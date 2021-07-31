import Link from "next/link";
import { signIn, signOut, userSession } from "../Stacks";

const NavLinks = (props) => {
  return (
    <div>
      <Link href="/about">
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
      <Link href="/cities">
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
      <Link href="https://docs.citycoins.co/">
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
        <button onClick={() => { props.isMobile && props.closeMobileMenu(); signIn();}}>
            Connect
          </button>
      )}
      {userSession.isUserSignedIn() && (
          <button onClick={() => {props.isMobile && props.closeMobileMenu(); signOut();}}>
            Sign Out
          </button>
      )}
    </div>
  );
};

export default NavLinks;