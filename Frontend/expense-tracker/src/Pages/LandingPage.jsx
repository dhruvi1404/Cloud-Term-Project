import React from 'react';
import { Link } from 'react-router-dom';
import budget185 from "../Assets/budget185.png";
import "../Pages/LandingPage.css";

const LandingPage = () => {
    return (
      <>
       

        {/* Landing Page Content */}
        <div className="container">
          <div className="content">
            <div className="image-container">
              <img src={budget185} alt="Budget Image" className="image" />
            </div>
            <div className="text-container">
              <h1 className="title">Manage your expenses</h1>
              <h2 className="subtitle">Know your bills</h2>
            </div>
          </div>
        </div>
      </>
    );
};

export default LandingPage;
