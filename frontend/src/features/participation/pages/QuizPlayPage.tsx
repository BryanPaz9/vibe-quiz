import { useParams } from 'react-router-dom';
import { Badge, PageContainer } from '@/shared/components';

export default function QuizPlayPage() {
  const { publicId } = useParams<{ publicId: string }>();

  return (
    <PageContainer
      actions={<Badge tone="warning">Próxima fase</Badge>}
      eyebrow="Participación"
      title="Resolver cuestionario"
    >
      <section className="panel">
        <p>
          Aquí se mostrarán las preguntas de opción múltiple sin revelar la
          respuesta correcta.
        </p>
        <code>Quiz: {publicId}</code>
      </section>
    </PageContainer>
  );
}
