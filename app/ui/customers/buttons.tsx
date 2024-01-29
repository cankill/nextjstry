import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteCustomer } from '@/app/lib/actions';

export function CreateCustomer() {
  return (
    <Link
      href="/dashboard/customers/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Customer</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCustomer({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteCustomer({ id, active }: { id: string, active: boolean }) {
  const deleteCustomerWithId = deleteCustomer.bind(null, id)
  if (!active) {
    return (
      <div className="rounded-md border p-2 border-gray-200">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5 stroke-gray-200" />
      </div>
    )
  } else {
    return (
      <form action={deleteCustomerWithId}>
        <fieldset disabled={!active}>
          <button className="rounded-md border p-2 hover:bg-gray-100">
            <span className="sr-only">Delete</span>
            <TrashIcon className="w-5" />
          </button>
        </fieldset>
      </form>
    );
  }
}
