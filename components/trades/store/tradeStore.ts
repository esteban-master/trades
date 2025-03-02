import { format } from 'date-fns';
import { create } from 'zustand'

type TradeState = {
    create: {
      open: boolean;
      openTimeValue: string;
      closeTimeValue: string;
      setOpen: (open: boolean) => void;
      setOpenTimeValue: (timeValue: string) => void;
      setCloseTimeValue: (timeValue: string) => void;
    }
}

export const useTradeStore = create<TradeState>((set) => ({
  create: {
    open: false,
    openTimeValue: `${format(new Date(), 'HH')}:${format(new Date(), 'mm')}`,
    closeTimeValue: `${format(new Date(), 'HH')}:${format(new Date(), 'mm')}`,
    setOpen: (value) => set((prev) => ({ create: { ...prev.create, open: value }})),
    setOpenTimeValue: (timeValue) => set((prev) => ({ create: { ...prev.create, openTimeValue: timeValue }})),
    setCloseTimeValue: (timeValue) => set((prev) => ({ create: { ...prev.create, closeTimeValue: timeValue }})),
  }
}))