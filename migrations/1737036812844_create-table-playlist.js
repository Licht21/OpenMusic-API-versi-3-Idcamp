/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('playlist',{
        id:{
            type: 'VARCHAR(30)',
            primaryKey: true
        },
        name: {
            type: 'TEXT',
            notNull: true
        },
        owner: {
            type: 'VARCHAR(30)',
            references: 'users',
            onDelete: 'CASCADE',
            notNull: true
        }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('playlist')
};
