import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Login page component
 */

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/read');
    } else {
      alert('Incorrect email or password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-[80px] font-[Anton] text-[#0d4341] m-0">LEÍDO</h1>
        <h2 className="font-[Poppins] text-[20px] font-normal text-gray-700 mt-1 text-center">
          Your library, always with you
        </h2>
      </div>

      <div className="flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded-lg shadow-lg flex flex-col w-[300px] gap-3"
        >
          <h2 className="mb-3 text-[#0d4341] text-lg font-semibold text-center">
            Log In
          </h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"
          />

          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="bg-[#0d4341] text-white font-bold border-2 border-[#0d4341] py-2 rounded-md text-base hover:bg-pink-400 transition-colors"
          >
            Login
          </button>

          <p className="text-sm text-center mt-2">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-[#0d4341] font-bold hover:underline"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

