import pkg from 'pg';
const { Pool } = pkg;
// import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
  CustomerForm,
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';

const pool = new Pool({
  user: 'sysadm',
  host: 'localhost',
  database: 'nextjs',
  password: 'change_me',
  port: 6432
})

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Revenue: Fetching data...');
    const data = await pool.query<Revenue>(`SELECT * FROM revenue`);

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();
  try {
    console.log('Latest invoices: Fetching latest data...');

    const data = await pool.query<LatestInvoiceRaw>(`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`);

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = await pool.query(`SELECT COUNT(*) FROM invoices`);
    const customerCountPromise = await pool.query(`SELECT COUNT(*) FROM customers`);
    const invoiceStatusPromise = await pool.query(`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`);

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const queryStr = `SELECT
                        invoices.id,
                        invoices.amount,
                        invoices.date,
                        invoices.status,
                        customers.name,
                        customers.email,
                        customers.image_url
                      FROM invoices
                      JOIN customers ON invoices.customer_id = customers.id
                      WHERE
                        customers.name ILIKE $1
                        OR customers.email ILIKE $1
                        OR invoices.amount::text ILIKE $1
                        OR invoices.date::text ILIKE $1
                        OR invoices.status ILIKE $1
                      ORDER BY invoices.date DESC
                      LIMIT $2 OFFSET $3`;
    
    // console.log(`The query search is: %${query}%`)

    const values = [`%${query}%`, ITEMS_PER_PAGE, offset]

    console.log('Fetching customers data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const invoices = await pool.query<InvoicesTable>(queryStr, values);
    console.log('Customers data fetch completed after 3 seconds.');

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  const queryString = `SELECT COUNT(*)
                        FROM invoices
                        JOIN customers ON invoices.customer_id = customers.id
                      WHERE
                        customers.name ILIKE $1 OR
                        customers.email ILIKE $1 OR
                        invoices.amount::text ILIKE $1 OR
                        invoices.date::text ILIKE $1 OR
                        invoices.status ILIKE $1`;

  const values = [`%${query}%`];

  try {
    const count = await pool.query(queryString, values);
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    const query = `SELECT
                      invoices.id,
                      invoices.customer_id,
                      invoices.amount,
                      invoices.status
                  FROM invoices
                  WHERE invoices.id = $1;`

    const values = [id];

    const data = await pool.query<InvoiceForm>(query, values);

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  noStore();
  try {
    const data = await pool.query<CustomerField>(`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `);

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(
  query: string,
  currentPage: number,
) {
  noStore();  
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  console.log(`Offset: ${offset}`)
  try {
    const queryString = `SELECT
                          customers.id,
                          customers.name,
                          customers.email,
                          customers.image_url,
                          COUNT(invoices.id) AS total_invoices,
                          SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
                          SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
                        FROM customers
                        LEFT JOIN invoices ON customers.id = invoices.customer_id
                        WHERE
                          customers.name ILIKE $1
                          OR customers.email ILIKE $1
                        GROUP BY customers.id, customers.name, customers.email, customers.image_url
                        ORDER BY customers.name ASC
                        LIMIT $2 OFFSET $3`;

    const values = [`%${query}%`, ITEMS_PER_PAGE, offset]


    // console.log('Fetching customers data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    const data = await pool.query<CustomersTableType>(queryString, values);
    // console.log('Customers data fetch completed after 3 seconds.');

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchCustomersPages(query: string) {
  noStore();
  const queryString = `SELECT COUNT(*)
                        FROM customers
                      WHERE
                        name ILIKE $1 OR
                        email ILIKE $1`;

  const values = [`%${query}%`];

  try {
    const count = await pool.query(queryString, values);

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }
}

export async function fetchCustomerById(id: string) {
  noStore();
  try {
    const query = `SELECT
                      customers.id,
                      customers.name,
                      customers.email,
                      customers.image_url
                  FROM customers
                  WHERE customer.id = $1;`

    const values = [id];

    return await pool.query<CustomerForm>(query, values);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function getUser(email: string) {
  noStore();
  try {
    const user = await pool.query(`SELECT * FROM users WHERE email=${email}`);
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
