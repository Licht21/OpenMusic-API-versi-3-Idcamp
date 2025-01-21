const Joi = require('joi');

const PostPlaylistsPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PostPlaylistsSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const DeletePlaylistsSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  PostPlaylistsPayloadSchema,
  PostPlaylistsSongPayloadSchema,
  DeletePlaylistsSongPayloadSchema,
};
