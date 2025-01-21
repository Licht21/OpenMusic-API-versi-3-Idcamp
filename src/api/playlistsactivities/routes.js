const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: handler.getPlaylistActivities,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
