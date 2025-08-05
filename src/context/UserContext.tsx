import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserType = 'superadmin' | 'investor' | 'company' | null;

interface UserContextProps {
  userType: UserType;
  setUserType: (type: UserType) => void;
  email: string;
  setEmail: (email: string) => void;
  name: string;
  setName: (name: string) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserTypeState] = useState<UserType>(null);
  const [email, setEmailState] = useState('');
  const [name, setNameState] = useState('');

  // Persist to localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserTypeState(parsed.userType);
      setEmailState(parsed.email);
      setNameState(parsed.name);
    }
  }, []);

  useEffect(() => {
    if (userType && email) {
      localStorage.setItem('user', JSON.stringify({ userType, email, name }));
    } else {
      localStorage.removeItem('user');
    }
  }, [userType, email, name]);

  const setUserType = (type: UserType) => setUserTypeState(type);
  const setEmail = (email: string) => setEmailState(email);
  const setName = (name: string) => setNameState(name);

  return (
    <UserContext.Provider value={{ userType, setUserType, email, setEmail, name, setName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
