import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import api from '../../services/api';
import { FaUser, FaEnvelope, FaLink  } from 'react-icons/fa';
import { GoChevronLeft } from "react-icons/go";

import './styles.css';
import Header from '../../components/header';
import Footer from '../../components/footer';
import languageColors from '../../languageColors';
import Pagination from '../../components/pagination'

const initialStateUser = { 
  username: '', 
  avatarUrl: '', 
  name: '', 
  blog: '', 
  email: '', 
  bio: '', 
  publicRepos: 0
};

export default () => {
  let { username } = useParams();
  let history = useHistory();
  const [user, setUser] =  useState(initialStateUser);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadPagination, setLoadPagination] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumber, setPageNumber] = useState([]);
  const [lastPage, setLastPage] = useState(0);

  const loadRepositories = useCallback(async (currentPage = 1) => {
    try {
      const responseUser = await api.get(`/users/${username}`);
      const response = await api.get(`/users/${username}/repos?page=${currentPage}&per_page=30`);
      const { link } = response.headers;
      if (link !== undefined)  {
        getPagination(currentPage, link);
        setLoadPagination(true);
      }

      setCurrentPage(currentPage);
      setUser({
        username: responseUser.data.login,
        avatarUrl: responseUser.data.avatar_url,
        name: responseUser.data.name,
        blog: responseUser.data.blog,
        email: responseUser.data.email,
        bio: responseUser.data.bio,
        publicRepos: responseUser.data.public_repos,
      })

      const repoArray = [];
      response.data.map(repo => (
        repoArray.push({
          id: repo.id,
          name: repo.name,
          htmlUrl: repo.html_url,
          description: repo.description,
          language: repo.language,
        })
      ));

      setRepositories(repoArray);
      setLoading(false);
      window.scrollTo(0, 0);
    } catch (error) {
      history.push('/');
    }
  }, [username, history]);

  useEffect(() => {
    loadRepositories();
  }, [loadRepositories]);

  const getPagination = (pageNumber, link) => {
    const linkSections = link.split(',');
    const values = linkSections.map(link => link.split(';'));
    const array = values.map(item => item[0].split('=')[1].split('&')[0]);
    const newArray = array.map(item => parseInt(item[0], 10));
    newArray.push(pageNumber);
    // ordena a array
    newArray.sort((a, b) => a - b);
    // remove items(numeros) repetidos
    const pageNumbersArray = newArray.filter((item, index, self) => index === self.indexOf(item));
    const pageNumberIndice = pageNumbersArray.length;
    setLastPage(pageNumbersArray[pageNumberIndice - 1]);
    setPageNumber(pageNumbersArray);
  };

  const truncateString = (str, max) => {
    if (str !== null)
      return str.length > max ? str.substr(0, max - 1) + '...' : str;
  };
  
  return (
    <div className="wrap-repo">
      <Header title="Busca de Repositórios" />
      {!loading && 
        <div className="repo-container">
          <div className="main-content">
            <div className="main-div-mobile back-action">
              <Link to="/"><GoChevronLeft />Back to Home</Link>
            </div>
            <div className="main-header">
              <img className="avatar-user" src={user.avatarUrl} width="150" height="150" alt="avatar"/>
              <div className="main-header-items">
                <div className="header-item">
                  <span><FaUser /></span>
                  <div>
                    <h2>{user.username}</h2>
                    {user.bio &&
                      <div className="header-item">
                        <h3>{user.bio}</h3>
                      </div>
                    }
                  </div>    
                </div>
                {(user.email || user.blog) &&
                  <div className="header-item-link">
                    {user.email &&
                      <div>
                        <span><FaEnvelope /></span>
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                      </div>
                    }
                    {user.blog &&
                      <div>
                        <span><FaLink /></span>
                        <a target="_blank" rel="noopener noreferrer" href="https://rocketseat.com.br">{user.blog}</a>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>

            <div className="main-body">
              <div className="main-body-text">
                <h2>Repositories</h2>
                <span>{user.publicRepos}</span>
              </div>
              <ul className="main-body-items">
                {repositories.length > 0 ? (
                  <>
                    {repositories.map(repo => (
                      <li key={repo.id}>
                        <div className="box-item">
                          <a target="_blank" rel="noopener noreferrer" href={repo.htmlUrl}>{repo.name}</a>
                          <p>{truncateString(repo.description, 115)}</p>
                          <div className="box-item-ln">
                            <span style={{ backgroundColor: languageColors[repo.language] }}></span>
                            <span>{repo.language}</span></div>
                        </div>
                      </li>
                    ))}
                  </>
                ) : (
                  <h3>There aren't repositories</h3>
                )}
              </ul>
            </div>
            {loadPagination &&
              <Pagination 
                currentPage={currentPage}
                loadRepositories={loadRepositories}
                pageNumber={pageNumber}
                lastPage={lastPage}
              />
            }
          </div>
          <Footer />
        </div>
      }
    </div>
  );
}
