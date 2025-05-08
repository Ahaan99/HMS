import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Hotel, AlertTriangle, IndianRupee, Activity, CircleDollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingRequests: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    paymentStats: {
      totalPayments: 0,
      pendingPayments: 0,
      monthlyRevenue: 0
    }
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [basicStats, paymentStats] = await Promise.all([
          fetch('http://localhost:5000/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch('http://localhost:5000/api/admin/payments/stats', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        const basicData = await basicStats.json();
        const paymentData = await paymentStats.json();

        if (!basicStats.ok || !paymentStats.ok) {
          throw new Error('Failed to fetch stats');
        }

        setStats({
          ...basicData.stats,
          paymentStats: paymentData.stats || {
            totalPayments: 0,
            pendingPayments: 0,
            monthlyRevenue: 0
          }
        });
      } catch (error) {
        setError(error.message);
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return (
    <div role="status" className="flex items-center justify-center min-h-[400px]">
      <p className="text-lg text-gray-700 font-medium">Loading dashboard data...</p>
    </div>
  );
  
  if (error) return (
    <div role="alert" className="flex items-center justify-center min-h-[400px] text-red-800 bg-red-50 p-4 rounded-lg">
      <p className="text-lg font-medium">Error: {error}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Updated Header Section */}
      <div 
        className="bg-gray-900 -mx-6 -mt-6 p-6 rounded-lg shadow-lg" 
        role="region" 
        aria-label="Dashboard Overview"
      >
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-300 mt-1">Welcome to HMS admin dashboard</p>
      </div>

      {/* Stats Grid - removed negative margins */}
      <section 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        aria-label="Key Statistics"
      >
        <StatsCard 
          title="Total Students"
          value={stats.totalStudents}
          icon={<Users className="h-6 w-6" />}
          trend="+12% from last month"
          className="bg-blue-50 border-blue-200"
          iconClassName="text-blue-700"
          ariaLabel="Total number of students"
        />
        <StatsCard 
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={<AlertTriangle className="h-6 w-6" />}
          trend="5 new requests today"
          className="bg-amber-50 border-amber-100"
          iconClassName="text-amber-600"
          ariaLabel="Number of pending requests"
        />
        <StatsCard 
          title="Occupied Rooms"
          value={`${stats.occupiedRooms}/${stats.occupiedRooms + stats.availableRooms}`}
          icon={<Hotel className="h-6 w-6" />}
          trend={`${stats.availableRooms} rooms available`}
          className="bg-green-50 border-green-100"
          iconClassName="text-green-600"
          ariaLabel="Number of occupied rooms"
        />
        <StatsCard 
          title="Room Availability"
          value={`${Math.round((stats.availableRooms / (stats.occupiedRooms + stats.availableRooms)) * 100)}%`}
          icon={<Activity className="h-6 w-6" />}
          trend="Current occupancy rate"
          className="bg-purple-50 border-purple-100"
          iconClassName="text-purple-600"
          ariaLabel="Room availability percentage"
        />
      </section>

      {/* Financial Overview - adjusted spacing */}
      <section 
        className="space-y-4"
        aria-labelledby="financial-overview-heading"
      >
        <h2 
          id="financial-overview-heading"
          className="text-lg font-semibold mb-4 text-gray-900"
        >
          Financial Overview
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard 
            title="Total Revenue"
            value={`₹${stats.paymentStats.totalPayments.toLocaleString()}`}
            icon={<CircleDollarSign className="h-6 w-6" />}
            trend="+8% from last month"
            className="bg-emerald-50 border-emerald-100"
            iconClassName="text-emerald-600"
            ariaLabel="Total revenue"
          />
          <StatsCard 
            title="Pending Payments"
            value={`₹${stats.paymentStats.pendingPayments.toLocaleString()}`}
            icon={<IndianRupee className="h-6 w-6" />}
            trend="12 students pending"
            className="bg-red-50 border-red-100"
            iconClassName="text-red-600"
            ariaLabel="Pending payments"
          />
          <StatsCard 
            title="Monthly Revenue"
            value={`₹${stats.paymentStats.monthlyRevenue.toLocaleString()}`}
            icon={<Activity className="h-6 w-6" />}
            trend="This month's collection"
            className="bg-violet-50 border-violet-100"
            iconClassName="text-violet-600"
            ariaLabel="Monthly revenue"
          />
        </div>
      </section>
    </div>
  );
};

const StatsCard = ({ title, value, icon, trend, className, iconClassName, ariaLabel }) => (
  <Card className={`relative overflow-hidden focus-within:ring-2 focus-within:ring-violet-600 ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
      <div className={`p-2 rounded-full bg-white ${iconClassName}`} aria-hidden="true">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div 
        className="text-2xl font-bold text-gray-900"
        aria-label={ariaLabel}
      >
        {value}
      </div>
      <p className="text-sm text-gray-600 mt-1">{trend}</p>
    </CardContent>
  </Card>
);

export default AdminDashboard;
