import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./error-page.css";

export const Error = () => {
  useEffect(() => {
    // Create star field effect
    const starField = document.querySelector('.star-field');
    const createStar = () => {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.width = `${Math.random() * 3 + 1}px`;
      star.style.height = star.style.width;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
      star.style.setProperty('--delay', `${Math.random() * 2}s`);
      return star;
    };

    // Add stars to the field
    for (let i = 0; i < 150; i++) {
      starField.appendChild(createStar());
    }

    // Cleanup function
    return () => {
      while (starField.firstChild) {
        starField.removeChild(starField.firstChild);
      }
    };
  }, []);

  return (
    <div className="error-page">
      <div className="star-field"></div>
      <div className="error-container">
        <h1 className="error-text">404</h1>
        <p className="error-message">Oops! Page not found</p>
        <Link to="/" className="return-button">
          Return Home
        </Link>
      </div>
    </div>
  );
};
