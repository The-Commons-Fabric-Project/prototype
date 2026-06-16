import { useEffect, useState } from 'react'
import CommonsFabricLogo from '../../assets/CommonsFabricLogo'

export default function Header() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const handleScroll = () => setHidden(window.scrollY > 200)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-sage-border bg-cream/80 backdrop-blur-[10px] transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="max-w-[1040px] mx-auto px-6 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <button className="bg-transparent border-none cursor-pointer flex items-center gap-[10px] p-0">
          <CommonsFabricLogo />
          <span className="text-left leading-[1.1]">
            <span className="block font-fraunces text-[16px] font-semibold text-forest">Commons Fabric</span>
            <span className="block text-[11px] text-sage-muted font-medium">Community Calendar</span>
          </span>
        </button>

        {/* Nav */}
        <nav className="flex gap-[22px] ml-auto mr-2">
          <button className="bg-transparent border-0 border-b-2 border-teal cursor-pointer font-sans text-[14.5px] font-semibold text-forest px-0 py-1">
            Events
          </button>
          <button className="bg-transparent border-0 border-b-2 border-transparent cursor-pointer font-sans text-[14.5px] font-semibold text-sage-muted px-0 py-1">
            Directory
          </button>
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-[10px]">
          <button className="font-sans font-semibold text-[14px] px-[14px] py-2 rounded-[10px] cursor-pointer border border-sage-border bg-transparent text-teal leading-[1.1] tracking-[0.1px]">
            Log in
          </button>
          <button className="font-sans font-semibold text-[14px] px-[14px] py-2 rounded-[10px] cursor-pointer border border-teal bg-teal text-white leading-[1.1] tracking-[0.1px]">
            Create account
          </button>
        </div>

      </div>
    </header>
  )
}
