import React, { useState, useEffect } from 'react';
import moment from 'moment';

import './styles.css';

export default props => {
  const [date] = useState(new Date());
  const [year, setYear] = useState('');

  useEffect(() => {
    const year = moment(date).format('YYYY'); 
    setYear(year);
  }, [date]);

  return (
    <footer className="footer">
        <h4> &copy; {year} GitHub Repositories </h4>
    </footer>
  );
};
