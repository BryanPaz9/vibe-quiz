import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAdminLogin } from '@/features/auth/hooks/use-admin-auth';
import { getAdminSession } from '@/features/auth/session/admin-session';
import { ApiError } from '@/shared/api';
import { Button, Input, PageContainer } from '@/shared/components';
import type { LoginRequest } from '@/shared/types/api';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Ingresa el correo electrónico.')
    .email('Ingresa un correo electrónico válido.'),
  password: z.string().min(1, 'Ingresa la contraseña.'),
});

interface LoginLocationState {
  from?: string;
  reason?: 'expired';
}

function loginErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return 'No fue posible iniciar sesión. Inténtalo nuevamente.';
  }
  if (error.code === 'INVALID_CREDENTIALS') {
    return 'El correo o la contraseña no son válidos.';
  }
  if (error.code === 'RATE_LIMITED') {
    return 'Se alcanzó el límite de intentos. Espera un momento antes de volver a intentar.';
  }
  return 'No fue posible iniciar sesión. Inténtalo nuevamente.';
}

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const loginMutation = useAdminLogin();
  const locationState = location.state as LoginLocationState | null;
  const destination =
    locationState?.from?.startsWith('/admin/') &&
    locationState.from !== '/admin/login'
      ? locationState.from
      : '/admin/quizzes';
  const {
    formState: { errors },
    handleSubmit,
    register,
    setFocus,
  } = useForm<LoginRequest>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  if (getAdminSession()) {
    return <Navigate replace to={destination} />;
  }

  const submit = handleSubmit(async (credentials) => {
    try {
      await loginMutation.mutateAsync(credentials);
      navigate(destination, { replace: true });
    } catch {
      // TanStack Query exposes the safe error state rendered below.
    }
  });

  return (
    <PageContainer eyebrow="Administración" title="Iniciar sesión">
      <section className="panel auth-card">
        <p className="muted">
          Accede con las credenciales del administrador configurado para
          VibeQuiz.
        </p>
        <form noValidate onSubmit={submit}>
          {locationState?.reason === 'expired' && (
            <p className="state-message" role="status">
              Tu sesión finalizó. Inicia sesión nuevamente.
            </p>
          )}
          {loginMutation.isError && (
            <p className="state-message state-message--error" role="alert">
              {loginErrorMessage(loginMutation.error)}
            </p>
          )}
          <Input
            autoComplete="email"
            error={errors.email?.message}
            label="Correo electrónico"
            placeholder="admin@example.com"
            type="email"
            {...register('email')}
          />
          <Input
            autoComplete="current-password"
            error={errors.password?.message}
            label="Contraseña"
            type="password"
            {...register('password')}
          />
          <Button
            className="auth-card__submit"
            isLoading={loginMutation.isPending}
            type="submit"
          >
            Ingresar
          </Button>
          <p className="muted">
            Por seguridad, la sesión se conserva únicamente mientras esta página
            permanece abierta.
          </p>
        </form>
      </section>
    </PageContainer>
  );
}
