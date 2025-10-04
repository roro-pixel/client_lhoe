import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
// import baresseImage from '../assets/barbers/barrès2.jpeg';
// import guelorImage from '../assets/barbers/Guelord.jpeg';
// import princeImage from '../assets/barbers/massamba.jpeg';
// import darcelImage from '../assets/barbers/darcel.jpeg';
// import timImage from '../assets/barbers/tim.jpeg';

const mockStylists = [
  {
    name: 'Bakaboula Barrès',
    image: '',
  },
  {
    name: 'Banzouzi B. Guelord',
    image: '',
  },
  {
    name: 'Maba Tim',
    image: '',
  },
  {
    name: 'Darcel',
    image: '',
  },
  {
    name: 'Massamba Prince',
    image: '',
  },
];

interface Stylist {
  name: string;
  image: string;
}

function StylistCard({ stylist }: { stylist: Stylist })  {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
    ref={ref}
    className={`fade-in ${isVisible ? 'visible' : ''} bg-white rounded-xl shadow-md overflow-hidden md:hover:shadow-lg transition-all duration-300`}
  >
    {/* <div className="w-full aspect-square overflow-hidden"> 
      <img
        src={stylist.image}
        alt={stylist.name}
        className="w-full h-full object-cover object-center" 
      />
    </div> */}
      <div className="flex items-center justify-center bg-gray-200 w-full h-48">
        {stylist.image ? (
          <img
            src={stylist.image}
            alt={stylist.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={64} className="text-gray-500" />
        )}
      </div>
    <div className="p-6 text-center">
      <h3 className="text-xl sm:text-lg font-semibold">{stylist.name}</h3>
    </div>
  </div>
  );
}

export default function Stylists() {
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-stone-100'
    }`}>
      <style jsx global>{`
        .stylist-card {
          opacity: 0;
          animation: fadeInUp 0.6s forwards;
          animation-delay: calc(var(--delay) * 0.1s);
        }
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .stylist-card {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      {/* En-tête */}
      <motion.h1
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        className={`text-4xl font-bold mb-4 text-center ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}
      >
        Nos Coiffeurs
      </motion.h1>

      {/* Grille des cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStylists.map((stylist, index) => (
          <div
            key={index}
            className={`stylist-card rounded-xl shadow-md overflow-hidden transition-all ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            style={{ '--delay': index } as React.CSSProperties}
          >
            <div className={`flex items-center justify-center h-48 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <User size={64} className={
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              } />
            </div>
            <div className="p-6 text-center">
              <h3 className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {stylist.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}