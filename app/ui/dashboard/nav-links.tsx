'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { PiGraphDuotone } from "react-icons/pi";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home',      href: '/dashboard',           icon: HomeIcon },
  { name: 'Invoices',  href: '/dashboard/invoices',  icon: DocumentDuplicateIcon },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
  { name: 'Nodes',     href: '/dashboard/nodes',     icon: PiGraphDuotone },
];

export default function NavLinks() {
  const pathName = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-rose-300 hover:text-rose-800 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-rose-300 text-rose-800': pathName === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" size="28"/>
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
