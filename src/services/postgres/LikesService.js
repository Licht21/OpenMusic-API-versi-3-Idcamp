/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const ClientError = require('../../exceptions/ClientError');

class LikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLikes(userId, albumId) {
    await this.verifyLikes(userId, albumId);
    const id = `like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Like gagal ditambahkan');
    }
    await this._cacheService.delete(`album:${albumId}`);
  }

  async deleteLikes(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Like gagal dihapus');
    }
    await this._cacheService.delete(`album:${albumId}`);
  }

  async getLikes(albumId) {
    try {
      // mendapatkan catatan dari cache
      const result = await this._cacheService.get(`album:${albumId}`);
      const cacheStatus = true;
      return {
        result: JSON.parse(result),
        cacheStatus,
      };
    } catch (error) {
      const query = {
        text: 'SELECT album_id FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      await this._cacheService.set(`album:${albumId}`, JSON.stringify(result.rows.length));

      return { result: result.rows.length };
    }
  }

  async verifyLikes(userId, albumId) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new ClientError('Anda sudah berinteraksi dengan album ini', 400);
    }
  }
}

module.exports = LikesService;
