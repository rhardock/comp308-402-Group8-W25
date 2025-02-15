'use client'; // Mark this as a Client Component
import { UserProvider } from '@/context/UserContext';

export default function Providers({ children }) {
  return <UserProvider>{children}</UserProvider>;
}
