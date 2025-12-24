"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

const divisions = ["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh"];

export default function BookingPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    duration: 1,
    division: "",
    district: "",
    city: "",
    area: "",
    address: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then(res => res.json())
      .then(data => {
        const found = data.find(s => s._id.toString() === id.toString());
        setService(found);
        setLoading(false);
      });
  }, [id]);

  const totalCost = service ? formData.duration * service.price : 0;

  const handleBooking = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Confirm Booking?",
      text: `You are booking ${service.name} for ${formData.duration} hours. Total cost will be $${totalCost}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#C5D89D",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Book Now!",
      cancelButtonText: "Maybe Later",
      background: "#fff",
      color: "#000",
      borderRadius: "2rem"
    });

    if (result.isConfirmed) {
      toast.loading("Processing your booking...", { id: "booking-toast" });
      
      const bookingData = {
        ...formData,
        serviceId: service._id,
        serviceName: service.name,
        totalCost,
        userEmail: session.user.email,
        status: "Pending",
        createdAt: new Date()
      };

      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });

        if (res.ok) {
          toast.success("Booking successful!", { id: "booking-toast" });
          Swal.fire({
            title: "Success!",
            text: "Your booking has been received. Check your email for the invoice!",
            icon: "success",
            confirmButtonColor: "#C5D89D",
            borderRadius: "2rem"
          });
          router.push("/my-bookings");
        } else {
          toast.error("Booking failed. Please try again.", { id: "booking-toast" });
        }
      } catch (error) {
        toast.error("Network error. Please check your connection.", { id: "booking-toast" });
      }
    }
  };

  if (loading || status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-foreground text-[10px] font-black tracking-[0.2em] uppercase mb-4">
          Reservation Request
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
          Secure Your <span className="text-primary italic">Service</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2">
          <form onSubmit={handleBooking} className="space-y-8 bg-card p-10 rounded-[2.5rem] border border-primary/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest ml-1">Duration (Hours)</label>
                <input
                  type="number"
                  min="1"
                  required
                  className="w-full px-5 py-4 bg-muted border border-primary/5 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-sm"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest ml-1">Division</label>
                <select
                  required
                  className="w-full px-5 py-4 bg-muted border border-primary/5 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-sm appearance-none"
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                >
                  <option value="">Select Division</option>
                  {divisions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest ml-1">Service Location Details</label>
                <textarea
                  required
                  className="w-full px-5 py-4 bg-muted border border-primary/5 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-sm min-h-[120px]"
                  placeholder="Street address, House number, Area details..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                ></textarea>
              </div>
            </div>

            <div className="relative z-10 pt-4">
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all duration-300 uppercase tracking-[0.2em] text-sm"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="bg-card p-10 rounded-[2.5rem] border border-primary/5 sticky top-28 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
            
            <h3 className="text-sm font-black text-foreground/30 uppercase tracking-[0.3em] mb-8">Order Summary</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center group">
                <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Selected Service</span>
                <span className="font-black text-foreground text-sm group-hover:text-primary transition-colors">{service?.name}</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Base Rate</span>
                <span className="font-black text-foreground text-sm">${service?.price}/hr</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Time Period</span>
                <span className="font-black text-foreground text-sm">{formData.duration} Hours</span>
              </div>
              
              <div className="border-t border-primary/5 pt-6 mt-6 flex justify-between items-end">
                <div>
                    <span className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Total Investment</span>
                    <p className="text-4xl font-black text-primary leading-none mt-1">${totalCost}</p>
                </div>
                <div className="h-10 w-10 flex items-center justify-center bg-primary/10 rounded-xl">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-secondary/10 rounded-3xl border border-secondary/20 flex items-start gap-4">
             <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 text-secondary">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
             </div>
             <p className="text-xs font-bold text-foreground/60 leading-relaxed">
                Your data is encrypted and secure. We prioritize the safety of our community above all else.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
