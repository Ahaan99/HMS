import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const DashboardHome = () => {
  const { user } = useAuth();
  const [allocatedRoom, setAllocatedRoom] = useState(null);

  useEffect(() => {
    fetchAllocatedRoom();
  }, []);

  const fetchAllocatedRoom = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rooms/allocated', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAllocatedRoom(data.room);
      }
    } catch (error) {
      console.error('Failed to fetch allocated room:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="p-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-white">, {user?.name}!</h1>
        <p className="text-white/80 mt-1">Here's your hostel status at a glance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          icon="🏠"
          title="Room Status"
          value={allocatedRoom ? `Room ${allocatedRoom.roomNumber}` : 'Not Allocated'}
          className="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <DashboardCard
          icon="💰"
          title="Pending Payments"
          value="₹0"
          className="bg-gradient-to-br from-green-500 to-green-600"
        />
        <DashboardCard
          icon="🍽️"
          title="Meal Plan"
          value="Active"
          className="bg-gradient-to-br from-yellow-500 to-yellow-600"
        />
        <DashboardCard
          icon="📝"
          title="Complaints"
          value="0 Active"
          className="bg-gradient-to-br from-red-500 to-red-600"
        />
      </div>

      {/* Add more dashboard content here */}
    </div>
  );
};

const DashboardCard = ({ icon, title, value, className }) => (
  <div className={`p-6 rounded-xl shadow-lg ${className}`}>
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <h3 className="text-sm font-medium text-white/80">{title}</h3>
    </div>
    <p className="text-2xl font-semibold text-white mt-2">{value}</p>
  </div>
);

export default DashboardHome;
