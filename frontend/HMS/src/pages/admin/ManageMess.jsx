import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ManageMess = () => {
  const [menu, setMenu] = useState({
    breakfast: '',
    lunch: '',
    dinner: ''
  });

  useEffect(() => {
    fetchTodayMenu();
  }, []);

  const fetchTodayMenu = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/mess/today', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success && data.menu) {
        setMenu(data.menu);
      }
    } catch (error) {
      toast.error('Failed to fetch menu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/mess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(menu)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Menu updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update menu');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Mess Menu</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="font-medium">Breakfast</label>
            <textarea
              className="w-full p-2 border rounded-md"
              value={menu.breakfast}
              onChange={(e) => setMenu({ ...menu, breakfast: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium">Lunch</label>
            <textarea
              className="w-full p-2 border rounded-md"
              value={menu.lunch}
              onChange={(e) => setMenu({ ...menu, lunch: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium">Dinner</label>
            <textarea
              className="w-full p-2 border rounded-md"
              value={menu.dinner}
              onChange={(e) => setMenu({ ...menu, dinner: e.target.value })}
              required
            />
          </div>
        </div>
        <Button type="submit">Update Menu</Button>
      </form>
    </div>
  );
};

export default ManageMess;
