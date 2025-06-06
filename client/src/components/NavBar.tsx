import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useScrollThreshold } from '@/hooks/use-scroll';
import { scrollToElement } from '@/lib/utils';
import { useLocation, useRoute } from 'wouter';
import { Link } from 'wouter';
import { SiDiscord, SiInstagram, SiYoutube, SiWhatsapp } from 'react-icons/si';
import { motion } from 'framer-motion';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolled = useScrollThreshold(50);
  const [location, setLocation] = useLocation();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMenuOpen && !target.closest('#mobile-menu') && !target.closest('#mobile-menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavLinkClick = (id: string) => {
    setIsMenuOpen(false);
    if (location !== '/') {
      setLocation(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  const navigateToLearnMore = () => {
    setIsMenuOpen(false);
    window.location.href = '/learn-more';
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled && "bg-background shadow-md"
    )}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a 
          href="#home" 
          className="flex items-center z-10"
          onClick={(e) => { e.preventDefault(); handleNavLinkClick('home'); }}
        >
          <span className="text-primary font-orbitron text-xl md:text-2xl font-bold tracking-wider">
            PRO BOOYAH <span className="text-secondary">LEAGUE</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center max-w-[calc(100vw-400px)] overflow-x-auto scrollbar-hide">
          <div className="flex items-center space-x-8 px-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'register', label: 'Register' },
              { id: 'about', label: 'About' },
              { id: 'rules', label: 'Rules' },
              { id: 'prizes', label: 'Prizes' },
              { id: 'leaderboard', label: 'Leaderboard' },
              { id: 'community', label: 'Community' },
              { id: 'support', label: 'Support' }
            ].map(item => (
              <a 
                key={item.id}
                href={location === '/' ? `#${item.id}` : `/?scrollTo=${item.id}`}
                className="nav-link text-foreground hover:text-primary transition-colors duration-300 whitespace-nowrap"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavLinkClick(item.id);
                }}
              >
                {item.label}
              </a>
            ))}

            <Link 
              href="/learn-more"
              className="nav-link text-foreground hover:text-secondary transition-colors duration-300 whitespace-nowrap"
            >
              Learn More
            </Link>

            <button 
              onClick={() => handleNavLinkClick('register')}
              className="bg-primary text-primary-foreground py-2 px-6 rounded font-orbitron font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all duration-300 glow-btn whitespace-nowrap ml-4"
            >
              Join Now
            </button>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button 
          id="mobile-menu-button"
          className="lg:hidden z-10 w-10 h-10 flex flex-col justify-center items-center"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={cn(
            "block w-8 h-1 bg-foreground mb-2 transition-transform duration-300",
            isMenuOpen && "translate-y-3 rotate-45"
          )} />
          <span className={cn(
            "block w-8 h-1 bg-foreground mb-2 transition-opacity duration-300",
            isMenuOpen && "opacity-0"
          )} />
          <span className={cn(
            "block w-8 h-1 bg-foreground transition-transform duration-300",
            isMenuOpen && "-translate-y-3 -rotate-45"
          )} />
        </button>

        {/* Mobile Menu */}
        <div 
          id="mobile-menu"
          className={cn(
            "fixed top-0 right-0 bottom-0 w-3/4 bg-background bg-opacity-95 z-40 p-8 lg:hidden flex flex-col shadow-2xl transform transition-transform duration-500",
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 right-6 text-foreground hover:text-primary transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h2 className="text-2xl font-orbitron font-bold mb-8">
              <span className="text-primary">PRO BOOYAH</span>{" "}
              <span className="text-secondary">LEAGUE</span>
            </h2>

            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2
                  }
                }
              }}
              initial="hidden"
              animate={isMenuOpen ? "visible" : "hidden"}
              className="mt-8 flex flex-col space-y-6"
            >
              {[
                { id: 'home', label: 'Home', path: '/' },
                { id: 'register', label: 'Register', path: '/register' },
                { id: 'about', label: 'About', path: '/' },
                { id: 'rules', label: 'Rules', path: '/rules' },
                { id: 'prizes', label: 'Prizes', path: '/' },
                { id: 'leaderboard', label: 'Leaderboard', path: '/' },
                { id: 'community', label: 'Community', path: '/' },
                { id: 'support', label: 'Support', path: '/support' }
              ].map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, x: 50 },
                    visible: { 
                      opacity: 1, 
                      x: 0,
                      transition: {
                        duration: 0.4,
                        ease: "easeOut"
                      }
                    }
                  }}
                  className="w-full"
                >
                  {item.path === '/' ? (
                    <a 
                      href={`#${item.id}`}
                      className="nav-link text-foreground hover:text-primary transition-colors duration-300 block w-full px-4 text-lg text-left font-medium items-center"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavLinkClick(item.id);
                      }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link 
                      href={item.path}
                      className="nav-link text-foreground hover:text-primary transition-colors duration-300 block w-full px-4 text-lg text-left font-medium items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}

              <motion.div
                variants={{
                  hidden: { opacity: 0, x: 50 },
                  visible: { 
                    opacity: 1, 
                    x: 0,
                    transition: {
                      duration: 0.4,
                      ease: "easeOut"
                    }
                  }
                }}
              >
                <Link
                  href="/learn-more"
                  className="text-xl font-orbitron text-foreground hover:text-secondary transition-colors duration-300 border-b border-muted pb-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Learn More
                </Link>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, x: 50 },
                  visible: { 
                    opacity: 1, 
                    x: 0,
                    transition: {
                      duration: 0.4,
                      ease: "easeOut",
                      delay: 0.2
                    }
                  }
                }}
                className="w-full"
              >
                <Link
                  href="/register"
                  className="mt-4 bg-primary text-primary-foreground py-3 px-8 rounded font-orbitron font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all duration-300 glow-btn text-center block w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join Now
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.4,
                    ease: "easeOut",
                    delay: 0.3
                  }
                }
              }}
              initial="hidden"
              animate={isMenuOpen ? "visible" : "hidden"}
              className="mt-auto"
            >
              <div className="flex items-center justify-start space-x-6 mt-8">
                <a href="https://youtube.com/@macrostrom?si=rtljS-G3zyMA-awv" className="text-foreground hover:text-primary text-2xl transition-colors duration-300">
                  <SiYoutube />
                </a>
                <a href="https://whatsapp.com/channel/0029VbAc0D82v1IvjhgviA2x" className="text-foreground hover:text-primary text-2xl transition-colors duration-300">
                  <SiWhatsapp />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}