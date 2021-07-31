import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import Router from "next/router";

const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig });

export function signIn() {
  showConnect({
    appDetails: {
      name: "MiamiCoin",
      icon: "/miamicoin.svg",
    },
    onFinish: () => {
      Router.reload(window.location.pathname);
    },
    userSession: userSession,
  });
}

export function signOut() {
  userSession.signUserOut();
  Router.reload(window.location.pathname);
}

export function getUserData() {
  return userSession.loadUserData();
}


