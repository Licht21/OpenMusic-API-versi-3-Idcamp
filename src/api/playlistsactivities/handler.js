/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class PlaylistActivitiesHandler {
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  async getPlaylistActivities(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const activities = await this._service.getPlaylistActivities(playlistId, credentialId);

    return h.response({
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    }).code(200);
  }
}

module.exports = PlaylistActivitiesHandler;
