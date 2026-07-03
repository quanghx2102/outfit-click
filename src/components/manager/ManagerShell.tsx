import ManagerSidebar from './ManagerSidebar';
import ManagerTopbar from './ManagerTopbar';

interface ManagerShellProps {
  user: { name: string; email: string };
  children: React.ReactNode;
}

export default function ManagerShell({ user, children }: ManagerShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <ManagerSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <ManagerTopbar user={user} />
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
