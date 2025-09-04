import { Link } from "wouter";
import { CalendarDaysIcon, MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";

export default function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-red-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <CalendarDaysIcon className="h-6 w-6 text-white" />
              <h1 className="ml-2 text-xl font-bold text-white">Own Your Day</h1>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><Link href="/how-it-works" className="text-white hover:text-neutral-200 text-sm font-medium">How It Works</Link></li>
            <li><Link href="/about" className="text-white hover:text-neutral-200 text-sm font-medium">About Us</Link></li>
            <li><Link href="/faq" className="text-white hover:text-neutral-200 text-sm font-medium">FAQ</Link></li>
          </ul>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            className="text-white p-2 rounded-md focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-red-700">
          <div className="px-4 py-2 space-y-3">
            <Link href="/how-it-works" className="block text-white hover:text-neutral-200 text-sm font-medium py-2">How It Works</Link>
            <Link href="/about" className="block text-white hover:text-neutral-200 text-sm font-medium py-2">About Us</Link>
            <Link href="/faq" className="block text-white hover:text-neutral-200 text-sm font-medium py-2">FAQ</Link>
          </div>
        </div>
      )}
    </header>
  );
}
