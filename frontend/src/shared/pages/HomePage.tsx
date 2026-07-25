import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCirclePlay,
  faPenToSquare,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { PageContainer, PlatformJourney } from '@/shared/components';

export default function HomePage() {
  return (
    <PageContainer
      eyebrow="Aprendizaje interactivo"
      title="Crea, comparte y responde cuestionarios"
    >
      <section className="hero-panel">
        <div className="hero-panel__content">
          <img
            alt="VibeQuiz"
            className="hero-panel__logo"
            src="/brand/vq-logo.png"
          />
          <p>
            Convierte tus preguntas en experiencias de aprendizaje simples de
            compartir. Crea evaluaciones, invita participantes con un enlace y
            consulta resultados claros desde un solo lugar.
          </p>
          <div className="hero-panel__actions">
            <Link className="button button--primary" to="/admin/login">
              <FontAwesomeIcon aria-hidden="true" icon={faPenToSquare} />
              <span>Crear un cuestionario</span>
            </Link>
          </div>
        </div>
        <img
          alt=""
          aria-hidden="true"
          className="hero-panel__visual"
          src="/brand/vq-isotipo.png"
        />
      </section>

      <section aria-labelledby="how-it-works" className="landing-section">
        <div className="landing-section__heading">
          <p className="page-header__eyebrow">Todo el flujo, sin fricción</p>
          <h2 id="how-it-works">De una idea a resultados en tres pasos</h2>
        </div>
        <PlatformJourney />
      </section>

      <section className="panel landing-callout">
        <div>
          <FontAwesomeIcon aria-hidden="true" icon={faShieldHalved} />
          <div>
            <h2>Una experiencia clara para cada rol</h2>
            <p>
              El administrador controla el contenido y su disponibilidad; los
              participantes se concentran únicamente en responder.
            </p>
          </div>
        </div>
        <Link className="button button--secondary" to="/admin/login">
          <FontAwesomeIcon aria-hidden="true" icon={faCirclePlay} />
          <span>Comenzar ahora</span>
        </Link>
      </section>
    </PageContainer>
  );
}
