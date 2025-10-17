import { useRegister } from '../../hooks/useRegister';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { UserRole } from '../../types';

interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const ROLE_LABELS: Record<UserRole, string> = {
  teacher: 'Enseignant',
  student: 'Élève',
  parent: 'Parent',
  admin: 'Administrateur',
};

export function RegisterForm({ onSuccess, onError }: RegisterFormProps) {
  const {
    formData,
    updateField,
    handleSubmit,
    reset,
    isLoading,
    error,
    validationErrors,
    isValid,
    clearError,
  } = useRegister({
    onSuccess: onSuccess || (() => {}),
    onError: onError || (() => {}),
  });

  return (
    <Card className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Inscription</h2>
        <p className="text-gray-600">Créez votre compte Yello</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Nom complet
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Votre nom complet"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
            disabled={isLoading}
          />
          {validationErrors.name && (
            <p className="text-sm text-destructive">{validationErrors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            required
            disabled={isLoading}
          />
          {validationErrors.email && (
            <p className="text-sm text-destructive">{validationErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium text-foreground">
            Rôle
          </label>
          <Select
            value={formData.role}
            onValueChange={(value) => updateField('role', value as UserRole)}
            disabled={isLoading}
          >
            <SelectTrigger id="role" className="w-full">
              <SelectValue placeholder="Sélectionnez un rôle" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors.role && (
            <p className="text-sm text-destructive">{validationErrors.role}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="schoolId" className="text-sm font-medium text-foreground">
            ID École (optionnel)
          </label>
          <Input
            id="schoolId"
            type="text"
            placeholder="school_001"
            value={formData.schoolId}
            onChange={(e) => updateField('schoolId', e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Mot de passe
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Au moins 6 caractères"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            required
            disabled={isLoading}
          />
          {validationErrors.password && (
            <p className="text-sm text-destructive">{validationErrors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirmer le mot de passe
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Répétez votre mot de passe"
            value={formData.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            required
            disabled={isLoading}
          />
          {validationErrors.confirmPassword && (
            <p className="text-sm text-destructive">{validationErrors.confirmPassword}</p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
            <button
              type="button"
              onClick={clearError}
              className="text-xs text-destructive/80 hover:text-destructive underline mt-1"
            >
              Fermer
            </button>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={!isValid || isLoading}
        >
          {isLoading ? 'Inscription...' : 'S\'inscrire'}
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={reset}
          className="text-sm text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          Réinitialiser le formulaire
        </button>
      </div>
    </Card>
  );
}
