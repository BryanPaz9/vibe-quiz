import { z } from 'zod';

const optionSchema = z.object({
  isCorrect: z.boolean(),
  text: z
    .string()
    .trim()
    .min(1, 'Escribe el texto de la opción.')
    .max(500, 'La opción no puede superar 500 caracteres.'),
});

const questionSchema = z.object({
  options: z
    .array(optionSchema)
    .min(2, 'Agrega al menos dos opciones.')
    .refine(
      (options) => options.filter((option) => option.isCorrect).length === 1,
      'Selecciona exactamente una respuesta correcta.',
    ),
  text: z
    .string()
    .trim()
    .min(1, 'Escribe el texto de la pregunta.')
    .max(1000, 'La pregunta no puede superar 1000 caracteres.'),
});

export const quizContentSchema = z.object({
  description: z
    .string()
    .trim()
    .max(1000, 'La descripción no puede superar 1000 caracteres.'),
  questions: z.array(questionSchema).min(1, 'Agrega al menos una pregunta.'),
  title: z
    .string()
    .trim()
    .min(1, 'Escribe el título del cuestionario.')
    .max(160, 'El título no puede superar 160 caracteres.'),
});

export type QuizContentFormValues = z.infer<typeof quizContentSchema>;

export const emptyQuestion: QuizContentFormValues['questions'][number] = {
  text: '',
  options: [
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
  ],
};
