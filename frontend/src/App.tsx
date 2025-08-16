import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';

import { LandingPage, Auth } from './pages';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename='/talketeer/'>
        <RootLayout>
          <Routes>
            <Route index element={<LandingPage />} />
            <Route path='/auth' element={<Auth />} />
          </Routes>
        </RootLayout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App