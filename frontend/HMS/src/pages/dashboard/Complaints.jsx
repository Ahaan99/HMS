import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Maintenance'
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/complaints', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setComplaints(data.complaints);
      }
    } catch (error) {
      toast.error('Failed to fetch complaints');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Complaint submitted successfully');
        setShowForm(false);
        setFormData({ title: '', description: '', category: 'Maintenance' });
        fetchComplaints();
      }
    } catch (error) {
      toast.error('Failed to submit complaint');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Complaints</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Complaint'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              className="w-full p-2 border rounded-md"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            >
              <option value="Maintenance">Maintenance</option>
              <option value="Cleanliness">Cleanliness</option>
              <option value="Food">Food</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>
          <Button type="submit">Submit Complaint</Button>
        </form>
      )}

      <div className="space-y-4">
        {complaints.map((complaint) => (
          <div key={complaint._id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{complaint.title}</h3>
                <p className="text-sm text-gray-500">{complaint.category}</p>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {complaint.status}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{complaint.description}</p>
            {complaint.response && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">Response:</p>
                <p className="mt-1">{complaint.response}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Complaints;
