import ManagerSidebar from './ManagerSidebar';
import ManagerTopbar from './ManagerTopbar';

interface ManagerShellProps {
  user: { name: string; email: string };
  children: React.ReactNode;
}

export default function ManagerShell({ user, children }: ManagerShellProps) {
  return (
    <div className="flex min-h-screen" style={{ background: '#F6F7F9' }}>
      <ManagerSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <ManagerTopbar user={user} />
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
