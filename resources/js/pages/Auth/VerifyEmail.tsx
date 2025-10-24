import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import GuestLayout from '@/components/layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle } from 'lucide-react';

export default function VerifyEmail({ status }: { status?: string }) {
  const { post, processing } = useForm({});

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('verification.send'));
  };

  return (
    <GuestLayout>
      <Head title="Verificar Email" />

      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <Mail className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verifica tu Correo</h2>
          <p className="mt-2 text-sm text-gray-600">
            Gracias por registrarte. Antes de comenzar, verifica tu dirección de correo
            electrónico haciendo clic en el enlace que te enviamos.
          </p>
        </div>

        {/* Status Message */}
        {status === 'verification-link-sent' && (
          <Alert className="border-success bg-green-50">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              ¡Un nuevo enlace de verificación ha sido enviado a tu correo!
            </AlertDescription>
          </Alert>
        )}

        {/* Resend Button */}
        <form onSubmit={submit}>
          <Button
            type="submit"
            className="w-full gap-2"
            disabled={processing}
          >
            <Mail className="h-4 w-4" />
            {processing ? 'Enviando...' : 'Reenviar Email de Verificación'}
          </Button>
        </form>

        {/* Logout Link */}
        <div className="text-center">
          <Link
            href={route('logout')}
            method="post"
            as="button"
            className="text-sm text-gray-600 underline hover:text-gray-900"
          >
            Cerrar Sesión
          </Link>
        </div>
      </div>
    </GuestLayout>
  );
}
