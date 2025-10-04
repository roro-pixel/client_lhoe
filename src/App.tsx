import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import RegisterPage from './pages/Register';
import Services from './pages/Services';
import Stylists from './pages/Stylists';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import LoginForm from './components/Login';
import UserProfile from './pages/UserProfile';
import AuthService from './services/AuthService';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage'; 
import ChangePassword from './pages/ChangePassword';
import CheckIn from './components/CheckIn';
import { ThemeProvider } from './context/ThemeContext';

// Composant ScrollToTop 
function ScrollToTop() {
  const { pathname } = useLocation();

  // Fonction de scroll améliorée pour compatibilité mobile
  const scrollToTop = () => {
    // méthode standard
    window.scrollTo(0, 0);
    
    // behavior auto pour plus de compatibilité
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
    
    // cibler le body et html pour maximiser la compatibilité
    document.body.scrollTop = 0; // Pour Safari
    document.documentElement.scrollTop = 0; // Pour Chrome, Firefox, IE et Opera
    
    // utilisation requestAnimationFrame pour les navigateurs mobiles plus anciens
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  };

  // Réinitialise la position de défilement lors des changements de page
  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  // Réinitialise la position de défilement lors du rechargement de la page
  useEffect(() => {
    // Pour les appareils mobiles, forcer un scroll immédiat au chargement
    scrollToTop();
    
    // Avec un léger délai pour les navigateurs mobiles qui peuvent charger plus lentement
    const timeoutId = setTimeout(() => {
      scrollToTop();
    }, 50);
    
    // Sauvegarde l'intention de réinitialiser avant le rechargement
    const handleBeforeUnload = () => {
      sessionStorage.setItem('scrollReset', 'true');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', scrollToTop); // Ajout d'un écouteur d'événement 'load'
    
    // Vérifie si nous devons réinitialiser après un rechargement
    if (sessionStorage.getItem('scrollReset') === 'true') {
      scrollToTop();
      sessionStorage.removeItem('scrollReset');
    }
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', scrollToTop);
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  const hideFooterPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/change-password', '/check-in'];
  const hideNavPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/change-password', '/check-in']; 

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast.success("Connexion réussie !", { autoClose: 989 });
  };
  
  const handleLogout = async () => {
    try {
      await AuthService.logout();
      setIsLoggedIn(false);
      localStorage.removeItem("token");
      toast.success("Déconnexion réussie !", { autoClose: 975 });
    } catch (error) {
      toast.error("Erreur lors de la déconnexion !", { autoClose: 970 });
    }
  };

  return (
    <ThemeProvider>
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Intégration du composant ScrollToTop */}
      <ScrollToTop />
      
      {!hideNavPaths.includes(location.pathname) && (
        <Navigation isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      )}
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/stylists" element={<Stylists />} />
          <Route
            path="/booking"
            element={
              isLoggedIn ? <AppointmentForm /> : 
              <Navigate to="/login" state={{ from: '/booking' }} />
            }
          />
          <Route
            path="/appointments"
            element={
              isLoggedIn ? <AppointmentList /> : 
              <Navigate to="/login" state={{ from: '/appointments' }} />
            }
          />
          <Route
            path="/profile"
            element={
              isLoggedIn ? <UserProfile /> : 
              <Navigate to="/login" state={{ from: '/profile' }} />
            }
          />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" /> 
              ) : (
                <LoginForm onLogin={handleLogin} />
              )
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/change-password/:token" element={<ChangePassword />} />
          <Route path="/check-in" element={<CheckIn />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {!hideFooterPaths.includes(location.pathname) && <Footer />}

      {/* Ajoutez ToastContainer ici */}
      <ToastContainer
        position="top-right" // Position du toast
        autoClose={2300} // Fermeture automatique après 5 secondes
        hideProgressBar={false} // Afficher la barre de progression
        newestOnTop={false} // Nouveaux toasts en bas
        closeOnClick // Fermer au clic
        rtl={false} // Sens d'affichage (left-to-right)
        pauseOnFocusLoss // Mettre en pause quand la fenêtre perd le focus
        draggable // Permettre de glisser pour fermer
        pauseOnHover // Mettre en pause au survol
      />
    </div>
    </ThemeProvider>
  );
}

export default App;