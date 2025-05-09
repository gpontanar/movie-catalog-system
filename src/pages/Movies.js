import React, { useEffect, useState } from 'react';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [expandedMovieId, setExpandedMovieId] = useState(null);

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

  const toggleComments = (movieId) => {
    setExpandedMovieId((prevId) => (prevId === movieId ? null : movieId));
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {movies.map((movie) => (
          <div className="col-md-12 mb-4" key={movie._id}>
            <div className="card">
              <img
                src={movie.image || 'https://www.shutterstock.com/image-vector/cinema-film-strip-wave-reel-600nw-1422026513.jpg'} 
                alt={movie.title}
                className="card-img-top movie-image"
              />
              <div className="card-body">
                <h2 className="card-title">{movie.title}</h2>
                <p className="card-text">
                  <strong>Year:</strong> {movie.year}
                </p>
                <p className="card-text">
                  <strong>Director:</strong> {movie.director}
                </p>
                <p className="card-text">
                  <strong>Genre:</strong> {movie.genre}
                </p>
                <p className="card-text">{movie.description}</p>
                <button
                  className="btn btn-toggle-comments"
                  onClick={() => toggleComments(movie._id)}
                >
                  {expandedMovieId === movie._id ? 'Hide Comments' : 'View Comments'}
                </button>
                {expandedMovieId === movie._id && (
                  <div className="comments-section mt-3">
                    <strong>Comments:</strong>
                    <ul className="list-group mt-2">
                      {movie.comments?.map((commentObj, index) => (
                        <li
                          key={commentObj._id || index}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          {commentObj.comment}
                          <span className="badge bg-secondary">
                            By {commentObj.userId || 'Anonymous'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;