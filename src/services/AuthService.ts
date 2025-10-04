// Types
interface AuthResponse {
  token: string;
  email: string;
  role: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
}

class AuthService {
  private static readonly AUTH_KEY = 'auth';
  private static readonly TOKEN_KEY = 'token';
  private static readonly API_URL = `${import.meta.env.VITE_API_URL}/auth`;
  private static readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes en millisecondes
  private static inactivityTimer: NodeJS.Timeout | null = null;

  // Déconnexion automatique après une période d'inactivité
  static startInactivityTimer() {
    this.clearInactivityTimer(); // Nettoyer le timer existant
    this.inactivityTimer = setTimeout(() => {
      this.logout(); // Déconnecter l'utilisateur
      localStorage.removeItem('reservationDone'); // Vider le localStorage
    }, this.INACTIVITY_TIMEOUT);
  }

  // Réinitialiser le timer d'inactivité
  static resetInactivityTimer() {
    this.clearInactivityTimer();
    this.startInactivityTimer();
  }

  // Nettoyer le timer d'inactivité
  static clearInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  // Méthode de débogage pour afficher les informations du token
  static debugTokenInfo() {
    const authData = this.getAuthData();
  }

  // Méthode privée pour gérer les réponses avec un type générique
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Une erreur est survenue');
    }
    return response.json();
  }

  // Stockage du token
  static setAuthData(authData: AuthResponse): void {
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(authData));
    localStorage.setItem(this.TOKEN_KEY, authData.token);
  }

  // Récupérer les données d'authentification
  static getAuthData(): AuthResponse | null {
    const authData = localStorage.getItem(this.AUTH_KEY);
    return authData ? JSON.parse(authData) : null;
  }

  // Récupérer le token
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Nettoyer les données d'authentification
  static clearAuth(): void {
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Vérifier si l'utilisateur est authentifié
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Connexion
  static async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${this.API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const authData = await this.handleResponse<AuthResponse>(response);
    this.setAuthData(authData);
    this.startInactivityTimer(); // Démarrer le timer après la connexion
    return authData;
  }

  // Inscription
  static async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${this.API_URL}/signup/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const authData = await this.handleResponse<AuthResponse>(response);
    this.setAuthData(authData);
    this.startInactivityTimer(); // Démarrer le timer après l'inscription
    return authData;
  }

  // Déconnexion
  static async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(`${this.API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      }
    } catch (error) {
      // console.error('Erreur de déconnexion', error);
    } finally {
      this.clearAuth();
      this.clearInactivityTimer(); // Nettoyer le timer lors de la déconnexion
      localStorage.removeItem('reservationDone'); // Vider le localStorage pour les réservations
    }
  }

  // Requête authentifiée
  static async authenticatedRequest<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Non authentifié');
    }

    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    const response = await fetch(url, {
      ...options,
      headers,
    });

    return this.handleResponse<T>(response);
  }

  static async verifyEmail(email: string): Promise<void> {
  const url = `${this.API_URL}/forgot-password?email=${encodeURIComponent(email)}`;
  
  const response = await fetch(url, {
    method: 'POST', 
    headers: {
      'Accept': 'application/json',
    },
    
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la validation de l\'email.');
  }
}

  // Réinitialisation du mot de passe
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await fetch(`${this.API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la réinitialisation du mot de passe.');
    }
  }

  static async changePassword(token: string, newPassword: string, confirmPassword: string): Promise<void> {
  if (newPassword !== confirmPassword) {
    throw new Error('Les mots de passe ne correspondent pas.');
  }

  const response = await fetch(`https://d7b0-102-129-81-49.ngrok-free.app/v1/auth/change-password?token=${encodeURIComponent(token)}`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ newPassword }), 
  });

  if (!response.ok) {
    throw new Error('Erreur lors du changement du mot de passe.');
  }
}
}

export default AuthService;




