import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";

const Login = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData);
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
      <div className="flex w-[900px] h-[600px] bg-white rounded-2xl shadow-lg">
        {/* Left Panel */}
        <div className="w-[300px] bg-[#4461F2] px-8 py-10 flex-shrink-0 rounded-l-2xl">
          <div className="h-full flex flex-col justify-between">
            <div>
              <h1 className="text-white text-3xl font-bold leading-tight">
                Welcome to<br />HMS
              </h1>
              <p className="text-white/90 mt-4 text-base">
                Manage your hotel operations seamlessly
              </p>
            </div>
            <p className="text-white/70 text-sm">© 2025 HMS. All rights reserved.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex items-center justify-center px-12">
          <div className="w-full max-w-[360px]">
            <div className="flex flex-col items-center">
              <div className="bg-[#4461F2] p-3 rounded-lg mb-6">
                <span className="text-white text-2xl font-bold">🏨</span>
              </div>
              <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Login to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 mb-4">
              <div>
                <label className="block text-sm mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-12 rounded-lg border-gray-300"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full h-12 rounded-lg border-gray-300"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>

              <Button 
                type="submit"
                className="w-full h-12 bg-[#4461F2] hover:bg-[#3451E2] rounded-lg font-medium"
                disabled={isLoading}
              >
                Sign In
              </Button>
            </form>

            <p className="text-center text-gray-600 text-sm mb-2">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#4461F2] hover:text-[#3451E2] font-medium">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
