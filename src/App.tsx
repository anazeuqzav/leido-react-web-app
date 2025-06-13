import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { BookDetail } from './infrastructure/ui/components/book';
import { StatisticsProvider } from './infrastructure/ui/context/StatisticsContext';
import { RecommendationProvider } from './infrastructure/ui/context/RecommendationContext';


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
          <RecommendationProvider>
          <StatisticsProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Router>
                <Routes>
                  {/* Rutas Públicas */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Rutas Protegidas */}
                  <Route element={
                    <PrivateRoute>
                      <DashboardLayout />
                    </PrivateRoute>
                  }>
                    {/* Redirección por defecto */}
                    <Route index element={<Navigate to="/read" />} />
                    
                    {/* Libros */}
                    <Route path="/read" element={<ReadBooks />} />
                    <Route path="/want-to-read" element={<UnreadBooks />} />
                    <Route path="/favorites" element={<FavoriteBooks />} />
                    
                    {/* Recomendaciones */}
                    <Route path="/recommendations" element={<RecommendationsPage />} />
                    
                    {/* Estadísticas */}
                    <Route path="/statistics" element={<StatisticsPage />} />
                    
                    {/* Detalles de libros */}
                    <Route path="/book/:bookId" element={<BookDetail />} />
                    <Route path="/library-book/:bookId" element={<BookDetail />} />
                  </Route>
                  
                  {/* Ruta 404 - No encontrado */}
                  <Route path="*" element={
                    <div className="flex items-center justify-center h-screen">
                      <h1 className="text-2xl">404 - Página no encontrada</h1>
                    </div>
                  } />
                </Routes>
                
                <ToastContainer
                  position="bottom-right"
                  autoClose={4000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                />
              </Router>
          </LocalizationProvider>
        </StatisticsProvider>
        </RecommendationProvider>
        </SearchProvider>
      </BooksProvider>
    </AuthProvider>
  );
};

export default App;
