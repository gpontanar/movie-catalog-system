import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; 

const UserDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [expandedMovieId, setExpandedMovieId] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
      fetch(`${process.env.REACT_APP_API_URL}/movies/getMovies`)
          .then((res) => res.json())
          .then((data) => {
              console.log('Fetched movies:', data.movies);
              setMovies(data.movies);
          })
          .catch((err) => console.error('Error fetching movies:', err));
  }, []);

  const toggleComments = (movieId) => {
      setExpandedMovieId((prevId) => (prevId === movieId ? null : movieId));
  };

  const handleAddComment = (movieId) => {
      if (!comment.trim()) {
          Swal.fire({
              icon: 'warning',
              title: 'Empty Comment',
              text: 'Comment cannot be empty!',
          });
          return;
      }

      fetch(`${process.env.REACT_APP_API_URL}/movies/addComment/${movieId}`, {
          method: 'PATCH',
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
              setMovies((prevMovies) =>
                  prevMovies.map((movie) =>
                      movie._id === updatedMovie.updatedMovie._id ? updatedMovie.updatedMovie : movie
                  )
              );
              setComment('');
              Swal.fire({
                  icon: 'success',
                  title: 'Comment Added',
                  text: 'Your comment has been added successfully!',
              });
          })
          .catch((err) => {
              console.error('Error adding comment:', err);
              Swal.fire({
                  icon: 'error',
                  title: 'Failed to Add Comment',
                  text: 'An error occurred while adding your comment. Please try again.',
              });
          });
  };

  const handleDeleteComment = (movieId, commentId) => {
    fetch(`${process.env.REACT_APP_API_URL}/movies/deleteComment/${movieId}/${commentId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then((updatedMovie) => {
            setMovies((prevMovies) =>
                prevMovies.map((movie) =>
                    movie._id === updatedMovie.updatedMovie._id ? updatedMovie.updatedMovie : movie
                )
            );
            Swal.fire({
                icon: 'success',
                title: 'Comment Deleted',
                text: 'Your comment has been deleted successfully!',
            });
        })
        .catch((err) => {
            console.error('Error deleting comment:', err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Delete Comment',
                text: 'An error occurred while deleting your comment. Please try again.',
            });
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
                              <h2 className="card-title">{movie.title}</h2>
                              <p className="card-text">
                                  <strong>Director:</strong> {movie.director}
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
                                                      By{' '}
                                                      {commentObj.userId === JSON.parse(localStorage.getItem('user')).id
                                                          ? 'You'
                                                          : commentObj.userId || 'Anonymous'}
                                                  </span>
                                                  {commentObj.userId === JSON.parse(localStorage.getItem('user')).id && (
                                                      <button
                                                          className="btn btn-danger btn-sm"
                                                          onClick={() => handleDeleteComment(movie._id, commentObj._id)}
                                                      >
                                                          Delete
                                                      </button>
                                                  )}
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