import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Scissors, User} from 'lucide-react';
import AuthService from '../services/AuthService';
import { useTheme } from '../context/ThemeContext';

interface Appointment {
  id: string;
  clientId: string;
  clientLastname: string;
  clientFirstname: string;
  clientEmail: string;
  barberId: string;
  barberLastname: string;
  barberFirstname: string;
  appointmentTime: Date;
  bookedTime: Date;
  haircutType: string;
  price: number;
  status: string;
}

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Fonction pour récupérer les en-têtes avec le token
  const getHeaders = () => {
    const token = AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAppointments = async () => {
      try {
        const token = AuthService.getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/appointment/completed`,
          {
            headers: getHeaders(), // Utilisation des en-têtes avec le token
          }
        );

        // Vérifier si la réponse est JSON
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          throw new Error('Réponse non JSON');
        }

        if (!response.ok) {
          throw new Error('Erreur serveur');
        }

        const data = await response.json();
        if (isMounted) {
          setAppointments(data);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError(
            'Erreur inconnue'
          );
          setIsLoading(false);
        }
      }
    };

    fetchAppointments();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center min-h-[calc(100vh-180px)] ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={`flex flex-col items-center ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 ${
            theme === 'dark' ? 'border-blue-400' : 'border-blue-600'
          }`}></div>
          <p className="mt-4">Chargement des rendez-vous...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-[calc(100vh-180px)] flex flex-col ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto p-6 w-full">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-6">
          Historique des rendez-vous
        </h2>
  
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 mb-4 rounded">
            {error}
            <button 
              onClick={() => window.location.reload()}
              className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
            >
              Réessayer
            </button>
          </div>
        )}
{appointments.length === 0 ? (
  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    Aucun rendez-vous trouvé.
  </p>
) : (
  <div className="space-y-4">
    {appointments.map((appointment) => (
      <div 
        key={appointment.id}
        className={`p-4 rounded-lg shadow-sm border transition-colors duration-300 ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700 text-gray-300'
            : 'bg-white border-gray-200 text-gray-800'
        }`}
      >
        <div className="flex items-center gap-4">
          <Calendar className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} w-5 h-5`} />
          <div>
            <p className="font-medium">
              {new Date(appointment.appointmentTime).toLocaleDateString('fr-FR')} à{' '}
              {new Date(appointment.appointmentTime).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Scissors className={`inline mr-1 w-4 h-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              {appointment.haircutType} - {appointment.price} FCFA
            </p>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <User className={`inline mr-1 w-4 h-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              Coiffeur : {appointment.barberFirstname} {appointment.barberLastname}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
)}
  
        {/* Espacement pour pousser le footer vers le bas */}
        <div className="mt-auto pt-16"></div>
      </div>
    </div>
  );
}