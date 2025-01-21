/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('playlist_musics',{
        id:{
            type: 'VARCHAR(30)',
            primaryKey: true
        },
        playlist_id:{
            type: 'VARCHAR(30)',
            notNull: true,
            references: 'playlist',
            onDelete: 'CASCADE'
        },
        music_id:{
            type: 'VARCHAR(30)',
            notNull: true,
            references: 'musics',
            onDelete: 'CASCADE'
        },
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('playlist_musics')
};
