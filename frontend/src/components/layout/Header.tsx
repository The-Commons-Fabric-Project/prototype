import { useEffect, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import CommonsFabricLogo from '../../assets/CommonsFabricLogo'

export default function Header() {
  const [hidden, setHidden] = useState(false)
  const { location } = useRouterState()
  const path = location.pathname

  useEffect(() => {
    const handleScroll = () => setHidden(window.scrollY > 200)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navClass = (active: boolean) =>
    `no-underline border-b-2 cursor-pointer font-sans text-[14.5px] font-semibold px-0 py-1 bg-transparent transition-colors ${
      active ? 'border-primary text-ink' : 'border-transparent text-muted'
    }`

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-line bg-paper/80 backdrop-blur-[10px] transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="max-w-[1040px] mx-auto px-6 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="no-underline flex items-center gap-[10px] p-0">
          <CommonsFabricLogo />
          <span className="text-left leading-[1.1]">
            <span className="block font-display text-[16px] font-semibold text-ink">Commons Fabric</span>
            <span className="block text-[11px] text-muted font-medium">Community Calendar</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex gap-[22px] ml-auto mr-2">
          <Link to="/" className={navClass(path === '/')}>Events</Link>
          <Link to="/directory" className={navClass(path === '/directory')}>Directory</Link>
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-[10px]">
          <button className="font-sans font-semibold text-[14px] px-[14px] py-2 rounded-[10px] cursor-pointer border border-line bg-transparent text-primary leading-[1.1] tracking-[0.1px]">
            Log in
          </button>
          <button className="font-sans font-semibold text-[14px] px-[14px] py-2 rounded-[10px] cursor-pointer border border-primary bg-primary text-white leading-[1.1] tracking-[0.1px]">
            Create account
          </button>
        </div>

      </div>
    </header>
  )
}
