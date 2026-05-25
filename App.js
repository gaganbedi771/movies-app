import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchProducts() {
    try {
      setIsLoading(true);
      const respnse = await fetch("https://swapi.info/api/films");
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
    }
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchProducts}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && <MoviesList movies={movies} />}
        {isLoading && <p>Loading...</p>}

      </section>
    </React.Fragment>
  );
}

export default App;
