import { useState } from 'react';
import { FaEnvelope, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthService from '../services/AuthService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour valider l'email avec une regex
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Format basique d'un email
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation de l'email
    if (!email) {
      setError('Veuillez entrer votre email.');
      return;
    }

    if (!validateEmail(email)) {    
      setError('Veuillez entrer un email valide.');
      return;
    }

    try {
      setIsLoading(true);
      await AuthService.verifyEmail(email);

      toast.success('Vérifiez votre boîte mail pour le lien de réinitialisation.');

      setEmail('');
    } catch (err) {
      setError('Une erreur est survenue, veuillez réessayer plus tard.');
      toast.error('Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-lg mx-auto mt-8 p-12 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Mot de passe oublié</h2>
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : null}
            Vérifier le compte
          </button>
        </form>
      </div>
    </div>
  );
}