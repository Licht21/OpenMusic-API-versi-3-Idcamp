/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('collaborations',{
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
        user_id:{
            type: 'VARCHAR(30)',
            notNull: true,
            references: 'users',
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
    pgm.dropTable('collaborations')
};
