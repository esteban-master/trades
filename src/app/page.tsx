import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link'

export default function Home() {
  return (
    <div >
      <Link           
        href="/company"
        className={cn(
          buttonVariants({
            variant: 'outline',
          }),
        )}
        >
          Empresas
        </Link>
    </div>
  );
}
