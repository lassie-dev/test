import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/components/layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { LogIn } from 'lucide-react';

export default function Login({
  status,
  canResetPassword,
}: {
  status?: string;
  canResetPassword: boolean;
}) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'));
  };

  return (
    <GuestLayout>
      <Head />

      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('auth.login')}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        {/* Status Message */}
        {status && (
          <Alert className="border-success bg-green-50">
            <AlertDescription className="text-success">{status}</AlertDescription>
          </Alert>
        )}

        {/* Login Form */}
        <form onSubmit={submit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              {t('auth.email')}
            </Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="border-gray-300"
              placeholder={t('auth.emailPlaceholder')}
              autoComplete="username"
              autoFocus
            />
            {errors.email && (
              <p className="text-sm text-error">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">
              {t('auth.password')}
            </Label>
            <Input
              id="password"
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="border-gray-300"
              placeholder={t('auth.passwordPlaceholder')}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-sm text-error">{errors.password}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={data.remember}
                onCheckedChange={(checked) => setData('remember', checked as boolean)}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-normal text-gray-700 cursor-pointer"
              >
                {t('auth.rememberMe')}
              </Label>
            </div>

            {canResetPassword && (
              <Link
                href={route('password.request')}
                className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
              >
                {t('auth.forgotPassword')}
              </Link>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full gap-2"
            disabled={processing}
          >
            <LogIn className="h-4 w-4" />
            {processing ? t('common.entering') : t('auth.login')}
          </Button>
        </form>

        {/* Register Link */}
        <div className="text-center text-sm text-gray-600">
          {t('auth.noAccount')}{' '}
          <Link
            href={route('register')}
            className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
          >
            {t('auth.registerHere')}
          </Link>
        </div>
      </div>
    </GuestLayout>
  );
}
