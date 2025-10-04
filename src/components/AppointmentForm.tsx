import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { CheckCircle } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import AuthService from '../services/AuthService';
import { useTheme } from '../context/ThemeContext';

// Interfaces coiffeur
interface Haircut {
  id: number;
  type: string;
  duration: number;
  price: number;
}

interface Barber {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  description?: string;
  phone: number;
}

// Interfaces esthéticienne
interface BeautyService {
  id: number;
  type: string;
  duration: number;
  price: number;
}

interface Esthetician {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  description?: string;
  phone: number;
}

interface AvailableTime {
  id: number;
  barberId: string;
  firstname: string;
  lastName: string;
  starTime: string;
  endTime: string;
  note: string;
  available: boolean;
}

// Data pour coiffeur
interface AppointmentData {
  barberId: string;
  haircutId: number | undefined;
  appointmentTime: string;
  haircutType: string | undefined;
  email: string;
}

// Data pour esthéticienne
interface AppointmentData2 {
  estheticianId: string;
  estheticId: number | undefined;
  appointmentTime: string;
  estheticType: string | undefined;
  email: string;
}

// Validation schema pour coiffeur
const appointmentSchema = z.object({
  barberId: z.string().nonempty("Le coiffeur est requis"),
  haircutId: z.number().min(1, "La prestation est requise"),
  appointmentTime: z.string().nonempty("La date et l'heure sont requises"),
  haircutType: z.string().nonempty("Le service est requis"),
  email: z.string().email("Email invalide"),
});

// Validation schema pour esthéticienne
const appointmentSchema2 = z.object({
  estheticianId: z.string().nonempty("L'esthéticienne est requise"),
  estheticId: z.number().min(1, "La prestation est requise"),
  appointmentTime: z.string().nonempty("La date et l'heure sont requises"),
  estheticType: z.string().nonempty("Le service est requis"),
  email: z.string().email("Email invalide"),
});

const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;

