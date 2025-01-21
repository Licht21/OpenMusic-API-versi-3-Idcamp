/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('playlist_music_activities',{
        id:{
            type: 'VARCHAR(30)',
            primaryKey: true
        },
        music_id:{
            type: 'VARCHAR(30)',
            notNull: true
        },
        user_id:{
            type: 'VARCHAR(30)',
            notNull: true
        },
        action: {
            type: 'TEXT',
            notNull: true
        },
        time:{
            type: 'VARCHAR(30)',
            notNull: true
        },
        playlist_id:{
            type: 'VARCHAR(30)',
            notNull:true,
            references: 'playlist',
            onDelete: 'CASCADE'
        }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('playlist_song_activities')
};
