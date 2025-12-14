import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scissors, Clock, Award, Calendar, Heart, ChevronUp, ChevronDown } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import Stylists from './Stylists';
import Estheticians from './Estheticians';
import Services from './Services';
import BeautyServiceList from './BeautyServices';
import ContactForm from '../components/ContactForm';
import backgroundImage from '../assets/logo/banniere.jpeg';
import { motion } from 'framer-motion';
import { Helmet } from "react-helmet";
import { useTheme } from '../context/ThemeContext';

const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Définition de l'interface pour les props du composant FeatureItem
interface FeatureItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
  theme: 'light' | 'dark';
}

// Composant pour les éléments de fonctionnalités avec animation
const FeatureItem = ({ icon: Icon, title, description, delay, theme }: FeatureItemProps) => {
  return (
    <motion.div 
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
    >
      <Icon className={`w-12 h-12 mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`} />
      <motion.h3 
        className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: delay + 0.2 }}
      >
        {title}
      </motion.h3>
      <motion.p 
        className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: delay + 0.3 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};

export default function Home() {
  const [showScrollButtons, setShowScrollButtons] = useState(true);
  const [activeSection, setActiveSection] = useState<'stylists' | 'estheticians'>('stylists');
  const location = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.slice(1);
      scrollToSection(sectionId);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowScrollButtons(currentScrollY < 50 || currentScrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderSection = useCallback(() => {
    return (
      <>
        <div id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeSection === 'stylists' ? <Services /> : <BeautyServiceList />}
        </div>
        <div id="stylists" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeSection === 'stylists' ? <Stylists /> : <Estheticians />}
        </div>
      </>
    );
  }, [activeSection]);

  const renderAfterSection = useCallback(() => {
    if (activeSection === 'stylists') {
      return (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`text-3xl sm:text-2xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}

            >
              Prêt à Transformer Votre Style ?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`text-xl sm:text-lg mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}

            >
              Planifiez votre rendez-vous dès à présent et laissez-nous nous occuper de vous avec plaisir.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* <Link
                to="/booking"
                className="inline-flex items-center px-8 py-3 rounded-lg bg-gray-800 dark:bg-gray-700 text-white font-medium hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300 sm:text-sm"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Prendre Rendez-vous
              </Link> */}
              <button
              disabled
                className="inline-flex items-center px-8 py-3 rounded-lg bg-gray-800 dark:bg-gray-700 text-white font-medium hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300 sm:text-sm opacity-60 cursor-not-allowed"
                title="Service temporairement indisponible"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Prendre Rendez-vous
              </button>
            </motion.div>
          </div>
          <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <FeatureItem 
                icon={Scissors} 
                title="Services de Qualité" 
                description="Nous offrons une gamme complète de services de coiffure pour répondre à tous vos besoins."
                delay={0.1}
                theme={theme}
              />
              <FeatureItem 
                icon={Clock} 
                title="Horaires Flexibles" 
                description="Nous sommes ouverts du lundi au samedi pour s’adapter à votre emploi du temps."
                delay={0.3}
                theme={theme}
              />
              <FeatureItem 
                icon={Award} 
                title="Coiffeurs Primés" 
                description="Nos coiffeurs sont reconnus pour leur talent et leur expertise dans le domaine de la coiffure."
                delay={0.5}
                theme={theme}
              />
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`text-3xl sm:text-2xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}

            >
              Prêt à Sublimer Votre Beauté ?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`text-xl sm:text-lg mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}

            >
              Réservez dès maintenant et laissez nos experts en beauté prendre soin de vous.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* <Link
                to="/booking"
                className="inline-flex items-center px-8 py-3 rounded-lg bg-gray-800 dark:bg-gray-700 text-white font-medium hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300 sm:text-sm"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Prendre Rendez-vous
              </Link> */}
              <button
              disabled
                className="inline-flex items-center px-8 py-3 rounded-lg bg-gray-800 dark:bg-gray-700 text-white font-medium hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300 sm:text-sm opacity-60 cursor-not-allowed"
                title="Service temporairement indisponible"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Prendre Rendez-vous
              </button>
            </motion.div>
          </div>
          <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <FeatureItem 
                icon={Heart} 
                title="Services de Beauté" 
                description="Nous offrons une gamme complète de services esthétiques pour répondre à tous vos besoins de beauté."
                delay={0.1}
                theme={theme}
              />
              <FeatureItem 
                icon={Clock} 
                title="Horaires Flexibles" 
                description="Nous sommes ouverts du lundi au samedi pour s’adapter à votre emploi du temps."
                delay={0.3}
                theme={theme}
              />
              <FeatureItem 
                icon={Award} 
                title="Esthéticiennes Primées" 
                description="Nos esthéticiennes sont reconnues pour leur talent et leur expertise dans le domaine de la beauté."
                delay={0.5}
                theme={theme}
              />
            </div>
          </div>
        </>
      );
    }
  }, [activeSection, theme]);

  return (
      <div className={`space-y-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-stone-100'}`}>
        <Helmet>
          <title>Salon chez l'Homme - Coiffure et Bien-être à Brazzaville</title>
          <meta name="description" content="Découvrez l'excellence de la coiffure et du bien-être au Salon chez l'Homme à Brazzaville. Services modernes et relaxation pour hommes." />
        </Helmet>
    
        <motion.div
          id="home"
          className="relative min-h-[500px] md:h-[600px] flex items-center justify-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-white max-w-xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
              >
                <strong>Bienvenue chez L'homme</strong>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl mb-8"
              >
                Découvrez l'excellence de la coiffure dans notre salon moderne et élégant
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {/* <Link
                  to="/booking"
                  className={`inline-block px-6 py-3 md:px-8 md:py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors shadow-lg opacity-60 cursor-not-allowed ${
                    theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'
                  }`}
                  title="Service temporairement indisponible"
                >
                  Réserver Maintenant
                </Link> */}
                <button
                disabled
                  className={`inline-block px-6 py-3 md:px-8 md:py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors shadow-lg opacity-60 cursor-not-allowed ${
                    theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'
                  }`}
                  title="Service temporairement indisponible"
                >
                  Réserver Maintenant
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
    
        <div className="flex justify-center space-x-4 mb-4">
          <motion.button
            onClick={() => setActiveSection('stylists')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
              activeSection === 'stylists'
                ? theme === 'dark'
                  ? 'bg-gray-700 text-white shadow-lg'
                  : 'bg-gray-800 text-white shadow-lg'
                : theme === 'dark'
                  ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Coiffeurs
          </motion.button>
          <motion.button
            onClick={() => setActiveSection('estheticians')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
              activeSection === 'estheticians'
                ? theme === 'dark'
                  ? 'bg-gray-700 text-white shadow-lg'
                  : 'bg-gray-800 text-white shadow-lg'
                : theme === 'dark'
                  ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Esthéticiennes
          </motion.button>
        </div>
    
        <div className="pt-8">
          {renderSection()}
        </div>
    
        <div className="pt-8">
          {renderAfterSection()}
        </div>

        <div className="pt-16">
           <ContactForm />
        </div>
    
        {showScrollButtons && (
          <div className="fixed right-8 bottom-16 z-50 flex flex-col space-y-2">
            <motion.button
              onClick={() => scrollToSection('home')}
              className={`w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition ${
                theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 hover:bg-gray-900'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronUp className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              onClick={() => scrollToSection('features')}
              className={`w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition ${
                theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 hover:bg-gray-900'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronDown className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        )}
      </div>
    );
}