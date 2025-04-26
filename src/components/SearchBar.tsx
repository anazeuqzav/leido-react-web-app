import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import React from "react";

interface SearchBarProps {
  setResults: (results: any[]) => void;
}

const SearchBar = ({ setResults }: SearchBarProps) => {
  const [input, setInput] = useState("");

  const fetchData = async (value: string) => {
    if (!value) {
      setResults([]);
      return;
    }

    try {
      const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(value)}`);
      const books = response.data.docs.map((doc: any) => ({
        title: doc.title,
        author: doc.author_name ? doc.author_name[0] : "Unknown Author",
        coverId: doc.cover_i,
        key: doc.key,
      }));

      setResults(books.slice(0, 5)); // limitar a 5 resultados
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (value: string) => {
    setInput(value);
    fetchData(value);
  };

  const wrapperStyle = {
    width: "100%",
    height: "2.5rem",
    border: "none",
    borderRadius: "10px",
    padding: "0 15px",
    boxShadow: "0px 0px 8px #ddd",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    position: "relative" as "relative",
    zIndex: 10,
  };

  const inputStyle = {
    backgroundColor: "transparent",
    border: "none",
    height: "100%",
    fontSize: "1.25rem",
    width: "100%",
    marginLeft: "5px",
    outline: "none",
  };

  const iconStyle = {
    color: "royalblue",
  };

  return (
    <div style={wrapperStyle}>
      <FaSearch style={iconStyle} />
      <input
        style={inputStyle}
        placeholder="Search for books..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;