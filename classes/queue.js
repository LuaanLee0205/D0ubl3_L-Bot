const { promisify } = require('util');
const { logger } = require('../utils/logger');
const { canModifyQueue } = require('../utils/queue');
const { VoiceConnectionStatus, AudioPlayerStatus, createAudioPlayer, entersState, NoSubscriberBehavior, VoiceConnectionDisconnectReason } = require('@discordjs/voice');

const wait = promisify(setTimeout);

class Queue {
	constructor({ connection, message }) {
		this.connection = connection;
		this.message = message;
		this.songs = [];
		this.client = message.client;

		this.resource = undefined;
		this.volume = process.env.DEFAULT_VOLUME || 100;
		this.loop = false;
		this.muted = false;
		this.queueLock = false;
		this.readyLock = false;

		this.textChannel = this.message.channel;
		this.player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });
		this.connection.subscribe(this.player);

		this.connection.on('stateChange', async (_, newState) => {
			if (newState.status === VoiceConnectionStatus.Disconnected) {
				if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
					try {
						this.stop();
					} catch (e) {
						logger.error(e);
						this.stop();
					}
				} else if (this.connection.rejoinAttempts < 5) {
					await wait((this.connection.rejoinAttempts + 1) * 5_000);
					this.connection.rejoin();
				} else {
					this.connection.destroy();
				}
			} else if (newState.status === VoiceConnectionStatus.Destroyed) {
				// this.stop();
			} else if (
				!this.readyLock &&
				(newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)
			) {
				this.readyLock = true;
				try {
					await entersState(this.connection, VoiceConnectionStatus.Ready, 20_000);
				} catch {
					if (this.connection.state.status !== VoiceConnectionStatus.Destroyed) this.connection.destroy();
				} finally {
					this.readyLock = false;
				}
			}
		});

		this.player.on('stateChange', async (oldState, newState) => {
			if (oldState.status !== AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Idle) {
				if (this.loop && this.songs.length) {
					this.songs.push(this.songs.shift());
				} else {
					this.songs.shift();
				}

				this.processQueue();
			} else if (oldState.status === AudioPlayerStatus.Buffering && newState.status === AudioPlayerStatus.Playing) {
				this.sendPlayingMessage(newState);
			}
		});

		this.player.on('error', (error) => {
			logger.error(error);
			if (this.loop && this.songs.length) {
				this.songs.push(this.songs.shift());
			} else {
				this.songs.shift();
			}
			this.processQueue();
		});
	}

	enqueue(..._songs) {
		this.songs = this.songs.concat(_songs);
		this.processQueue();
	}

	stop() {
		this.queueLock = true;
		this.loop = false;
		this.songs = [];
		this.player.stop();
		this.client.queues.delete(this.message.guild.id);

		process.env.PRUNING && this.textChannel.send('❌ Music queue ended.').catch(logger.error);

		setTimeout(() => {
			if (
				this.player.state.status !== AudioPlayerStatus.Idle || this.connection.state.status === VoiceConnectionStatus.Destroyed || this.client.queues.get(this.message.guild.id) !== undefined
			) return;

			this.connection.destroy();
			this.player.stop();
			this.client.queues.delete(this.message.guild.id);

			process.env.PRUNING && this.textChannel.send('Leaving voice channel...');
		}, 100);
	}

	async processQueue() {
		if (this.queueLock || this.player.state.status !== AudioPlayerStatus.Idle) {
			return;
		}

		if (!this.songs.length) {
			return this.stop();
		}

		this.queueLock = true;

		const next = this.songs[0];

		try {
			const resource = await next.makeResource();

			this.resource = resource;
			this.player.play(this.resource);
			this.resource.volume?.setVolumeLogarithmic(this.volume / 100);
		} catch (error) {
			logger.error(error);

			return this.processQueue();
		} finally {
			this.queueLock = false;
		}
	}

	async sendPlayingMessage(newState) {
		const song = (newState.resource).metadata;

		let playingMessage;

		try {
			playingMessage = await this.textChannel.send((newState.resource).metadata.startMessage());

			await playingMessage.react('⏭');
			await playingMessage.react('⏯');
			await playingMessage.react('🔇');
			await playingMessage.react('🔉');
			await playingMessage.react('🔊');
			await playingMessage.react('🔁');
			await playingMessage.react('🔀');
			await playingMessage.react('⏹');
		} catch (error) {
			logger.error(error);
			this.textChannel.send(error.message);
			return;
		}

		const filter = (reaction, user) => user.id !== this.textChannel.client.user.id;

		const collector = playingMessage.createReactionCollector({
			filter,
			time: song.duration > 0 ? song.duration * 1000 : 600000,
		});

		collector.on('collect', async (reaction, user) => {
			if (!this.songs) return;

			const member = await playingMessage.guild.members.fetch(user);

			switch (reaction.emoji.name) {
			case '⏭':
				reaction.users.remove(user).catch(logger.error);
				await this.client.commands.get('skip').execute(this.message);
				break;

			case '⏯':
				reaction.users.remove(user).catch(logger.error);
				if (this.player.state.status == AudioPlayerStatus.Playing) {
					await this.client.commands.get('pause').execute(this.message);
				} else {
					await this.client.commands.get('resume').execute(this.message);
				}
				break;

			case '🔇':
				reaction.users.remove(user).catch(logger.error);
				if (!canModifyQueue(member)) return 'You need to join a voice channel first!';
				this.muted = !this.muted;
				if (this.muted) {
					this.resource.volume?.setVolumeLogarithmic(0);
					this.textChannel.send(`<${user}> 🔇 muted the music!`).catch(logger.error);
				} else {
					this.resource.volume?.setVolumeLogarithmic(this.volume / 100);
					this.textChannel.send(`<${user}> 🔊 unmuted the music!`).catch(logger.error);
				}
				break;

			case '🔉':
				reaction.users.remove(user).catch(logger.error);
				if (this.volume == 0) return;
				if (!canModifyQueue(member)) return 'You need to join a voice channel first!';
				this.volume = Math.max(this.volume - 10, 0);
				this.resource.volume?.setVolumeLogarithmic(this.volume / 100);
				this.textChannel
					.send(`<${user}> 🔉 decreased the volume, the volume is now ${this.volume}%`)
					.catch(logger.error);
				break;

			case '🔊':
				reaction.users.remove(user).catch(logger.error);
				if (this.volume == 100) return;
				if (!canModifyQueue(member)) return 'You need to join a voice channel first!';
				this.volume = Math.min(this.volume + 10, 100);
				this.resource.volume?.setVolumeLogarithmic(this.volume / 100);
				this.textChannel
					.send(`<${user}> 🔊 increased the volume, the volume is now ${this.volume}%`)
					.catch(logger.error);
				break;

			case '🔁':
				reaction.users.remove(user).catch(logger.error);
				await this.client.commands.get('loop').execute(this.message);
				break;

			case '🔀':
				reaction.users.remove(user).catch(logger.error);
				await this.client.commands.get('shuffle').execute(this.message);
				break;

			case '⏹':
				reaction.users.remove(user).catch(logger.error);
				await this.client.commands.get('stop').execute(this.message);
				collector.stop();
				break;

			default:
				reaction.users.remove(user).catch(logger.error);
				break;
			}
		});

		collector.on('end', () => {
			playingMessage.reactions.removeAll().catch(logger.error);

			if (process.env.PRUNING) {
				setTimeout(() => {
					playingMessage.delete().catch();
				}, 3000);
			}
		});
	}
}
module.exports = {
	Queue,
};