'use server';

import { z } from 'zod';
import pkg from 'pg';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
const { Pool } = pkg;

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string()
});

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

const CreateInvoice = FormSchema.omit({ id: true, date: true });

const pool = new Pool({
    user: 'sysadm',
    host: 'localhost',
    database: 'nextjs',
    password: 'change_me',
    port: 6432
})

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0]

    const sql = `INSERT INTO invoices (customer_id, amount, status, date) VALUES ($1, $2, $3, $4)`;
    const values = [customerId, amountInCents, status, date];

    console.log('Create invoice in DB');
    await pool.query(sql, values);
    console.log('Invoice created in DB');

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;
    const sql = `UPDATE invoices SET customer_id=$1, amount=$2, status=$3 WHERE id=$4`;
    const values = [customerId, amountInCents, status, id];

    console.log('Update invoice in DB');
    await pool.query(sql, values);
    console.log('Invoice updated in DB');

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}