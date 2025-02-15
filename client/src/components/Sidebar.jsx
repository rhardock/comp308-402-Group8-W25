import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-100 p-5">
      <h2 className="text-xl font-semibold mb-4 text-center">Dashboard</h2>
      <ul className="space-y-2">
        <li>
          <Link href="/dashboard/account">
            <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Account
            </button>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/summary">
            <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Create Summary
            </button>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/history">
            <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              View History
            </button>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/logout">
            <button className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600">
              Logout
            </button>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
