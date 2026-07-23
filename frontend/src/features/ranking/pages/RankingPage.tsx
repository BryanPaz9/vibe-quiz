import { useParams } from 'react-router-dom';
import { Badge, PageContainer } from '@/shared/components';

export default function RankingPage() {
  const { publicId } = useParams<{ publicId: string }>();

  return (
    <PageContainer
      actions={<Badge tone="warning">Próxima fase</Badge>}
      eyebrow="Resultados públicos"
      title="Tabla de clasificación"
    >
      <section className="panel">
        <p>
          Aquí se mostrarán únicamente alias, puntuación y duración de
          participaciones completadas.
        </p>
        <code>Quiz: {publicId}</code>
      </section>
    </PageContainer>
  );
}
