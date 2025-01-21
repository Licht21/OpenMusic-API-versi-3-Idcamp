const routes = require('./routes');
const PlaylistsHandler = require('./handler');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: (server, { service, validator }) => {
    const playlistHandler = new PlaylistsHandler(service, validator);
    server.route(routes(playlistHandler));
  },
};
