import { useState, useEffect, useCallback } from 'react';
import { User } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import AuthService from '../services/AuthService';
import { useTheme } from '../context/ThemeContext';

interface Client {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

interface ApiError {
  message: string;
  status: number;
}

interface AlertProps {
  message: string;
  type: 'success' | 'error';
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  const { theme } = useTheme();
  
  return (
    <div
      role="alert"
      className={`p-4 rounded-md mb-4 ${
        type === 'success'
          ? theme === 'dark'
            ? 'bg-green-900 text-green-200'
            : 'bg-green-50 text-green-700'
          : theme === 'dark'
          ? 'bg-red-900 text-red-200'
          : 'bg-red-50 text-red-700'
      }`}
    >
      {message}
    </div>
  );
};

export default function UserProfile() {
  const { theme } = useTheme();
  const [client, setClient] = useState<Client>({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState<{ show: boolean; message: string; type: AlertProps['type'] }>({
    show: false,
    message: '',
    type: 'success',
  });
  const [isLoading, setIsLoading] = useState(false);

  const getHeaders = () => {
    const token = AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const fetchClientData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<Client>(`${import.meta.env.VITE_API_URL}/me`, {
        headers: getHeaders(),
      });
      setClient(response.data);
    } catch (error) {
      showNotification(`Erreur lors du chargement du profil: ${handleError(error)}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  const handleError = (error: unknown): string => {
    if (error instanceof AxiosError) {
      const apiError = error.response?.data as ApiError;
      return apiError?.message || error.message;
    }
    return 'Une erreur inattendue est survenue';
  };

  const showNotification = (message: string, type: AlertProps['type']) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 3000);
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      await axios.put<Client>(
        `${import.meta.env.VITE_API_URL}/client/update`,
        client,
        {
          headers: getHeaders(),
        }
      );
      showNotification('Profil mis à jour avec succès', 'success');
      setIsEditing(false);
    } catch (error) {
      showNotification(`Erreur lors de la mise à jour du profil: ${handleError(error)}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!client.firstname || !client.lastname || !client.email || !client.phone) {
      showNotification('Veuillez remplir tous les champs', 'error');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(client.email)) {
      showNotification('Adresse email invalide', 'error');
      return false;
    }
    const phoneRegex = /^(06|05|04)\d{7}$/;
    if (!phoneRegex.test(client.phone)) {
      showNotification('Numéro de téléphone invalide', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      await handleUpdateProfile();
    }
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center min-h-[calc(100vh-180px)] ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
          theme === 'dark' ? 'border-blue-400' : 'border-blue-500'
        }`}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto">
          {alert.show && <Alert message={alert.message} type={alert.type} />}
  
          {/* Carte principale */}
          <div className={`rounded-xl shadow-md p-6 sm:p-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            
            {/* En-tête */}
            <div className="flex items-center gap-3 mb-6">
              <User className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Mon Profil
              </h2>
            </div>
  
            {/* Section des informations */}
            <div className="space-y-5">
              {/* Groupe Prénom/Nom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={`block text-sm sm:text-base font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Prénom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300'
                      }`}
                      value={client.firstname}
                      onChange={(e) => setClient({...client, firstname: e.target.value})}
                    />
                  ) : (
                    <div className={`px-4 py-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-800'
                    }`}>
                      {client.firstname}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className={`block text-sm sm:text-base font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300'
                      }`}
                      value={client.lastname}
                      onChange={(e) => setClient({...client, lastname: e.target.value})}
                    />
                  ) : (
                    <div className={`px-4 py-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-800'
                    }`}>
                      {client.lastname}
                    </div>
                  )}
                </div>
              </div>
  
              {/* Email (non éditable) */}
              <div>
                <label className={`block text-sm sm:text-base font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email
                </label>
                <div className={`px-4 py-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-800'
                }`}>
                  {client.email}
                </div>
              </div>
  
              {/* Téléphone */}
              <div>
                <label className={`block text-sm sm:text-base font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Téléphone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                    value={client.phone}
                    onChange={(e) => setClient({...client, phone: e.target.value})}
                  />
                ) : (
                  <div className={`px-4 py-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-800'
                  }`}>
                    {client.phone}
                  </div>
                )}
              </div>
            </div>
  
            {/* Boutons d'action */}
            <div className="mt-8">
              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className={`py-3 rounded-lg font-medium ${
                      theme === 'dark'
                        ? 'border border-gray-600 text-white hover:bg-gray-700'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className={`w-full py-3 rounded-lg font-medium ${
                    theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Modifier
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="h-20"></div> {/* Espace pour le footer */}
    </div>
  );
}