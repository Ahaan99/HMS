import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { IndianRupee, Clock, CheckCircle } from 'lucide-react';

const DEFAULT_STATS = {
  totalRevenue: 0,
  pendingAmount: 0,
  todayCollection: 0,
  monthlyRevenue: 0
};

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch payment records
        const response = await fetch('http://localhost:5000/api/admin/student-payments', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch payment records');
        }

        const data = await response.json();
        
        if (data.success) {
          setPayments(data.payments || []);
          // Calculate stats from payment records
          const stats = calculatePaymentStats(data.payments);
          setStats(stats);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to fetch payment records');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculatePaymentStats = (payments) => {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);

    return payments.reduce((stats, payment) => {
      const paymentDate = new Date(payment.createdAt).toISOString();

      // Total revenue (all successful payments)
      if (payment.status === 'Paid') {
        stats.totalRevenue += payment.amount;
      }

      // Pending amount
      if (payment.status === 'Pending') {
        stats.pendingAmount += payment.amount;
      }

      // Today's collection
      if (paymentDate.startsWith(today) && payment.status === 'Paid') {
        stats.todayCollection += payment.amount;
      }

      // Monthly revenue
      if (paymentDate.startsWith(thisMonth) && payment.status === 'Paid') {
        stats.monthlyRevenue += payment.amount;
      }

      return stats;
    }, { ...DEFAULT_STATS });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-48">Loading payment data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={<IndianRupee />}
          className="bg-green-50"
        />
        <StatsCard
          title="Pending Amount"
          value={`₹${stats.pendingAmount.toLocaleString()}`}
          icon={<Clock />}
          className="bg-yellow-50"
        />
        <StatsCard
          title="Today's Collection"
          value={`₹${stats.todayCollection.toLocaleString()}`}
          icon={<CheckCircle />}
          className="bg-blue-50"
        />
        <StatsCard
          title="Monthly Revenue"
          value={`₹${stats.monthlyRevenue.toLocaleString()}`}
          icon={<IndianRupee />}
          className="bg-purple-50"
        />
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Payment Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                    <div className="text-sm text-gray-500">{payment.studentId}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">₹{payment.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      payment.status === 'Paid' 
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{payment.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon, className }) => (
  <Card className={`${className}`}>
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-white/50">
          {icon}
        </div>
      </div>
    </div>
  </Card>
);

export default ManagePayments;
