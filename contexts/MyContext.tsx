import { createContext, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

export type MyContextType = {
  [macaddress: string]: {
    name: string,
    allow: string,
    tantou: string,
    start_flg: boolean,
    timer: any,
    timer_id: number,
    mno: string,
    category: string,
    no: string,
    battery: number
  },
};

type MyContextType2 = {
  data: MyContextType,
  setData: React.Dispatch<React.SetStateAction<MyContextType>>,
};

export const MyContext = createContext<MyContextType2 | undefined>(undefined);

export function useMyContext() {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }
  return context;
}
