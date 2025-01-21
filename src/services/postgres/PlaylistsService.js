/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(usersService, musicsService, collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._usersService = usersService;
    this._musicsService = musicsService;
  }

  async addPlaylist(playlistName, playlistOwner) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistName, playlistOwner],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async deletePlaylist(playlistId) {
    const query = {
      text: 'DELETE FROM playlist WHERE id = $1 RETURNING *',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal dihapus');
    }
  }

  async getPlaylist(playlistOwner) {
    const query = {
      text: `SELECT 
    playlist.id AS id, 
    playlist.name AS name, 
    owner_user.username AS username 
FROM 
    playlist
LEFT JOIN 
    collaborations ON collaborations.playlist_id = playlist.id
LEFT JOIN 
    users AS owner_user ON owner_user.id = playlist.owner
WHERE 
    playlist.owner = $1 OR collaborations.user_id = $1
GROUP BY 
    playlist.id, playlist.name, owner_user.username;
`,
      values: [playlistOwner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyPlaylistOwner(playlistId, playlistOwner) {
    const query = {
      text: 'SELECT * FROM playlist WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    if (result.rows[0].owner !== playlistOwner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      } try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  async addPlaylistSong(playlistId, musicId, userId) {
    await this._musicsService.getMusicById(musicId);

    const id = `playlist-item-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_musics VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, musicId],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan musik ke dalam playlist');
    }
    await this.addActivities(playlistId, musicId, userId, 'add');
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: `SELECT playlist.id AS id,
       playlist.name AS name,
       users.username AS username
       FROM playlist
       FULL JOIN users ON users.id = playlist.owner
       WHERE playlist.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  async getPlaylistSong(playlistId) {
    const query = {
      text: `SELECT musics.id AS id,
        musics.title AS title,
        musics.performer AS performer
        FROM musics
        LEFT JOIN playlist_musics
        ON playlist_musics.music_id = musics.id
        WHERE playlist_musics.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistSong(playlistId, musicId, userId) {
    const query = {
      text: 'DELETE FROM playlist_musics WHERE playlist_id = $1 AND music_id = $2 RETURNING id',
      values: [playlistId, musicId],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Musik gagal dihapus');
    }

    await this.addActivities(playlistId, musicId, userId, 'delete');
  }

  async addActivities(playlistId, musicId, userId, action) {
    const id = `activities-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_music_activities VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, musicId, userId, action, time, playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan activities');
    }
  }
}

module.exports = PlaylistsService;
