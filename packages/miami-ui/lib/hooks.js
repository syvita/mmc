import { getUserData } from '@stacks/connect-react';

import { useState, useEffect } from 'react';

export function useStxAddresses(userSession) {
  const [ownerStxAddress, setOwnerStxAddress] = useState();
  useEffect(() => {
    if (userSession && userSession.isUserSignedIn()) {
      getUserData(userSession).then(userData => {
          setOwnerStxAddress(userData.profile.stxAddress.testnet);
      });
    }
  }, [userSession]);
    
  return { ownerStxAddress };
}
