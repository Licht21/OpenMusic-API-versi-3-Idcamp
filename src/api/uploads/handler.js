/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(service, albumsService, validator) {
    this._service = service;
    this._albumsService = albumsService
    this._validator = validator;

    autoBind(this);
  }

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const { id: albumsId } = request.params;
    cover.hapi.filename = albumsId;

    const fileLocation = await this._service.writeFile(cover, cover.hapi);
    await this._albumsService.addCoverUrl(fileLocation, albumsId);

    return h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    }).code(201);
  }
}

module.exports = UploadsHandler;
