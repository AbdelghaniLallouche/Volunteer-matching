import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../../redux/slices/authSlice';
import Input from '../../components/Shared/Input';
import Button from '../../components/Shared/Button';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'volunteer' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      alert(message);
    }

    if (isSuccess || user) {
      navigate(`/${user.role}/missions`);
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mint-light to-vibrant-green/20 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-vibrant-green mb-1">
            {formData.role === 'volunteer' ? 'Valunteer' : 'Association Portal'}
          </h1>
          <p className="text-sm text-gray-600">
            {formData.role === 'volunteer'
              ? "Welcome back! Let's make a difference."
              : "Welcome back to your organization account."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Login as</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'volunteer' })}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  formData.role === 'volunteer'
                    ? 'bg-vibrant-green text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Volunteer
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'association' })}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  formData.role === 'association'
                    ? 'bg-vibrant-green text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Association
              </button>
            </div>
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Button type="submit" fullWidth className="mt-5" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Login'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-vibrant-green font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
