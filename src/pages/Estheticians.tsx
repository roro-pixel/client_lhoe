import { motion, useReducedMotion } from 'framer-motion';
import { User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const mockEstheticians = [
  {
    name: 'NKOUKA Mimie',
    image: '',
  },
  {
    name: 'MBENGUI Belgerance',
    image: '',
  },
];

interface Esthetician {
  name: string;
  image: string;
}

function EstheticianCard({ esthetician }: { esthetician: Esthetician }) {
  const ref = useRef(null); // Initialise le ref
  const [isVisible, setIsVisible] = useState(false);

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
      className={`fade-in ${isVisible ? 'visible' : ''} bg-white w-48 h-72 rounded-xl shadow-md overflow-hidden md:hover:shadow-lg transition-all duration-300 flex flex-col`}
    >
      {/* Section image ou icône */}
      <div className="flex items-center justify-center bg-gray-200 w-full h-48">
        {esthetician.image ? (
          <img
            src={esthetician.image}
            alt={esthetician.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={64} className="text-gray-500" />
        )}
      </div>

      {/* Section texte */}
      <div className="h-24 flex items-center justify-center p-4">
        <h3 className="text-center text-lg font-semibold line-clamp-2">
          {esthetician.name}
        </h3>
      </div>
    </div>
  );
}

export default function Estheticians() {
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-stone-100'
    }`}>
      <style jsx global>{`
        .esthetician-card {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s forwards;
          animation-delay: calc(var(--delay) * 0.1s);
        }
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .esthetician-card {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
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
        Nos Esthéticiennes
      </motion.h1>

      {/* Conteneur des cartes */}
      <div className="flex flex-wrap justify-center gap-6">
        {mockEstheticians.map((esthetician, index) => (
          <div
            key={index}
            className={`esthetician-card w-64 rounded-xl shadow-md overflow-hidden transition-colors duration-300 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            style={{ '--delay': index } as React.CSSProperties}
          >
            {/* Image placeholder */}
            <div className={`flex items-center justify-center h-48 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <User size={64} className={
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              } />
            </div>
            
            {/* Nom */}
            <div className="p-6 text-center">
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {esthetician.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
