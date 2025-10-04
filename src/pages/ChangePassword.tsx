import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FaKey, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthService from '../services/AuthService';

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ token?: string }>();

  useEffect(() => {
    // Stratégie 1: Chercher dans les paramètres d'URL (/:token)
    if (params.token) {
      setToken(params.token);
      return;
    }
    
    // Stratégie 2: Chercher dans les query parameters (?token=xxx)
    const queryParams = new URLSearchParams(location.search);
    const queryToken = queryParams.get('token');
    if (queryToken) {
      setToken(queryToken);
      return;
    }
    
    // Stratégie 3: Chercher dans localStorage (stocké précédemment)
    const storedToken = localStorage.getItem('resetToken');
    if (storedToken) {
      setToken(storedToken);
      return;
    }
    
    // Aucun token trouvé - rediriger vers la page de demande de réinitialisation
    toast.error('Token de réinitialisation manquant ou invalide');
    navigate('/forgot-password');
  }, [navigate, location, params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Vérification supplémentaire de la présence du token
    if (!token) {
      setError('Token de réinitialisation manquant.');
      navigate('/forgot-password');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Utilisation du token avec garantie qu'il est défini
      await AuthService.changePassword(token, newPassword, confirmPassword);
      
      // Nettoyage du token de localStorage
      localStorage.removeItem('resetToken');
      
      toast.success('Votre mot de passe a été changé avec succès !');
      
      // Redirection vers la page de connexion après succès
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer plus tard.');
      toast.error('Erreur lors du changement du mot de passe. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-lg mx-auto mt-8 p-12 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Changer le mot de passe</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        {token ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champ Nouveau mot de passe */}
            <div className="relative">
              <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 border border-gray-300 rounded-lg p-2"
                placeholder="Nouveau mot de passe"
                disabled={isLoading}
              />
            </div>

            {/* Champ Confirmer le mot de passe */}
            <div className="relative">
              <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 border border-gray-300 rounded-lg p-2"
                placeholder="Confirmer le mot de passe"
                disabled={isLoading}
              />
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
              Changer le mot de passe
            </button>
          </form>
        ) : (
          <div className="text-center py-4">
            <FaSpinner className="animate-spin mx-auto text-blue-500 text-2xl" />
            <p className="mt-2">Vérification du token...</p>
          </div>
        )}
      </div>
    </div>
  );
}