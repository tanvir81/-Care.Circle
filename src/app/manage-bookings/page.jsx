"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

export default function ManageBookings() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/my-bookings");
    }
  }, [status, session, router]);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id, newStatus) => {
    const actionText = newStatus === "Confirmed" ? "confirm" : newStatus === "Completed" ? "complete" : "cancel";
    const confirmColor = newStatus === "Cancelled" ? "#d33" : "#C5D89D";

    const result = await Swal.fire({
      title: `${newStatus} Booking?`,
      text: `Are you sure you want to ${actionText} this booking?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: confirmColor,
      cancelButtonColor: "#aaa",
      confirmButtonText: `Yes, ${newStatus}`,
      borderRadius: "2rem"
    });

    if (result.isConfirmed) {
      toast.loading("Updating status...", { id: "admin-update-toast" });
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBookings(
          bookings.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );
        toast.success(`Booking ${newStatus}`, { id: "admin-update-toast" });
        Swal.fire({
          title: "Update Successful",
          text: `The booking is now ${newStatus}.`,
          icon: "success",
          confirmButtonColor: "#C5D89D",
          borderRadius: "2rem"
        });
      } else {
        toast.error("Failed to update status", { id: "admin-update-toast" });
      }
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

  if (loading || status === "loading") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-foreground/40 font-black uppercase tracking-widest text-[10px]">Syncing Admin Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-foreground text-[10px] font-black tracking-[0.2em] uppercase mb-4"
          >
            Administrative Portal
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-foreground"
          >
            Manage <span className="text-primary italic">All Bookings</span>
          </motion.h1>
        </div>
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-card border border-primary/5 px-6 py-3 rounded-2xl shadow-xl shadow-primary/5"
        >
           <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block mb-1">Total Requests</span>
           <span className="text-2xl font-black text-primary">{bookings.length}</span>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {bookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card p-16 rounded-[3rem] border border-primary/5 text-center shadow-2xl shadow-primary/5"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-foreground mb-4">No Bookings Yet</h2>
            <p className="text-foreground/60 leading-relaxed max-w-sm mx-auto">
              There are currently no care requests in the system. Check back later for new bookings.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-[2.5rem] shadow-xl shadow-primary/5 border border-primary/5 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted border-b border-primary/5">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Client / Service</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Investment</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Location</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center">Lifecycle</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {bookings.map((booking, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      key={booking._id} 
                      className="group hover:bg-primary/5 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center font-black text-secondary group-hover:scale-110 transition-transform">
                            {booking.serviceName?.trim()?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <div className="font-black text-foreground text-lg">{booking.serviceName}</div>
                            <div className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.1em]">{booking.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-foreground/80">{booking.duration} Hours</div>
                        <div className="text-[10px] font-black text-primary uppercase tracking-widest">${booking.totalCost}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-foreground/80 truncate max-w-[200px]">{booking.address}</div>
                        <div className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">{booking.city}, {booking.area}</div>
                        <div className="text-[9px] font-bold text-foreground/30">{booking.division}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col items-center gap-2">
                          <span className={`${getStatusColor(booking.status)} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border w-24 text-center`}>
                            {booking.status}
                          </span>
                          <span className={`${booking.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-foreground/5 text-foreground/30 border-foreground/10'} px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border w-24 text-center`}>
                            {booking.paymentStatus || 'Unpaid'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {booking.status === "Pending" && (
                            <button
                              onClick={() => updateStatus(booking._id, "Confirmed")}
                              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all"
                            >
                              Confirm
                            </button>
                          )}
                          {booking.status === "Confirmed" && (
                            <button
                              onClick={() => updateStatus(booking._id, "Completed")}
                              disabled={booking.paymentStatus !== "Paid"}
                              className={`${
                                booking.paymentStatus === "Paid" 
                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                                : "bg-muted text-foreground/20 cursor-not-allowed"
                              } px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all`}
                            >
                              Complete
                            </button>
                          )}
                          {booking.status !== "Cancelled" && booking.status !== "Completed" && (
                            <button
                              onClick={() => updateStatus(booking._id, "Cancelled")}
                              className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                            >
                              Cancel
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
                        {booking.serviceName?.trim()?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="max-w-[150px]">
                        <h3 className="font-black text-foreground text-xl truncate">{booking.serviceName}</h3>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest truncate">{booking.userEmail}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-6 border-y border-primary/5">
                    <div>
                      <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-1">Fee</p>
                      <p className="font-bold text-foreground">${booking.totalCost}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-1">Status</p>
                      <span className={`${getStatusColor(booking.status)} px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {booking.status === "Pending" && (
                      <button
                        onClick={() => updateStatus(booking._id, "Confirmed")}
                        className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all"
                      >
                        Confirm Booking
                      </button>
                    )}
                    {booking.status === "Confirmed" && (
                      <button
                        onClick={() => updateStatus(booking._id, "Completed")}
                        disabled={booking.paymentStatus !== "Paid"}
                        className={`w-full ${
                          booking.paymentStatus === "Paid" ? "bg-emerald-500 text-white" : "bg-muted text-foreground/20"
                        } py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all`}
                      >
                        Complete Service
                      </button>
                    )}
                    {booking.status !== "Cancelled" && booking.status !== "Completed" && (
                      <button
                        onClick={() => updateStatus(booking._id, "Cancelled")}
                        className="w-full bg-red-500/10 text-red-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
