// BookSearch.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
}

const BookSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 2) {
        searchBooks();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const searchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
      const books = response.data.docs.map((doc: any) => ({
        key: doc.key,
        title: doc.title,
        author_name: doc.author_name,
        cover_i: doc.cover_i,
      }));

      setResults(books.slice(0, 5));
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelectBook = (book: Book) => {
    console.log('Selected book:', book);
    // Aquí podrías redirigir o abrir detalles
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        className="w-full border border-gray-300 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Search for books or authors..."
        value={query}
        onChange={handleInputChange}
      />

      {query && results.length > 0 && (
        <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul className="list-none m-0 p-0">
            {results.map((book) => (
              <li
                key={book.key}
                onClick={() => handleSelectBook(book)}
                className="flex items-center gap-4 p-3 hover:bg-gray-100 cursor-pointer"
              >
                {book.cover_i ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-16 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
                    No cover
                  </div>
                )}
                <div className="flex flex-col overflow-hidden">
                  <span className="font-semibold text-sm truncate">{book.title}</span>
                  <span className="text-gray-500 text-xs truncate">{book.author_name?.[0]}</span>
                </div>
              </li>
            ))}
            <li className="text-center text-blue-500 text-sm py-3 hover:underline cursor-pointer">
              View all results...
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookSearch;
