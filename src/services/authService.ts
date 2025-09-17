import type { 
  AuthResponse, 
  LoginData, 
  RegisterData, 
  AuthUser,
  ApiResponse 
} from '../types';
import { MOCK_USERS } from '../constants';

// Simulation d'un délai réseau
const simulateNetworkDelay = (min = 500, max = 1500): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Génération d'un token mock
const generateMockToken = (userId: string): string => {
  return `mock_token_${userId}_${Date.now()}`;
};

// Génération d'un ID unique
const generateId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

class AuthService {
  // Simulation d'une base de données en mémoire
  private users: Map<string, AuthUser> = new Map();
  private registeredUsers: Map<string, { password: string; userData: Partial<AuthUser> }> = new Map();

  constructor() {
    this.initializeMockUsers();
  }

  private initializeMockUsers(): void {
    // Initialisation des utilisateurs de test
    Object.values(MOCK_USERS).forEach((mockUser) => {
      const userId = generateId();
      const user: AuthUser = {
        id: userId,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        schoolId: 'school_mock_001',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockUser.name}`,
        token: generateMockToken(userId),
        refreshToken: generateMockToken(userId),
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };

      this.users.set(mockUser.email, user);
      this.registeredUsers.set(mockUser.email, {
        password: mockUser.password,
        userData: user
      });
    });
  }

  async login(loginData: LoginData): Promise<ApiResponse<AuthResponse>> {
    await simulateNetworkDelay();

    const { email, password } = loginData;
    const registeredUser = this.registeredUsers.get(email);

    if (!registeredUser) {
      throw new Error('Email ou mot de passe incorrect');
    }

    if (registeredUser.password !== password) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const user = this.users.get(email);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Mise à jour des tokens
    const updatedUser: AuthUser = {
      ...user,
      token: generateMockToken(user.id),
      refreshToken: generateMockToken(user.id),
      updatedAt: new Date(),
    };

    this.users.set(email, updatedUser);

    return {
      success: true,
      message: 'Connexion réussie',
      data: {
        user: updatedUser,
        message: 'Bienvenue sur Yello !'
      }
    };
  }

  async register(registerData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    await simulateNetworkDelay();

    const { email, password, confirmPassword, name, role, schoolId } = registerData;

    // Validation
    if (password !== confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas');
    }

    if (password.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères');
    }

    if (this.registeredUsers.has(email)) {
      throw new Error('Un compte avec cet email existe déjà');
    }

    // Création du nouvel utilisateur
    const userId = generateId();
    const newUser: AuthUser = {
      id: userId,
      email,
      name,
      role,
      schoolId: schoolId || 'school_mock_001',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      token: generateMockToken(userId),
      refreshToken: generateMockToken(userId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Sauvegarde
    this.users.set(email, newUser);
    this.registeredUsers.set(email, {
      password,
      userData: newUser
    });

    return {
      success: true,
      message: 'Inscription réussie',
      data: {
        user: newUser,
        message: 'Votre compte a été créé avec succès !'
      }
    };
  }

  async refreshToken(_refreshToken: string): Promise<ApiResponse<{ token: string }>> {
    await simulateNetworkDelay();

    // Simulation simple - en réalité, on vérifierait le refresh token
    const newToken = generateMockToken('refresh');

    return {
      success: true,
      message: 'Token rafraîchi',
      data: { token: newToken }
    };
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    await simulateNetworkDelay();

    return {
      success: true,
      message: 'Déconnexion réussie',
      data: { message: 'Vous avez été déconnecté avec succès' }
    };
  }

  async getCurrentUser(token: string): Promise<ApiResponse<AuthUser>> {
    await simulateNetworkDelay();

    // Simulation de vérification du token - on accepte tout token mock
    if (!token.startsWith('mock_token_') && !token.startsWith('mock-token-')) {
      throw new Error('Token invalide ou expiré');
    }

    // Pour les tokens mock, on retourne le premier utilisateur teacher par défaut
    // En réalité, on décoderait le token pour obtenir l'ID utilisateur
    const user = Array.from(this.users.values()).find(u => u.role === 'teacher');
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return {
      success: true,
      message: 'Utilisateur récupéré',
      data: user
    };
  }

  // Méthode utilitaire pour obtenir les utilisateurs mockés (pour le développement)
  getMockUsers(): typeof MOCK_USERS {
    return MOCK_USERS;
  }
}

// Instance singleton du service
export const authService = new AuthService();
export default authService;
