import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth'; // adjust if needed
import { authOptions } from '../../lib/auth'; // adjust the path as needed
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  return <DashboardClient session={session} />;
}
