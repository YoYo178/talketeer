import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GuestLayout } from './layouts/GuestLayout.tsx';
import { Provider } from 'react-redux'
import { store } from './store/index.ts'
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

import { UserRoute } from './components/auth/UserRoute.tsx';
import { GuestRoute } from './components/auth/GuestRoute.tsx';

import { LandingPage, Auth } from './pages/guest';
import { Chat } from './pages/user';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
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
      </Provider>
    </ErrorBoundary>
  )
}

export default App