import { create } from 'zustand'

type TradeState = {
    create: {
      open: boolean;
      setOpen: (open: boolean) => void;
    }
}

export const useTradeStore = create<TradeState>((set) => ({
  create: {
    open: false,
    setOpen: (value) => set((prev) => ({ create: { ...prev.create, open: value }})),
  }
}))