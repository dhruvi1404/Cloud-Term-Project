import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; // Import the CSS file

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await Auth.signIn(formData.email, formData.password);
      setMessage('Login successful!');
      localStorage.setItem('user', JSON.stringify(user)); // Store user data in local storage
      navigate('/dashboard'); // Redirect to a protected route
    } catch (error) {
      setMessage(error.message || 'An error occurred during login.');
    }
  };

  return (
    <div className="form-container">
      <form className="form-wrapper" onSubmit={handleSubmit}>
        <h2 className="form-title">Login</h2>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="form-input"
        />
        <button type="submit" className="form-button">Login</button>
        {message && <p className="text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
