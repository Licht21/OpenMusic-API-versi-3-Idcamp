const routes = require('./routes');
const PlaylistActivitiesHandler = require('./handler');

module.exports = {
  name: 'playlistActivities',
  version: '1.0.0',
  register: (server, { playlistActivitiesService }) => {
    const playlistHandler = new PlaylistActivitiesHandler(playlistActivitiesService);
    server.route(routes(playlistHandler));
  },
};
