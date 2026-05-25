import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
let retryTimer;

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchMovies() {
    try {
      setIsLoading(true);
      setError(null);

      const respnse = await fetch("https://swapi.info/api/films");
      if (respnse.ok === false) {
        throw new Error("Something went wrong! Retrying");
      }

      const data = await respnse.json();
      console.log(data);
      const transformedMovies = data.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      console.log(transformedMovies);
      setMovies(transformedMovies);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.message);

      retryTimer = setTimeout(() => {
        fetchMovies();
      }, 5000);
    }
    setIsLoading(false);
  }

  function cancelRetryHandler() {
    clearTimeout(retryTimer);

    setError("Retry cancelled.");
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length == 0 && !error && <p>Found no movies.</p>}
        {!isLoading && error && (
          <>
            <p>{error}</p>{" "}
            <button onClick={cancelRetryHandler}>Cancel Retrying</button>
          </>
        )}

        {isLoading && <p>Loading...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
