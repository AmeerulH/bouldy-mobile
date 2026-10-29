import type { ErrorBoundaryProps } from 'expo-router';
import { TransportError } from '../data/client';
import { AppError } from '../features/app-error';
import { NotFound } from './not-found';
export function BouldyErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  if (error instanceof TransportError && [400, 404].includes(error.status)) return <NotFound />;
  return <AppError retry={retry} />;
}
