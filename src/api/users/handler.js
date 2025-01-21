/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    await this._validator.validateUserPayload(request.payload);
    const userId = await this._service.addUser(request.payload);
    return h.response({
      status: 'success',
      data: {
        userId,
      },
    }).code(201);
  }
}

module.exports = UsersHandler;
