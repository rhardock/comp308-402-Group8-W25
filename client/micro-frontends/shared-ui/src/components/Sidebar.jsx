import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaBook, FaChartBar } from 'react-icons/fa';

export const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/home', label: 'Home', icon: FaHome },
    { href: '/dashboard', label: 'Notes', icon: FaBook },
    { href: '/summary', label: 'Summary', icon: FaChartBar },
  ];

  return (
    <div className="h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group flex items-center px-2 py-2 text-base font-medium rounded-md
                  ${isActive
                    ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}
                `}
              >
                <Icon
                  className={`
                    mr-4 h-5 w-5
                    ${isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-400 dark:text-gray-300 group-hover:text-gray-500 dark:group-hover:text-gray-200'}
                  `}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}; 