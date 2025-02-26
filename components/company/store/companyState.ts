import { create } from 'zustand'

type CompanyState = {
    select: {
        open: boolean;
        setOpen: (open: boolean) => void;
        value: string;
        setValue: (value: string) => void;
    },
    create: {
      open: boolean;
      setOpen: (open: boolean) => void;
    }
}

export const useCompanyStore = create<CompanyState>((set) => ({
  select: {
    open: false,
    setOpen: (value) => set((prev) => ({ select: { ...prev.select, open: value }})),
    value: '',
    setValue: (value) => set((prev) => ({ select: { ...prev.select, value }})),
  },
  create: {
    open: false,
    setOpen: (value) => set((prev) => ({ create: { ...prev.create, open: value }})),
  }
}))