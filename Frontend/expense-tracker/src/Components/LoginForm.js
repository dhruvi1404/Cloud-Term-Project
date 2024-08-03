import React, { useState } from 'react';
import axios from 'axios';
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
      const requestBody = {
        email: formData.email,
        password: formData.password
      };

      // Send login request to the backend
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/Login`, requestBody);
      if (response.status === 200) {
        setMessage('Login successful!');
        // Store the user data in local storage
        localStorage.setItem('user', JSON.stringify(response.data));
        // Redirect to the dashboard or another protected route
        navigate('/');
      } else {
        setMessage('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred during login.');
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
