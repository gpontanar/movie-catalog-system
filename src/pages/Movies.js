import React, { useEffect, useState } from 'react';

const Movies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/movies/getMovies`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setMovies(data.movies))
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        {movies.map(movie => (
          <div className="col-md-4 mb-4" key={movie._id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">{movie.description}</p>
                <button className="btn btn-primary" onClick={() => alert(`Viewing ${movie.title}`)}>View Movie</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;