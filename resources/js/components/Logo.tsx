import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className, variant = 'full', size = 'lg' }: LogoProps) {
  const sizeClasses = {
    icon: {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
    },
    full: {
      sm: 'h-10 w-auto',
      md: 'h-12 w-auto',
      lg: 'h-16 w-auto md:h-20',
    },
  };

  return (
    <div className={cn('flex items-center', className)}>
      <img
        src="/images/logo.png"
        alt="Nuevo Amanecer"
        className={cn('object-contain', sizeClasses[variant][size])}
      />
    </div>
  );
}
