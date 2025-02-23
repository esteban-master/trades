import { create } from 'zustand'

type BrokerState = {
    select: {
        open: boolean;
        setOpen: (open: boolean) => void;
        value: string;
        setValue: (value: string) => void;
    }
}

export const useBrokerStore = create<BrokerState>((set) => ({
  select: {
    open: false,
    setOpen: (value) => set((prev) => ({ select: { ...prev.select, open: value }})),
    value: '',
    setValue: (value) => set((prev) => ({ select: { ...prev.select, value }})),
  }
}))