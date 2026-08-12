import React from 'react';
import { AdminArenaProvider } from './AdminArenaContext';
import { AdminCaffinityProvider } from './AdminCaffinityContext';
import { AdminInboxProvider } from './AdminInboxContext';
import { AdminProblemBoxProvider } from './AdminProblemBoxContext';
import { AdminShopperzProvider } from './AdminShopperzContext';
import { AdminUAssistProvider } from './AdminUAssistContext';
import { AdminProfileProvider } from './AdminProfileContext';

export default function AdminProviders({ children }) {
  return (
    <AdminProfileProvider>
      <AdminCaffinityProvider>
        <AdminArenaProvider>
          <AdminProblemBoxProvider>
            <AdminInboxProvider>
              <AdminShopperzProvider>
                <AdminUAssistProvider>
                  {children}
                </AdminUAssistProvider>
              </AdminShopperzProvider>
            </AdminInboxProvider>
          </AdminProblemBoxProvider>
        </AdminArenaProvider>
      </AdminCaffinityProvider>
    </AdminProfileProvider>
  );
}
