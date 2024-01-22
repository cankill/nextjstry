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

const createInvoiceSql = `INSERT INTO invoices (customer_id, amount, status, date) VALUES ($1, $2, $3, $4)`;
const updateInvoiceSql = `UPDATE invoices SET customer_id=$1, amount=$2, status=$3 WHERE id=$4`;
const deleteInvoiceSql = `DELETE FROM invoices WHERE id=$1`;

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0]
   
    const values = [customerId, amountInCents, status, date];

    try {
        await pool.query(createInvoiceSql, values);
    } catch(error) {
        console.error(`Database error: Failed to create invoice. ${error}`)
        return {
            message: 'Database error: Failed to create invoice.',
        };
    }

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
    const values = [customerId, amountInCents, status, id];

    try {
        await pool.query(updateInvoiceSql, values);
    } catch(error) {
        console.error(`Database error: Failed to update invoice. ${error}`)
        return {
            message: 'Database error: Failed to update invoice.',
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {    
    throw new Error('Failed to Delete Invoice');

    const values = [id];

    try {
        await pool.query(deleteInvoiceSql, values);
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
    } catch(error) {
        console.error(`Database error: Failed to delete invoice. ${error}`)
        return {
            message: 'Database error: Failed to delete invoice.',
        };
    }    
}