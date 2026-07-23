import { Input, PageContainer } from '@/shared/components';
import { Button } from '@/shared/components/Button';

export default function LoginPage() {
  return (
    <PageContainer eyebrow="Administración" title="Iniciar sesión">
      <section className="panel auth-card">
        <form>
          <Input
            autoComplete="email"
            label="Correo electrónico"
            name="email"
            placeholder="admin@example.com"
            type="email"
          />
          <Input
            autoComplete="current-password"
            label="Contraseña"
            name="password"
            type="password"
          />
          <Button disabled type="submit">
            Ingresar
          </Button>
          <p className="muted">
            La autenticación se conectará en la siguiente entrega funcional.
          </p>
        </form>
      </section>
    </PageContainer>
  );
}
