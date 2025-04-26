import React from "react";
import SearchResult from "./SearchResult";

interface SearchResultsListProps {
  results: {
    title: string;
    author: string;
    coverId?: number;
    key: string;
  }[];
}

const SearchResultsList = ({ results }: SearchResultsListProps) => {
  const listStyle = {
    width: "100%",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column" as "column",
    boxShadow: "0px 0px 8px #ddd",
    borderRadius: "10px",
    marginTop: "0.5rem",
    maxHeight: "300px",
    overflowY: "auto" as "auto",
    position: "absolute" as "absolute",
    top: "3rem",
    zIndex: 5,
  };

  return (
    <div style={listStyle}>
      {results.map((result) => (
        <SearchResult result={result} key={result.key} />
      ))}
    </div>
  );
};

export default SearchResultsList;