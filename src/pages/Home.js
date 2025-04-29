import React from 'react';
import Movies from './Movies';

const Home = () => {
  return (
    <div className="text-center mt-5">
      <h1>Movies Catalog</h1>
      <p>Popular Movies and Reviews</p>
      <Movies />
    </div>
  );
};

export default Home;