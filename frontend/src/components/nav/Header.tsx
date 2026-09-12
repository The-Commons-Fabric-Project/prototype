import { useEffect, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'

import CommonsFabricLogo from '../../assets/CommonsFabricLogo'
import Button from '../controls/Button';

import LoginModal from '../modals/LoginModal';
import { useAuth } from '../../hooks/useAuth';
import { useModal } from '../../hooks/useOverlayContext';
import CreateAccountModal from '../modals/CreateAccountModal';

import { COLOR_ORDER, PALETTE } from '../../utils/palette'
const HEADER_STRIPE = COLOR_ORDER.map(x => PALETTE[x]["c1"]);

// ref: https://github.com/david4473/Reciped/blob/main/src/components/Header.tsx

/**
 * Header bar appearing on top of all pages.
 *
 * TODO: replace the CF logo with the RCH logo and move CF's to a footer - blocked
 * on the RCH logo asset.
 */
export default function Header() {
  const [hidden, setHidden] = useState(false);
  const session = useAuth();
  const { location,  } = useRouterState();
  const path = location.pathname;
  
  const { modal, setModal } = useModal();

  useEffect(() => {
    const handleScroll = () => setHidden(window.scrollY > 200)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navClass = (active: boolean) =>
    `no-underline border-b-2 cursor-pointer font-sans text-[14.5px] font-semibold px-0 py-1 bg-transparent transition-colors ${
      active ? 'border-primary text-ink' : 'border-transparent text-muted'
    }`

  const handleLogin = () => { setModal("login"); }
  // logout clears local state before awaiting the server, so the promise is unused.
  const handleLogout = () => { void session.logout(); }
  const handleCreateAccount = () => { setModal("create_account"); }
  const closeModal = () => { setModal(undefined) }

  const renderModal =  () => { 
    // The header only opens the login and create-account modals.
    switch (modal) {
      case "create_account": 
        return <CreateAccountModal onClose={closeModal} />;
      case "login": 
        return <LoginModal onClose={closeModal} />;
      default: 
        return "";
    }
  }

  return (
    <>
    <header className={`sticky top-0 z-50 w-full border-b border-line bg-paper/80 backdrop-blur-[10px] transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="w-full flex gap-0.5">
        {COLOR_ORDER.map((c) => (
          <span key={c} className={`flex-1 h-0.75 bg-cf-${c}`}/>
        ))}
      </div>

      <div className="max-w-260 mx-auto px-6 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="no-underline flex items-center gap-2.5 p-0">
          <CommonsFabricLogo />
          <span className="text-left leading-[1.1]">
            <span className="block font-display text-[16px] font-semibold text-ink">Commons Fabric</span>
            <span className="block text-[11px] text-muted font-medium">Community Calendar</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex gap-5.5 ml-auto mr-2">
          <Link to="/" className={navClass(path === '/')}>Events</Link>
          <Link to="/directory" className={navClass(path === '/directory')}>Directory</Link>
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-2.5">
          {/* While the session is being restored we do not yet know which pair of
              buttons is correct. Rendering the signed-out pair would flash "Log in"
              at an already signed-in user on every refresh, so hold the space instead. */}
          {session.isLoading ? (
            <div className="h-8.5 w-40" aria-hidden />
          ) : session.isAuthenticated ? (
            <>
              <span className="text-[13px] text-ink font-semibold max-w-40 truncate">{session.user?.fullname}</span>
              <button 
                className="font-sans font-semibold text-[14px] px-3.5 py-2 rounded-md cursor-pointer border border-line bg-transparent text-primary leading-[1.1] tracking-[0.1px]"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={handleLogin} className="font-sans font-semibold text-[14px] px-3.5 py-2 rounded-md cursor-pointer border border-line bg-transparent text-primary leading-[1.1] tracking-[0.1px]">Log in</Button>
              <Button className="font-sans font-semibold text-[14px] px-3.5 py-2 rounded-md cursor-pointer border border-primary bg-primary text-white leading-[1.1] tracking-[0.1px]" onClick={handleCreateAccount}>
                Create account
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
    {/* BUG (minor) showLogin never gets set back to false after authenticating */}
    {/* { (showLogin) ? (<LoginModal onClose={closeLogin} />) : ""} */}
    {renderModal()}
   
    </>
  )
}