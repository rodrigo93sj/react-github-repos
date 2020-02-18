import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import { FaGithub } from "react-icons/fa";

import './styles.css';

const Home = () => {
  let history = useHistory();
  const [username, setUsername] = useState('');
  const [messageError, setMessageError] = useState('');

  const handleAccess = async event => {
    event.preventDefault();
    try {
      const responseUser = await api.get(`/users/${username}`);
      if (responseUser.status === 200) history.push(`/repositories/${username}`);
    } catch (error) {
      setUsername('');
      setMessageError('User not found.');
    }
  };

  const btnClose = () => {
    setMessageError('');
  };

  return (
    <div className="wrap-home">
      <div className="home-container">
        <div className="application-content">
          <div className="application-header">
            <div className="header-logo"><FaGithub /></div>
            <h2>GitHub Repositories</h2>
          </div>
          {!!messageError && 
            <div className="alert-error">
              <p>{messageError}</p>
              <button className="close" onClick={btnClose}>
                <span>X</span>
              </button>
            </div>
          }
          <div className="application-form">
            <form onSubmit={handleAccess}>
              <label>
                GitHub Username
              </label>
              <input 
                type="text" 
                className="input-control" 
                value={username} 
                onChange={e => setUsername(e.target.value)} />
              <input type="submit" value="Search" className="button-default" />
            </form>
          </div>
          <div className="application-footer">
            <p>
              Don't have a account?
              <a target="_blank" rel="noopener noreferrer" href="https://github.com/"> Sign up on GitHub.</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
