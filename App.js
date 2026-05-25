import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovies from "./components/AddMovies";
let retryTimer;

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
    return () => {
      clearTimeout(retryTimer);
    };
  }, []);

  const fetchMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const respnse = await fetch("https://swapi.info/api/films");
      if (respnse.ok === false) {
        throw new Error("Something went wrong! Retrying");
      }

      const data = await respnse.json();
      const transformedMovies = data.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      console.log(error);
      setError(error.message);

      retryTimer = setTimeout(() => {
        fetchMovies();
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function cancelRetryHandler() {
    clearTimeout(retryTimer);

    setError("Retry cancelled.");
  }

  return (
    <React.Fragment>
      <section>
        <AddMovies></AddMovies>
      </section>
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
