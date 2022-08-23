import { useEffect, useState } from "react";
import { movieService } from "../services/movie.service";
import { userService } from "../services/user.service";
import { Link } from "react-router-dom";
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
  rel="stylesheet"
  integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
  crossorigin="anonymous"
></link>;

const HomePage = () => {
  const [countMovies, setCountMovies] = useState(null);
  const [countUsers, setCountUsers] = useState(null);
  const [countBy, setCount] = useState([]);
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);

  const getMovies = async () => {
    const result = await movieService.getMovieList();
    setMovies(result);
    setFilteredMovies(result);
  };

  const inputHandler = (e) => {
    setFilter(e.target.value);
    setFilteredMovies(
      movies.filter((movie) => {
        return movie.title.toLowerCase().includes(e.target.value.toLowerCase());
      })
    );
  };

  useEffect(() => {
    const getCountByGenre = async () => {
      const result = await movieService.getCountByGenre();
      setCount(result);

      if (!movies.length) {
        getMovies();
      }
    };

    const getCountMovies = async () => {
      const result = await movieService.getCountMovies();
      setCountMovies(result.countMovies);
    };

    const getCountUsers = async () => {
      const result = await userService.getCountUsers();
      setCountUsers(result.countUsers);
    };

    if (!countBy.length) {
      getCountByGenre();
    }

    if (!countMovies) {
      getCountMovies();
    }

    if (!countUsers) {
      getCountUsers();
    }
  });

  return (
    <div className="home-page">
      <input id = "search"
        onInput={inputHandler}
        type="text"
        placeholder="Search"
        value={filter}
      />
      <div>
        <ul>
          {filteredMovies.length &&
            filteredMovies.map((movie) => (
              <li key={movie.id} className="movie-preview">
                <img
                  className="movie-picture"
                  src={movie.imageUrl}
                  alt="movie poster"
                />
                <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
              </li>
            )) || <div>No matched movies</div>}
        </ul>
      </div>
      <div className="stats">
        <p> There are {countUsers} registered users in our website!</p>
        <p>There are {countMovies} movies in our website!</p>
        {countBy.length &&
          countBy.map((item) => (
            <p key={item._id.genre}>
              Genre: {item._id.genre}, number of movies: {item.count}
            </p>
          ))}
      </div>
    </div>
  );
};

export default HomePage;
