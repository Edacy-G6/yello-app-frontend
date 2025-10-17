import { useState } from 'react';
import { useAuth } from './useAuth';
import type { RegisterData, UserRole } from '../types';

interface UseRegisterOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useRegister(options: UseRegisterOptions = {}) {
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'teacher',
    schoolId: '',
  });

  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof RegisterData, string>>>({});

  const updateField = (field: keyof RegisterData, value: string | UserRole) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    if (error) clearError();
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof RegisterData, string>> = {};

    // Validation email
    if (!formData.email) {
      errors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }

    // Validation nom
    if (!formData.name) {
      errors.name = 'Le nom est requis';
    } else if (formData.name.length < 2) {
      errors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    // Validation mot de passe
    if (!formData.password) {
      errors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    // Validation confirmation mot de passe
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Validation rôle
    if (!formData.role) {
      errors.role = 'Le rôle est requis';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) {
      options.onError?.('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    try {
      await register(formData);
      options.onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'inscription';
      options.onError?.(errorMessage);
    }
  };

  const reset = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      role: 'teacher',
      schoolId: '',
    });
    setValidationErrors({});
    clearError();
  };

  const isValid = Object.keys(validationErrors).length === 0 && 
                  formData.email.length > 0 && 
                  formData.password.length > 0 && 
                  formData.confirmPassword.length > 0 && 
                  formData.name.length > 0;

  return {
    formData,
    updateField,
    handleSubmit,
    reset,
    isLoading,
    error,
    validationErrors,
    isValid,
    clearError,
  };
}
