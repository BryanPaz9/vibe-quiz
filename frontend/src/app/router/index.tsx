import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { AdminLayout } from '@/app/layouts/AdminLayout';
import { RootLayout } from '@/app/layouts/RootLayout';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import LoginPage from '@/features/auth/pages/LoginPage';
import QuizEntryPage from '@/features/participation/pages/QuizEntryPage';
import QuizPlayPage from '@/features/participation/pages/QuizPlayPage';
import {
  AdminRankingPage,
  QuizCreatePage,
  QuizDetailPage,
  QuizListPage,
  QuizResultsPage,
} from '@/features/quizzes/pages/AdminQuizPages';
import RankingPage from '@/features/ranking/pages/RankingPage';
import ResultPage from '@/features/results/pages/ResultPage';
import HomePage from '@/shared/pages/HomePage';
import NotFoundPage from '@/shared/pages/NotFoundPage';

export const appRoutes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'quiz/:publicId', element: <QuizEntryPage /> },
      { path: 'quiz/:publicId/play', element: <QuizPlayPage /> },
      {
        path: 'quiz/:publicId/result/:participationId',
        element: <ResultPage />,
      },
      { path: 'quiz/:publicId/ranking', element: <RankingPage /> },
      { path: 'admin/login', element: <LoginPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: 'admin/quizzes', element: <QuizListPage /> },
              { path: 'admin/quizzes/new', element: <QuizCreatePage /> },
              { path: 'admin/quizzes/:id', element: <QuizDetailPage /> },
              {
                path: 'admin/quizzes/:id/results',
                element: <QuizResultsPage />,
              },
              {
                path: 'admin/quizzes/:id/ranking',
                element: <AdminRankingPage />,
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(appRoutes);
