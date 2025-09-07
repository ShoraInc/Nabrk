// components/VerticalLines/VerticalLines.js
import React from 'react';
import './VerticalLines.scss';

const VerticalLines = ({ isHomePage = false }) => {
  return (
    <div className={`vertical-lines ${isHomePage ? 'vertical-lines--home' : ''}`}>
      <div className="vertical-lines__left"></div>
      <div className="vertical-lines__right"></div>
    </div>
  );
};

export default VerticalLines;