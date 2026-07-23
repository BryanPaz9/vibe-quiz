import { useParams } from 'react-router-dom';
import { Badge, PageContainer } from '@/shared/components';

export default function QuizEntryPage() {
  const { publicId } = useParams<{ publicId: string }>();

  return (
    <PageContainer
      actions={<Badge tone="warning">Próxima fase</Badge>}
      eyebrow="Participación"
      title="Preparando cuestionario"
    >
      <section className="panel">
        <p>
          Aquí se presentará la información pública del cuestionario y el
          formulario de alias.
        </p>
        <code>Quiz: {publicId}</code>
      </section>
    </PageContainer>
  );
}
