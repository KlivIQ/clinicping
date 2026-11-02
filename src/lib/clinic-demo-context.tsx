/* ClinicPing — © 2026 KlivIQ Technologies. Built by KlivIQ Technologies. */
import { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import type { DemoState } from './clinic-demo';
const Context = createContext<{ state: DemoState; setState: Dispatch<SetStateAction<DemoState>> } | null>(null);
export function ClinicDemoProvider({ initialState, children }: { initialState: DemoState; children: ReactNode }) {
  const [state, setState] = useState(initialState);
  return <Context.Provider value={{ state, setState }}>{children}</Context.Provider>;
}
export function useClinicDemo() {
  const context = useContext(Context);
  if (!context) throw new Error('Clinic demo provider missing');
  return context;
}