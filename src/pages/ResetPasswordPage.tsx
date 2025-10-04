import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaLock, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AuthService from '../services/AuthService';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Pour afficher/masquer le mot de passe
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Pour afficher/masquer la confirmation
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // Fonction pour valider la force du mot de passe
  const validatePasswordStrength = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!validatePasswordStrength(password)) {
      setError(
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.'
      );
      return;
    }

    if (!token) {
      setError('Token invalide ou manquant.');
      return;
    }

    try {
      setIsLoading(true);

      await AuthService.resetPassword(token, password);

      toast.success('Mot de passe réinitialisé avec succès !');
      navigate('/login');
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
        <h2 className="text-2xl font-bold text-center mb-6">Réinitialiser le mot de passe</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Champ pour le nouveau mot de passe */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'} // Basculer entre texte et mot de passe
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 border border-gray-300 rounded-lg p-2"
              placeholder="Nouveau mot de passe"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Icône pour afficher/masquer */}
            </button>
          </div>

          {/* Champ pour confirmer le mot de passe */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type={showConfirmPassword ? 'text' : 'password'} // Basculer entre texte et mot de passe
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-10 border border-gray-300 rounded-lg p-2"
              placeholder="Confirmer le mot de passe"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />} {/* Icône pour afficher/masquer */}
            </button>
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : null}
            Réinitialiser le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
}