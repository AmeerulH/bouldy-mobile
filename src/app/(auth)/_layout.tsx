import { PageMotion } from '../../components/page-motion';
import { Stack,Redirect } from 'expo-router';
import { PageLoader } from '../../components/page-loader';
import { AppError } from '../../features/app-error';
import { useAuth } from '../../platform/auth';
export default function Layout() {
  const auth = useAuth();
  if (!auth.ready) return <PageLoader label="Preparing Bouldy…" />;
  // A signed-in visit to login or signup goes home, ahead of any session error.
  if (auth.user) return <Redirect href="/" />;
  if (auth.hydrationError) return <AppError retry={auth.retry} />;
  return (
    <PageMotion>
      <Stack screenOptions={{ headerShown: false, animation: "none" }} />
    </PageMotion>
  );
}

export { BouldyErrorBoundary as ErrorBoundary } from '../../components/error-boundary';
