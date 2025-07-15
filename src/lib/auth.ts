// In a real application, these would be stored securely in environment variables
const ADMIN_USERNAME = 'admin';
// This is a SHA-256 hash of 'your-secure-password'
const ADMIN_PASSWORD_HASH = '7d793037a0760186574b0282f2f435e7'; 

// Simple function to hash a string (for demo purposes only)
// In production, use a proper crypto library and salt the passwords
async function hashString(str: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.slice(0, 32); // Take first 32 chars for consistency
}

export async function authenticate(username: string, password: string): Promise<boolean> {
  if (username !== ADMIN_USERNAME) return false;
  const hashedPassword = await hashString(password);
  return hashedPassword === ADMIN_PASSWORD_HASH;
}

export function useAuth() {
  const isAuthenticated = () => {
    const token = sessionStorage.getItem('adminToken');
    return token === ADMIN_PASSWORD_HASH;
  };

  const login = async (username: string, password: string) => {
    const success = await authenticate(username, password);
    if (success) {
      sessionStorage.setItem('adminToken', ADMIN_PASSWORD_HASH);
    }
    return success;
  };

  const logout = () => {
    sessionStorage.removeItem('adminToken');
  };

  return { isAuthenticated, login, logout };
}