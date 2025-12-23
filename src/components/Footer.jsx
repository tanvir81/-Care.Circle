export default function Footer() {
  return (
    <footer className="bg-muted border-t border-primary/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 relative flex items-center justify-center">
                <img src="/logo.png" alt="Care.Circle Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-black tracking-tight text-foreground">
                Care.Circle
              </span>
            </div>
            <p className="text-foreground/60 text-sm max-w-sm leading-relaxed">
              We believe in providing more than just a service; we provide peace of mind. Our community of certified caregivers is dedicated to the well-being of your family.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders could go here */}
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-black text-foreground/30 uppercase tracking-[0.2em] mb-6">
              Circle Links
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="/" className="text-foreground/60 hover:text-primary transition-colors font-bold text-sm">Home</a>
              </li>
              <li>
                <a href="/#services" className="text-foreground/60 hover:text-primary transition-colors font-bold text-sm">Our Services</a>
              </li>
              <li>
                <a href="/#about" className="text-foreground/60 hover:text-primary transition-colors font-bold text-sm">About the Circle</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-foreground/30 uppercase tracking-[0.2em] mb-6">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Email Us</span>
                <span className="text-foreground/70 font-bold text-sm">hello@carecircle.com</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Call Anytime</span>
                <span className="text-foreground/70 font-bold text-sm">+880 1711 000 000</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-primary/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-foreground/40 text-[10px] font-black uppercase tracking-widest text-center md:text-left">
              &copy; 2025 Care.Circle. Professional Caregiving Ecosystem.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-foreground/40 hover:text-primary text-[10px] font-black uppercase tracking-widest transition-colors">Privacy</a>
              <a href="#" className="text-foreground/40 hover:text-primary text-[10px] font-black uppercase tracking-widest transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
