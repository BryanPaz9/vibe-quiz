import { TransformFnParams } from 'class-transformer';

export function trimString({ value }: TransformFnParams): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export function normalizeSpaces({ value }: TransformFnParams): unknown {
  return typeof value === 'string' ? value.trim().replace(/\s+/gu, ' ') : value;
}
