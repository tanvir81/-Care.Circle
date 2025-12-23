"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  const isActive = (path) => pathname === path;
  const isAdminPath = pathname === "/manage-bookings" || pathname === "/add-service";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAdminOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = (path) => 
    `px-3 py-2 text-sm font-bold transition-all duration-300 relative group ${
      isActive(path) 
        ? "text-primary" 
        : "text-foreground/60 hover:text-primary"
    }`;

  const mobileNavLinkClass = (path) => 
    `block px-4 py-4 text-base font-bold rounded-2xl transition-all duration-300 ${
      isActive(path) 
        ? "text-primary bg-primary/10 border-l-4 border-primary" 
        : "text-foreground/60 hover:text-primary hover:bg-muted"
    }`;

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-primary/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 relative flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <img src="/logo.png" alt="Care.Circle Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                Care.Circle
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex sm:ml-6 sm:space-x-4 items-center h-full">
            <Link href="/" className={navLinkClass("/")}>
              Home
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${isActive("/") ? "scale-x-100" : ""}`} />
            </Link>
            <Link href="/#services" className={navLinkClass("/#services")}>
              Services
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
            
            {session && (
              <>
                {session.user.role !== "admin" && (
                  <Link href="/my-bookings" className={navLinkClass("/my-bookings")}>
                    My Bookings
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${isActive("/my-bookings") ? "scale-x-100" : ""}`} />
                  </Link>
                )}
                
                {session.user.role === "admin" && (
                  <div className="relative h-full flex items-center" ref={dropdownRef}>
                    <button
                      onClick={() => setIsAdminOpen(!isAdminOpen)}
                      className={`flex items-center space-x-1 px-3 py-2 text-sm font-bold transition-all duration-300 h-full ${
                        isAdminPath 
                          ? "text-primary" 
                          : "text-foreground/60 hover:text-primary"
                      }`}
                    >
                      <span>Dashboard</span>
                      <svg className={`w-4 h-4 transition-transform ${isAdminOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Desktop Dropdown */}
                    <AnimatePresence>
                      {isAdminOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full right-0 w-56 mt-2 bg-white border border-primary/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                        >
                          <Link 
                            href="/manage-bookings" 
                            onClick={() => setIsAdminOpen(false)}
                            className={`block px-5 py-4 text-sm font-bold transition-colors ${isActive("/manage-bookings") ? "text-primary bg-primary/10" : "text-foreground/70 hover:bg-muted hover:text-primary"}`}
                          >
                            Manage All Bookings
                          </Link>
                          <Link 
                            href="/add-service" 
                            onClick={() => setIsAdminOpen(false)}
                            className={`block px-5 py-4 text-sm font-bold transition-colors ${isActive("/add-service") ? "text-primary bg-primary/10" : "text-foreground/70 hover:bg-muted hover:text-primary"}`}
                          >
                            Add New Service
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}
            
            {session ? (
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-primary/10">
                <div className="flex flex-col items-end">
                  <span className="text-sm text-foreground font-black whitespace-nowrap">Hi, {session.user.name}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-black hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-primary/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-6">
                <Link href="/login" className="px-6 py-2.5 text-sm font-bold text-foreground/70 hover:text-primary hover:bg-primary/10 rounded-xl transition-all duration-300">Login</Link>
                <Link href="/register" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-black hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-primary/20">
                  Join Circle
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-2xl text-foreground/60 hover:bg-muted hover:text-primary transition-all duration-300"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" 
                  />
                ) : (
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" 
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-primary/10 overflow-hidden bg-white shadow-2xl"
          >
            <div className="px-4 pt-4 pb-8 space-y-2">
              <Link href="/" onClick={() => setIsOpen(false)} className={mobileNavLinkClass("/")}>Home</Link>
              <Link href="/#services" onClick={() => setIsOpen(false)} className={mobileNavLinkClass("/#services")}>Services</Link>
              
              {session && (
                <>
                  <div className="border-t border-primary/5 my-4"></div>
                  {session.user.role !== "admin" && (
                    <Link href="/my-bookings" onClick={() => setIsOpen(false)} className={mobileNavLinkClass("/my-bookings")}>My Bookings</Link>
                  )}
                  
                  {session.user.role === "admin" && (
                    <div className="space-y-1 py-2">
                      <p className="px-4 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-3">Admin Portal</p>
                      <Link href="/manage-bookings" onClick={() => setIsOpen(false)} className={mobileNavLinkClass("/manage-bookings")}>Manage All Bookings</Link>
                      <Link href="/add-service" onClick={() => setIsOpen(false)} className={mobileNavLinkClass("/add-service")}>Add New Service</Link>
                    </div>
                  )}
                </>
              )}

              <div className="border-t border-primary/10 pt-8 mt-6">
                {session ? (
                  <div className="space-y-4 px-2">
                    <p className="px-2 text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Profile</p>
                    <div className="p-4 flex items-center justify-between bg-muted rounded-2xl border border-primary/5">
                       <span className="text-foreground font-black">{session.user.name}</span>
                       <button
                        onClick={() => { setIsOpen(false); signOut(); }}
                        className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-primary/10"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 px-2">
                    <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center py-4 px-4 bg-muted text-foreground font-black rounded-2xl transition-all">Login</Link>
                    <Link href="/register" onClick={() => setIsOpen(false)} className="flex items-center justify-center py-4 px-4 bg-primary text-primary-foreground rounded-2xl font-black shadow-lg shadow-primary/20 transition-all">Join Circle</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
