import { 
  MapPinIcon, 
  PhoneIcon, 
  MailIcon, 
  FacebookIcon, 
  InstagramIcon, 
  TwitterIcon, 
  LinkedinIcon,
  ChevronDownIcon
} from "lucide-react";
import { useState } from "react";

// Collapsible section for mobile
function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-neutral-800 md:border-none pb-2 md:pb-0">
      <button 
        className="w-full flex items-center justify-between py-3 md:py-0 md:cursor-default"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-sm font-semibold uppercase tracking-wider md:mb-4">{title}</h4>
        <ChevronDownIcon className={`h-4 w-4 md:hidden transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        {children}
      </div>
    </div>
  );
}

export default function AppFooter() {
  return (
    <footer className="bg-neutral-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
          <FooterSection title="About Own Your Day">
            <ul className="space-y-2 py-2 md:py-0">
              <li><a href="#" className="text-sm text-neutral-300 hover:text-white">Our Story</a></li>
              <li><a href="#" className="text-sm text-neutral-300 hover:text-white">How It Works</a></li>
              <li><a href="#" className="text-sm text-neutral-300 hover:text-white">Testimonials</a></li>
              <li><a href="#" className="text-sm text-neutral-300 hover:text-white">Careers</a></li>
            </ul>
          </FooterSection>
          
          <FooterSection title="Resources">
            <ul className="space-y-2 py-2 md:py-0">
              <li><a href="#" className="text-sm text-neutral-300 hover:text-white">Credit Education</a></li>
              <li><a href="#" className="text-sm text-neutral-300 hover:text-white">Financial Calculators</a></li>
              <li><a href="#" className="text-sm text-neutral-300 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-sm text-neutral-300 hover:text-white">FAQ</a></li>
            </ul>
          </FooterSection>
          
          <FooterSection title="Legal">
            <ul className="space-y-2 py-2 md:py-0">
              <li><a href="#" className="text-sm text-neutral-300 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-neutral-300 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-neutral-300 hover:text-white">Cookie Policy</a></li>
              <li><a href="#" className="text-sm text-neutral-300 hover:text-white">FCRA Disclosure</a></li>
            </ul>
          </FooterSection>
          
          <FooterSection title="Contact Us">
            <ul className="space-y-2 py-2 md:py-0">
              <li className="flex items-start text-sm text-neutral-300">
                <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>123 Finance St, Suite 100<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center text-sm text-neutral-300">
                <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>1-800-555-LOAN</span>
              </li>
              <li className="flex items-center text-sm text-neutral-300">
                <MailIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>support@ownyourday.com</span>
              </li>
            </ul>
          </FooterSection>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-400">© {new Date().getFullYear()} Own Your Day. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-neutral-400 hover:text-white">
              <span className="sr-only">Facebook</span>
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-400 hover:text-white">
              <span className="sr-only">Instagram</span>
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-400 hover:text-white">
              <span className="sr-only">Twitter</span>
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-400 hover:text-white">
              <span className="sr-only">LinkedIn</span>
              <LinkedinIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
