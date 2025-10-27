import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/components/layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';

export default function ResetPassword({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    token: token,
    email: email,
    password: '',
    password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('password.store'));
  };

  return (
    <GuestLayout>
      <Head />

      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('auth.resetPassword')}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.resetPasswordSubtitle')}
          </p>
        </div>

        {/* Form */}
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
              autoComplete="username"
            />
            {errors.email && (
              <p className="text-sm text-error">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">
              {t('auth.newPassword')}
            </Label>
            <Input
              id="password"
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="border-gray-300"
              autoComplete="new-password"
              autoFocus
            />
            {errors.password && (
              <p className="text-sm text-error">{errors.password}</p>
            )}
          </div>

          {/* Password Confirmation Field */}
          <div className="space-y-2">
            <Label htmlFor="password_confirmation" className="text-gray-700">
              {t('auth.confirmPassword')}
            </Label>
            <Input
              id="password_confirmation"
              type="password"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              className="border-gray-300"
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
            <Key className="h-4 w-4" />
            {processing ? t('common.resetting') : t('auth.resetPassword')}
          </Button>
        </form>
      </div>
    </GuestLayout>
  );
}
