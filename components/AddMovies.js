import React from "react";
import "./AddMovies.css";

const AddMovies = () => {
  const [title, setTitle] = React.useState("");
  const [releaseDate, setReleaseDate] = React.useState("");
  const [openingText, setOpeningText] = React.useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    console.log(title, releaseDate, openingText);
    setTitle("");
    setReleaseDate("");
    setOpeningText("");
  };

  return (
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="releaseDate">Release Date</label>
        <input
          type="date"
          id="releaseDate"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="openingText">Opening Text</label>
        <textarea
          id="openingText"
          value={openingText}
          onChange={(e) => setOpeningText(e.target.value)}
        />
      </div>
      <button type="submit">Add Movie</button>
    </form>
  );
};

export default AddMovies;
