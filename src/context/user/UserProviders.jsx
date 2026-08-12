import React from 'react';
import { UserArenaProvider } from './UserArenaContext';
import { UserCaffinityProvider } from './UserCaffinityContext';
import { UserInboxProvider } from './UserInboxContext';
import { UserProblemBoxProvider } from './UserProblemBoxContext';
import { UserShopperzProvider } from './UserShopperzContext';
import { UserUAssistProvider } from './UserUAssistContext';

export default function UserProviders({ children }) {
  return (
    <UserCaffinityProvider>
      <UserArenaProvider>
        <UserProblemBoxProvider>
          <UserInboxProvider>
            <UserShopperzProvider>
              <UserUAssistProvider>
                {children}
              </UserUAssistProvider>
            </UserShopperzProvider>
          </UserInboxProvider>
        </UserProblemBoxProvider>
      </UserArenaProvider>
    </UserCaffinityProvider>
  );
}
