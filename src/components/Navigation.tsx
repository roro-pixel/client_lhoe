import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, User, Moon, Sun } from 'lucide-react';
import Logo from '../assets/logo/lhomme.png';
import { useTheme } from '../context/ThemeContext'; 

interface NavigationProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Navigation({ isLoggedIn, onLogout }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const isHomeWithHash = location.pathname === '/' && location.hash !== '';
    if (!isHomeWithHash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavigation = (id: string) => {
    if (isMenuOpen) setIsMenuOpen(false);
    
    if (location.pathname === '/') {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate(`/#${id}`);
    }
  };

  // Classes corrigées pour supporter le mode sombre
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-black'
        : 'text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <img src={Logo} alt="Logo" className="w-8 h-8" />
              <span className="ml-2 text-2xl font-medium text-gray-900 dark:text-white">
                L'HOMME
              </span>
            </NavLink>
          </div>

          {/* Menu et boutons */}
          <div className="flex items-center space-x-4">
            {/* Bouton de basculement de thème */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label={`Basculer en mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* Menu button pour mobile */}
            <div className="xl:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Navigation principale (desktop) */}
          <div className="hidden xl:flex items-center ml-4">
            <div className="flex items-center space-x-4">
              <NavLink to="/" className={navLinkClass}>
                Accueil
              </NavLink>
              <button
                onClick={() => handleNavigation('services')}
                className="block px-4 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Nos Services
              </button>
              <button
                onClick={() => handleNavigation('stylists')}
                className="block px-4 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Coiffeurs & Esthéticiennes
              </button>
              {isLoggedIn && (
                <>
                  <NavLink to="/booking" className={navLinkClass}>
                    Réserver
                  </NavLink>
                  <NavLink to="/appointments" className={navLinkClass}>
                    Mes Rendez-vous
                  </NavLink>
                  <NavLink to="/profile" className={navLinkClass}>
                    <User className="w-4 h-4 inline-block mr-1" />
                    Mon Profil
                  </NavLink>
                </>
              )}
            </div>

            {/* Connexion/Déconnexion */}
            <div className="ml-8 flex items-center">
              {isLoggedIn ? (
                <button
                  onClick={onLogout}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </button>
              ) : (
                <NavLink 
                  to="/login" 
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Connexion
                </NavLink>
              )}
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="xl:hidden space-y-1 mt-2 pb-2">
            <NavLink to="/" className={navLinkClass} onClick={toggleMenu}>
              Accueil
            </NavLink>
            <button
              onClick={() => {
                handleNavigation('services');
                toggleMenu();
              }}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Nos Services
            </button>
            <button
              onClick={() => {
                handleNavigation('stylists');
                toggleMenu();
              }}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Coiffeurs & Esthéticiennes
            </button>
            {isLoggedIn ? (
              <>
                <NavLink to="/booking" className={navLinkClass} onClick={toggleMenu}>
                  Réserver
                </NavLink>
                <NavLink to="/appointments" className={navLinkClass} onClick={toggleMenu}>
                  Mes Rendez-vous
                </NavLink>
                <NavLink to="/profile" className={navLinkClass} onClick={toggleMenu}>
                  <User className="w-4 h-4 inline-block mr-1" />
                  Mon Profil
                </NavLink>
                <button onClick={() => { onLogout(); toggleMenu(); }} className="flex items-center w-full text-left px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </button>
              </>
            ) : (
              <NavLink to="/login" className="flex items-center px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700" onClick={toggleMenu}>
                <LogIn className="w-4 h-4 mr-2" />
                Connexion
              </NavLink>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}