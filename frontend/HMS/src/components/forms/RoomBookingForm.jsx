import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";


const RoomBookingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    course: '',
    batch: '',
    year: '1st',
    seater: '2',
    AC: 'no',
    gender: '',
    address: '',
    phoneNumber: '',
    rollNumber: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Age</label>
          <Input
            type="number"
            placeholder="Enter your age"
            min="16"
            max="30"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Course</label>
          <Input
            type="text"
            placeholder="Enter your course"
            value={formData.course}
            onChange={(e) => setFormData({...formData, course: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Batch</label>
          <Input
            type="text"
            placeholder="Enter your batch"
            value={formData.batch}
            onChange={(e) => setFormData({...formData, batch: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Year</label>
          <select
            className="w-full p-2 border rounded-md"
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: e.target.value})}
            required
          >
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Room Type</label>
          <select
            className="w-full p-2 border rounded-md"
            value={formData.seater}
            onChange={(e) => setFormData({...formData, seater: e.target.value})}
            required
          >
            <option value="2">2 Seater</option>
            <option value="3">3 Seater</option>
            <option value="4">4 Seater</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">AC Preference</label>
          <select
            className="w-full p-2 border rounded-md"
            value={formData.ac}
            onChange={(e) => setFormData({...formData, ac: e.target.value})}
            required
          >
            <option value="yes">AC</option>
            <option value="no">Non-AC</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Gender</label>
          <select
            className="w-full p-2 border rounded-md"
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value})}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <Input
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Roll Number</label>
          <Input
            type="text"
            placeholder="Enter your roll number"
            value={formData.rollNumber}
            onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
            required
          />
        </div>
        <div className="col-span-2 space-y-2">
          <label className="text-sm font-medium">Address</label>
          <textarea
            className="w-full p-2 border rounded-md min-h-[100px]"
            placeholder="Enter your address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Submit Booking Request
      </Button>
    </form>
  );
};

export default RoomBookingForm;
