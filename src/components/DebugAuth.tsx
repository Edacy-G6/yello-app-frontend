import { useAuth } from '../hooks/useAuth';
import { STORAGE_KEYS } from '../constants';

function DebugAuth() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const getStorageInfo = () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    return {
      token: token ? `${token.substring(0, 20)}...` : 'Aucun',
      userData: userData ? 'Présent' : 'Aucun',
      refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : 'Aucun',
    };
  };

  const storageInfo = getStorageInfo();

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border max-w-sm">
      <h3 className="font-bold text-sm mb-2">🐛 Debug Auth</h3>
      
      <div className="space-y-1 text-xs">
        <div>
          <span className="font-medium">Store:</span>
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isAuthenticated ? 'Connecté' : 'Déconnecté'}
          </span>
        </div>
        
        <div>
          <span className="font-medium">Loading:</span>
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            isLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isLoading ? 'En cours' : 'Terminé'}
          </span>
        </div>
        
        <div>
          <span className="font-medium">User ID:</span>
          <span className="ml-2 text-gray-600 dark:text-gray-300">
            {user?.id || 'Aucun'}
          </span>
        </div>
        
        <div>
          <span className="font-medium">Role:</span>
          <span className="ml-2 text-gray-600 dark:text-gray-300">
            {user?.role || 'Aucun'}
          </span>
        </div>
        
        <hr className="my-2" />
        
        <div>
          <span className="font-medium">Token:</span>
          <span className="ml-2 text-gray-600 dark:text-gray-300">
            {storageInfo.token}
          </span>
        </div>
        
        <div>
          <span className="font-medium">User Data:</span>
          <span className="ml-2 text-gray-600 dark:text-gray-300">
            {storageInfo.userData}
          </span>
        </div>
        
        <div>
          <span className="font-medium">Refresh Token:</span>
          <span className="ml-2 text-gray-600 dark:text-gray-300">
            {storageInfo.refreshToken}
          </span>
        </div>
      </div>
      
      <button
        onClick={() => window.location.reload()}
        className="mt-3 w-full bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-[#E3AC02]"
      >
        🔄 Rafraîchir la page
      </button>
    </div>
  );
}

export default DebugAuth;