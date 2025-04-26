import React from "react";

interface SearchResultProps {
    result: {
      title: string;
      author: string;
      coverId?: number;
    };
  }
  
const SearchResult = ({ result }: SearchResultProps) => {
    const containerStyle = {
      padding: "10px 20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      cursor: "pointer",
    };
  
    const containerHoverStyle = {
      backgroundColor: "#efefef",
    };
  
    const imgStyle = {
      width: "40px",
      height: "60px",
      objectFit: "cover" as "cover",
      borderRadius: "5px",
    };
  
    const infoStyle = {
      display: "flex",
      flexDirection: "column" as "column",
    };
  
    const titleStyle = {
      fontWeight: "bold",
      fontSize: "0.95rem",
      color: "#333",
    };
  
    const authorStyle = {
      fontSize: "0.85rem",
      color: "#777",
    };
  
    return (
      <div
        style={containerStyle}
        onClick={() => alert(`You selected "${result.title}" by ${result.author}`)}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = containerHoverStyle.backgroundColor)}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <img
          src={
            result.coverId
              ? `https://covers.openlibrary.org/b/id/${result.coverId}-S.jpg`
              : "https://via.placeholder.com/50x75?text=No+Cover"
          }
          alt={result.title}
          style={imgStyle}
        />
        <div style={infoStyle}>
          <div style={titleStyle}>{result.title}</div>
          <div style={authorStyle}>{result.author}</div>
        </div>
      </div>
    );
  };
  
  export default SearchResult;