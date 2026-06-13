import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppStore } from '../../store';
import { cn } from '../../utils/cn';

export const Layout: React.FC = () => {
  const { sidebarOpen, setSidebarOpen, theme } = useAppStore();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={cn('min-h-screen bg-slate-50', theme === 'dark' && 'dark bg-slate-900')}>
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />
        
        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
