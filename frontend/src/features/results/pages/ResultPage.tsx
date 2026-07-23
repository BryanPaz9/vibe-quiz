import { useParams } from 'react-router-dom';
import { Badge, PageContainer } from '@/shared/components';

export default function ResultPage() {
  const { publicId, participationId } = useParams<{
    publicId: string;
    participationId: string;
  }>();

  return (
    <PageContainer
      actions={<Badge tone="warning">Próxima fase</Badge>}
      eyebrow="Participación completada"
      title="Tu resultado"
    >
      <section className="panel">
        <p>
          Aquí aparecerán puntuación, porcentaje y duración calculados por el
          backend.
        </p>
        <code>
          Quiz: {publicId} · Participación: {participationId}
        </code>
      </section>
    </PageContainer>
  );
}
