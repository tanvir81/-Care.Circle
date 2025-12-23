import { connectDB } from "@/lib/db";
import { ObjectId } from "mongodb";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const db = await connectDB();
  
  const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
  const service = await db.collection("services").findOne(query);
  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.name} | Care.Circle`,
    description: service.description,
    openGraph: {
      images: [service.image]
    }
  };
}

export default async function ServiceDetail({ params }) {
  const { id } = await params;
  const db = await connectDB();
  
  const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
  const service = await db.collection("services").findOne(query);
  if (!service) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: Image with Decorative Frame */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/5 rounded-[3rem] rotate-3 -z-10"></div>
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white h-[500px] relative">
            <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-primary/20 shadow-lg">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Standard Rate</p>
              <p className="text-2xl font-black text-primary">${service.price}<span className="text-sm text-foreground/40 font-bold">/hr</span></p>
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="space-y-10">
          <div className="space-y-4">
            <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-foreground/40">
               <Link href="/" className="hover:text-primary transition-colors">Home</Link>
               <span>/</span>
               <span className="text-foreground/80">Service Details</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight">{service.name}</h1>
          </div>

          <div className="space-y-6">
            <p className="text-xl text-foreground/60 leading-relaxed font-medium">
              {service.description}
            </p>

            <div className="bg-muted p-10 rounded-[2.5rem] border border-primary/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
               <h3 className="text-sm font-black text-foreground/30 uppercase tracking-[0.3em] mb-4">Detailed Insights</h3>
               <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-line relative z-10">
                 {service.details || "Professional and compassionate care tailored to meet your unique needs. Our verified caregivers ensure a safe and supportive environment for your loved ones."}
               </p>
            </div>
          </div>

          <div className="pt-6">
            <Link
              href={`/booking/${service._id}`}
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-12 py-5 rounded-2xl font-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-primary/20 uppercase tracking-[0.2em] text-sm w-full lg:w-auto"
            >
              Book This Service
              <svg className="ml-3 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-secondary/10 rounded-3xl border border-secondary/20">
              <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-1">Care Quality</p>
              <p className="font-black text-foreground text-sm uppercase">Verified Expert</p>
            </div>
            <div className="p-6 bg-primary/10 rounded-3xl border border-primary/20">
              <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-1">Availability</p>
              <p className="font-black text-foreground text-sm uppercase">Instant Booking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
