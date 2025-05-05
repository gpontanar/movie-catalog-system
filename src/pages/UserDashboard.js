import React, { useEffect, useState } from 'react';

const UserDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [expandedMovieId, setExpandedMovieId] = useState(null); // State to track expanded movie
  const [comment, setComment] = useState(''); // State for the comment

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/movies/getMovies`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched movies:', data.movies); // Debugging
        setMovies(data.movies);
      })
      .catch((err) => console.error('Error fetching movies:', err));
  }, []);

  const toggleComments = (movieId) => {
    setExpandedMovieId((prevId) => (prevId === movieId ? null : movieId)); // Toggle comments visibility
  };

  const handleAddComment = (movieId) => {
    if (!comment.trim()) {
      alert('Comment cannot be empty!');
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/movies/addComment/${movieId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ comment }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((updatedMovie) => {
        // Update the movie list with the new comment
        setMovies((prevMovies) =>
          prevMovies.map((movie) =>
            movie._id === updatedMovie._id ? updatedMovie : movie
          )
        );
        setComment(''); // Clear the comment input
        alert('Comment added successfully!');
      })
      .catch((err) => {
        console.error('Error adding comment:', err);
        alert('Failed to add comment. Please try again.');
      });
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">USER DASHBOARD</h1>
      <p className="text-center">Share your experience and comments!</p>
      <div className="row">
        {movies.map((movie) => (
          <div className="col-md-12 mb-4" key={movie._id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">
                  <strong>By:</strong> {movie.director}
                </p>
                <p className="card-text">
                  <strong>Year:</strong> {movie.year}
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
                    <textarea
                      className="form-control mt-3"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <button
                      id="addComment"
                      className="btn btn-success mt-3"
                      onClick={() => handleAddComment(movie._id)}
                    >
                      Add Comment
                    </button>
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

export default UserDashboard;