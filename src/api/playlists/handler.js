/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);

    const { name: playlistName } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist(playlistName, credentialId);

    return h.response({
      status: 'success',
      data: {
        playlistId,
      },
    }).code(201);
  }

  async deletePlaylistHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylist(playlistId);

    return h.response({
      status: 'success',
      message: 'Berhasil menghapus playlist',
    }).code(200);
  }

  async getPlaylistHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const playlists = await this._service.getPlaylist(credentialId);

    return h.response({
      status: 'success',
      data: {
        playlists,
      },
    }).code(200);
  }

  async postPlaylistMusic(request, h) {
    this._validator.validatePostPlaylistSongPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { songId: musicsId } = request.payload;
    const { id: playlistId } = request.params;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.addPlaylistSong(playlistId, musicsId, credentialId);

    return h.response({
      status: 'success',
      message: 'Musik berhasil ditambahkan ke playlist',
    }).code(201);
  }

  async getPlaylistMusic(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._service.getPlaylistById(playlistId);
    const songs = await this._service.getPlaylistSong(playlistId);
    playlist.songs = songs;

    return h.response({
      status: 'success',
      data: {
        playlist,
      },
    }).code(200);
  }

  async deletePlaylistMusic(request, h) {
    this._validator.validateDeletePlaylistSongPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { songId: musicsId } = request.payload;
    const { id: playlistId } = request.params;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deletePlaylistSong(playlistId, musicsId, credentialId);

    return h.response({
      status: 'success',
      message: 'Musik berhasil dihapus',
    }).code(200);
  }
}

module.exports = PlaylistsHandler;
