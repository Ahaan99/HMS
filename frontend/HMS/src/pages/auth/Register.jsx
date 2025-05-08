import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/context/AuthContext';
import { UserPlus } from 'lucide-react';
import { toast } from "sonner";

const Register = () => {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords don't match!");
      }
      
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      toast.success("Registration successful!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
      <div className="flex w-[900px] h-[650px] bg-white rounded-2xl shadow-lg">
        {/* Left Panel */}
        <div className="w-[300px] bg-[#4461F2] px-8 py-10 flex-shrink-0 rounded-l-2xl">
          <div className="h-full flex flex-col justify-between">
            <div>
              <h1 className="text-white text-3xl font-bold leading-tight">
                Welcome to<br />HMS
              </h1>
              <p className="text-white/90 mt-4 text-base">
                Your complete hotel management solution
              </p>
            </div>
            <p className="text-white/70 text-sm">© 2025 HMS. All rights reserved.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex items-center justify-center px-12">
          <div className="w-full max-w-[360px]">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-[#4461F2] p-3 rounded-lg mb-4">
                <span className="text-white text-2xl font-bold">🏨</span>
              </div>
              <h2 className="text-2xl font-bold">Create Account</h2>
              <p className="text-gray-600 mt-1">Join us today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mb-4">
              {[
                { id: 'name', label: 'Full Name', type: 'text' },
                { id: 'email', label: 'Email', type: 'email' },
                { id: 'password', label: 'Password', type: 'password' },
                { id: 'confirmPassword', label: 'Confirm Password', type: 'password' }
              ].map(({ id, label, type }) => (
                <div key={id}>
                  <label className="block text-sm mb-2">{label}</label>
                  <Input
                    type={type}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    className="w-full h-12 rounded-lg border-gray-300"
                    value={formData[id]}
                    onChange={(e) => setFormData({...formData, [id]: e.target.value})}
                    required
                  />
                </div>
              ))}

              <Button 
                type="submit"
                className="w-full h-12 bg-[#4461F2] hover:bg-[#3451E2] rounded-lg font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Register'}
              </Button>
            </form>

            <p className="text-center text-gray-600 text-sm mb-2">
              Already have an account?{' '}
              <Link to="/login" className="text-[#4461F2] hover:text-[#3451E2] font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
