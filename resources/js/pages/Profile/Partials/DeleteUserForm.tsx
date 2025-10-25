import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const { t } = useTranslation();
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    {t('profile.deleteAccount')}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    {t('profile.deleteAccountDescription')}
                </p>
            </header>

            <Button variant="destructive" onClick={confirmUserDeletion}>
                {t('profile.deleteAccount')}
            </Button>

            <Dialog open={confirmingUserDeletion} onOpenChange={setConfirmingUserDeletion}>
                <DialogContent>
                    <form onSubmit={deleteUser}>
                        <DialogHeader>
                            <DialogTitle>{t('profile.deleteAccountConfirm')}</DialogTitle>
                            <DialogDescription>
                                {t('profile.deleteAccountWarning')}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-6">
                            <Label htmlFor="password" className="sr-only">{t('profile.passwordLabel')}</Label>

                            <Input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="mt-1 block w-full"
                                placeholder={t('profile.passwordPlaceholder')}
                            />

                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={closeModal}>
                                {t('common.cancel')}
                            </Button>

                            <Button type="submit" variant="destructive" disabled={processing}>
                                {t('profile.deleteAccount')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
}
