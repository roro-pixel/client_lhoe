import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface Haircut {
  id: number;
  type: string;
  duration: number;
  price: number;
}

interface HaircutCardProps {
  haircut: Haircut;
  onClick: (haircut: Haircut) => void;
  isThirdCard: boolean;
  setThirdCardElement: (element: HTMLDivElement | null) => void;
}

// Improved haircut card component with better mobile animation support
function HaircutCard({ haircut, onClick, isThirdCard, setThirdCardElement }: HaircutCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  
  useEffect(() => {
    const currentRef = cardRef.current;
    
    // If it's the third card, establish the reference
    if (isThirdCard && currentRef) {
      setThirdCardElement(currentRef);
    }
    
    // Set up intersection observer with lower threshold for mobile
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { 
        threshold: 0.05, // Lower threshold for better mobile detection
        rootMargin: "10px" // Add margin to trigger earlier
      }
    );
    
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isThirdCard, setThirdCardElement]);
  
  // Enhanced fallback for reduced motion preference
  if (shouldReduceMotion) {
    return (
      <div
        ref={cardRef}
        className={`fade-in ${isVisible ? 'visible' : ''} bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer`}
        onClick={() => onClick(haircut)}
        style={{ 
          // Inline styles as backup to ensure animation works
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease'
        }}
      >
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Scissors className="w-6 h-6 text-gray-800" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-center mt-4">{haircut.type}</h3>
        <div className="mt-2 text-gray-600 text-center">
          <p>Durée: {haircut.duration} min</p>
          <p>Prix: {haircut.price} XAF</p>
        </div>
        <button className="mt-4 w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition-colors">
          Réserver
        </button>
      </div>
    );
  }
  
  // Optimized framer-motion animation
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(haircut)}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <Scissors className="w-6 h-6 text-gray-800" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-center mt-4">{haircut.type}</h3>
      <div className="mt-2 text-gray-600 text-center">
        <p>Durée: {haircut.duration} min</p>
        <p>Prix: {haircut.price} XAF</p>
      </div>
      <button className="mt-4 w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition-colors">
        Réserver
      </button>
    </motion.div>
  );
}

export default function Services() {
  const navigate = useNavigate();
  const [haircuts, setHaircuts] = useState<Haircut[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [thirdCardElement, setThirdCardElement] = useState<HTMLDivElement | null>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const headerRef = useRef<HTMLHeadingElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const { theme } = useTheme();

  // Memoized function for the reference
  const setThirdCardElementCallback = useCallback((element: HTMLDivElement | null) => {
    setThirdCardElement(element);
  }, []);

  // Improved header animation with lower threshold
  useEffect(() => {
    const currentRef = headerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { 
        threshold: 0.05, 
        rootMargin: "10px" 
      }
    );
    
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Improved resize handler with debounce for better performance
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Debounced resize listener
    let timeoutId: number | undefined;
    const debouncedResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const fetchHaircuts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/haircut/all`, {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error retrieving haircuts');
        }

        const data = await response.json();
        setHaircuts(data);
      } catch (err) {
        setError("Une erreur s'est produite, veuillez réessayer plus tard!");
      } finally {
        setLoading(false);
      }
    };
    fetchHaircuts();
  }, []);

  const handleSelectHaircut = (haircut: Haircut) => {
    navigate(`/booking?haircutId=${haircut.id}&typeHaircut=${encodeURIComponent(haircut.type)}&duration=${haircut.duration}&price=${haircut.price}`, {
      state: { haircut }
    });
  };

  // Modification: Mise à jour de handleShowMore pour toujours activer le défilement
  const handleShowMore = () => {
    // On indique qu'un défilement est nécessaire quelle que soit la direction
    setShouldScroll(true);
    setShowAll(!showAll);
  };

  // Modification: Amélioration du comportement de défilement
  useEffect(() => {
    if (shouldScroll) {
      const options: ScrollIntoViewOptions = { 
        behavior: shouldReduceMotion ? 'auto' : 'smooth', 
        block: 'start' 
      };
      
      // Petit délai pour permettre les mises à jour du DOM
      setTimeout(() => {
        if (showAll) {
          // Lors de l'expansion, on défile jusqu'à la troisième carte
          if (thirdCardElement) {
            thirdCardElement.scrollIntoView(options);
          }
        } else {
          // Lors de la réduction, on défile vers le haut du composant
          if (headerRef.current) {
            headerRef.current.scrollIntoView(options);
          }
        }
        setShouldScroll(false);
      }, 100);
    }
  }, [showAll, thirdCardElement, shouldScroll, shouldReduceMotion]);

  const displayedHaircuts = showAll ? haircuts : haircuts.slice(0, isSmallScreen ? 3 : 6);

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-[calc(100vh-180px)] ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="flex flex-col items-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 ${
            theme === 'dark' ? 'border-blue-400' : 'border-blue-600'
          } border-b-2 ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
          }`}></div>
          <p className={`mt-4 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Chargement des coupes...
          </p>
        </div>
      </div>
    );
  }
  if (error) return <div className="text-red-500 p-6">{error}</div>;

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    }`}>
      <motion.h2
        ref={headerRef}
        initial={{ opacity: 0, y: -20 }}
        animate={headerVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        className={`text-2xl font-bold mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}
      >
        Nos services
      </motion.h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedHaircuts.map((haircut, index) => {
          const isVisible = true;
          return (
            <motion.div
              key={haircut.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-gray-300' 
                  : 'bg-white border-gray-200 text-gray-800'
              }`}
              onClick={() => handleSelectHaircut(haircut)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <Scissors className={`w-6 h-6 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                  }`} />
                </div>
              </div>
              <h3 className={`text-lg font-semibold text-center mt-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {haircut.type}
              </h3>
              <div className={`mt-2 text-center ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <p>Durée: {haircut.duration} min</p>
                <p>Prix: {haircut.price} XAF</p>
              </div>
              <motion.button 
                className={`mt-4 w-full py-2 px-4 rounded transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Réserver
              </motion.button>
            </motion.div>
          );
        })}
      </div>              
  
      {haircuts.length > (isSmallScreen ? 3 : 6) && (
        <div className="mt-4 text-center">
          <motion.button
            onClick={handleShowMore}
            className={`px-4 py-2 rounded-md transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-800 text-white hover:bg-gray-900'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showAll ? 'Voir moins' : 'Voir plus'}
          </motion.button>
        </div>
      )}
    </div>
  );
}
