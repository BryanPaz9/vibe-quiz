import { Button } from './Button';

export function ConfirmDialog({
  confirmLabel = 'Confirmar',
  description,
  isOpen,
  onCancel,
  onConfirm,
  title,
}: {
  confirmLabel?: string;
  description: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onCancel}>
      <div
        aria-describedby="confirmation-description"
        aria-labelledby="confirmation-title"
        aria-modal="true"
        className="dialog"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <h2 id="confirmation-title">{title}</h2>
        <p id="confirmation-description">{description}</p>
        <div className="dialog__actions">
          <Button onClick={onCancel} variant="secondary">
            Cancelar
          </Button>
          <Button onClick={onConfirm} variant="danger">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
