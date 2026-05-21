import { createContext, useContext, useState, useCallback } from "react";

interface TerminalContextValue {
  isOpen: boolean;
  pendingCommand: string | null;
  openWithCommand: (cmd: string) => void;
  clearPending: () => void;
  setIsOpen: (v: boolean) => void;
}

const TerminalContext = createContext<TerminalContextValue | null>(null);

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);

  const openWithCommand = useCallback((cmd: string) => {
    setIsOpen(true);
    setPendingCommand(cmd);
  }, []);

  const clearPending = useCallback(() => {
    setPendingCommand(null);
  }, []);

  return (
    <TerminalContext.Provider
      value={{ isOpen, pendingCommand, openWithCommand, clearPending, setIsOpen }}
    >
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error("useTerminal must be used inside TerminalProvider");
  return ctx;
}
