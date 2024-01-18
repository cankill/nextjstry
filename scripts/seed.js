import pkg from 'pg';
const { Pool } = pkg;
// import { db } from '@vercel/postgres';
import { invoices, customers, revenue, users } from '../app/lib/placeholder-data.js';
import { hash } from 'bcrypt';

async function seedUsers(pool) {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // Create the "users" table if it doesn't exist
    const createTable = await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );`);

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await hash(user.password, 10);
        const query = 'INSERT INTO users(id, name, email, password) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING;';
        const values = [user.id, user.name, user.email, hashedPassword];
        return pool.query(query, values);
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedInvoices(pool) {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create the "invoices" table if it doesn't exist
    const createTable = await pool.query(`
    CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL,
    amount INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    date DATE NOT NULL
  );`);

    console.log(`Created "invoices" table`);

    // Insert data into the "invoices" table
    const insertedInvoices = await Promise.all(
      invoices.map(async (invoice) => {
        const query = 'INSERT INTO invoices(customer_id, amount, status, date) VALUES ($1, $2, $3, $4)ON CONFLICT (id) DO NOTHING;'
        const values = [invoice.customer_id, invoice.amount, invoice.status, invoice.date];
        return pool.query(query, values);
      }),
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      createTable,
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedCustomers(pool) {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create the "customers" table if it doesn't exist
    const createTable = await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );`);

    console.log(`Created "customers" table`);

    // Insert data into the "customers" table
    const insertedCustomers = await Promise.all(
      customers.map(async (customer) => {
        const query = 'INSERT INTO customers (id, name, email, image_url) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING;';
        const values = [customer.id, customer.name, customer.email, customer.image_url];
        return pool.query(query, values)
      }),
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      createTable,
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedRevenue(pool) {
  try {
    // Create the "revenue" table if it doesn't exist
    const createTable = await pool.query(`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );`);

    console.log(`Created "revenue" table`);

    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(async (rev) => {
        const query = 'INSERT INTO revenue (month, revenue) VALUES ($1, $2) ON CONFLICT (month) DO NOTHING;';
        const values = [rev.month, rev.revenue];
        return pool.query(query, values)
      }),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function main() {
  const pool = new Pool({
    user: 'sysadm',
    host: 'localhost',
    database: 'nextjs',
    password: 'change_me',
    port: 6432
  })

  console.log(await pool.query('SELECT NOW()'))

  await seedUsers(pool);
  await seedCustomers(pool);
  await seedInvoices(pool);
  await seedRevenue(pool);
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
