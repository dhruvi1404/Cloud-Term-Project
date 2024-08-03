import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerificationPage = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/VerifyRegisterCode`, { verification_code: verificationCode });
      setMessage(response.data.message);
      if (response.status === 200) {
        // Verification successful, navigate to home page
        navigate('/');
      }
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Verification Page</h2>
      <input type="text" placeholder="Enter Verification Code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
      <button onClick={handleVerify}>Verify</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerificationPage;
