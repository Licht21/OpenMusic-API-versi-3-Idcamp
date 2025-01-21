/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class MusicsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postMusicHandler(request, h) {
    this._validator.validateMusicPayload(request.payload);
    const {
      title, year, genre, performer, duration = null, albumId = null,
    } = request.payload;

    const musicId = await this._service.addMusic({
      title, year, genre, performer, duration, albumId,
    });
    return h.response({
      status: 'success',
      data: {
        songId: musicId,
      },
    }).code(201);
  }

  async getMusicsHandler(request, h) {
    const { title = undefined, performer = undefined } = request.query;
    const musics = await this._service.getMusics(title, performer);
    return h.response({
      status: 'success',
      data: {
        songs: musics,
      },
    }).code(200);
  }

  async getMusicByIdHandler(request, h) {
    const { id } = request.params;
    const music = await this._service.getMusicById(id);
    return h.response({
      status: 'success',
      data: {
        song: music,
      },
    }).code(200);
  }

  async putMusicByIdHandler(request, h) {
    this._validator.validateMusicPayload(request.payload);
    const { id } = request.params;
    await this._service.editMusicById(id, request.payload);
    return h.response({
      status: 'success',
      message: 'Music berhasil diperbarui',
    }).code(200);
  }

  async deleteMusicByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteMusicById(id);
    return h.response({
      status: 'success',
      message: 'Music berhasil dihapus',
    });
  }
}

module.exports = MusicsHandler;
