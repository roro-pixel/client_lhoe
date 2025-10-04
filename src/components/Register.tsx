import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaPhone, FaEye, FaEyeSlash, FaSpinner, FaCheck } from 'react-icons/fa';
import AuthService from '../services/AuthService';
import Modal from './Modal'; 
import PrivacyPolicyContent from '../pages/PrivacyPolicyContent';
import googleLogo from '../assets/logo/google-logo.png';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [acceptWhatsApp, setAcceptWhatsApp] = useState(false); // Nouvel état pour la case à cocher

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: '',
    phone: '',
  });

  // Fonction pour valider l'email
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Fonction pour valider la force du mot de passe
  const validatePasswordStrength = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber 
      // hasSpecialChar
    );
  };
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Supprime tout sauf les chiffres
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation de l'email
    if (!validateEmail(formData.email)) {
      setError('Veuillez entrer un email valide.');
      return;
    }

    // Validation du mot de passe
    if (!validatePasswordStrength(formData.password)) {
      setError(
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre.'
      );
      return;
    }

    // Vérification que les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    // Vérification que la case WhatsApp est cochée
    if (!acceptWhatsApp) {
      setError('Vous devez accepter de recevoir des messages via WhatsApp pour vous inscrire.');
      return;
    }

    setIsLoading(true);

    try {
      // Envoyer les données sans modifier le numéro de téléphone
      await AuthService.register(formData);
      alert('Inscription réussie.');
      navigate('/login');
    } catch (err) {
      setError('Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-lg mx-auto p-12 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Inscription</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Champ Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2"
              placeholder="Votre email"
              required
              disabled={isLoading}
            />
          </div>

          {/* Champ Prénom */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2"
              placeholder="Votre prénom"
              required
              disabled={isLoading}
            />
          </div>

          {/* Champ Nom */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2"
              placeholder="Votre nom"
              required
              disabled={isLoading}
            />
          </div>

          {/* Champ Téléphone */}
          <div className="relative">
          <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 scale-x-[-1]" />
            <div className="flex items-center">
              <span className="pl-10 text-gray-500">+242</span>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="w-full pl-2 border border-gray-300 rounded-lg p-2"
                placeholder="Votre numéro whatsApp"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          {/* Champ Mot de passe */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 border border-gray-300 rounded-lg p-2"
              placeholder="Votre mot de passe"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Champ Confirmer le mot de passe */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 border border-gray-300 rounded-lg p-2"
              placeholder="Confirmer le mot de passe"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Case à cocher pour WhatsApp */}
          <div className="flex items-center">
  <button
    type="button"
    onClick={() => setAcceptWhatsApp(!acceptWhatsApp)}
    className={`mr-2 w-5 h-5 flex items-center justify-center border-2 border-black rounded-sm ${acceptWhatsApp ? 'bg-blue-500' : 'bg-white'}`}
  >
    {acceptWhatsApp && <FaCheck className="w-3 h-3 text-white" />}
  </button>
  <span className="text-sm">
    J'accepte de recevoir des messages via WhatsApp sur le numéro fourni
  </span>
</div>

          {/* Bouton S'inscrire */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
            S'inscrire
          </button>

          {/* Lien "Déjà inscrit ? Se connecter" */}
          <div className="text-center mt-4">
            <span>Déjà inscrit ? </span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-500 hover:underline"
            >
              Se connecter
            </button>
          </div>
          
          {/* Lien vers la politique de confidentialité */}
          <div className="text-center mt-4">
            <span>En vous inscrivant, vous acceptez notre </span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-500 hover:underline"
            >
              Politique de confidentialité
            </button>
            <span>.</span>
          </div>
        </form>
        
        {/* Modal pour la politique de confidentialité */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <PrivacyPolicyContent />
        </Modal>
      </div>
    </div>
  );
};

export default RegisterPage;