import { Link, useParams } from 'react-router-dom';
import { getParticipationSessionByQuiz } from '@/features/participation/session/participation-session';
import { usePublicRanking } from '@/features/ranking/hooks/use-public-ranking';
import {
  Badge,
  Button,
  EmptyState,
  ErrorMessage,
  Loader,
  PageContainer,
} from '@/shared/components';
import { formatDuration } from '@/shared/utils/format-duration';

export default function RankingPage() {
  const { publicId } = useParams<{ publicId: string }>();
  const rankingQuery = usePublicRanking(publicId);
  const session = publicId ? getParticipationSessionByQuiz(publicId) : null;

  if (!publicId) {
    return (
      <PageContainer eyebrow="Ranking" title="Enlace inválido">
        <ErrorMessage>
          La dirección no contiene un identificador de cuestionario.
        </ErrorMessage>
      </PageContainer>
    );
  }

  if (rankingQuery.isPending) {
    return (
      <PageContainer eyebrow="Ranking" title="Tabla de clasificación">
        <Loader label="Consultando posiciones…" />
      </PageContainer>
    );
  }

  if (rankingQuery.isError || !rankingQuery.data) {
    return (
      <PageContainer eyebrow="Ranking" title="Ranking no disponible">
        <ErrorMessage>
          No pudimos consultar la tabla de clasificación.
        </ErrorMessage>
        <div className="page-actions">
          <Button
            onClick={() => void rankingQuery.refetch()}
            variant="secondary"
          >
            Reintentar
          </Button>
        </div>
      </PageContainer>
    );
  }

  const ranking = rankingQuery.data;
  const generatedAt = new Intl.DateTimeFormat('es-GT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(ranking.generatedAt));

  return (
    <PageContainer
      actions={<Badge>{ranking.entries.length} participantes</Badge>}
      eyebrow="Resultados públicos"
      title="Tabla de clasificación"
    >
      {session?.quiz?.title && (
        <p className="ranking-subtitle">{session.quiz.title}</p>
      )}

      {ranking.entries.length === 0 ? (
        <EmptyState title="Todavía no hay resultados">
          El ranking aparecerá cuando se complete la primera participación.
        </EmptyState>
      ) : (
        <div className="panel table-scroll">
          <table className="ranking-table">
            <caption className="sr-only">
              Ranking público generado el {generatedAt}
            </caption>
            <thead>
              <tr>
                <th scope="col">Posición</th>
                <th scope="col">Alias</th>
                <th scope="col">Puntuación</th>
                <th scope="col">Porcentaje</th>
                <th scope="col">Duración</th>
              </tr>
            </thead>
            <tbody>
              {ranking.entries.map((entry) => {
                const isCurrentParticipant =
                  session?.alias === entry.alias &&
                  session.status === 'COMPLETED';
                return (
                  <tr
                    className={
                      isCurrentParticipant
                        ? 'ranking-table__current'
                        : undefined
                    }
                    key={`${entry.position}-${entry.alias}`}
                  >
                    <td>
                      <strong>#{entry.position}</strong>
                    </td>
                    <td>
                      {entry.alias}
                      {isCurrentParticipant && (
                        <span className="ranking-you">Tú</span>
                      )}
                    </td>
                    <td>
                      {entry.score}/{entry.totalQuestions}
                    </td>
                    <td>{entry.percentage}%</td>
                    <td>{formatDuration(entry.durationMs)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="ranking-generated">Actualizado: {generatedAt}</p>
      <div className="result-actions">
        {session?.status === 'COMPLETED' && (
          <Link
            className="button button--primary"
            to={`/quiz/${publicId}/result/${session.participationId}`}
          >
            Volver a mi resultado
          </Link>
        )}
        <Link className="button button--secondary" to="/">
          Volver al inicio
        </Link>
      </div>
    </PageContainer>
  );
}
