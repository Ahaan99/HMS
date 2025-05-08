import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar, CheckSquare, Home, CreditCard } from 'lucide-react';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState('details'); // 'details', 'attendance', 'payments'

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/students', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      toast.error('Failed to fetch students');
    }
  };

  const updateStudent = async (studentId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/students/${studentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Student updated successfully');
        fetchStudents();
        setShowModal(false);
      }
    } catch (error) {
      toast.error('Failed to update student');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Students</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setView('details')}>
            <Home className="w-4 h-4 mr-2" />
            Details
          </Button>
          <Button variant="outline" onClick={() => setView('attendance')}>
            <CheckSquare className="w-4 h-4 mr-2" />
            Attendance
          </Button>
          <Button variant="outline" onClick={() => setView('payments')}>
            <CreditCard className="w-4 h-4 mr-2" />
            Payments
          </Button>
        </div>
      </div>

      {view === 'details' ? (
        <div className="bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.studentDetails?.roomNumber || 'Not Assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedStudent(student);
                        setShowModal(true);
                      }}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : view === 'attendance' ? (
        <AttendanceView students={students} />
      ) : (
        <PaymentTrackingView students={students} />
      )}

      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Student Details</h3>
              <Button variant="ghost" onClick={() => setShowModal(false)}>×</Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={selectedStudent.name}
                  onChange={(e) => setSelectedStudent({
                    ...selectedStudent,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-md"
                  value={selectedStudent.email}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={selectedStudent.studentDetails?.course || ''}
                  onChange={(e) => setSelectedStudent({
                    ...selectedStudent,
                    studentDetails: {
                      ...selectedStudent.studentDetails,
                      course: e.target.value
                    }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Room Number</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={selectedStudent.studentDetails?.roomNumber || ''}
                  onChange={(e) => setSelectedStudent({
                    ...selectedStudent,
                    studentDetails: {
                      ...selectedStudent.studentDetails,
                      roomNumber: e.target.value
                    }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Room Details</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={selectedStudent.studentDetails?.roomNumber || ''}
                  onChange={(e) => setSelectedStudent({
                    ...selectedStudent,
                    studentDetails: {
                      ...selectedStudent.studentDetails,
                      roomNumber: e.target.value
                    }
                  })}
                  placeholder="Enter room number"
                />
              </div>
              <div className="text-sm text-gray-500">
                {selectedStudent.studentDetails?.roomId ? (
                  <p>Room Type: {selectedStudent.studentDetails.roomId.type}</p>
                ) : null}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => updateStudent(selectedStudent._id, selectedStudent)}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AttendanceView = ({ students }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between mb-4">
      <h3 className="font-semibold">Attendance Record</h3>
      <input type="date" className="border rounded p-2" />
    </div>
    <table className="min-w-full">
      <thead>
        <tr>
          <th className="px-6 py-3 text-left">Name</th>
          <th className="px-6 py-3 text-left">Room</th>
          <th className="px-6 py-3 text-left">Status</th>
          <th className="px-6 py-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map(student => (
          <tr key={student._id}>
            <td className="px-6 py-4">{student.name}</td>
            <td className="px-6 py-4">{student.studentDetails?.roomNumber || 'N/A'}</td>
            <td className="px-6 py-4">
              <select className="border rounded p-1">
                <option>Present</option>
                <option>Absent</option>
                <option>Leave</option>
              </select>
            </td>
            <td className="px-6 py-4">
              <Button size="sm">Save</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PaymentTrackingView = ({ students }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <table className="min-w-full">
      <thead>
        <tr>
          <th className="px-6 py-3 text-left">Name</th>
          <th className="px-6 py-3 text-left">Room</th>
          <th className="px-6 py-3 text-left">Total Due</th>
          <th className="px-6 py-3 text-left">Last Payment</th>
          <th className="px-6 py-3 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {students.map(student => (
          <tr key={student._id}>
            <td className="px-6 py-4">{student.name}</td>
            <td className="px-6 py-4">{student.studentDetails?.roomNumber || 'N/A'}</td>
            <td className="px-6 py-4">₹{student.payments?.totalDue || 0}</td>
            <td className="px-6 py-4">{student.payments?.lastPayment || 'No payments'}</td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 rounded-full text-xs ${
                student.payments?.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {student.payments?.status || 'Pending'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ManageStudents;
