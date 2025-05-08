import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
