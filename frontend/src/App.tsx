import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GuestLayout } from './layouts/GuestLayout.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

import { UserRoute } from './components/auth/UserRoute.tsx';
import { GuestRoute } from './components/auth/GuestRoute.tsx';

import { LandingPage, Auth } from './pages/guest';
import { Chat } from './pages/user';
import { useSettingsStore } from './hooks/state/useSettingsStore.ts';
import { useEffect } from 'react';

const queryClient = new QueryClient();

const THEME_STORAGE_KEY = 'theme-preference'

function App() {
  const { isDark } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add("dark")
      window.localStorage.setItem(THEME_STORAGE_KEY, "dark")
    } else {
      root.classList.remove("dark")
      window.localStorage.setItem(THEME_STORAGE_KEY, "light")
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
            <Route element={<GuestRoute />}>
              <Route element={<GuestLayout />}>
                <Route index element={<LandingPage />} />
                <Route path='/auth' element={<Auth />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App