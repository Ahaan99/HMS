import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download } from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({
    totalPaid: 0,
    currentDue: 0,
    recentPayments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payments/summary', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSummary(data.summary);
      }
    } catch (error) {
      toast.error('Failed to fetch summary');
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (error) {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (paymentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payments/${paymentId}/pay`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Payment successful');
        fetchPayments();
      }
    } catch (error) {
      toast.error('Payment failed');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payments</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Paid</h3>
          <p className="text-2xl font-semibold mt-2">₹{summary.totalPaid}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Current Semester Due</h3>
          <p className="text-2xl font-semibold mt-2">₹{summary.currentDue}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
          <p className="text-2xl font-semibold mt-2">
            {summary.currentDue > 0 ? 'Pending' : 'Paid'}
          </p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Payment History</h3>
        </div>
        <div className="divide-y">
          {payments.map((payment) => (
            <div key={payment._id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{payment.type}</p>
                <p className="text-sm text-gray-500">
                  {new Date(payment.paidDate || payment.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg">₹{payment.amount}</span>
                {payment.status === 'Paid' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(payment.receiptUrl, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Receipt
                  </Button>
                )}
                {payment.status === 'Pending' && (
                  <Button
                    size="sm"
                    onClick={() => handlePayment(payment._id)}
                  >
                    Pay Now
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Payments;
