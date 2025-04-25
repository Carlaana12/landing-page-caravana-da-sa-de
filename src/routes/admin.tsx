import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import LoginPage from '@/pages/admin/login';
import DashboardPage from '@/pages/admin/dashboard';
import PostsPage from '@/pages/admin/posts';
import UsersPage from '@/pages/admin/users';
import SettingsPage from '@/pages/admin/settings';

export const adminRouter = createBrowserRouter([
  {
    path: '/admin/login',
    element: <LoginPage />
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'posts',
        element: <PostsPage />
      },
      {
        path: 'users',
        element: <UsersPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      }
    ]
  }
]); 