/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('musics',{
        id:{
            type: 'VARCHAR(30)',
            primaryKey: true
        },
        title:{
            type: 'TEXT',
            notNull: true
        },
        year:{
            type: 'INTEGER',
            notNull: true
        },
        performer:{
            type: 'TEXT',
            notNull:true
        },
        genre:{
            type: 'TEXT',
            notNull:true
        },
        duration:{
            type: 'INTEGER',
            allowNull:true
        },
        album_id:{
            type:'VARCHAR(30)',
            allowNull:true,
            references:'albums',
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
    pgm.dropTable('musics')
};
