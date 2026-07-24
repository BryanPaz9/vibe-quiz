import { zodResolver } from '@hookform/resolvers/zod';
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
    <fieldset className="panel quiz-editor-question">
      <legend>Pregunta {index + 1}</legend>
      <div className="quiz-editor-toolbar">
        <Button
          disabled={isFirst}
          onClick={onMoveUp}
          type="button"
          variant="secondary"
        >
          Subir pregunta
        </Button>
        <Button
          disabled={isLast}
          onClick={onMoveDown}
          type="button"
          variant="secondary"
        >
          Bajar pregunta
        </Button>
        <Button onClick={onRemove} type="button" variant="danger">
          Eliminar pregunta
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
        {optionFields.map((field, optionIndex) => (
          <div className="quiz-editor-option" key={field.id}>
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
                errors.questions?.[index]?.options?.[optionIndex]?.text?.message
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
                <span aria-hidden="true">⬆️</span>
              </Button>
              <Button
                aria-label="Bajar opción"
                disabled={optionIndex === optionFields.length - 1}
                onClick={() => moveOption(optionIndex, optionIndex + 1)}
                title="Bajar opción"
                type="button"
                variant="secondary"
              >
                <span aria-hidden="true">⬇️</span>
              </Button>
              <Button
                disabled={optionFields.length <= 2}
                onClick={() => removeOption(optionIndex)}
                type="button"
                variant="danger"
              >
                Eliminar opción
              </Button>
            </div>
          </div>
        ))}
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
          Agregar opción
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
        <Button
          onClick={() => appendQuestion(emptyQuestion)}
          type="button"
          variant="secondary"
        >
          Agregar pregunta
        </Button>
      </div>

      {questionFields.map((field, index) => (
        <QuestionEditor
          control={control}
          errors={errors}
          index={index}
          isFirst={index === 0}
          isLast={index === questionFields.length - 1}
          key={field.id}
          onMoveDown={() => moveQuestion(index, index + 1)}
          onMoveUp={() => moveQuestion(index, index - 1)}
          onRemove={() => removeQuestion(index)}
          register={register}
          setValue={setValue}
        />
      ))}

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
