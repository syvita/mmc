import Link from 'next/link';
import { useConnect, userSessionState } from '../../lib/auth';
import { useAtom } from 'jotai';

const NavLinks = (props) => {
  const { handleOpenAuth } = useConnect();
  const { handleSignOut } = useConnect();
  const [userSession] = useAtom(userSessionState);
  
  return (
    <div>
      <Link href="/about" passHref={true}>
        <a onClick={() => props.isMobile && props.closeMobileMenu()}>
          {props.isMobile && (
            <img
              src="/LinkImages/cycles.svg"
              height="18px"
              width="18px"
              alt="Cycles"
            />
          )}
          About
        </a>
      </Link>
      <Link href="https://docs.citycoins.co/" passHref={true}>
        <a onClick={() => props.isMobile && props.closeMobileMenu()}>
          {props.isMobile && (
            <img
              src="/LinkImages/security.svg"
              height="18px"
              width="18px"
              alt="Security"
            />
          )}
          Cities
        </a>
      </Link>
      <Link href="https://docs.citycoins.co/" passHref={true}>
        <a onClick={() => props.isMobile && props.closeMobileMenu()}>
          {props.isMobile && (
            <img
              src="/LinkImages/docs.svg"
              height="18px"
              width="18px"
              alt="Docs"
            />
          )}
          Docs
        </a>
      </Link>
      {!userSession.isUserSignedIn() && (
        <button
          onClick={() => {
            props.isMobile && props.closeMobileMenu();
            handleOpenAuth();
          }}
        >
          Connect
        </button>
      )}
      {userSession.isUserSignedIn() && (
        <button
          onClick={() => {
            props.isMobile && props.closeMobileMenu();
            handleSignOut();
          }}
        >
          Sign Out
        </button>
      )}
    </div>
  );
};

export default NavLinks;
