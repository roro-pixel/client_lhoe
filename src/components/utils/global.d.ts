declare global {
    interface Window {
      google?: {
        accounts: {
          id: {
            initialize: (config: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void;
            renderButton: (element: HTMLElement, options: { theme: string; size: string; text?: string }) => void;
          };
        };
      };
    }
  }
  
  export interface GoogleCredentialResponse {
    credential: string;
    select_by?: string;
  }
  