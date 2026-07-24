import { faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { formatElapsedTime } from '@/features/participation/utils/format-elapsed-time';

function elapsedSeconds(startedAt: string, now: number): number {
  const startedAtMs = Date.parse(startedAt);
  if (Number.isNaN(startedAtMs)) return 0;
  return Math.max(0, Math.floor((now - startedAtMs) / 1000));
}

export function ElapsedTimer({ startedAt }: { startedAt: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const formattedTime = formatElapsedTime(elapsedSeconds(startedAt, now));

  return (
    <div
      aria-label={`Tiempo transcurrido: ${formattedTime}`}
      className="elapsed-timer"
      role="timer"
    >
      <FontAwesomeIcon aria-hidden="true" icon={faStopwatch} />
      <span aria-hidden="true">{formattedTime}</span>
      <span className="sr-only">
        Tiempo transcurrido desde que inició el cuestionario
      </span>
    </div>
  );
}
