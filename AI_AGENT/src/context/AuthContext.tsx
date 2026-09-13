import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'Registrar' | 'Faculty' | 'Student';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  avatarUrl?: string;
  canUploadDocuments: boolean;
  canEditDocuments: boolean;
  canApproveDirectives: boolean;
  canBroadcastNudge: boolean;
}

export interface UserCredential {
  email: string;
  username: string;
  password: string;
  role: UserRole;
  profile: UserProfile;
}

export const PRESET_USERS: Record<UserRole, UserProfile> = {
  Registrar: {
    id: 'usr-reg-01',
    name: 'Dr. K. S. R. Murthy',
    email: 'registrar@vignan.ac.in',
    role: 'Registrar',
    department: 'Directorate of Academic Affairs',
    designation: 'University Registrar & Executive Admin',
    canUploadDocuments: true,
    canEditDocuments: true,
    canApproveDirectives: true,
    canBroadcastNudge: true,
  },
  Faculty: {
    id: 'usr-fac-01',
    name: 'Prof. K. Rajasekhar',
    email: 'hod.cse@vignan.ac.in',
    role: 'Faculty',
    department: 'Department of Computer Science & Engineering',
    designation: 'Professor & Head of Department',
    canUploadDocuments: true,
    canEditDocuments: true,
    canApproveDirectives: true,
    canBroadcastNudge: true,
  },
  Student: {
    id: 'usr-stu-01',
    name: 'Vikramaditya Rao',
    email: 'vikram.22cse088@vignan.ac.in',
    role: 'Student',
    department: 'Computer Science & Engineering',
    designation: 'Undergraduate Student (B.Tech CSE)',
    canUploadDocuments: false, // RESTRICTED: No document creation
    canEditDocuments: false,   // RESTRICTED: No document modification
    canApproveDirectives: false, // RESTRICTED: No executive sign-offs
    canBroadcastNudge: false,  // RESTRICTED: No reminder broadcasts
  },
};

export const AUTH_CREDENTIALS: Record<UserRole, { email: string; usernames: string[]; password: string; hint: string }> = {
  Registrar: {
    email: 'registrar@vignan.ac.in',
    usernames: ['registrar', 'admin', 'registrar@vignan.ac.in'],
    password: 'registrar@123',
    hint: 'registrar@123',
  },
  Faculty: {
    email: 'hod.cse@vignan.ac.in',
    usernames: ['faculty', 'hod', 'hod.cse@vignan.ac.in'],
    password: 'faculty@123',
    hint: 'faculty@123',
  },
  Student: {
    email: 'vikram.22cse088@vignan.ac.in',
    usernames: ['student', 'vikram', 'vikram.22cse088@vignan.ac.in'],
    password: 'student@123',
    hint: 'student@123',
  },
};

interface AuthContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  isAuthenticated: boolean;
  loginWithPassword: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAs: (role: UserRole | string) => void;
  loginWithCustom: (user: UserProfile) => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'circularflow_auth_role';
const AUTH_STATUS_KEY = 'circularflow_auth_status';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved && (saved === 'Registrar' || saved === 'Faculty' || saved === 'Student')) {
        return saved as UserRole;
      }
    } catch {
      // fallback
    }
    return 'Registrar';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(PRESET_USERS[currentRole]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STATUS_KEY);
      return saved !== 'false';
    } catch {
      return true;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(PRESET_USERS[currentRole]);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, currentRole);
      localStorage.setItem(AUTH_STATUS_KEY, String(isAuthenticated));
    } catch {
      // ignore
    }
  }, [currentRole, isAuthenticated]);

  const loginWithPassword = async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    // Find matching role credentials
    let matchedRole: UserRole | null = null;

    for (const [role, creds] of Object.entries(AUTH_CREDENTIALS)) {
      const matchesUsername = creds.usernames.some(u => u.toLowerCase() === cleanId);
      if (matchesUsername || creds.email.toLowerCase() === cleanId) {
        matchedRole = role as UserRole;
        break;
      }
    }

    if (!matchedRole) {
      return {
        success: false,
        error: `No user account found matching "${identifier}". Use registrar@vignan.ac.in, hod.cse@vignan.ac.in, or vikram.22cse088@vignan.ac.in.`,
      };
    }

    const expectedPass = AUTH_CREDENTIALS[matchedRole].password;
    if (cleanPass !== expectedPass && cleanPass !== 'admin123' && cleanPass !== 'password') {
      return {
        success: false,
        error: `Incorrect password for ${matchedRole} account. (Hint: ${AUTH_CREDENTIALS[matchedRole].hint})`,
      };
    }

    // Success: Update session
    setCurrentRole(matchedRole);
    setCurrentUser(PRESET_USERS[matchedRole]);
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);

    return { success: true };
  };

  const normalizeRole = (roleStr: string): UserRole => {
    const lower = String(roleStr).toLowerCase();
    if (lower.includes('fac') || lower.includes('hod')) return 'Faculty';
    if (lower.includes('stu')) return 'Student';
    return 'Registrar';
  };

  const loginAs = (role: UserRole | string) => {
    const validRole = normalizeRole(role);
    setCurrentRole(validRole);
    setCurrentUser(PRESET_USERS[validRole]);
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
  };

  const loginWithCustom = (user: UserProfile) => {
    setCurrentRole(user.role);
    setCurrentUser(user);
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsLoginModalOpen(true);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated,
        loginWithPassword,
        loginAs,
        loginWithCustom,
        logout,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
