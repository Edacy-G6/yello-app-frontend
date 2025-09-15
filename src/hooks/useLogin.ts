import { useState } from 'react';
import { useAuth } from './useAuth';
import type { LoginData } from '../types';

interface UseLoginOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useLogin(options: UseLoginOptions = {}) {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const updateField = (field: keyof LoginData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!formData.email || !formData.password) {
      options.onError?.('Veuillez remplir tous les champs');
      return;
    }

    try {
      await login(formData);
      options.onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      options.onError?.(errorMessage);
    }
  };

  const reset = () => {
    setFormData({
      email: '',
      password: '',
      rememberMe: false,
    });
    clearError();
  };

  const isValid = formData.email.length > 0 && formData.password.length > 0;

  return {
    formData,
    updateField,
    handleSubmit,
    reset,
    isLoading,
    error,
    isValid,
    clearError,
  };
}
