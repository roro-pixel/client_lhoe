import { useState, useEffect, useCallback } from 'react';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import { GoogleCredentialResponse } from './utils/global';
import { z } from 'zod';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import googleLogo from '../assets/logo/google-logo.png';

const GOOGLE_CLIENT_ID = '587266621075-gdisbgor90kv3ske7sgag3v1res5fri2.apps.googleusercontent.com';

interface LoginFormProps {
  onLogin: () => void;
}

const loginSchema = z.object({
  email: z.string().email("Email invalide").nonempty("L'email est requis"),
  password: z.string().nonempty("Le mot de passe est requis"),
});

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Démarrer le timer d'inactivité après la connexion
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      AuthService.startInactivityTimer();
    }
  }, []);

  // Réinitialiser le timer à chaque interaction de l'utilisateur
  useEffect(() => {
    const handleUserActivity = () => AuthService.resetInactivityTimer();
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    return () => {
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, []);

  const handleGoogleLogin = useCallback(async (response: GoogleCredentialResponse) => {
    try {
      setIsLoading(true);
      const googleToken = response.credential;
      await AuthService.authenticatedRequest('https://lhomme-hairsalon-2f8a73553943.herokuapp.com/v1/auth/google', {
        method: 'POST',
        body: JSON.stringify({ token: googleToken }),
      });
      onLogin();
      navigate('/'); // Rediriger vers l'accueil après la connexion Google
      AuthService.startInactivityTimer(); // Démarrer le timer après la connexion Google
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion Google');
    } finally {
      setIsLoading(false);
    }
  }, [onLogin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    const sanitizedData = {
      email: sanitizeInput(email),
      password: sanitizeInput(password),
    };

    try {
      setIsLoading(true);
      await AuthService.login(sanitizedData);
      onLogin();
      navigate('/'); // Rediriger vers l'accueil après la connexion
      AuthService.startInactivityTimer(); // Démarrer le timer après la connexion
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors.map((err) => err.message).join(', '));
      return false;
    }
    return true;
  };

  const sanitizeInput = (input: string) => {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-lg mx-auto p-12 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 border border-gray-300 rounded-lg p-2"
              placeholder="Votre email"
              disabled={isLoading}
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 border border-gray-300 rounded-lg p-2"
              placeholder="Votre mot de passe"
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
            Se connecter
          </button>
        </form>
        {/* <button
          onClick={() => {}}
          className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 mt-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <img
            src={googleLogo}
            alt="Logo Google"
            className="w-5 h-5 mr-2"
          />
          <span>Connexion avec Google</span>
        </button> */}
        <p className="text-center text-sm">
          Pas encore inscrit ?{' '}
          <a 
            href="/register" 
            className={`text-blue-500 hover:underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
          >
            Créez un compte
          </a>
        </p>
        <p className="text-center text-sm mt-2">
          <a 
            href="/forgot-password" 
            className={`text-blue-500 hover:underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
          >
            Mot de passe oublié ?
          </a>
        </p>
      </div>
    </div>
  );
}