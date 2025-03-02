import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Noted! Dashboard</h1>
        <p className="text-gray-600">Select an option from the sidebar to get started.</p>
      </div>
    </ProtectedRoute>
  );
}
