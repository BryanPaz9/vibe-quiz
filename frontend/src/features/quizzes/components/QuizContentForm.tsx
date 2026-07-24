import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faPlus,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, m } from 'motion/react';
import {
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { Link } from 'react-router-dom';
import {
  emptyQuestion,
  quizContentSchema,
  type QuizContentFormValues,
} from '@/features/quizzes/schemas/quiz-content-schema';
import { Button, ErrorMessage, Input, Textarea } from '@/shared/components';
import type { QuizContentInput } from '@/shared/types/api';

interface QuestionEditorProps {
  control: Control<QuizContentFormValues>;
  errors: FieldErrors<QuizContentFormValues>;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRemove: () => void;
  register: UseFormRegister<QuizContentFormValues>;
  setValue: UseFormSetValue<QuizContentFormValues>;
}

function QuestionEditor({
  control,
  errors,
  index,
  isFirst,
  isLast,
  onMoveDown,
  onMoveUp,
  onRemove,
  register,
  setValue,
}: QuestionEditorProps) {
  const {
    append: appendOption,
    fields: optionFields,
    move: moveOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `questions.${index}.options`,
  });
  const options = useWatch({
    control,
    name: `questions.${index}.options`,
  });
  const optionError = errors.questions?.[index]?.options;
  const optionGroupError =
    optionError && 'root' in optionError
      ? optionError.root?.message
      : undefined;

  function selectCorrectOption(selectedIndex: number) {
    optionFields.forEach((_, optionIndex) => {
      setValue(
        `questions.${index}.options.${optionIndex}.isCorrect`,
        optionIndex === selectedIndex,
        { shouldDirty: true, shouldValidate: true },
      );
    });
  }

  return (
    <fieldset
      className="panel quiz-editor-question"
      data-question-index={index}
    >
      <legend>Pregunta {index + 1}</legend>
      <div className="quiz-editor-toolbar">
        <Button
          disabled={isFirst}
          onClick={onMoveUp}
          type="button"
          variant="secondary"
        >
          <FontAwesomeIcon aria-hidden="true" icon={faArrowUp} />
          <span>Subir pregunta</span>
        </Button>
        <Button
          disabled={isLast}
          onClick={onMoveDown}
          type="button"
          variant="secondary"
        >
          <FontAwesomeIcon aria-hidden="true" icon={faArrowDown} />
          <span>Bajar pregunta</span>
        </Button>
        <Button onClick={onRemove} type="button" variant="danger">
          <FontAwesomeIcon aria-hidden="true" icon={faTrashCan} />
          <span>Eliminar pregunta</span>
        </Button>
      </div>

      <Textarea
        error={errors.questions?.[index]?.text?.message}
        label="Texto de la pregunta"
        maxLength={1000}
        {...register(`questions.${index}.text`)}
      />

      <div className="quiz-editor-options">
        <h2>Opciones</h2>
        <AnimatePresence initial={false}>
          {optionFields.map((field, optionIndex) => (
            <m.div
              animate={{ opacity: 1, y: 0 }}
              className="quiz-editor-option"
              exit={{ opacity: 0, scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              key={field.id}
              layout
              transition={{ duration: 0.2 }}
            >
              <label className="quiz-editor-correct">
                <input
                  aria-label={`Marcar opción ${optionIndex + 1} como correcta`}
                  checked={Boolean(options?.[optionIndex]?.isCorrect)}
                  name={`correct-question-${index}`}
                  onChange={() => selectCorrectOption(optionIndex)}
                  type="radio"
                />
                Correcta
              </label>
              <Input
                error={
                  errors.questions?.[index]?.options?.[optionIndex]?.text
                    ?.message
                }
                label={`Opción ${optionIndex + 1}`}
                maxLength={500}
                {...register(`questions.${index}.options.${optionIndex}.text`)}
              />
              <div className="quiz-editor-option__actions">
                <Button
                  aria-label="Subir opción"
                  disabled={optionIndex === 0}
                  onClick={() => moveOption(optionIndex, optionIndex - 1)}
                  title="Subir opción"
                  type="button"
                  variant="secondary"
                >
                  <FontAwesomeIcon aria-hidden="true" icon={faArrowUp} />
                </Button>
                <Button
                  aria-label="Bajar opción"
                  disabled={optionIndex === optionFields.length - 1}
                  onClick={() => moveOption(optionIndex, optionIndex + 1)}
                  title="Bajar opción"
                  type="button"
                  variant="secondary"
                >
                  <FontAwesomeIcon aria-hidden="true" icon={faArrowDown} />
                </Button>
                <Button
                  disabled={optionFields.length <= 2}
                  onClick={() => removeOption(optionIndex)}
                  type="button"
                  variant="danger"
                >
                  <FontAwesomeIcon aria-hidden="true" icon={faTrashCan} />
                  <span>Eliminar opción</span>
                </Button>
              </div>
            </m.div>
          ))}
        </AnimatePresence>
        {optionGroupError && (
          <p className="field__error" role="alert">
            {optionGroupError}
          </p>
        )}
        <Button
          onClick={() => appendOption({ text: '', isCorrect: false })}
          type="button"
          variant="secondary"
        >
          <FontAwesomeIcon aria-hidden="true" icon={faPlus} />
          <span>Agregar opción</span>
        </Button>
      </div>
    </fieldset>
  );
}

export interface QuizContentFormProps {
  cancelTo: string;
  errorTitle: string;
  initialValues: QuizContentFormValues;
  isPending: boolean;
  onSubmit: (request: QuizContentInput) => Promise<void>;
  showError: boolean;
  submitLabel: string;
  successMessage?: string;
}

export function QuizContentForm({
  cancelTo,
  errorTitle,
  initialValues,
  isPending,
  onSubmit,
  showError,
  submitLabel,
  successMessage,
}: QuizContentFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<QuizContentFormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(quizContentSchema),
  });
  const {
    append: appendQuestion,
    fields: questionFields,
    move: moveQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control, name: 'questions' });

  function addQuestion() {
    const nextQuestionIndex = questionFields.length;
    appendQuestion(emptyQuestion, { shouldFocus: false });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const question = document.querySelector<HTMLElement>(
          `[data-question-index="${nextQuestionIndex}"]`,
        );
        question?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
        question?.querySelector<HTMLTextAreaElement>('textarea')?.focus();
      });
    });
  }

  async function submit(values: QuizContentFormValues) {
    const request: QuizContentInput = {
      title: values.title,
      ...(values.description ? { description: values.description } : {}),
      questions: values.questions.map((question, questionIndex) => ({
        text: question.text,
        position: questionIndex + 1,
        options: question.options.map((option, optionIndex) => ({
          text: option.text,
          position: optionIndex + 1,
          isCorrect: option.isCorrect,
        })),
      })),
    };

    await onSubmit(request);
  }

  return (
    <form
      className="quiz-editor"
      noValidate
      onSubmit={(event) => void handleSubmit(submit)(event)}
    >
      <section className="panel">
        <Input
          error={errors.title?.message}
          label="Título"
          maxLength={160}
          {...register('title')}
        />
        <Textarea
          error={errors.description?.message}
          label="Descripción (opcional)"
          maxLength={1000}
          {...register('description')}
        />
      </section>

      <div className="quiz-editor-heading">
        <div>
          <h2>Preguntas</h2>
          <p className="muted">
            Cada pregunta necesita al menos dos opciones y una respuesta
            correcta.
          </p>
        </div>
        <Button onClick={addQuestion} type="button" variant="secondary">
          <FontAwesomeIcon aria-hidden="true" icon={faPlus} />
          <span>Agregar pregunta</span>
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {questionFields.map((field, index) => (
          <m.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            initial={{ opacity: 0, y: 14 }}
            key={field.id}
            layout
            transition={{ duration: 0.24 }}
          >
            <QuestionEditor
              control={control}
              errors={errors}
              index={index}
              isFirst={index === 0}
              isLast={index === questionFields.length - 1}
              onMoveDown={() => moveQuestion(index, index + 1)}
              onMoveUp={() => moveQuestion(index, index - 1)}
              onRemove={() => removeQuestion(index)}
              register={register}
              setValue={setValue}
            />
          </m.div>
        ))}
      </AnimatePresence>

      <aside
        aria-label="Acciones rápidas del editor"
        className="quiz-editor-sticky-actions"
      >
        <span>
          {questionFields.length}{' '}
          {questionFields.length === 1 ? 'pregunta' : 'preguntas'}
        </span>
        <Button onClick={addQuestion} type="button">
          <FontAwesomeIcon aria-hidden="true" icon={faPlus} />
          <span>Nueva pregunta</span>
        </Button>
      </aside>

      {errors.questions?.root?.message && (
        <p className="field__error" role="alert">
          {errors.questions.root.message}
        </p>
      )}

      {showError && (
        <ErrorMessage title={errorTitle}>
          Revisa los datos o intenta guardar nuevamente.
        </ErrorMessage>
      )}
      {successMessage && (
        <p className="state-message state-message--success" role="status">
          {successMessage}
        </p>
      )}

      <div className="quiz-editor-submit">
        <Link className="button button--secondary" to={cancelTo}>
          Cancelar
        </Link>
        <Button isLoading={isPending} type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
