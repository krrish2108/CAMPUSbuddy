import React from 'react';
import { UserArenaProvider } from './UserArenaContext';
import { UserCaffinityProvider } from './UserCaffinityContext';
import { UserInboxProvider } from './UserInboxContext';
import { UserProblemBoxProvider } from './UserProblemBoxContext';
import { UserShopperzProvider } from './UserShopperzContext';
import { UserUAssistProvider } from './UserUAssistContext';
import { UserProfileProvider } from './UserProfileContext';

export default function UserProviders({ children }) {
  return (
    <UserProfileProvider>
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
    </UserProfileProvider>
  );
}
