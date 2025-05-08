import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    floor: '',
    type: 'Single',
    capacity: '',
    price: ''
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const response = await fetch('http://localhost:5000/api/admin/rooms', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    if (data.success) {
      setRooms(data.rooms);
    }
  };

  const updateRoomStatus = async (roomId, status) => {
    const response = await fetch(`http://localhost:5000/api/admin/rooms/${roomId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status })
    });
    if (response.ok) {
      fetchRooms();
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newRoom)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Room added successfully');
        setShowAddModal(false);
        setNewRoom({
          roomNumber: '',
          floor: '',
          type: 'Single',
          capacity: '',
          price: ''
        });
        fetchRooms();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to add room');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Rooms</h2>
        <Button onClick={() => setShowAddModal(true)}>Add New Room</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room._id} className="bg-white p-6 rounded-lg shadow-sm border flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Room {room.roomNumber}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                room.status === 'Available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {room.status}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600 flex-grow">
              <div className="flex justify-between items-center py-1 border-b">
                <span>Floor</span>
                <span className="font-medium text-gray-900">{room.floor}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b">
                <span>Type</span>
                <span className="font-medium text-gray-900">{room.type}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b">
                <span>Capacity</span>
                <span className="font-medium text-gray-900">{room.capacity} Students</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b">
                <span>Price</span>
                <span className="font-medium text-gray-900">₹{room.price}/month</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm"
                className={`flex-1 ${
                  room.status === 'Available' 
                    ? 'border-green-200 text-green-700 hover:bg-green-50'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => updateRoomStatus(room._id, 'Available')}
              >
                Mark Available
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className={`flex-1 ${
                  room.status === 'Maintenance'
                    ? 'border-red-200 text-red-700 hover:bg-red-50'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => updateRoomStatus(room._id, 'Maintenance')}
              >
                Maintenance
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h3 className="text-lg font-semibold mb-4">Add New Room</h3>
            <form onSubmit={handleAddRoom} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Number</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={newRoom.roomNumber}
                  onChange={(e) => setNewRoom({...newRoom, roomNumber: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Floor</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={newRoom.floor}
                  onChange={(e) => setNewRoom({...newRoom, floor: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newRoom.type}
                  onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
                  required
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Triple">Triple</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Capacity</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({...newRoom, capacity: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={newRoom.price}
                  onChange={(e) => setNewRoom({...newRoom, price: e.target.value})}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Room
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRooms;
