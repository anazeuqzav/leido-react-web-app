import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './infrastructure/ui/styles/toast.css';

// Context Providers
import { AuthProvider, AuthContext } from './infrastructure/ui/context/AuthContext';
import { BooksProvider } from './infrastructure/ui/context/BooksContext';
import { SearchProvider } from './infrastructure/ui/context/SearchContext';

// Pages
import Login from './infrastructure/ui/pages/Login';
import Register from './infrastructure/ui/pages/Register';
import DashboardLayout from './infrastructure/ui/pages/DashboardLayout';
import StatisticsPage from './infrastructure/ui/pages/Statistics';
import RecommendationsPage from './infrastructure/ui/pages/Recommendations';

// Components
import ReadBooks from './infrastructure/ui/components/lists/ReadBooks';
import UnreadBooks from './infrastructure/ui/components/lists/UnreadBooks';
import FavoriteBooks from './infrastructure/ui/components/lists/FavoriteBooks';
import BookDetail from './infrastructure/ui/components/book/BookDetail';

// Configure colors for Material UI components
const theme = createTheme({
  palette: {
    primary: {
      main: '#0d4341', // Main color
    },
    secondary: {
      main: 'rgb(252, 98, 168)', // Secondary color (cancel button, for example)
    },
    background: {
      paper: '#ffffff', // Modal background
    },
  },
});

// Protect routes if the user is not authenticated
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BooksProvider>
        <SearchProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ThemeProvider theme={theme}>
              <Router>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <DashboardLayout />
                      </PrivateRoute>
                    }
                  >
                    <Route index element={<Navigate to="/read" />} />
                    <Route path="/read" element={<ReadBooks />} />
                    <Route path="/want-to-read" element={<UnreadBooks />} />
                    <Route path="/favorites" element={<FavoriteBooks />} />
                    <Route path="/recommendations" element={<RecommendationsPage />} />
                    <Route path="/statistics" element={<StatisticsPage />} />
                    <Route path="/book/:bookId" element={<BookDetail />} />
                    <Route path="/library-book/:bookId" element={<BookDetail />} />
                  </Route>
                </Routes>
                <ToastContainer
                  position="bottom-right"
                  autoClose={4000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                  className="toast-container"
                  toastClassName="toast-item"
                />
              </Router>
            </ThemeProvider>
          </LocalizationProvider>
        </SearchProvider>
      </BooksProvider>
    </AuthProvider>
  );
};

export default App;
