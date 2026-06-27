import { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '../types';

interface DevRoleContextValue {
  devRole: UserRole;
  setDevRole: (role: UserRole) => void;
}

const DevRoleContext = createContext<DevRoleContextValue>({
  devRole: 'admin',
  setDevRole: () => {},
});

export function DevRoleProvider({ children }: { children: ReactNode }) {
  const [devRole, setDevRole] = useState<UserRole>('admin');
  return (
    <DevRoleContext.Provider value={{ devRole, setDevRole }}>
      {children}
    </DevRoleContext.Provider>
  );
}

export const useDevRole = () => useContext(DevRoleContext);
