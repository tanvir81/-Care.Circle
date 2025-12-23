"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    image: "/banner.jpg",
    title: "Compassionate Care for Your Loved Ones",
    description: "Professional care services for your family members, ensuring they receive the best attention and support they deserve."
  },
  {
    image: "/baby-hero.jpg",
    title: "Expert Baby Sitting You Can Trust",
    description: "Our certified babysitters provide a safe, fun, and nurturing environment for your little ones while you're away."
  },
  {
    image: "/sick-hero.jpg",
    title: "Dedicated Support for Your Recovery",
    description: "Skilled nursing and home assistance to help your loved ones recover in the comfort of their own home."
  }
];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[600px] w-full overflow-hidden bg-muted flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="w-full"
        >
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
            {/* Text Content */}
            <div className="space-y-8 relative z-10 order-2 lg:order-1">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-[10px] font-black tracking-[0.2em] uppercase mb-4">
                  Welcome to Care.Circle
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight">
                  {slides[current].title.split(' ').map((word, i) => (
                    <span key={i} className={i >= slides[current].title.split(' ').length - 2 ? "text-primary" : ""}>
                      {word}{' '}
                    </span>
                  ))}
                </h1>
              </motion.div>

              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-lg md:text-xl text-foreground/60 leading-relaxed max-w-xl"
              >
                {slides[current].description}
              </motion.p>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <Link 
                  href="/#services" 
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-primary/20 uppercase tracking-widest text-xs"
                >
                  Explore Services
                </Link>
                <Link 
                  href="/#about" 
                  className="bg-white border border-primary/10 text-foreground px-8 py-4 rounded-2xl font-black hover:bg-muted transition-all duration-300 uppercase tracking-widest text-xs"
                >
                  Our Story
                </Link>
              </motion.div>
            </div>

            {/* Image Container - Fixed the "Zoomed In" issue by using object-contain in a balanced frame */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="relative aspect-[4/3] lg:aspect-square w-full order-1 lg:order-2"
            >
              <div className="absolute inset-0 bg-primary/5 rounded-[3rem] -rotate-3 transition-transform group-hover:rotate-0 duration-500"></div>
              <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src={slides[current].image} 
                  alt={slides[current].title} 
                  className="w-full h-full object-cover" 
                />
                {/* Very subtle overlay as requested */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating Decorative Element */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-primary/10 hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Trust Score</p>
                    <p className="text-lg font-black text-foreground">100% Secure</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-4 md:left-auto md:right-20 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === current ? "w-10 bg-primary shadow-lg shadow-primary/30" : "w-3 bg-foreground/10 hover:bg-foreground/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
