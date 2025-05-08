import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await fetch('http://localhost:5000/api/notifications/mark-read', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      markNotificationsAsRead();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🏨</span>
              <h1 className="text-xl font-bold text-white">HMS Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  className="relative p-2 bg-white hover:bg-white/90 text-violet-600 rounded-full transition-colors"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    3
                  </span>
                </Button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-t-xl">
                      <h3 className="font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
                      <NotificationItem 
                        title="Room Booking Confirmed"
                        message="Your room booking has been approved"
                        type="success"
                      />
                      <NotificationItem 
                        title="New Message"
                        message="You have a new complaint response"
                        type="info"
                      />
                      <NotificationItem 
                        title="Payment Due"
                        message="Hostel fee payment is due soon"
                        type="warning"
                      />
                    </div>
                    <div className="p-3 text-center border-t bg-gray-50/50 rounded-b-xl">
                      <button className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                        View All
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <span className="text-sm font-medium text-white">Welcome, {user?.name}</span>
              <Button 
                onClick={logout}
                className="bg-white hover:bg-gray-100 text-black hover:text-black active:text-black focus:text-black border-0"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="flex">
        <aside className="fixed left-0 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg border-r border-gray-200 transition-all duration-300 md:translate-x-0 transform">
          <nav className="p-4 space-y-2">
            <SidebarLink to="/dashboard" icon="🏠">Overview</SidebarLink>
            <SidebarLink to="/dashboard/room-booking" icon="🛏️">Room Booking</SidebarLink>
            <SidebarLink to="/dashboard/complaints" icon="📝">Complaints</SidebarLink>
            <SidebarLink to="/dashboard/mess" icon="🍽️">Mess Details</SidebarLink>
            <SidebarLink to="/dashboard/payments" icon="💰">Payments</SidebarLink>
          </nav>
        </aside>
        
        <main className="flex-1 ml-64 p-6 min-h-[calc(100vh-4rem)] bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const NotificationItem = ({ title, message, type }) => (
  <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
    <div className="flex gap-3 items-start">
      <span className={`p-1 rounded-full ${
        type === 'success' ? 'bg-green-100 text-green-600' :
        type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
        'bg-blue-100 text-blue-600'
      }`}>
        {type === 'success' ? '✓' : type === 'warning' ? '!' : 'ℹ'}
      </span>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500 mt-0.5">{message}</p>
      </div>
    </div>
  </div>
);

const SidebarLink = ({ to, children, icon }) => (
  <Link 
    to={to} 
    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-fuchsia-50 hover:text-violet-600 transition-all"
  >
    <span className="text-xl">{icon}</span>
    <span>{children}</span>
  </Link>
);

export default DashboardLayout;
