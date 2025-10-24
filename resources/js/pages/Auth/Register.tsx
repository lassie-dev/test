import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import GuestLayout from '@/components/layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('register'));
  };

  return (
    <GuestLayout>
      <Head title="Registro - Nuevo Amanecer" />

      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Crear Cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Completa el formulario para registrarte
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={submit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">
              Nombre Completo
            </Label>
            <Input
              id="name"
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="border-gray-300"
              placeholder="Juan Pérez"
              autoComplete="name"
              autoFocus
            />
            {errors.name && (
              <p className="text-sm text-error">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="border-gray-300"
              placeholder="tu@email.com"
              autoComplete="username"
            />
            {errors.email && (
              <p className="text-sm text-error">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="border-gray-300"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-sm text-error">{errors.password}</p>
            )}
          </div>

          {/* Password Confirmation Field */}
          <div className="space-y-2">
            <Label htmlFor="password_confirmation" className="text-gray-700">
              Confirmar Contraseña
            </Label>
            <Input
              id="password_confirmation"
              type="password"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              className="border-gray-300"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {errors.password_confirmation && (
              <p className="text-sm text-error">{errors.password_confirmation}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full gap-2"
            disabled={processing}
          >
            <UserPlus className="h-4 w-4" />
            {processing ? 'Registrando...' : 'Crear Cuenta'}
          </Button>
        </form>

        {/* Login Link */}
        <div className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link
            href={route('login')}
            className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </GuestLayout>
  );
}
