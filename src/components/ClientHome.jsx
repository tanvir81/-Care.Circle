"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ClientHome({ initialServices = [] }) {
  const [services, setServices] = useState(initialServices);
  const [loading, setLoading] = useState(initialServices.length === 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we already have services from the server, we don't need to fetch on client
    if (initialServices && initialServices.length > 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("/api/services")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setServices(data);
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          setServices([]);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [initialServices]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <>
      {/* Services Section */}
      <section id="services" className="py-32 max-w-7xl mx-auto px-4">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-[10px] font-black tracking-[0.2em] uppercase mb-4"
          >
            Our Offerings
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-foreground mb-6"
          >
            Tailored Care for <span className="text-primary italic">Every Need</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-foreground/60 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            We've carefully designed our services to provide the highest level of comfort and professional assistance for your family.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
        {loading ? (
          <div className="col-span-1 md:col-span-3 py-20 flex flex-col items-center justify-center space-y-4">
             <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
             <p className="text-foreground/40 font-black uppercase tracking-widest text-xs">Loading Services...</p>
          </div>
        ) : error ? (
          <div className="col-span-1 md:col-span-3 py-20 bg-destructive/5 rounded-[2rem] border border-destructive/10 text-center space-y-4">
             <p className="text-destructive font-black">Something went wrong while loading services.</p>
             <p className="text-foreground/40 text-sm">{error}</p>
             <button 
               onClick={() => window.location.reload()} 
               className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-black hover:shadow-lg transition-all"
             >
               Try Again
             </button>
          </div>
        ) : services.length === 0 ? (
          <div className="col-span-1 md:col-span-3 py-20 text-center">
            <p className="text-foreground/40 font-black">No services available at the moment.</p>
          </div>
        ) : (
          services.map((service) => (
            <motion.div 
              key={service._id} 
              variants={itemVariants}
              whileHover={{ y: -12 }}
              className="group bg-card rounded-[2rem] overflow-hidden border border-primary/5 hover:border-primary/20 transition-all duration-500 shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10"
            >
              <div className="h-64 relative overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 right-4 h-12 w-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center font-black text-primary border border-primary/10">
                  ${service.price}
                </div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{service.name}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed line-clamp-2">{service.description}</p>
                <div className="pt-4 flex justify-between items-center border-t border-primary/5">
                  <span className="text-xs font-black text-foreground/30 uppercase tracking-widest">Standard Rate</span>
                  <Link 
                    href={`/service/${service._id}`} 
                    className="bg-primary/10 text-primary px-6 py-3 rounded-xl text-sm font-black hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        )}
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-muted py-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8 relative z-10"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-foreground text-[10px] font-black tracking-[0.2em] uppercase">
              About The Care.Circle
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight">Why Families Choose Our <span className="text-secondary">Community</span></h2>
            <p className="text-foreground/60 leading-relaxed text-lg">
              Care.Circle is more than just a booking platform. We are a community of professional and compassionate caregivers dedicated to providing the best support for your loved ones. 
            </p>
            <div className="space-y-4">
              {[
                "Fully Verified & Background Checked Caregivers",
                "Personalized Matching Based on Your Needs",
                "Real-time Tracking & Transparent Booking",
                "24/7 Support for Peace of Mind"
              ].map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  key={i} 
                  className="flex items-center gap-4"
                >
                  <div className="h-6 w-6 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor font-black">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-foreground/80 font-bold">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-secondary/20 aspect-video rounded-[3rem] flex flex-col items-center justify-center p-12 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-secondary/30 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <span className="text-7xl font-black text-secondary block mb-4">5k+</span>
                <span className="text-2xl font-black text-foreground block mb-2">Trusted by Families</span>
                <p className="text-foreground/60 font-bold max-w-xs mx-auto">Providing seamless caregiving experiences across the region.</p>
              </div>
            </div>
            {/* Decorative Floating Card */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl border border-primary/10 max-w-[200px]"
            >
              <div className="flex gap-2 mb-3">
                {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-primary" />)}
              </div>
              <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1">Satisfaction</p>
              <p className="text-xl font-black text-foreground">99.8%</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-foreground mb-4">Heartfelt Stories</h2>
          <div className="w-12 h-1.5 bg-primary mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { name: "Sarah Ahmed", text: "The babysitter was amazing! My kids loved her. She was so professional and caring.", role: "Parent" },
             { name: "Karim Ullah", text: "Highly recommend the elderly care service. They were very patient with my father.", role: "Son" },
             { name: "Maria Jannat", text: "Easy to book and great support. The sick care assistant helped with everything.", role: "Family Caretaker" }
           ].map((testimonial, i) => (
             <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="p-10 bg-white rounded-3xl shadow-sm border border-primary/5 relative group hover:shadow-xl transition-all duration-500"
             >
                <div className="absolute top-0 right-10 -translate-y-1/2 text-6xl font-black text-primary/10 group-hover:text-primary/20 transition-colors opacity-50">"</div>
                <p className="text-foreground/60 italic leading-relaxed relative z-10">"{testimonial.text}"</p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-10 w-10 bg-muted rounded-xl flex items-center justify-center font-black text-primary/40">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-black text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">{testimonial.role}</p>
                  </div>
                </div>
             </motion.div>
           ))}
        </div>
      </section>
    </>
  );
}
