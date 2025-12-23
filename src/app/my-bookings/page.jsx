"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function MyBookings() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role === "admin") {
      router.push("/manage-bookings");
    }
    if (session?.user?.email) {
      fetch(`/api/bookings?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          setBookings(data);
          setLoading(false);
        });
    }
  }, [session, router]);

  const cancelBooking = async (id) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      const res = await fetch(`/api/bookings/${id}`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" })
      });
      if (res.ok) {
        setBookings(bookings.map(b => b._id === id ? { ...b, status: "Cancelled" } : b));
      }
    }
  };

  const payBooking = async (id) => {
    const res = await fetch(`/api/bookings/${id}`, { 
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: "Paid" })
    });
    if (res.ok) {
      setBookings(bookings.map(b => b._id === id ? { ...b, paymentStatus: "Paid" } : b));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'Confirmed': return 'bg-primary/10 text-primary border-primary/20';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Confirmed': return 2;
      case 'Completed': return 3;
      case 'Cancelled': return 0;
      default: return 1;
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-foreground/40 font-black uppercase tracking-widest text-[10px]">Syncing Bookings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-16">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-foreground text-[10px] font-black tracking-[0.2em] uppercase mb-4"
        >
          User Dashboard
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-foreground"
        >
          My <span className="text-primary italic">Bookings</span>
        </motion.h1>
      </div>

      <AnimatePresence mode="wait">
        {bookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card p-16 rounded-[3rem] border border-primary/5 text-center shadow-2xl shadow-primary/5"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-foreground mb-4">No Active Bookings</h2>
            <p className="text-foreground/60 mb-10 max-w-sm mx-auto leading-relaxed">
              It looks like you haven't scheduled any care services yet. Check out our offerings to get started.
            </p>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/#services" 
              className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20"
            >
              Explore Services
            </motion.a>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-1"
          >
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-[2.5rem] shadow-xl shadow-primary/5 border border-primary/5 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted border-b border-primary/5">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Service</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Details</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Progress</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {bookings.map((booking, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={booking._id} 
                      className="group hover:bg-primary/5 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center font-black text-secondary group-hover:scale-110 transition-transform">
                            {booking.serviceName[0]}
                          </div>
                          <div>
                            <div className="font-black text-foreground text-lg">{booking.serviceName}</div>
                            <div className="text-[10px] font-black text-primary uppercase tracking-widest">${booking.totalCost} Total</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-foreground/80">{booking.duration} Hours</div>
                        <div className="text-[10px] font-black text-foreground/40 uppercase tracking-widest truncate max-w-[150px]">{booking.address}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-2">
                          <span className={`${getStatusColor(booking.status)} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border text-center`}>
                            {booking.status}
                          </span>
                          <span className={`${booking.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-foreground/5 text-foreground/40 border-foreground/10'} px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border text-center`}>
                            {booking.paymentStatus || 'Unpaid'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-2">
                          <div className="flex gap-1">
                            {[1, 2, 3].map((step) => (
                              <div 
                                key={step}
                                className={`h-1.5 w-6 rounded-full transition-all duration-500 ${
                                   booking.status === 'Cancelled' ? 'bg-red-500/20' :
                                   step <= getStatusStep(booking.status) ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-muted'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-[9px] font-black uppercase tracking-widest text-foreground/30">
                            {booking.status === 'Pending' ? 'Processing' : 
                             booking.status === 'Confirmed' ? 'On the way' : 
                             booking.status === 'Completed' ? 'Service Done' : 'Stopped'}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setSelectedBooking(booking)}
                            className="p-3 bg-foreground/5 hover:bg-foreground text-foreground hover:text-white rounded-xl transition-all"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          {booking.status === "Confirmed" && booking.paymentStatus !== "Paid" && (
                            <button
                              onClick={() => payBooking(booking._id)}
                              className="p-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-xl transition-all"
                              title="Pay Now"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )}
                          {booking.status === "Pending" && (
                            <button
                              onClick={() => cancelBooking(booking._id)}
                              className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
                              title="Cancel"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-6">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-primary/5 border border-primary/5 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center font-black text-secondary">
                        {booking.serviceName[0]}
                      </div>
                      <div>
                        <h3 className="font-black text-foreground text-xl">{booking.serviceName}</h3>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">${booking.totalCost} total</p>
                      </div>
                    </div>
                    <span className={`${getStatusColor(booking.status)} px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-6 border-y border-primary/5">
                    <div>
                      <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-1">Duration</p>
                      <p className="font-bold text-foreground">{booking.duration} Hours</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-1">Payment</p>
                      <p className={`font-bold ${booking.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-foreground/40'}`}>
                        {booking.paymentStatus || 'Unpaid'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setSelectedBooking(booking)}
                      className="flex-1 bg-muted text-foreground py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      View Details
                    </button>
                    {booking.status === "Pending" && (
                      <button 
                        onClick={() => cancelBooking(booking._id)}
                        className="flex-1 bg-red-500/10 text-red-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="absolute inset-0 bg-foreground/40 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[3rem] max-w-lg w-full p-10 shadow-3xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div>
                  <span className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-2">
                    Order Details
                  </span>
                  <h2 className="text-3xl font-black text-foreground leading-tight">{selectedBooking.serviceName}</h2>
                </div>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="w-10 h-10 bg-muted hover:bg-foreground hover:text-white rounded-xl flex items-center justify-center transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-8 mb-10 relative z-10">
                <div className="grid grid-cols-2 gap-8 p-8 bg-muted rounded-[2rem] border border-primary/5">
                  <div className="space-y-1">
                    <p className="text-[10px] text-foreground/40 font-black uppercase tracking-widest leading-none">Duration</p>
                    <p className="font-black text-foreground text-xl leading-none">{selectedBooking.duration}h</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] text-foreground/40 font-black uppercase tracking-widest leading-none">Investment</p>
                    <p className="font-black text-primary text-xl leading-none">${selectedBooking.totalCost}</p>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                         <svg className="w-4 h-4 text-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                         </svg>
                      </div>
                      <div>
                        <p className="text-[10px] text-foreground/40 font-black uppercase tracking-widest mb-1">Assistance Location</p>
                        <p className="font-bold text-foreground leading-relaxed">{selectedBooking.address}</p>
                        <p className="text-xs font-bold text-foreground/40">{selectedBooking.area}, {selectedBooking.city}</p>
                      </div>
                   </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <div className={`p-4 rounded-2xl border flex-1 text-center ${getStatusColor(selectedBooking.status)}`}>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">Status</p>
                    <p className="font-black text-xs uppercase">{selectedBooking.status}</p>
                  </div>
                  <div className={`p-4 rounded-2xl border flex-1 text-center ${selectedBooking.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-muted border-primary/5 text-foreground/40'}`}>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">Payment</p>
                    <p className="font-black text-xs uppercase">{selectedBooking.paymentStatus || 'Pending'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 px-8 py-5 bg-foreground text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-2xl hover:-translate-y-1 transition-all"
                >
                  Close View
                </button>
                {selectedBooking.status === "Confirmed" && selectedBooking.paymentStatus !== "Paid" && (
                   <button 
                    onClick={() => payBooking(selectedBooking._id)}
                    className="flex-1 px-8 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-2xl hover:-translate-y-1 transition-all"
                  >
                    Pay Invoice
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
