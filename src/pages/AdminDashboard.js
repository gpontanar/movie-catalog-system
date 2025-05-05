import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
    const [movies, setMovies] = useState([]);
    const [newMovie, setNewMovie] = useState({ title: '', director: '', year: '', description: '', genre: '' });
    const [expandedMovieId, setExpandedMovieId] = useState(null);
    const [comment, setComment] = useState('');
    const [editMovie, setEditMovie] = useState(null); // For editing a movie

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/movies/getMovies`)
            .then((res) => res.json())
            .then((data) => setMovies(data.movies))
            .catch((err) => console.error(err));
    }, []);

    const handleAddMovie = () => {
        fetch(`${process.env.REACT_APP_API_URL}/movies/addMovie`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(newMovie),
        })
            .then((res) => res.json())
            .then((data) => {
                setMovies([...movies, data]);
                Swal.fire('Success', 'Movie added successfully!', 'success');
                setNewMovie({ title: '', director: '', year: '', description: '', genre: '' });
            })
            .catch((err) => console.error(err));
    };

    const handleDeleteMovie = (id) => {
        fetch(`${process.env.REACT_APP_API_URL}/movies/deleteMovie/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(() => {
                setMovies(movies.filter((movie) => movie._id !== id));
                Swal.fire('Success', 'Movie deleted successfully!', 'success');
            })
            .catch((err) => console.error(err));
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
              Swal.fire('Success', 'Comment added successfully!', 'success');
          })
          .catch((err) => {
              console.error('Error adding comment:', err);
              Swal.fire({
                  icon: 'error',
                  title: 'Failed to Add Comment',
                  text: 'An error occurred while adding the comment. Please try again.',
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
              Swal.fire('Success', 'Comment deleted successfully!', 'success');
          })
          .catch((err) => {
              console.error('Error deleting comment:', err);
              Swal.fire({
                  icon: 'error',
                  title: 'Failed to Delete Comment',
                  text: 'An error occurred while deleting the comment. Please try again.',
              });
          });
  };
    const handleUpdateMovie = () => {
        fetch(`${process.env.REACT_APP_API_URL}/movies/updateMovie/${editMovie._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(editMovie),
        })
            .then((res) => res.json())
            .then((updatedMovie) => {
                setMovies((prevMovies) =>
                    prevMovies.map((movie) =>
                        movie._id === updatedMovie._id ? updatedMovie : movie
                    )
                );
                setEditMovie(null);
                Swal.fire('Success', 'Movie updated successfully!', 'success');
            })
            .catch((err) => console.error(err));
    };



    const toggleComments = (movieId) => {
        setExpandedMovieId((prevId) => (prevId === movieId ? null : movieId));
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center">ADMIN DASHBOARD</h1>
            <p className="text-center">Here you can manage movies and comments.</p>

            {/* Add Movie Section */}
            <div className="mb-4">
                <h2>Add Movie</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={newMovie.title}
                    onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                    className="form-control mb-2"
                />
                <input
                    type="text"
                    placeholder="Director"
                    value={newMovie.director}
                    onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                    className="form-control mb-2"
                />
                <input
                    type="number"
                    placeholder="Year"
                    value={newMovie.year}
                    onChange={(e) => setNewMovie({ ...newMovie, year: e.target.value })}
                    className="form-control mb-2"
                />
                <textarea
                    placeholder="Description"
                    value={newMovie.description}
                    onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                    className="form-control mb-2"
                ></textarea>
                <input
                    type="text"
                    placeholder="Genre"
                    value={newMovie.genre}
                    onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                    className="form-control mb-2"
                />
                <button className="btn btn-success" onClick={handleAddMovie}>
                    Add Movie
                </button>
            </div>

            {/* Movies List */}
            <div>
                <h2>Movies</h2>
                {movies.map((movie) => (
                    <div key={movie._id} className="card mb-3">
                        <div className="card-body">
                            <h3 className="card-title">{movie.title}</h3>
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
                                className="btn btn-danger"
                                onClick={() => handleDeleteMovie(movie._id)}
                            >
                                Delete Movie
                            </button>
                            <button
                                className="btn btn-primary ms-2"
                                onClick={() => toggleComments(movie._id)}
                            >
                                {expandedMovieId === movie._id ? 'Hide Comments' : 'View Comments'}
                            </button>
                            <button
                                className="btn btn-warning ms-2"
                                onClick={() => setEditMovie(movie)}
                            >
                                Edit Movie
                            </button>

                            {/* Comments Section */}
                            {expandedMovieId === movie._id && (
                                <div className="mt-3">
                                    <h6>Comments</h6>
                                    <ul className="list-group">
                                        {movie.comments.map((comment) => (
                                            <li
                                                key={comment._id}
                                                className="list-group-item d-flex justify-content-between align-items-center"
                                            >
                                                {comment.comment}
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        handleDeleteComment(movie._id, comment._id)
                                                    }
                                                >
                                                    Delete
                                                </button>
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
                                        className="btn btn-success mt-2"
                                        onClick={() => handleAddComment(movie._id)}
                                    >
                                        Add Comment
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Movie Modal */}
            {editMovie && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Movie</h2>
                        <input
                            type="text"
                            placeholder="Title"
                            value={editMovie.title}
                            onChange={(e) => setEditMovie({ ...editMovie, title: e.target.value })}
                            className="form-control mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Director"
                            value={editMovie.director}
                            onChange={(e) => setEditMovie({ ...editMovie, director: e.target.value })}
                            className="form-control mb-2"
                        />
                        <input
                            type="number"
                            placeholder="Year"
                            value={editMovie.year}
                            onChange={(e) => setEditMovie({ ...editMovie, year: e.target.value })}
                            className="form-control mb-2"
                        />
                        <textarea
                            placeholder="Description"
                            value={editMovie.description}
                            onChange={(e) => setEditMovie({ ...editMovie, description: e.target.value })}
                            className="form-control mb-2"
                        ></textarea>
                        <input
                            type="text"
                            placeholder="Genre"
                            value={editMovie.genre}
                            onChange={(e) => setEditMovie({ ...editMovie, genre: e.target.value })}
                            className="form-control mb-2"
                        />
                        <button className="btn btn-success" onClick={handleUpdateMovie}>
                            Save Changes
                        </button>
                        <button className="btn btn-secondary ms-2" onClick={() => setEditMovie(null)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;