export default function AppointmentForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const today = useMemo(() => new Date(), []);
  const { theme } = useTheme();

  // État pour le basculement entre coiffeurs et esthéticiennes
  const [activeSection, setActiveSection] = useState<'barber' | 'esthetician'>('barber');

  // États pour coiffeur
  const [selectedHaircut, setSelectedHaircut] = useState<Haircut | null>(null);
  const [haircuts, setHaircuts] = useState<Haircut[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string>('');

  // États pour esthéticienne
  const [selectedBeautyService, setSelectedBeautyService] = useState<BeautyService | null>(null);
  const [beautyServices, setBeautyServices] = useState<BeautyService[]>([]);
  const [estheticians, setEstheticians] = useState<Esthetician[]>([]);
  const [selectedEsthetician, setSelectedEsthetician] = useState<string>('');

  // États communs
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const [appointmentData2, setAppointmentData2] = useState<AppointmentData2 | null>(null);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  const [showNextStepsPopup, setShowNextStepsPopup] = useState(false);

  // Vérifier si une réservation a déjà été effectuée au chargement de la page
  useEffect(() => {
    const reservationDone = localStorage.getItem('reservationDone');
    if (reservationDone === 'true') {
      setShowNextStepsPopup(true);
    }
  }, []);

  const getHeaders = () => {
    const token = AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const isToday = (date: string) => {
    const selected = new Date(date);
    return selected.toDateString() === today.toDateString();
  };

  const getCurrentTime = () => {
    return today.toTimeString().slice(0, 5);
  };

  const isTimePast = (time: string) => {
    if (!isToday(selectedDate)) return false;
    return time < getCurrentTime();
  };

  const adjustAvailableTimes = (times: AvailableTime[]) => {
    if (!isToday(selectedDate)) return times; 
    
    const currentTime = new Date();
    return times.filter(slot => {
      const slotTime = new Date(slot.starTime); 
      return slotTime.getTime() > currentTime.getTime() + 30 * 60 * 1000; 
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime('');
    
    // Réinitialiser selon la section active
    if (activeSection === 'barber') {
      setSelectedBarber('');
    } else {
      setSelectedEsthetician('');
    }
    
    setAvailableTimes([]);
  };

  // Gérer le changement de coiffeur
  const handleBarberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const barberId = e.target.value;
    setSelectedBarber(barberId);
    if (selectedDate) {
      fetchAvailability(barberId, selectedDate);
    }
  };

  // Gérer le changement d'esthéticienne
  const handleEstheticianChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const estheticianId = e.target.value;
    setSelectedEsthetician(estheticianId);
    if (selectedDate) {
      fetchAvailability(estheticianId, selectedDate);
    }
  };

  // Récupérer la liste des coiffeurs
  const fetchBarbers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/barber/available`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des coiffeurs');
      }

      const data = await response.json();
      setBarbers(data);
    } catch (error) {
      toast.error('Impossible de charger la liste des coiffeurs');
    }
  };

  // Récupérer la liste des esthéticiennes
  const fetchEstheticians = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/esthetician/all`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des esthéticiennes');
      }

      const data = await response.json();
      setEstheticians(data);
    } catch (error) {
      toast.error('Impossible de charger la liste des esthéticiennes');
    }
  };

  // Récupérer la liste des prestations coiffure
  const fetchHaircuts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/haircut/all`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des services');
      }

      const data = await response.json();
      setHaircuts(data);
    } catch (error) {
      toast.error('Impossible de charger la liste des services');
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer la liste des prestations esthétiques
  const fetchBeautyServices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/esthetic/all`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des services beauté');
      }

      const data = await response.json();
      setBeautyServices(data);
    } catch (error) {
      toast.error('Impossible de charger la liste des services beauté');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction commune pour récupérer les disponibilités
  const fetchAvailability = async (providerId: string, date: string) => {
    if (!providerId || !date) return;

    setIsLoading(true);
    try {
      const endpoint = activeSection === 'barber' 
        ? `${API_BASE_URL}/availability/barber/${providerId}/slot?date=${date}`
        : `${API_BASE_URL}/availability/esthetician/${providerId}/slot?date=${date}`;
      
      const response = await fetch(endpoint, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des disponibilités');
      }

      const data = await response.json();
      const adjustedTimes = adjustAvailableTimes(data);
      setAvailableTimes(adjustedTimes);

      if (adjustedTimes.length === 0) {
        toast.warning('Aucun horaire disponible pour cette date. Veuillez choisir une autre date.');
      }
    } catch (error) {
      toast.error('Impossible de charger les disponibilités, essayer une autre date');
      setAvailableTimes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les données initiales
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Vérifier si nous avons des paramètres pour coiffeur
    const haircutId = parseInt(params.get('haircutId') || '0');
    const typeHaircut = params.get('typeHaircut') || '';
    const duration = parseInt(params.get('duration') || '0');
    const price = parseInt(params.get('price') || '0');

    if (haircutId && typeHaircut && duration && price) {
      setSelectedHaircut({ id: haircutId, type: typeHaircut, duration, price });
      setActiveSection('barber');
    }

    // Vérifier si nous avons des paramètres pour esthéticienne
    const beautyServiceId = parseInt(params.get('beautyServiceId') || '0');
    const typeBeautyService = params.get('typeBeautyService') || '';
    const durationBeauty = parseInt(params.get('durationBeauty') || '0');
    const priceBeauty = parseInt(params.get('priceBeauty') || '0');

    if (beautyServiceId && typeBeautyService && durationBeauty && priceBeauty) {
      setSelectedBeautyService({ id: beautyServiceId, type: typeBeautyService, duration: durationBeauty, price: priceBeauty });
      setActiveSection('esthetician');
    }

    // Charger les données selon la section active
    fetchBarbers();
    fetchEstheticians();
    fetchHaircuts();
    fetchBeautyServices();
  }, [location.search]);

  // État pour l'étape d'ajout au calendrier
  const [showAddCalendarQuestion, setShowAddCalendarQuestion] = useState(false);

  // Gestion de la soumission du formulaire
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (isLoading) return;

  setIsLoading(true);
  try {
    const authData = AuthService.getAuthData();
    
    if (activeSection === 'barber') {
      // Récupérer les informations complètes du coiffeur
      const selectedBarberInfo = barbers.find(b => b.id === selectedBarber);
      const barberName = selectedBarberInfo ? 
        `${selectedBarberInfo.firstname} ${selectedBarberInfo.lastname}` : '';
      
      // Stocker toutes les informations nécessaires, y compris selectedHaircut complet
      const data: AppointmentData & { 
        fullHaircutInfo?: Haircut, 
        providerName?: string,
        startDateTime?: string,
        endDateTime?: string
      } = {
        barberId: selectedBarber,
        haircutId: selectedHaircut?.id,
        appointmentTime: `${selectedDate}T${selectedTime}`,
        haircutType: selectedHaircut?.type,
        email: authData?.email || '',
        // Ajouter des données supplémentaires pour le calendrier
        fullHaircutInfo: selectedHaircut ? { ...selectedHaircut } : undefined,
        providerName: barberName,
        startDateTime: `${selectedDate}T${selectedTime}`,
        endDateTime: selectedHaircut ? 
          new Date(new Date(`${selectedDate}T${selectedTime}`).getTime() + 
          selectedHaircut.duration * 60000).toISOString() : undefined
      };

      const result = appointmentSchema.safeParse(data);
      if (!result.success) {
        toast.error(result.error.errors.map(err => err.message).join(', '));
        return;
      }

      const response = await fetch(`${API_BASE_URL}/appointment/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          barberId: data.barberId,
          haircutId: data.haircutId,
          appointmentTime: data.appointmentTime,
          haircutType: data.haircutType,
          email: data.email
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du rendez-vous');
      }

      setAppointmentData(data);
    } else {
      // Récupérer les informations complètes de l'esthéticienne
      const selectedEstheticianInfo = estheticians.find(e => e.id === selectedEsthetician);
      const estheticianName = selectedEstheticianInfo ? 
        `${selectedEstheticianInfo.firstname} ${selectedEstheticianInfo.lastname}` : '';
      
      // Stocker toutes les informations nécessaires, y compris selectedBeautyService complet
      const data: AppointmentData2 & { 
        fullServiceInfo?: BeautyService, 
        providerName?: string,
        startDateTime?: string,
        endDateTime?: string
      } = {
        estheticianId: selectedEsthetician,
        estheticId: selectedBeautyService?.id,
        appointmentTime: `${selectedDate}T${selectedTime}`,
        estheticType: selectedBeautyService?.type,
        email: authData?.email || '',
        // Ajouter des données supplémentaires pour le calendrier
        fullServiceInfo: selectedBeautyService ? { ...selectedBeautyService } : undefined,
        providerName: estheticianName,
        startDateTime: `${selectedDate}T${selectedTime}`,
        endDateTime: selectedBeautyService ? 
          new Date(new Date(`${selectedDate}T${selectedTime}`).getTime() + 
          selectedBeautyService.duration * 60000).toISOString() : undefined
      };

      const result = appointmentSchema2.safeParse(data);
      if (!result.success) {
        toast.error(result.error.errors.map(err => err.message).join(', '));
        return;
      }

      const response = await fetch(`${API_BASE_URL}/appointment/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          estheticianId: data.estheticianId,
          estheticId: data.estheticId,
          appointmentTime: data.appointmentTime,
          estheticType: data.estheticType,
          email: data.email
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du rendez-vous beauté');
      }

      setAppointmentData2(data);
    }

    // Afficher le toast de confirmation
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle className="text-green-500" size={20} />
        <span>Rendez-vous pris avec succès ! 😊</span>
      </div>,
      {
        autoClose: 989,
        closeButton: true,
      }
    );

    // Sauvegarder l'état de la réservation dans le localStorage
    localStorage.setItem('reservationDone', 'true');

    // Afficher la question d'ajout au calendrier
    setShowAddCalendarQuestion(true);

    // IMPORTANT: Réinitialiser les champs seulement APRÈS avoir sauvegardé toutes les données
    setSelectedHaircut(null);
    setSelectedBeautyService(null);
    setSelectedBarber('');
    setSelectedEsthetician('');
    setSelectedDate('');
    setSelectedTime('');
    setAvailableTimes([]);

  } catch (error) {
    toast.error('Une erreur est survenue lors de la création du rendez-vous');
  } finally {
    setIsLoading(false);
  }
};

  // Générer l'URL pour Google Calendar
