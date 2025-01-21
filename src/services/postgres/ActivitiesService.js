/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');

class ActivitiesService {
  constructor(playlistService) {
    this._pool = new Pool();
    this._playlistService = playlistService;
  }

  async getPlaylistActivities(playlistId, userId) {
    await this._playlistService.getPlaylistById(playlistId);
    await this._playlistService.verifyPlaylistAccess(playlistId, userId);

    const query = {
      text: `SELECT owner_user.username AS username,
            musics.title AS title, 
            playlist_music_activities.action AS action, 
            playlist_music_activities.time AS time 
            FROM playlist_music_activities
            FULL JOIN users AS owner_user ON owner_user.id = playlist_music_activities.user_id
            FULL JOIN musics ON musics.id = playlist_music_activities.music_id 
            WHERE playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ActivitiesService;
