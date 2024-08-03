import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const RegistrationForm = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [formData, setFormData] = useState({
    given_name: '',
    email: '',
    age: '',
    password: '',
    verification_code: ''
  });
  const [message, setMessage] = useState('');
  const [showVerification, setShowVerification] = useState(false); // Define showVerification state variable

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Store the registration data in local storage
      localStorage.setItem('registrationData', JSON.stringify(formData));

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/Registration`, formData);
      setMessage(response.data.message);
      if (response.status === 200) {
        // Always show the verification code field after successful registration
        setShowVerification(true);
      }
    } catch (error) {
      if(error.response!=undefined)
        setMessage(error.response.data.message);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    try {
      // Retrieve the registration data from local storage
      const storedData = JSON.parse(localStorage.getItem('registrationData'));
      const verificationData = {
        ...storedData,
        verification_code: formData.verification_code
      };
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/VerifyRegisterCode`, verificationData);
      setMessage(response.data.message);
      if (response.status === 200) {
        navigate('/upload-bill'); // Navigate to home page
      }
    } catch (error) {
      if(error.response != undefined)
        setMessage(error.response.data.message);
    }
  };

  return (
    <div className="form-container">
      <form className="form-wrapper" onSubmit={showVerification ? handleVerificationSubmit : handleSubmit}>
        <h2 className="form-title">Registration</h2>
        <input type="text" placeholder="Given Name" name="given_name" value={formData.given_name} onChange={handleChange} className="form-input" />
        <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} className="form-input" />
        <input type="number" placeholder="Age" name="age" value={formData.age} onChange={handleChange} className="form-input" />
        <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} className="form-input" />
        {/* Always show the verification code field */}
        {showVerification && (
          <input type="text" placeholder="Verification Code" name="verification_code" value={formData.verification_code} onChange={handleChange} className="form-input" />
        )}
        {/* Change the button text to "Verify" if showVerification is true */}
        <button type="submit" className="form-button">{showVerification ? 'Verify' : 'Register'}</button>
        {message && <p className="text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default RegistrationForm;
