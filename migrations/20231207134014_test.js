/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id').primary();
            table.string('name', 255).notNullable();
            table.string('email', 255).notNullable().unique();
            table.string('password', 255).notNullable();
            table.string('username', 255).notNullable();
            table.enu('role', ['super_admin', 'admin', 'user']);
        })
        .createTable('permissions', function (table) {
            table.increments('id').primary();
            table.integer('user_id').unsigned();
            table.foreign('user_id').references('users.id').onDelete('CASCADE');
            table.boolean('can_view_users').defaultTo(false);
            table.boolean('can_edit_users').defaultTo(false);
            table.boolean('can_create_users').defaultTo(false);
            table.boolean('can_delete_users').defaultTo(false);
            // TODO Add more permissions as needed
        })
    // .createTable('products', function (table) {
    //     table.increments('id').primary();
    //     table.decimal('price').notNullable();
    //     table.string('name', 1000).notNullable();
    //     table.integer('user_id').unsigned();
    //     table.foreign('user_id').references('users.id').onDelete('CASCADE');
    // })
    // .createTable('orders', function (table) {
    //     table.increments('id').primary();
    //     table.integer('user_id').unsigned();
    //     table.foreign('user_id').references('users.id').onDelete('CASCADE');
    //     table.timestamp('order_date').defaultTo(knex.fn.now());
    // })
    // .createTable('order_items', function (table) {
    //     table.increments('id').primary();
    //     table.integer('order_id').unsigned();
    //     table.foreign('order_id').references('orders.id').onDelete('CASCADE');
    //     table.integer('product_id').unsigned();
    //     table.foreign('product_id').references('products.id').onDelete('CASCADE');
    //     table.integer('quantity').notNullable();
    // });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTable('order_items')
        .dropTable('orders')
        .dropTable('products')
        .dropTable('permissions')
        .dropTable('users');
};
