import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, Users, Hotel, MessageSquare, 
  UtensilsCrossed, CreditCard, Menu, X
} from 'lucide-react';

const AdminLayout = () => {
  const { logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:border-2 focus:border-violet-700 focus:text-violet-800 focus:rounded-md focus:outline-none focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Updated Header */}
      <header 
        className="sticky top-0 z-50 bg-gray-900 border-b border-gray-700 shadow-lg h-20" 
        role="banner"
      >
        <div className="h-full px-6 flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden text-white hover:bg-gray-800 focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-gray-900 h-12 w-12"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isSidebarOpen}
              aria-controls="sidebar-nav"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-violet-700 rounded-lg">
                <span className="text-3xl" role="img" aria-label="Hotel">🏨</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  HMS Admin Portal
                </h1>
                <p className="text-sm font-medium text-gray-300">
                  Management Dashboard
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-300" role="status">
                Administrator Access
              </p>
            </div>
            <Button 
              onClick={logout}
              variant="destructive"
              className="bg-white hover:bg-gray-100 text-black hover:text-black active:text-black focus:text-black"
              aria-label="Log out from administrator panel"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Updated Layout Structure */}
      <div className="flex">
        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-30"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Fixed Sidebar */}
        <aside
          id="sidebar-nav"
          className={`
            fixed top-20 left-0 z-40
            h-[calc(100vh-5rem)] w-64 
            bg-gray-800 border-r border-gray-700
            transition-transform duration-300
            lg:sticky lg:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          role="navigation"
          aria-label="Main navigation"
        >
          <nav className="h-full overflow-y-auto">
            <div className="p-4 space-y-1">
              <SidebarLink to="/admin" icon={<Home className="h-5 w-5" />}>Dashboard</SidebarLink>
              <SidebarLink to="/admin/students" icon={<Users className="h-5 w-5" />} onClick={() => setSidebarOpen(false)}>
                Students
              </SidebarLink>
              <SidebarLink to="/admin/requests" icon={<Hotel className="h-5 w-5" />} onClick={() => setSidebarOpen(false)}>
                Room Requests
              </SidebarLink>
              <SidebarLink to="/admin/rooms" icon={<Hotel className="h-5 w-5" />} onClick={() => setSidebarOpen(false)}>
                Rooms
              </SidebarLink>
              <SidebarLink to="/admin/complaints" icon={<MessageSquare className="h-5 w-5" />} onClick={() => setSidebarOpen(false)}>
                Complaints
              </SidebarLink>
              <SidebarLink to="/admin/mess" icon={<UtensilsCrossed className="h-5 w-5" />} onClick={() => setSidebarOpen(false)}>
                Mess Menu
              </SidebarLink>
              <SidebarLink to="/admin/payments" icon={<CreditCard className="h-5 w-5" />} onClick={() => setSidebarOpen(false)}>
                Payments
              </SidebarLink>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main 
          id="main-content"
          className="flex-1 min-h-[calc(100vh-4rem)]"
          role="main"
        >
          <div className="p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`
        flex items-center gap-3 px-4 py-3 text-base
        transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400
        rounded-md
        ${isActive 
          ? 'text-white bg-violet-700 font-medium shadow-sm' 
          : 'text-gray-100 hover:bg-violet-800 hover:text-white'}
      `}
      onClick={onClick}
      role="menuitem"
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="text-current" aria-hidden="true">{icon}</span>
      <span>{children}</span>
    </Link>
  );
};

export default AdminLayout;
