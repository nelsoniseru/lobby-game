import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { registerUser } from '../../../services/authService';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async e => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await registerUser(form);

    if (response.status) {
      setError('');
      navigate('/login'); 
    } else {
      setError(response.message || 'Registration failed');
    }
  } catch (err) {
    setError(err.message || 'Registration failed'); 
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          disabled={loading}
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          disabled={loading}
        />
        <button
          type="submit"
          className={`w-full py-2 rounded transition-colors ${loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'} text-white`}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}
