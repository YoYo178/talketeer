import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { GuestLayout } from './layouts/GuestLayout.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

import { UserRoute } from './components/wrappers/UserRoute.tsx';
import { GuestRoute } from './components/wrappers/GuestRoute.tsx';

import { LandingPage, AuthPage, VerifyPage, ResetPage, GoogleSuccessPage } from './pages/guest';
import { Chat } from './pages/user';
import { useSettingsStore } from './hooks/state/useSettingsStore.ts';
import { useEffect } from 'react';
import { NotFound } from './pages/NotFound.tsx';

const queryClient = new QueryClient();

const THEME_STORAGE_KEY = 'theme-preference'

function App() {
  const { isDark } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      window.localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    } else {
      root.classList.remove('dark')
      window.localStorage.setItem(THEME_STORAGE_KEY, 'light')
    }
  }, [isDark]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        <BrowserRouter basename='/talketeer/'>
          <Routes>
            <Route element={<UserRoute />}>
              <Route path='/chat' element={<Chat />} />
            </Route>

            <Route element={<GuestLayout />}>
              <Route index element={<LandingPage />} />
              <Route element={<GuestRoute />}>
                <Route path='/auth' element={<AuthPage />}>
                  <Route path='login' element={<Outlet />} /> {/* Handled by the parent AuthPage component */}
                  <Route path='signup' element={<Outlet />} /> {/* Handled by the parent AuthPage component */}
                  <Route path='reset' element={<ResetPage />} />
                  <Route path='verify' element={<VerifyPage />} />
                  <Route path='google-success' element={<GoogleSuccessPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="/*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App