const getGoogleCalendarLink = () => {
  // Fonction pour formater la date au format attendu par Google Calendar
  const formatGoogleDate = (dateString: Date): string => {
    const date = new Date(dateString);
    // Format requis: YYYYMMDDTHHMMSSZ
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };
  
  if (activeSection === 'barber' && appointmentData) {
    const startDate = new Date(appointmentData.appointmentTime);
    
    // Trouver la durée pour calculer l'heure de fin
    const haircutInfo = haircuts.find(h => h.id === appointmentData.haircutId);
    const endDate = new Date(startDate.getTime() + (haircutInfo?.duration || 60) * 60000);
    
    // Formater les dates correctement
    const formattedStart = formatGoogleDate(startDate);
    const formattedEnd = formatGoogleDate(endDate);
    
    // Chercher le coiffeur pour son nom
    const barberInfo = barbers.find(b => b.id === appointmentData.barberId);
    const barberName = barberInfo ? `${barberInfo.firstname} ${barberInfo.lastname}` : "Non spécifié";
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      appointmentData.haircutType || 'Rendez-vous coiffure'
    )}&dates=${formattedStart}/${formattedEnd}&details=Coiffeur: ${encodeURIComponent(
      barberName
    )}&location=Votre Salon L'HOMME`;
  } 
  else if (activeSection === 'esthetician' && appointmentData2) {
    const startDate = new Date(appointmentData2.appointmentTime);
    
    // Trouver la durée pour calculer l'heure de fin
    const beautyServiceInfo = beautyServices.find(s => s.id === appointmentData2.estheticId);
    const endDate = new Date(startDate.getTime() + (beautyServiceInfo?.duration || 60) * 60000);
    
    // Formater les dates correctement
    const formattedStart = formatGoogleDate(startDate);
    const formattedEnd = formatGoogleDate(endDate);
    
    // Chercher l'esthéticienne pour son nom
    const estheticianInfo = estheticians.find(e => e.id === appointmentData2.estheticianId);
    const estheticianName = estheticianInfo ? `${estheticianInfo.firstname} ${estheticianInfo.lastname}` : "Non spécifiée";
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      appointmentData2.estheticType || 'Rendez-vous beauté'
    )}&dates=${formattedStart}/${formattedEnd}&details=Esthéticienne: ${encodeURIComponent(
      estheticianName
    )}&location=Votre Salon`;
  }
  return '#';
};

  // Gérer l'ajout à Google Calendar
  const handleGoogleCalendarAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(getGoogleCalendarLink(), '_blank');
    toast.success("Page Google Calendar ouverte dans un nouvel onglet");
    
    // Afficher le popup des options suivantes après un court délai
    setTimeout(() => {
      setShowNextStepsPopup(true);
    }, 500);
  };

  // Télécharger fichier .ics ou ouvrir dans Apple Calendar sur iOS
const downloadICSFile = () => {
  try {
    // Déterminer si l'utilisateur est sur iOS
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (activeSection === 'barber' && appointmentData) {
      // Récupérer les infos du rendez-vous
      const { appointmentTime, haircutType } = appointmentData;
      const startTime = new Date(appointmentTime);
      
      // Chercher le service pour avoir la durée
      const haircutInfo = haircuts.find(h => h.id === appointmentData.haircutId);
      if (!haircutInfo) {
        toast.error("Service introuvable");
        return;
      }
      
      // Calculer l'heure de fin
      const endTime = new Date(startTime.getTime() + haircutInfo.duration * 60000);
      
      // Chercher le coiffeur pour son nom
      const barberInfo = barbers.find(b => b.id === appointmentData.barberId);
      const barberName = barberInfo ? `${barberInfo.firstname} ${barberInfo.lastname}` : "Non spécifié";
      
      // Format des dates pour ICS
      const startStr = startTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const endStr = endTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      // Créer le contenu ICS sans indentation
      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Salon App//FR
BEGIN:VEVENT
SUMMARY:${haircutType || 'Rendez-vous coiffure'}
DTSTART:${startStr}
DTEND:${endStr}
DESCRIPTION:Coiffeur: ${barberName}
LOCATION:Votre Salon L'HOMME
END:VEVENT
END:VCALENDAR`;
      
      if (isIOS) {
        // Sur iOS, utiliser une URL data qui ouvrira directement Apple Calendar
        const dataUri = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
        window.open(dataUri);
        toast.success("Ouverture de l'événement dans Apple Calendar");
      } else {
        // Sur les autres plateformes, télécharger le fichier normalement
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'rendez-vous-coiffure.ics';
        
        document.body.appendChild(link);
        link.click();
        
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
        
        toast.success("Fichier de calendrier téléchargé avec succès");
      }
      
      // Afficher le popup des options suivantes après un court délai
      setTimeout(() => {
        setShowNextStepsPopup(true);
      }, 500);
    } 
    else if (activeSection === 'esthetician' && appointmentData2) {
      // Même logique pour l'esthéticienne
      const { appointmentTime, estheticType } = appointmentData2;
      const startTime = new Date(appointmentTime);
      
      const beautyServiceInfo = beautyServices.find(s => s.id === appointmentData2.estheticId);
      if (!beautyServiceInfo) {
        toast.error("Service beauté introuvable");
        return;
      }
      
      const endTime = new Date(startTime.getTime() + beautyServiceInfo.duration * 60000);
      
      const estheticianInfo = estheticians.find(e => e.id === appointmentData2.estheticianId);
      const estheticianName = estheticianInfo ? `${estheticianInfo.firstname} ${estheticianInfo.lastname}` : "Non spécifiée";
      
      const startStr = startTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const endStr = endTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Salon App//FR
BEGIN:VEVENT
SUMMARY:${estheticType || 'Rendez-vous beauté'}
DTSTART:${startStr}
DTEND:${endStr}
DESCRIPTION:Esthéticienne: ${estheticianName}
LOCATION:Votre Salon L'HOMME
END:VEVENT
END:VCALENDAR`;
      
      if (isIOS) {
        // Sur iOS, utiliser une URL data qui ouvrira directement Apple Calendar
        const dataUri = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
        window.open(dataUri);
        toast.success("Ouverture de l'événement dans Apple Calendar");
      } else {
        // Sur les autres plateformes, télécharger le fichier normalement
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'rendez-vous-beaute.ics';
        
        document.body.appendChild(link);
        link.click();
        
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
        
        toast.success("Fichier de calendrier téléchargé avec succès");
      }
      
      setTimeout(() => {
        setShowNextStepsPopup(true);
      }, 500);
    } else {
      toast.error("Aucune information de rendez-vous disponible");
    }
  } catch (error) {
    toast.error("Erreur lors du téléchargement du fichier de calendrier");
  }
};
  

  // Nettoyer l'état de la réservation
  const clearReservationState = () => {
    localStorage.removeItem('reservationDone');
    setShowAddCalendarQuestion(false);
    setShowCalendarOptions(false);
    setShowNextStepsPopup(false);
    setAppointmentData(null);
    setAppointmentData2(null);
  };
  
  // Fonction pour redémarrer le processus de réservation
  const resetBookingForm = () => {
    // Reset tous les états
    setShowAddCalendarQuestion(false);
    setShowCalendarOptions(false);
    setShowNextStepsPopup(false);
    setAppointmentData(null);
    setAppointmentData2(null);
    setSelectedHaircut(null);
    setSelectedBeautyService(null);
    setSelectedBarber('');
    setSelectedEsthetician('');
    setSelectedDate('');
    setSelectedTime('');
    setAvailableTimes([]);
    
    // Supprime l'état de réservation du localStorage
    localStorage.removeItem('reservationDone');
    
    // Petit délai pour que les états soient bien mis à jour
    setTimeout(() => {
      // Force React à rafraîchir l'interface
      setActiveSection(prev => prev === 'barber' ? 'barber' : 'barber');
    }, 50);
  };
  
    // Classes réutilisables pour le dark mode
    const inputClasses = `w-full p-3 border rounded-lg text-xs sm:text-sm h-12 sm:h-14 transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
    }`;
  
    const labelClasses = `block text-xs sm:text-sm font-semibold mb-1 ${
      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
    }`;
  
    const buttonClasses = (isPrimary = true) => 
      `p-3 rounded-lg text-xs sm:text-sm w-full h-12 sm:h-14 transition-colors duration-300 ${
        isPrimary
          ? theme === 'dark'
            ? 'bg-blue-700 hover:bg-blue-600 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
          : theme === 'dark'
            ? 'bg-gray-600 hover:bg-gray-500 text-gray-300'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
      }`;

      
  return (
    <div className={`min-h-[calc(100vh-180px)] flex flex-col ${
      theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-800'
    }`}>
      <div className={`max-w-2xl mx-auto p-6 w-full flex-grow space-y-8 text-sm sm:text-base ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
      }`}>
        {!showAddCalendarQuestion && !showCalendarOptions && !showNextStepsPopup ? (
          <>
            {/* Boutons de bascule entre coiffeurs et esthéticiennes */}
            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={() => setActiveSection('barber')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                  activeSection === 'barber'
                    ? theme === 'dark'
                      ? 'bg-gray-700 text-white shadow-lg'
                      : 'bg-gray-800 text-white shadow-lg'
                    : theme === 'dark'
                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Coiffeurs
              </button>
              <button
                onClick={() => setActiveSection('esthetician')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                  activeSection === 'esthetician'
                    ? theme === 'dark'
                      ? 'bg-gray-700 text-white shadow-lg'
                      : 'bg-gray-800 text-white shadow-lg'
                    : theme === 'dark'
                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Esthéticiennes
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <h2 className={`text-lg sm:text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Réserver un rendez-vous {activeSection === 'barber' ? 'coiffure' : 'beauté'}
              </h2>

              {/* Champ date */}
              <div className="mb-4">
  <label htmlFor="date-input" className={labelClasses}>
    Date
  </label>
  <div className="relative">
    <input
      id="date-input"
      type="date"
      value={selectedDate}
      min={today.toISOString().split('T')[0]}
      onChange={handleDateChange}
      className={`${inputClasses} appearance-none`} // Ajout de appearance-none
    />
    <span className={`
      absolute right-3 top-1/2 transform -translate-y-1/2
      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
      pointer-events-none
      flex items-center justify-center
      h-full w-8
    `}>
      📅
    </span>
  </div>
