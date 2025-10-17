import { useLogin } from '../../hooks/useLogin';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import GoogleLoginButton from '../auth/GoogleLoginButton';

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

  const fillTestUser = (userType: string, index: number = 0) => {
    const testUsers = {
      teacher: [
        { email: 'marie.dubois@yello.com', password: 'password123', name: 'Marie Dubois' },
        { email: 'jean.martin@yello.com', password: 'password123', name: 'Jean Martin' },
        { email: 'sophie.bernard@yello.com', password: 'password123', name: 'Sophie Bernard' }
      ],
      student: [
        { email: 'alice.dupont@yello.com', password: 'password123', name: 'Alice Dupont' },
        { email: 'bob.leroy@yello.com', password: 'password123', name: 'Bob Leroy' },
        { email: 'claire.moreau@yello.com', password: 'password123', name: 'Claire Moreau' },
        { email: 'david.petit@yello.com', password: 'password123', name: 'David Petit' },
        { email: 'emma.rousseau@yello.com', password: 'password123', name: 'Emma Rousseau' },
        { email: 'lucas.simon@yello.com', password: 'password123', name: 'Lucas Simon' }
      ],
      parent: [
        { email: 'camille.laurent@yello.com', password: 'password123', name: 'Camille Laurent' },
        { email: 'pierre.moreau@yello.com', password: 'password123', name: 'Pierre Moreau' }
      ],
      admin: [
        { email: 'admin@yello.com', password: 'password123', name: 'Admin Yello' }
      ]
    };
    
    const userList = testUsers[userType as keyof typeof testUsers];
    const user = userList[index] || userList[0];
    if (user) {
      updateField('email', user.email);
      updateField('password', user.password);
    }
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
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <p className="text-sm text-blue-800 font-medium mb-1">🧪 Mode Développement</p>
            <p className="text-xs text-blue-600">
              Utilisez les boutons ci-dessous pour tester avec des données réelles du seed. 
              Tous les comptes utilisent le mot de passe : <code className="bg-blue-100 px-1 rounded">password123</code>
            </p>
          </div>
          <p className="text-sm text-gray-500 mb-3">Utilisateurs de test :</p>
          
          {/* Enseignants */}
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-2 font-medium">👨‍🏫 Enseignants :</p>
            <div className="grid grid-cols-1 gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillTestUser('teacher', 0)}
                disabled={isLoading}
                className="text-xs justify-start"
              >
                Marie Dubois (marie.dubois@yello.com)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillTestUser('teacher', 1)}
                disabled={isLoading}
                className="text-xs justify-start"
              >
                Jean Martin (jean.martin@yello.com)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillTestUser('teacher', 2)}
                disabled={isLoading}
                className="text-xs justify-start"
              >
                Sophie Bernard (sophie.bernard@yello.com)
              </Button>
            </div>
          </div>

          {/* Étudiants */}
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-2 font-medium">👨‍🎓 Étudiants :</p>
            <div className="grid grid-cols-1 gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillTestUser('student', 0)}
                disabled={isLoading}
                className="text-xs justify-start"
              >
                Alice Dupont (alice.dupont@yello.com)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillTestUser('student', 1)}
                disabled={isLoading}
                className="text-xs justify-start"
              >
                Bob Leroy (bob.leroy@yello.com)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillTestUser('student', 2)}
                disabled={isLoading}
                className="text-xs justify-start"
              >
                Claire Moreau (claire.moreau@yello.com)
              </Button>
            </div>
          </div>

          {/* Parents et Admin */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-400 mb-1 font-medium">👨‍👩‍👧‍👦 Parents :</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillTestUser('parent', 0)}
                disabled={isLoading}
                className="text-xs w-full"
              >
                Camille Laurent
              </Button>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1 font-medium">⚙️ Admin :</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillTestUser('admin', 0)}
                disabled={isLoading}
                className="text-xs w-full"
              >
                Admin Yello
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Séparateur */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou continuer avec
          </span>
        </div>
      </div>

      {/* Bouton Google */}
      <GoogleLoginButton
        onSuccess={onSuccess}
        onError={onError}
        disabled={isLoading}
        className="w-full"
      />

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
