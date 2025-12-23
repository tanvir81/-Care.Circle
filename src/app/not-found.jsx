"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center overflow-hidden">
      {/* Decorative background elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10"
      />

      <div className="relative">
        <motion.h1 
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="text-[12rem] md:text-[20rem] font-black text-primary leading-none tracking-tighter"
        >
          404
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="bg-white/40 backdrop-blur-md px-8 py-2 rounded-full border border-white/20 shadow-2xl">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground">Lost in space</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 space-y-6"
      >
        <h2 className="text-3xl md:text-4xl font-black text-foreground">
          Where <span className="text-primary italic">are you?</span>
        </h2>
        <p className="text-foreground/40 max-w-sm mx-auto font-medium leading-relaxed">
          The sanctuary you're looking for seems to have vanished or never existed in this dimension.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12"
      >
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-10 py-5 bg-foreground text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] overflow-hidden shadow-2xl hover:shadow-primary/20 transition-all"
          >
            <div className="absolute inset-0 bg-primary/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
            <span className="relative z-10">Return to Existence</span>
          </motion.div>
        </Link>
      </motion.div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          className="hidden md:block absolute w-2 h-2 bg-primary rounded-full blur-[1px]"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + (i % 3) * 30}%`,
          }}
        />
      ))}
    </div>
  );
}
