import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="text-center text-gray-600 dark:text-gray-400">
        Select an option from the sidebar to get started
      </div>
    </ProtectedRoute>
  );
}