import { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import Logo from '@/components/Logo';

interface GuestLayoutProps {
  children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Logo className="mx-auto mb-2" />
            <p className="mt-4 text-sm text-gray-600">Sistema de Gestión Funeraria</p>
          </Link>
        </div>

        {/* Card Container */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
          {children}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Nuevo Amanecer. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
