import { BrowserRouter } from 'react-router-dom';

import { AppProviders } from '@/app/providers/AppProviders';
import { none } from '@/shared/lib/monads/option';
import { AppShell } from './AppShell';

export function App() {
  return (
    <AppProviders repository={none()}>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProviders>
  );
}
