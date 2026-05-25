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

      const response = await fetch(
        "https://react-http-c4f8c-default-rtdb.firebaseio.com/movies.json",
      );
      if (response.ok === false) {
        throw new Error("Something went wrong! Retrying");
      }

      const data = await response.json();

      const transformedMovies = [];

      for (const key in data) {
        transformedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

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

  const addMovieHandler = async (movie) => {
    try {
      const response = await fetch(
        "https://react-http-c4f8c-default-rtdb.firebaseio.com/movies.json",
        {
          method: "POST",
          body: JSON.stringify(movie),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log(response);

      const data = await response.json();
      console.log(data);
      setMovies((prevMovies) => {
        return [...prevMovies, data];
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMovieHandler = async (id) => {
    try {
      const response = await fetch(
        `https://react-http-c4f8c-default-rtdb.firebaseio.com/movies/${id}.json`,
        {
          method: "DELETE",
        },
      );
      setMovies((prevMovies) => {
        return prevMovies.filter((movie) => movie.id !== id);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <section>
        <AddMovies onAddMovie={addMovieHandler}></AddMovies>
      </section>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} />}
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
