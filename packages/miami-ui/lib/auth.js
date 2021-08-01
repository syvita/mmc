import { useCallback } from 'react';
import { AppConfig, UserSession } from '@stacks/connect-react';
import { showConnect } from '@stacks/connect';
import { atom, useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { getUserData } from '@stacks/connect-react';
import Router from "next/router";

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSessionState = atom(new UserSession({ appConfig }));
export const userDataState = atom();
export const authResponseState = atom();

export const useConnect = () => {
  const [userSession] = useAtom(userSessionState);
  const setUserData = useUpdateAtom(userDataState);
  const setAuthResponse = useUpdateAtom(authResponseState);

  const onFinish = async payload => {
    setAuthResponse(payload.authResponse);
    const userData = await payload.userSession.loadUserData();
    setUserData(userData);
    Router.reload(window.location.pathname);
      
  };

  const authOptions = {
    onFinish,
    userSession, // usersession is already in state, provide it here
    redirectTo: '/',
    appDetails: {
      name: 'MiamiCoin',
      icon: 'https://x.syvita.org/miamicoin.svg',
    },
  };

  const userData = () => {
    getUserData(userSession);
  };

  const handleOpenAuth = () => {
    showConnect(authOptions);
  };

  const handleSignOut = useCallback(() => {
    userSession?.signUserOut('/');
  }, [userSession]);

  return { userData, handleOpenAuth, handleSignOut, authOptions };
};
