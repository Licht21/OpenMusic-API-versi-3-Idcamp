/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class MusicsService {
  constructor() {
    this._pool = new Pool();
  }

  async addMusic({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO musics VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      values: [id, title, year, performer, genre, duration, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Music gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getMusics(title, performer) {
    let result;
    if (title === undefined && performer === undefined) {
      result = await this._pool.query('SELECT id, title, performer FROM musics');
    } else if (title !== undefined && performer !== undefined) {
      const query = {
        text: 'SELECT id, title, performer FROM musics WHERE title ILIKE $1 AND performer ILIKE $2',
        values: [`%${title}%`, `%${performer}%`],
      };
      result = await this._pool.query(query);
    } else {
      const queryTitle = {
        text: 'SELECT id, title, performer FROM musics WHERE title ILIKE $1',
        values: [`%${title}%`],
      };
      const queryPerformer = {
        text: 'SELECT id, title, performer FROM musics WHERE performer ILIKE $1',
        values: [`%${performer}%`],
      };
      result = title === undefined ? await this._pool.query(queryPerformer)
        : await this._pool.query(queryTitle);
    }
    return result.rows;
  }

  async getMusicById(id) {
    const query = {
      text: 'SELECT * FROM musics WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Music tidak ditemukan');
    }
    return result.rows[0];
  }

  async editMusicById(id, {
    title, year, genre, performer, duration, albumId = null,
  }) {
    const query = {
      text: 'UPDATE musics SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING *',
      values: [title, year, performer, genre, duration, albumId, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal Memperbarui Music. Id tidak ditemukan');
    }
  }

  async deleteMusicById(id) {
    const query = {
      text: 'DELETE FROM musics WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Music gagal dihapus, Id tidak ditemukan');
    }
  }
}

module.exports = MusicsService;
