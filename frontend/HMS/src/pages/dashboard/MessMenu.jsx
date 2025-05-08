import { useState, useEffect } from 'react';
import { toast } from "sonner";

const MessMenu = () => {
  const [menu, setMenu] = useState(null);

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
      if (data.success) {
        setMenu(data.menu);
      }
    } catch (error) {
      toast.error('Failed to fetch menu');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Today's Mess Menu</h2>
      {menu ? (
        <div className="grid gap-6 md:grid-cols-3">
          <MenuCard title="Breakfast" items={menu.breakfast} />
          <MenuCard title="Lunch" items={menu.lunch} />
          <MenuCard title="Dinner" items={menu.dinner} />
        </div>
      ) : (
        <p className="text-gray-500">Menu not available for today</p>
      )}
    </div>
  );
};

const MenuCard = ({ title, items }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <h3 className="text-lg font-semibold mb-3">{title}</h3>
    <p className="text-gray-600 whitespace-pre-line">{items}</p>
  </div>
);

export default MessMenu;
