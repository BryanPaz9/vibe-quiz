import {
  faCheckCircle,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { m } from 'motion/react';
import type { ParticipationAnswerReview } from '@/shared/types/api';

export function AnswerReview({
  answers,
}: {
  answers: ParticipationAnswerReview[];
}) {
  const orderedAnswers = [...answers].sort(
    (first, second) => first.position - second.position,
  );

  return (
    <section aria-labelledby="answer-review-title" className="answer-review">
      <div className="answer-review__heading">
        <p className="page-header__eyebrow">Detalle de respuestas</p>
        <h2 id="answer-review-title">Revisa cómo obtuviste tu nota</h2>
        <p>
          Compara tus respuestas con las correctas para reforzar lo aprendido.
        </p>
      </div>

      <div className="answer-review__list">
        {orderedAnswers.map((answer, index) => (
          <m.article
            animate={{ opacity: 1, y: 0 }}
            className={`panel answer-review-card ${
              answer.isCorrect
                ? 'answer-review-card--correct'
                : 'answer-review-card--incorrect'
            }`}
            initial={{ opacity: 0, y: 12 }}
            key={answer.questionId}
            transition={{ delay: Math.min(index * 0.05, 0.25) }}
          >
            <div className="answer-review-card__question">
              <span>Pregunta {index + 1}</span>
              <h3>{answer.questionText}</h3>
            </div>

            {answer.isCorrect ? (
              <div className="answer-option answer-option--correct">
                <FontAwesomeIcon aria-hidden="true" icon={faCheckCircle} />
                <div>
                  <span>Tu respuesta · Correcta</span>
                  <strong>{answer.selectedOption.text}</strong>
                </div>
              </div>
            ) : (
              <div className="answer-review-card__comparison">
                <div className="answer-option answer-option--incorrect">
                  <FontAwesomeIcon aria-hidden="true" icon={faCircleXmark} />
                  <div>
                    <span>Tu respuesta · Incorrecta</span>
                    <strong>{answer.selectedOption.text}</strong>
                  </div>
                </div>
                <div className="answer-option answer-option--correct">
                  <FontAwesomeIcon aria-hidden="true" icon={faCheckCircle} />
                  <div>
                    <span>Respuesta correcta</span>
                    <strong>{answer.correctOption.text}</strong>
                  </div>
                </div>
              </div>
            )}
          </m.article>
        ))}
      </div>
    </section>
  );
}
