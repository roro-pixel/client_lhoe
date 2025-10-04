import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; 

const ContactForm = () => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { theme } = useTheme(); // Récupération du thème actuel

  return (
    <section className={`py-20 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-950 text-gray-300' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Contactez-nous</h2>
          <p className={`text-xl ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>Nous sommes à votre écoute</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
<form className="space-y-6">
  <div>
    <label className="block text-sm font-medium mb-2">
      Nom complet
    </label>
    <motion.input
      animate={{
        boxShadow: focusedField === 'name' ? '0 0 0 2px rgba(144, 137, 133, 0.2)' : 'none',
      }}
      type="text"
      onFocus={() => setFocusedField('name')}
      onBlur={() => setFocusedField(null)}
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
        theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:ring-gray-300' : 'border-gray-300 focus:ring-gray-500'
      }`}
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-2">
      Email
    </label>
    <motion.input
      type="email"
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
        theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:ring-gray-300' : 'border-gray-300 focus:ring-gray-500'
      }`}
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-2">
      Message
    </label>
    <motion.textarea
      rows={4}
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 resize-none ${
        theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:ring-gray-300' : 'border-gray-300 focus:ring-gray-500'
      }`}
      placeholder="Écrivez votre message ici..."
    />
  </div>

  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`w-full px-6 py-3 rounded-md flex items-center justify-center ${
      theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-700 text-white hover:bg-gray-600'
    }`}
    disabled={true}
  >
    <Send className="mr-2 h-5 w-5" />
    Envoyer le message
  </motion.button>
</form>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-semibold mb-4">Informations de contact</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Mail className={`h-6 w-6 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-700'
                  }`} />
                  <a href="mailto:salon@lhomme-cg.com">salon@lhomme-cg.com</a>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className={`h-6 w-6 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-700'
                  }`} />
                  <span>+242 04 045 12 12</span>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className={`h-6 w-6 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-700'
                  }`} />
                  <span>En face du CHU, à côté de la pâtisserie Opéra, Brazzaville, Congo</span>
                </div>
              </div>
            </div>

            <div className="h-64 rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.7579452178625!2d15.266229809444186!3d-4.267233197815797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a330c83d2273f%3A0x881849a83a1dbd0a!2sL'HOMME!5e0!3m2!1sfr!2scg!4v1748689464736!5m2!1sfr!2scg"
                width="100%"
                height="100%" 
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
