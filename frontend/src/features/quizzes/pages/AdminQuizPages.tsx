import { PlaceholderPage } from '@/shared/components/PlaceholderPage';

export function QuizListPage() {
  return (
    <PlaceholderPage
      description="Listado paginado, búsqueda y filtros por estado."
      title="Cuestionarios"
    />
  );
}

export function QuizCreatePage() {
  return (
    <PlaceholderPage
      description="Creación del agregado completo en estado borrador."
      title="Crear cuestionario"
    />
  );
}

export function QuizDetailPage() {
  return (
    <PlaceholderPage
      description="Detalle y edición del contenido cuando el estado sea DRAFT."
      title="Detalle del cuestionario"
    />
  );
}

export function QuizResultsPage() {
  return (
    <PlaceholderPage
      description="Resultados paginados de las participaciones asociadas."
      title="Resultados"
    />
  );
}

export function AdminRankingPage() {
  return (
    <PlaceholderPage
      description="Ranking administrativo de participaciones completadas."
      title="Ranking"
    />
  );
}
