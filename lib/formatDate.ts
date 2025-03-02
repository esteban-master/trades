import { es } from 'date-fns/locale';
import { format } from 'date-fns';

export const formatDate = ({
  size,
  date,
}: {
  size: 'xxs' | 'xxsminute' | 'xs' | 'sm' | 'md' | 'lg' | 'month' | 'year';
  date: Date;
}) => {
  const patterns = {
    xxs: 'dd/MM/yyyy',
    xxsminute: 'dd/MM/yyyy HH:mm',
    xs: 'MMMM yyyy',
    sm: 'dd, MMMM yyyy',
    md: "eee dd 'de' MMM yyyy",
    lg: "EEEE dd 'de' MMMM yyyy",
    month: 'MMMM',
    year: 'yyyy',
  };

  return format(date, patterns[size], {
    locale: es,
  });
};
