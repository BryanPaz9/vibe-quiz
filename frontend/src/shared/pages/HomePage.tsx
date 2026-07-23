import { Link } from 'react-router-dom';
import { Badge, PageContainer } from '@/shared/components';

export default function HomePage() {
  return (
    <PageContainer
      actions={<Badge tone="success">Scaffold activo</Badge>}
      eyebrow="Aprendizaje interactivo"
      title="Crea, comparte y responde cuestionarios"
    >
      <section className="hero-panel">
        <div>
          <p>
            VibeQuiz demuestra cómo construir una aplicación completa mediante
            agentes especializados y supervisión humana.
          </p>
          <div className="hero-panel__actions">
            <Link className="button button--primary" to="/admin/login">
              Ir a administración
            </Link>
          </div>
        </div>
        <div className="hero-panel__visual" aria-hidden="true">
          <span>?</span>
        </div>
      </section>
    </PageContainer>
  );
}
