import { useLogin } from '../../hooks/useLogin';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { MOCK_USERS } from '../../constants';

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const {
    formData,
    updateField,
    handleSubmit,
    reset,
    isLoading,
    error,
    isValid,
    clearError,
  } = useLogin({
    onSuccess: onSuccess || (() => {}),
    onError: onError || (() => {}),
  });

  const fillMockUser = (userType: keyof typeof MOCK_USERS) => {
    const mockUser = MOCK_USERS[userType];
    updateField('email', mockUser.email);
    updateField('password', mockUser.password);
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Connexion</h2>
        <p className="text-gray-600">Connectez-vous à votre compte Yello</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Mot de passe
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Votre mot de passe"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => updateField('rememberMe', e.target.checked)}
            disabled={isLoading}
            className="rounded"
          />
          <label htmlFor="rememberMe" className="text-sm text-foreground">
            Se souvenir de moi
          </label>
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
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>

      {/* Utilisateurs de test pour le développement */}
      {import.meta.env.DEV && (
        <div className="border-t pt-4">
          <p className="text-sm text-gray-500 mb-3">Utilisateurs de test :</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillMockUser('teacher')}
              disabled={isLoading}
            >
              Enseignant
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillMockUser('student')}
              disabled={isLoading}
            >
              Élève
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillMockUser('parent')}
              disabled={isLoading}
            >
              Parent
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillMockUser('admin')}
              disabled={isLoading}
            >
              Admin
            </Button>
          </div>
        </div>
      )}

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
