import React, { useState, useEffect } from 'react';
import './styles.css';

export default ({ currentPage, loadRepositories, pageNumber, lastPage }) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize) }
  }, []);

  const setPage = page => {
    if (page === currentPage) return;

    loadRepositories(page);
  };

  const prevPage = () => {
    if (currentPage === 1) return;

    const pageNumber = currentPage - 1;
    loadRepositories(pageNumber);
  };

  const nextPage = () => {
    if (currentPage === lastPage) return;

    const pageNumber = currentPage + 1;
    loadRepositories(pageNumber);
  };

  const renderPageNumbers = pageNumber.map((number, index) => {
    let classes = currentPage === number ? 'active' : '';

    return (
      <span key={index} className={classes} onClick={() => setPage(number)} >{number}</span>
    );
  });

  return (
    <div className="main-pagination">
      <div className="pagination">
        {width < 600 ? (
          <span disabled={currentPage === 1 ? true : false} onClick={prevPage}>&laquo;</span>
        ) : (
          <span disabled={currentPage === 1 ? true : false} onClick={prevPage}>Anterior</span>
        )}
          {renderPageNumbers}
        {width < 600 ? (
          <span disabled={currentPage === lastPage ? true : false} onClick={nextPage}>&raquo;</span>
        ) : (
          <span disabled={currentPage === lastPage ? true : false} onClick={nextPage}>Próximo</span>
        )}
      </div>
    </div>
  );
};
