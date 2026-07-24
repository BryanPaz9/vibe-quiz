import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/app/providers/AppProviders';
import { router } from '@/app/router';

export default function App() {
  return (
    <AppProviders>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <RouterProvider router={router} />
        </MotionConfig>
      </LazyMotion>
    </AppProviders>
  );
}
