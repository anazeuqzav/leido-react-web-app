import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Register page component
 */
const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
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
            Create an Account
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"
          />

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

          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full px-2 py-2 border rounded-md text-sm ${password !== confirmPassword && confirmPassword !== '' ? 'border-red-500' : 'border-gray-300'}`}
            />
            {password !== confirmPassword && confirmPassword !== '' && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#0d4341] text-white font-bold border-2 border-[#0d4341] py-2 rounded-md text-base hover:bg-pink-400 transition-colors"
          >
            {loading ? 'Loading...' : 'Register'}
          </button>

          <p className="text-sm text-center mt-2">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#0d4341] font-bold hover:underline"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
