import { useState } from 'react';
import { Facebook, Instagram, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import Modal from './Modal'; 
import PrivacyPolicyContent from '../pages/PrivacyPolicyContent';
import { useTheme } from '../context/ThemeContext'; 

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useTheme(); // Récupération du thème actuel
  
  const openWhatsApp = () => {
    const phoneNumber = "242040451212";
    const url = `https://wa.me/${phoneNumber}`;
    window.open(url, '_blank');
  };

  return (
    <footer className={`py-8 border-t transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-800 text-gray-300 border-gray-700' 
        : 'bg-white text-gray-800 border-gray-200'
    }`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>Contact</h3>
            <p className="flex items-center">
              <MapPin className={`mr-2 h-6 w-6 ${
                theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'
              } transition-colors`} />
              En face du CHU, à côté de la pâtisserie Opéra, Brazzaville, Congo
            </p>
            <p className="flex items-center">
              <Phone className={`mr-2 h-5 w-5 ${
                theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'
              } transition-colors`} />
              Téléphone : +242 04 045 12 12
            </p>
            <p className="flex items-center">
              <Mail className={`mr-2 h-5 w-5 ${
                theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'
              } transition-colors`} />
              <a 
                href="mailto:salon@lhomme-cg.com" 
                className={`hover:${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                } transition-colors duration-200`}
              >
                Email : salon@lhomme-cg.com
              </a>
            </p>
          </div>

          {/* Horaires d'Ouverture */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>Horaires d'Ouverture</h3>
            <p className="flex items-center">
              <Calendar className={`mr-2 h-5 w-5 ${
                theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'
              } transition-colors`} />
              Lundi - Samedi : 8h00 - 19h00
            </p>
            <p className="flex items-center">
              <Calendar className={`mr-2 h-5 w-5 ${
                theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'
              } transition-colors`} />
              Dimanche : Fermé
            </p>
          </div>

          {/* Liens Utiles */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>Liens Utiles</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#services" 
                  className={`underline ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-gray-300' 
                      : 'text-gray-700 hover:text-blue-500'
                  } transition-colors duration-200`}
                >
                  Services et tarifs
                </a>
              </li>
              <li>
                <a 
                  href="#stylists" 
                  className={`underline ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-gray-300' 
                      : 'text-gray-700 hover:text-blue-500'
                  } transition-colors duration-200`}
                >
                  Une équipe prête à vous embellir
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`underline ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-gray-300' 
                      : 'text-gray-700 hover:text-blue-500'
                  } transition-colors duration-200`}
                >
                  Politique de confidentialité
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright et Réseaux Sociaux */}
        <div className="mt-8 text-center">
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
            &copy; {new Date().getFullYear()} <strong>Salon chez L'homme</strong>. Tous droits réservés.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            {/* Facebook */}
            <a 
              href="https://www.facebook.com/share/18USBf3eoG/?mibextid=wwXIfr" 
              className={`${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-blue-400' 
                  : 'text-gray-700 hover:text-blue-500'
              } transition-colors duration-200`}
            >
              <Facebook className="h-5 w-5" />
            </a>

            {/* Instagram */}
            <a 
              href="https://www.instagram.com/lhomme.cg?igsh=MWhjYjU1bDhxbGN6dQ==" 
              className={`${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-pink-400' 
                  : 'text-gray-700 hover:text-pink-500'
              } transition-colors duration-200`}
            >
              <Instagram className="h-5 w-5" />
            </a>

            {/* WhatsApp */}
            <a
              onClick={openWhatsApp}
              className={`${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-green-400' 
                  : 'text-gray-600 hover:text-green-500'
              } transition-colors duration-200 cursor-pointer`}
            >
              <FaWhatsapp className="h-5 w-5" />
            </a>
          </div>

          {/* Made by SNI */}
          <br />
          <p>
            <a 
              href="https://sni-cg.com/" 
              className={`underline ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-blue-400' 
                  : 'text-gray-700 hover:text-blue-500'
              } transition-colors duration-200`}
            >
              Made by SNI
            </a>
          </p>
        </div>
      </div>

      {/* Modal pour la politique de confidentialité */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PrivacyPolicyContent />
      </Modal>
    </footer>
  );
}