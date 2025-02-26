import { create } from 'zustand'

type AccountState = {
    create: {
      open: boolean;
      setOpen: (open: boolean) => void;
    }
}

export const useAccountStore = create<AccountState>((set) => ({
  create: {
    open: false,
    setOpen: (value) => set((prev) => ({ create: { ...prev.create, open: value }})),
  }
}))