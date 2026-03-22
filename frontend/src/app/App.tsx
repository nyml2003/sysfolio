import { BrowserRouter } from 'react-router-dom';

import { AppProviders } from '@/app/providers/AppProviders';
import { OverviewShell } from '@/site/overview/OverviewShell';
import { none } from '@/shared/lib/monads/option';

export function App() {
  return (
    <AppProviders repository={none()}>
      <BrowserRouter>
        <OverviewShell />
      </BrowserRouter>
    </AppProviders>
  );
}
