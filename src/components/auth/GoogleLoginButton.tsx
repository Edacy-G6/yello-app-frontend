import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { googleAuthService, type GoogleCredentialResponse } from '../../services/googleAuthService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export default function GoogleLoginButton({
  onSuccess,
  onError,
  disabled = false,
  className = '',
  variant = 'outline',
  size = 'default',
}: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const { login } = useAuth();

  // Charger le script Google
  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google?.accounts?.id) {
        setIsGoogleLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsGoogleLoaded(true);
      };
      script.onerror = () => {
        console.error('Erreur lors du chargement du script Google');
        onError?.('Erreur lors du chargement de Google Sign-In');
      };
      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, [onError]);

  // Initialiser Google Sign-In
  useEffect(() => {
    if (!isGoogleLoaded || !window.google?.accounts?.id) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('VITE_GOOGLE_CLIENT_ID non configuré');
      onError?.('Configuration Google manquante');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Google Sign-In:', error);
      onError?.('Erreur lors de l\'initialisation de Google Sign-In');
    }
  }, [isGoogleLoaded, onError]);

  const handleGoogleResponse = async (response: GoogleCredentialResponse) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const authResponse = await googleAuthService.handleGoogleResponse(response);
      
      if (authResponse.success && authResponse.data?.data) {
        const { user, token } = authResponse.data.data;
        
        // Mettre à jour le contexte d'authentification
        login(user, token);
        
        toast.success('Connexion Google réussie !');
        onSuccess?.();
      } else {
        throw new Error(authResponse.message || 'Erreur lors de l\'authentification');
      }
    } catch (error) {
      console.error('Erreur lors de l\'authentification Google:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'authentification Google';
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLogin = () => {
    if (!isGoogleLoaded || !window.google?.accounts?.id || isLoading) return;

    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('Google One Tap non affiché ou ignoré');
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'ouverture de Google Sign-In:', error);
      onError?.('Erreur lors de l\'ouverture de Google Sign-In');
    }
  };

  // Bouton personnalisé unique
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleManualLogin}
      disabled={disabled || isLoading || !isGoogleLoaded}
      className={`w-full ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connexion en cours...
        </>
      ) : !isGoogleLoaded ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Chargement...
        </>
      ) : (
        <>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuer avec Google
        </>
      )}
    </Button>
  );
}