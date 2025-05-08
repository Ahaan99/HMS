import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import RoomBookingForm from '@/components/forms/RoomBookingForm';

const RoomBooking = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('select'); // 'select' or 'form'
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rooms', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setRooms(data.rooms);
      }
    } catch (error) {
      toast.error('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setStep('form');
  };

  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/book/${selectedRoom._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          roomNumber: selectedRoom.roomNumber,
          roomType: selectedRoom.type,
          bookingDate: new Date().toISOString()
        })
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Room booking request submitted successfully');
        setStep('select');
        setSelectedRoom(null);
        fetchRooms(); // Refresh room list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to submit booking request');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading rooms...</div>;
  }

  if (!loading && rooms.length === 0) {
    return <div className="text-center py-10">No rooms available at the moment.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Room Booking</h2>
        {step === 'form' && (
          <Button 
            variant="outline" 
            onClick={() => setStep('select')}
          >
            Back to Rooms
          </Button>
        )}
      </div>
      
      {step === 'select' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room._id} className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold">Room {room.roomNumber}</h3>
              <div className="mt-2 space-y-2 text-sm text-gray-600">
                <p>Floor: {room.floor}</p>
                <p>Type: {room.type}</p>
                <p>Price: ₹{room.price}</p>
                <p>Status: <span className={`font-medium ${room.status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>{room.status}</span></p>
              </div>
              <Button
                className="mt-4 w-full"
                disabled={room.status !== 'Available'}
                onClick={() => handleRoomSelect(room)}
              >
                {room.status === 'Available' ? 'Book Room' : 'Not Available'}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">
            Booking Form for Room {selectedRoom.roomNumber}
          </h3>
          <RoomBookingForm onSubmit={handleFormSubmit} />
        </div>
      )}
    </div>
  );
};

export default RoomBooking;
