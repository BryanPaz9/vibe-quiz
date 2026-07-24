import { Badge, PageContainer } from '@/shared/components';

export function PlaceholderPage({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <PageContainer
      actions={<Badge tone="warning">Próxima fase</Badge>}
      eyebrow="Fundamentos preparados"
      title={title}
    >
      <section className="panel">
        <p>{description}</p>
        <p className="muted">
          La ruta, el layout y los providers ya están conectados. La
          funcionalidad se implementará contra el contrato REST aprobado.
        </p>
      </section>
    </PageContainer>
  );
}
