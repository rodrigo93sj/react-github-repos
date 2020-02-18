import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

export default props => {
  return (
    <header className="header">
      <h3>GitHub Repositories</h3>
      <Link to="/">Back to Home</Link>
    </header>
  );
}
