import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, User, Phone, BookOpen } from 'lucide-react';
import Navbar from '../components/HomePage/Navbar';
import Footer from '../components/HomePage/Footer';

const BASE_URL = "http://127.0.0.1:8000/";

const LoginRegister = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const endpoint = isLogin
      ? `${BASE_URL}users/user_login/`
      : `${BASE_URL}users/user_register/`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isLogin ? {
          email: formData.email,
          password: formData.password
        } : {
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phone
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (isLogin) {
        const userResponse = await fetch(`${BASE_URL}users/user_details/`, {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });
        const userData = await userResponse.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData.user_details));

        toast.success("Logged in successfully!");
        setTimeout(() => navigate("/", { replace: true }), 2000);
      } else {
        toast.success("Registered successfully!");
        setIsLogin(true);
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="h-20" />
      <div className="flex-grow flex items-center justify-center py-16">
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-12 px-4">
          {/* Left Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-1/2 text-center"
          >
            <div className="mb-8">
              <BookOpen className="h-16 w-16 text-gray-900 mx-auto mb-6" />
              <h1 className="text-4xl font-light text-gray-900 mb-4">
                Scroll<span className="font-serif italic">&</span>Shelf
              </h1>
              <div className="mx-auto h-px w-24 bg-gray-300" />
            </div>
            <p className="text-xl text-gray-600 px-8">
              {isLogin 
                ? "Welcome back to your literary sanctuary"
                : "Join our community of passionate readers"}
            </p>
          </motion.div>

          {/* Right Section - Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              className="w-full md:w-1/2 bg-white border border-gray-100 rounded-xl shadow-sm p-8"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-light text-gray-900 mb-8">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group relative">
                      <User className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
                      />
                    </div>
                    <div className="group relative">
                      <User className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
                      />
                    </div>
                  </div>
                )}

                {!isLogin && (
                  <div className="group relative">
                    <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
                    />
                  </div>
                )}

                <div className="group relative">
                  <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
                  />
                </div>

                <div className="group relative">
                  <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </motion.button>
              </form>

              <p className="mt-6 text-gray-600 text-center">
                {isLogin ? "New to Scroll & Shelf?" : "Already have an account?"}
                <button
                  onClick={toggleForm}
                  className="ml-2 text-amber-600 hover:text-amber-700 font-medium"
                >
                  {isLogin ? 'Create account' : 'Sign in instead'}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginRegister;