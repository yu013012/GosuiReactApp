import React, { ReactNode, useState } from 'react';
import { MyContext, MyContextType } from './MyContext';

interface MyContextProviderProps {
  children: ReactNode;
}

export function MyContextProvider({ children }: MyContextProviderProps) {
  const [data, setData] = useState<MyContextType>({});

  return (
    <MyContext.Provider value={{ data, setData }}>
      {children}
    </MyContext.Provider>
  );
}
