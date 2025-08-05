import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserType = 'superadmin' | 'investor' | 'company' | null;

interface UserContextProps {
  userType: UserType;
  setUserType: (type: UserType) => void;
  email: string;
  setEmail: (email: string) => void;
  name: string;
  setName: (name: string) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserTypeState] = useState<UserType>(null);
  const [email, setEmailState] = useState('');
  const [name, setNameState] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Persist to localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserTypeState(parsed.userType);
        setEmailState(parsed.email);
        setNameState(parsed.name);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (userType && email) {
      localStorage.setItem('user', JSON.stringify({ userType, email, name }));
    } else if (!isLoading) {
      localStorage.removeItem('user');
    }
  }, [userType, email, name, isLoading]);

  const setUserType = (type: UserType) => setUserTypeState(type);
  const setEmail = (email: string) => setEmailState(email);
  const setName = (name: string) => setNameState(name);

  return (
    <UserContext.Provider value={{ userType, setUserType, email, setEmail, name, setName, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
