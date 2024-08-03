import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UploadBillPage.css'; // Import the CSS file

const UploadBillPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [dates, setDates] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      // Convert file to base64
      const fileData = await convertFileToBase64(file);
      
      // Create request body in JSON format
      const requestBody = {
        image_data: fileData,
        image_name: file.name
      };
  
      // Send the request with JSON data
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/UploadToS3`, requestBody);
      
      // Check if the response contains products and dates
      if (response.data && response.data.products && response.data.dates) {
        // Save products and dates in local storage
        localStorage.setItem('products', JSON.stringify(response.data.products));
        localStorage.setItem('dates', JSON.stringify(response.data.dates));

        // Update state to trigger rendering of the table
        setProducts(response.data.products);
        setDates(response.data.dates);
  
        setMessage('File Uploaded Successfully. Data saved to local storage.');
      } else {
        setMessage('Error uploading file. Invalid response data.');
      }
    } catch (error) {
      setMessage('Error uploading file. ');
      console.error(error);
    }
  };
  
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  useEffect(() => {
    // Load products and dates from local storage when component mounts
    const storedProducts = JSON.parse(localStorage.getItem('products'));
    const storedDates = JSON.parse(localStorage.getItem('dates'));
    if (storedProducts && storedDates) {
      setProducts(storedProducts);
      setDates(storedDates);
    }
  }, []);

  const handleAddToDatabase = async () => {
    try {
      // Retrieve email from registrationData in local storage
      const registrationData = JSON.parse(localStorage.getItem('registrationData'));
      const email = registrationData.email;

      // Prepare request body for UpdateInventory API
      const requestBody = {
        email: email,
        products: products,
        date: dates[0] // Assuming only one date is stored
      };
      
      console.log(requestBody)
      // Call UpdateInventory API
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/UpdateInventory`, requestBody);

      
      // Check if the response contains a success message
      if (response.data) {
        setMessage("Added the data to the database.");
      } else {
        setMessage('Error adding data to the database.');
      }
    } catch (error) {
      setMessage('Error adding data to the database. ' );
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Upload Bill</h2>
      <div className="uploadContainer">
        <input type="file" onChange={handleFileChange} className="fileInput" />
      </div>
      <div className="uploadButtonContainer">
        <button onClick={handleFileUpload} className="uploadButton">Upload File</button>
      </div>
      {message && <p className="message">{message}</p>}
      {products.length > 0 && (
        <div>
          <h2>Products Table</h2>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Number</th>
                <th>Product Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.number}</td>
                  <td>{product.price}</td>
                  <td>{dates[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={handleAddToDatabase}>Add To Database</button>
    </div>
  );
};

export default UploadBillPage;
