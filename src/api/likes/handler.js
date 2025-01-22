/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class LikesHandler {
  constructor(service, albumsService) {
    this._albumsService = albumsService;
    this._service = service;

    autoBind(this);
  }

  async postLikesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumsId } = request.params;

    await this._albumsService.getAlbumById(albumsId);
    await this._service.addLikes(credentialId, albumsId);

    return h.response({
      status: 'success',
      message: 'Berhasil menambahkan like',
    }).code(201);
  }

  async deleteLikesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumsId } = request.params;

    await this._service.deleteLikes(credentialId, albumsId);

    return h.response({
      status: 'success',
      message: 'Likes berhasil dihapus',
    }).code(200);
  }

  async getLikesHandler(request, h) {
    const { id: albumsId } = request.params;

    const likes = await this._service.getLikes(albumsId);
    if (likes.cacheStatus) {
      return h
        .response({
          status: 'success',
          data: {
            likes: likes.result,
          },
        })
        .header('X-Data-Source', 'cache')
        .code(200);
    }

    return h.response({
      status: 'success',
      data: {
        likes: likes.result,
      },
    }).code(200);
  }
}

module.exports = LikesHandler;
