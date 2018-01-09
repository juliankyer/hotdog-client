import React from 'react';
import hotdog from '../assets/images/hotdog.gif';
import '../assets/stylesheets/LoadingBlock.css';

const LoadingBlock = () => {
  return (
    <div className="loading-block">
      <img alt="hotdog walking" src={hotdog} />
      <img alt="hotdog walking" src={hotdog} />
      <img alt="hotdog walking" src={hotdog} />
      <img alt="hotdog walking" src={hotdog} />
      <img alt="hotdog walking" src={hotdog} />
    </div>
  );
};

export default LoadingBlock;
