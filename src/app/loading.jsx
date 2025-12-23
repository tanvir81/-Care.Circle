export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="flex flex-col items-center space-y-6">
        {/* Premium Animation */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-4 border-4 border-secondary/20 rounded-full"></div>
          <div className="absolute inset-4 border-4 border-secondary border-b-transparent rounded-full animate-spin [animation-duration:1.5s] [animation-direction:reverse]"></div>
        </div>
        
        {/* Brand/Text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black tracking-tighter text-foreground">
            Care<span className="text-primary italic">.Circle</span>
          </h2>
          <div className="flex items-center gap-1 justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              ></div>
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 mt-4">
            Preparing your experience
          </p>
        </div>
      </div>
    </div>
  );
}