</div>

              {/* Champ prestataire selon section active */}
              <div className="mb-4">
                {activeSection === 'barber' ? (
                  <>
                    <label htmlFor="barber-select" className={labelClasses}>
                      Sélectionner le coiffeur
                    </label>
                    <select
                      id="barber-select"
                      value={selectedBarber}
                      onChange={handleBarberChange}
                      className={inputClasses}
                      disabled={!selectedDate}
                    >
                      <option value="">Choisir un coiffeur</option>
                      {barbers.map((barber) => (
                        <option key={barber.id} value={barber.id}>
                          {barber.firstname} {barber.lastname}{barber.description ? ` (${barber.description})` : ''}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <label htmlFor="esthetician-select" className={labelClasses}>
                      Sélectionner l'esthéticienne
                    </label>
                    <select
                      id="esthetician-select"
                      value={selectedEsthetician}
                      onChange={handleEstheticianChange}
                      className={inputClasses}
                      disabled={!selectedDate}
                    >
                      <option value="">Choisir une esthéticienne</option>
                      {estheticians.map((esthetician) => (
                        <option key={esthetician.id} value={esthetician.id}>
                          {esthetician.firstname} {esthetician.lastname}{esthetician.description ? ` (${esthetician.description})` : ''}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>

              {/* Champ service selon section active */}
              <div className="mb-4">
                {activeSection === 'barber' ? (
                  <>
                    <label htmlFor="service-select" className={labelClasses}>
                      Sélectionner le service
                    </label>
                    <select
                      id="service-select"
                      value={selectedHaircut?.id || ''}
                      onChange={(e) => {
                        const selected = haircuts.find(haircut => haircut.id === parseInt(e.target.value));
                        setSelectedHaircut(selected || null);
                      }}
                      className={inputClasses}
                    >
                      <option value="">Choisir un service</option>
                      {haircuts.map((haircut) => (
                        <option key={haircut.id} value={haircut.id}>
                          {haircut.type} - {haircut.duration} min - {haircut.price} XAF
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <label htmlFor="beauty-service-select" className={labelClasses}>
                      Sélectionner le service beauté
                    </label>
                    <select
                      id="beauty-service-select"
                      value={selectedBeautyService?.id || ''}
                      onChange={(e) => {
                        const selected = beautyServices.find(service => service.id === parseInt(e.target.value));
                        setSelectedBeautyService(selected || null);
                      }}
                      className={inputClasses}
                    >
                      <option value="">Choisir un service beauté</option>
                      {beautyServices.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.type} - {service.duration} min - {service.price} XAF
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>

              {/* Champ heure */}
              <div className="mb-4">
                <label htmlFor="time-select" className={labelClasses}>
                  Heure
                </label>
                <select
                  id="time-select"
                  name="time-select"
                  aria-label="Sélection de l'heure"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className={inputClasses}
                  disabled={!selectedDate || (activeSection === 'barber' ? !selectedBarber : !selectedEsthetician) || isLoading}
                >
                  <option value="">
                    {isLoading ? 'Chargement...' : 'Choisir une heure'}
                  </option>
                  {availableTimes && availableTimes.length > 0 ? (
                    availableTimes.map((slot) => (
                      <option
                        key={slot.id}
                        value={slot.starTime.split('T')[1]}
                        disabled={!slot.available || isTimePast(slot.starTime.split('T')[1])}
                      >
                        {slot.starTime.split('T')[1].substring(0, 5)}
                      </option>
                    ))
                  ) : (
                    <option value="">
                      {!selectedDate
                        ? "Veuillez d'abord sélectionner une date"
                        : activeSection === 'barber'
                          ? !selectedBarber
                            ? 'Veuillez sélectionner un coiffeur'
                            : 'Aucun horaire disponible'
                          : !selectedEsthetician
                            ? 'Veuillez sélectionner une esthéticienne'
                            : 'Aucun horaire disponible'
                      }
                    </option>
                  )}
                </select>
              </div>

              {/* Bouton de soumission */}
              <button
                type="submit"
                className={buttonClasses()}
                disabled={
                  isLoading || 
                  (activeSection === 'barber' 
                    ? !selectedHaircut || !selectedBarber 
                    : !selectedBeautyService || !selectedEsthetician) || 
                  !selectedDate || 
                  !selectedTime
                }
              >
                {isLoading ? 'Traitement en cours...' : 'Confirmer la réservation'}
              </button>
            </form>
          </>
        ) :  showAddCalendarQuestion ? (
        // Question pour ajouter au calendrier
        <div className="bg-white p-6 rounded-lg space-y-6">
          <h3 className="text-xl font-semibold text-center">Rendez-vous confirmé !</h3>
          <p className="text-center">Souhaitez-vous ajouter ce rendez-vous à votre calendrier ?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setShowAddCalendarQuestion(false);
                setTimeout(() => {
                  setShowCalendarOptions(true);
                }, 50);
              }}
              className="p-3 bg-blue-600 text-white rounded-lg sm:w-1/2 h-12 sm:h-14 text-xs sm:text-sm"
            >
              Oui, ajouter au calendrier
            </button>
            <button
              onClick={() => {
                setShowAddCalendarQuestion(false);
                setTimeout(() => {
                  setShowNextStepsPopup(true);
                }, 50);
              }}
              className="p-3 bg-gray-500 text-white rounded-lg sm:w-1/2 h-12 sm:h-14 text-xs sm:text-sm"
            >
              Non, merci
            </button>
          </div>
        </div>
      ) : showCalendarOptions ? (
        <div className="space-y-4">
  <h3 className="text-lg font-semibold">Ajouter à votre calendrier :</h3>
  
  <a 
    href={getGoogleCalendarLink()}
    target="_blank"
    rel="noopener noreferrer"
    className="block p-3 bg-green-500 text-white rounded-lg text-center h-12 sm:h-14 text-xs sm:text-sm flex items-center justify-center"
    onClick={handleGoogleCalendarAdd}
  >
    Ajouter à Google Calendar
  </a>
  
  <button
  onClick={downloadICSFile}
  className="w-full p-3 bg-gray-500 text-white rounded-lg h-12 sm:h-14 text-xs sm:text-sm"
>
  {/iPhone|iPad|iPod/i.test(navigator.userAgent) 
    ? "Ajouter à Apple Calendar" 
    : "Télécharger l'événement (.ics)"}
</button>
  
  <button
    onClick={() => setShowNextStepsPopup(true)}
    className="w-full p-3 bg-blue-600 text-white rounded-lg h-12 sm:h-14 text-xs sm:text-sm"
  >
    Continuer
  </button>
</div>
      ) : null}

      {/* Popup pour les options suivantes */}
      {showNextStepsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg space-y-4 max-w-md w-full">
            <h3 className="text-xl font-semibold text-center">Que souhaitez-vous faire ensuite ?</h3>
            <div className="pt-2">
              <button
                onClick={() => {
                  clearReservationState(); 
                  navigate('/');
                }}
                className="w-full p-3 bg-blue-500 text-white rounded-lg h-12 sm:h-14 text-xs sm:text-sm"
              >
                Aller à l'accueil
              </button>
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  resetBookingForm();
                  setShowNextStepsPopup(false);
                }}
                className="w-full p-3 bg-green-500 text-white rounded-lg h-12 sm:h-14 text-xs sm:text-sm"
              >
                Prendre un autre rendez-vous
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
     {/* Espacement pour pousser le footer vers le bas */}
    <div className="h-[200px]"></div>
    </div>
  );
}