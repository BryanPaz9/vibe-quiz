import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartColumn,
  faClipboardCheck,
  faLink,
  faPenToSquare,
  faRankingStar,
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, m } from 'motion/react';
import { type KeyboardEvent, useState } from 'react';

const journeys = {
  administrator: {
    label: 'Administrador',
    steps: [
      {
        title: 'Crea',
        icon: faPenToSquare,
        points: [
          'Organiza preguntas y opciones.',
          'Define la respuesta correcta.',
          'Conserva el cuestionario como borrador mientras lo prepara.',
        ],
      },
      {
        title: 'Publica y comparte',
        icon: faLink,
        points: [
          'Publica el cuestionario.',
          'Obtiene y comparte el enlace público.',
        ],
      },
      {
        title: 'Analiza resultados',
        icon: faChartColumn,
        points: [
          'Consulta puntuaciones, duración y ranking.',
          'Identifica el desempeño de los participantes.',
        ],
      },
    ],
  },
  participant: {
    label: 'Participante',
    steps: [
      {
        title: 'Ingresa con un alias',
        icon: faRightToBracket,
        points: ['Abre el enlace público.', 'Participa sin crear una cuenta.'],
      },
      {
        title: 'Responde',
        icon: faClipboardCheck,
        points: [
          'Recorre las preguntas y selecciona una opción por cada una.',
          'Visualiza el tiempo transcurrido durante el intento.',
        ],
      },
      {
        title: 'Revisa y compite',
        icon: faRankingStar,
        points: [
          'Consulta su puntuación y duración.',
          'Revisa sus respuestas frente a las correctas.',
          'Accede al ranking público.',
        ],
      },
    ],
  },
} as const;

type Profile = keyof typeof journeys;

export function PlatformJourney() {
  const [profile, setProfile] = useState<Profile>('administrator');
  const [activeStep, setActiveStep] = useState(0);
  const journey = journeys[profile];
  const step = journey.steps[activeStep];
  const lastStep = journey.steps.length - 1;

  function selectProfile(nextProfile: Profile) {
    setProfile(nextProfile);
    setActiveStep(0);
  }

  function navigateStepTabs(event: KeyboardEvent<HTMLButtonElement>) {
    let nextStep: number | undefined;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextStep = (activeStep + 1) % journey.steps.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextStep = (activeStep - 1 + journey.steps.length) % journey.steps.length;
    } else if (event.key === 'Home') {
      nextStep = 0;
    } else if (event.key === 'End') {
      nextStep = lastStep;
    }

    if (nextStep === undefined) {
      return;
    }

    event.preventDefault();
    setActiveStep(nextStep);
    const tabs = event.currentTarget.parentElement?.querySelectorAll('button');
    tabs?.item(nextStep).focus();
  }

  return (
    <div className="platform-journey">
      <div
        aria-label="Selecciona tu perfil"
        className="platform-journey__profiles"
        role="group"
      >
        {(Object.keys(journeys) as Profile[]).map((profileId) => (
          <button
            aria-pressed={profile === profileId}
            className="platform-journey__profile"
            key={profileId}
            onClick={() => selectProfile(profileId)}
            type="button"
          >
            {journeys[profileId].label}
          </button>
        ))}
      </div>

      <div
        aria-label={`Etapas del recorrido de ${journey.label}`}
        className="platform-journey__steps"
        role="tablist"
      >
        {journey.steps.map((journeyStep, index) => (
          <button
            aria-controls="platform-journey-panel"
            aria-selected={activeStep === index}
            className="platform-journey__step"
            id={`platform-journey-tab-${profile}-${index}`}
            key={journeyStep.title}
            onKeyDown={navigateStepTabs}
            onClick={() => setActiveStep(index)}
            role="tab"
            tabIndex={activeStep === index ? 0 : -1}
            type="button"
          >
            <span aria-hidden="true">{index + 1}</span>
            {journeyStep.title}
          </button>
        ))}
      </div>

      <AnimatePresence initial={false} mode="wait">
        <m.article
          animate={{ opacity: 1, y: 0 }}
          aria-labelledby={`platform-journey-tab-${profile}-${activeStep}`}
          className="panel platform-journey__panel"
          exit={{ opacity: 0, y: -8 }}
          id="platform-journey-panel"
          initial={{ opacity: 0, y: 8 }}
          key={`${profile}-${activeStep}`}
          role="tabpanel"
          transition={{ duration: 0.18 }}
        >
          <div className="platform-journey__icon" aria-hidden="true">
            <FontAwesomeIcon icon={step.icon} />
          </div>
          <div>
            <p className="platform-journey__progress">
              Paso {activeStep + 1} de {journey.steps.length}
            </p>
            <h3>{step.title}</h3>
            <ul>
              {step.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </m.article>
      </AnimatePresence>

      <div className="platform-journey__navigation">
        <button
          className="button button--secondary"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((current) => current - 1)}
          type="button"
        >
          Anterior
        </button>
        <button
          className="button button--primary"
          disabled={activeStep === lastStep}
          onClick={() => setActiveStep((current) => current + 1)}
          type="button"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
