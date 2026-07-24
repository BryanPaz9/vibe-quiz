import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy,
  faLock,
  faPaperPlane,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useCloseAdminQuiz,
  useDeleteAdminQuiz,
  usePublishAdminQuiz,
} from '@/features/quizzes/hooks/use-admin-quiz-lifecycle';
import { Button, ConfirmDialog, ErrorMessage } from '@/shared/components';
import type { AdminQuizDetail } from '@/shared/types/api';

type LifecycleAction = 'publish' | 'close' | 'delete';

const confirmationByAction: Record<
  LifecycleAction,
  { confirmLabel: string; description: string; title: string }
> = {
  publish: {
    confirmLabel: 'Publicar',
    description:
      'El cuestionario quedará disponible mediante su enlace público y ya no podrá editarse.',
    title: '¿Publicar cuestionario?',
  },
  close: {
    confirmLabel: 'Cerrar cuestionario',
    description:
      'Ya no se aceptarán nuevas participaciones y el cuestionario no podrá reabrirse.',
    title: '¿Cerrar cuestionario?',
  },
  delete: {
    confirmLabel: 'Eliminar definitivamente',
    description:
      'Esta acción eliminará permanentemente el borrador y no se puede deshacer.',
    title: '¿Eliminar borrador?',
  },
};

function actionErrorTitle(action: LifecycleAction | null): string {
  switch (action) {
    case 'publish':
      return 'No fue posible publicar el cuestionario';
    case 'close':
      return 'No fue posible cerrar el cuestionario';
    case 'delete':
      return 'No fue posible eliminar el cuestionario';
    default:
      return 'No fue posible completar la operación';
  }
}

export function QuizLifecyclePanel({ quiz }: { quiz: AdminQuizDetail }) {
  const navigate = useNavigate();
  const publishQuiz = usePublishAdminQuiz(quiz.id);
  const closeQuiz = useCloseAdminQuiz(quiz.id);
  const deleteQuiz = useDeleteAdminQuiz(quiz.id);
  const [dialogAction, setDialogAction] = useState<LifecycleAction | null>(
    null,
  );
  const [failedAction, setFailedAction] = useState<LifecycleAction | null>(
    null,
  );
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>(
    'idle',
  );

  const publicPath = `/quiz/${quiz.publicId}`;
  const publicUrl = new URL(publicPath, window.location.origin).toString();
  const activeMutation =
    dialogAction === 'publish'
      ? publishQuiz
      : dialogAction === 'close'
        ? closeQuiz
        : deleteQuiz;

  function openConfirmation(action: LifecycleAction) {
    publishQuiz.reset();
    closeQuiz.reset();
    deleteQuiz.reset();
    setFailedAction(null);
    setDialogAction(action);
  }

  async function confirmAction() {
    if (!dialogAction) return;
    const action = dialogAction;

    try {
      if (action === 'publish') await publishQuiz.mutateAsync();
      if (action === 'close') await closeQuiz.mutateAsync();
      if (action === 'delete') {
        await deleteQuiz.mutateAsync();
        await navigate('/admin/quizzes', { replace: true });
      }
      setDialogAction(null);
    } catch {
      setFailedAction(action);
      setDialogAction(null);
    }
  }

  async function copyPublicUrl() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopyStatus('success');
    } catch {
      setCopyStatus('error');
    }
  }

  const confirmation = dialogAction
    ? confirmationByAction[dialogAction]
    : confirmationByAction.publish;

  return (
    <section aria-labelledby="quiz-lifecycle-title" className="panel lifecycle">
      <div>
        <p className="lifecycle__eyebrow">Ciclo de vida</p>
        <h2 id="quiz-lifecycle-title">Disponibilidad del cuestionario</h2>
      </div>

      {quiz.status === 'DRAFT' && (
        <>
          <p>
            El borrador puede seguir editándose. Publícalo cuando esté listo o
            elimínalo si ya no se utilizará.
          </p>
          <div className="page-actions">
            <Button onClick={() => openConfirmation('publish')}>
              <FontAwesomeIcon aria-hidden="true" icon={faPaperPlane} />
              <span>Publicar cuestionario</span>
            </Button>
            <Button onClick={() => openConfirmation('delete')} variant="danger">
              <FontAwesomeIcon aria-hidden="true" icon={faTrashCan} />
              <span>Eliminar borrador</span>
            </Button>
          </div>
        </>
      )}

      {quiz.status === 'PUBLISHED' && (
        <>
          <p>
            Comparte este enlace con las personas que responderán el
            cuestionario.
          </p>
          <div className="lifecycle__public-link">
            <a href={publicPath} rel="noreferrer" target="_blank">
              {publicUrl}
            </a>
            <Button onClick={() => void copyPublicUrl()} variant="secondary">
              <FontAwesomeIcon aria-hidden="true" icon={faCopy} />
              <span>Copiar enlace</span>
            </Button>
          </div>
          {copyStatus === 'success' && (
            <p className="state-message state-message--success" role="status">
              Enlace copiado.
            </p>
          )}
          {copyStatus === 'error' && (
            <ErrorMessage title="No fue posible copiar el enlace">
              Selecciona y copia la dirección manualmente.
            </ErrorMessage>
          )}
          <div className="page-actions">
            <Button onClick={() => openConfirmation('close')} variant="danger">
              <FontAwesomeIcon aria-hidden="true" icon={faLock} />
              <span>Cerrar cuestionario</span>
            </Button>
          </div>
        </>
      )}

      {quiz.status === 'CLOSED' && (
        <p>
          El cuestionario está cerrado y ya no admite nuevas participaciones.
        </p>
      )}

      {failedAction && (
        <ErrorMessage title={actionErrorTitle(failedAction)}>
          Verifica el estado actual e inténtalo nuevamente.
        </ErrorMessage>
      )}

      <ConfirmDialog
        confirmLabel={confirmation.confirmLabel}
        description={confirmation.description}
        isOpen={dialogAction !== null}
        isPending={activeMutation.isPending}
        onCancel={() => setDialogAction(null)}
        onConfirm={() => void confirmAction()}
        title={confirmation.title}
      />
    </section>
  );
}
