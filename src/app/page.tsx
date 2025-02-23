import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link'

export default function Home() {
  return (
    <div >
      <Link           
        href="/broker"
        className={cn(
          buttonVariants({
            variant: 'outline',
          }),
        )}
        >
          Brokers
        </Link>
    </div>
  );
}
