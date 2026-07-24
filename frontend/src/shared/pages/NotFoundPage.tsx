import { Link } from 'react-router-dom';
import { PageContainer } from '@/shared/components';

export default function NotFoundPage() {
  return (
    <PageContainer eyebrow="Error 404" title="Página no encontrada">
      <section className="panel">
        <p>La dirección solicitada no pertenece a VibeQuiz.</p>
        <Link to="/">Volver al inicio</Link>
      </section>
    </PageContainer>
  );
}
