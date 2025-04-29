import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({ title: '', director: '', year: '', description: '', genre: '' });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/movies/getMovies`)
      .then(res => res.json())
      .then(data => setMovies(data.movies))
      .catch(err => console.error(err));
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
      .then(res => res.json())
      .then(data => setMovies([...movies, data]))
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/movies/deleteMovie/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => setMovies(movies.filter(movie => movie._id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div className="container mt-4">
      <h1>Admin Dashboard</h1>
      <button id="AddMovie" className="btn btn-success mb-3" onClick={handleAddMovie}>Add Movie</button>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Director</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie._id}>
              <td>{movie.title}</td>
              <td>{movie.director}</td>
              <td>{movie.year}</td>
              <td>
                <button className="btn btn-warning mx-2">Update</button>
                <button className="btn btn-danger" onClick={() => handleDelete(movie._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;