/**
 * SearchBook entity representing a book from the search API
 */
export interface SearchBook {
  key: string;
  id?: string; // OLID or other identifier for cover URL
  title: string;
  author_name?: string[];
  cover_i?: number;
  cover?: string; // Direct cover URL
}

/**
 * BookDetails entity representing detailed book information from the API
 */
export interface BookDetails {
  key: string;
  title: string;
  covers?: number[];
  authors?: {
    author: {
      key: string;
    }
  }[];
  description?: string | { value: string };
  subjects?: string[];
  first_publish_date?: string;
}
