'use server';

import { z } from 'zod';
import pkg from 'pg';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CustomerStateType, InvoiceForm } from './definitions';
import { signIn } from '@/auth';
const { Pool } = pkg;
import { AuthError } from 'next-auth';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({invalid_type_error: 'Please select a customer.'}),
    amount: z.coerce.number()
    .gt(0, {message: 'Please enter an amount greater than 0$.'}),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select invoice status'
    }),
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

const customerStateSql = `SELECT 
                            COUNT(invoices.id) AS total_invoices,
                            SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
                            SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
                          FROM 
                            invoices
                          WHERE
                            invoices.customer_id=$1`;

const deleteCustomerSql = `DELETE FROM customers WHERE id=$1`;



export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
    invoice?: InvoiceForm | null;
}

export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to create invoice.',
        }
    }

    const { customerId, amount, status } = validatedFields.data;
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

export async function updateInvoice(prevState: State, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to update invoice.',
        }
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const values = [customerId, amountInCents, status, prevState.invoice?.id];

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

export async function deleteCustomer(id: string) {    
    const values = [id];

    try {
        const customerState = await pool.query<CustomerStateType>(customerStateSql, values)
        if (customerState.rowCount > 0 && customerState.rows[0].total_invoices > 0) {
            console.error(`Failed to delete customer. First remove relative invoices count: ${customerState.rows[0].total_invoices}`)
            return {
                message: `Failed to delete customer. First remove relative invoices count: ${customerState.rows[0].total_invoices}`,
            };    
        } else {
            await pool.query(deleteCustomerSql, values);
            revalidatePath('/dashboard/customers');
            return { message: 'Deleted customer.' };
        }
    } catch(error) {
        console.error(`Database error: Failed to delete customer. ${error}`)
        return {
            message: 'Database error: Failed to delete customer.',
        };
    }    
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }