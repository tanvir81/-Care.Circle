"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

export default function AddService() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const file = formData.get("imageFile");

    try {
      let imageUrl = formData.get("image");

      if (file && file.size > 0) {
        toast.loading("Uploading system asset...", { id: "upload-toast" });
        const uploadData = new FormData();
        uploadData.append("file", file);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        
        const uploadResult = await uploadRes.json();
        if (uploadRes.ok) {
          imageUrl = uploadResult.url;
          toast.success("Asset uploaded successfully!", { id: "upload-toast" });
        } else {
          throw new Error("Image upload failed. Please check the file size/type.");
        }
      }

      toast.loading("Deploying service to catalog...", { id: "deploy-toast" });

      const serviceData = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price")),
        image: imageUrl,
        details: formData.get("details"),
      };

      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });

      if (res.ok) {
        toast.success("Service catalog updated!", { id: "deploy-toast" });
        await Swal.fire({
          title: "Service Deployed!",
          text: "The new care service is now live in the catalog.",
          icon: "success",
          confirmButtonColor: "#C5D89D",
          borderRadius: "2rem"
        });
        e.target.reset();
        setFileName("");
        router.push("/");
      } else {
        toast.error("Deployment failed. Admin access required.", { id: "deploy-toast" });
      }
    } catch (error) {
      toast.error(error.message || "A network error occurred.", { id: "deploy-toast" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-foreground/40 font-black uppercase tracking-widest text-[10px]">Verifying Credentials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-32 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-16">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-foreground text-[10px] font-black tracking-[0.2em] uppercase mb-4"
        >
          Administrator
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-foreground"
        >
          New <span className="text-primary italic">Service</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-foreground/40 mt-4 max-w-lg leading-relaxed font-medium"
        >
          Expand the Care.xyz ecosystem by introducing specialized care options to your clients.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-[3rem] border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="p-10 lg:p-16 space-y-12">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-2">Service Identity</label>
                <input 
                  name="name" 
                  required 
                  placeholder="e.g. Newborn Specialized Care" 
                  className="w-full px-6 py-4 bg-muted border border-transparent rounded-[1.5rem] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-foreground placeholder-foreground/20 shadow-inner" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-2">Hourly Rate (USD)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-primary">$</span>
                  <input 
                    name="price" 
                    type="number" 
                    step="0.01" 
                    required 
                    placeholder="25.00" 
                    className="w-full pl-12 pr-6 py-4 bg-muted border border-transparent rounded-[1.5rem] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-foreground placeholder-foreground/20 shadow-inner" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-2">Aesthetic Representation</label>
                <div className="space-y-4">
                  <div className="relative group">
                    <input 
                      name="imageFile" 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className="w-full px-6 py-10 bg-muted/50 border-2 border-dashed border-primary/10 rounded-[2rem] flex flex-col items-center justify-center gap-4 group-hover:bg-primary/5 group-hover:border-primary/30 transition-all">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground">
                          {fileName ? fileName : "Upload System Asset"}
                        </p>
                        <p className="text-[9px] text-foreground/30 mt-1 uppercase font-bold tracking-widest">JPG, PNG, WEBP (MAX. 5MB)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-primary/5"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-white text-[9px] font-black uppercase tracking-widest text-foreground/20">or reference internal path</span>
                    </div>
                  </div>

                  <input 
                    name="image" 
                    placeholder="/assets/services/default.jpg" 
                    className="w-full px-6 py-4 bg-muted border border-transparent rounded-[1.5rem] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-foreground placeholder-foreground/20 shadow-inner" 
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-2">Card Synopsis</label>
                <input 
                  name="description" 
                  required 
                  placeholder="Enter a punchy one-liner for search results..." 
                  className="w-full px-6 py-4 bg-muted border border-transparent rounded-[1.5rem] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-foreground placeholder-foreground/20 shadow-inner" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-2">Extensive Portfolio Details</label>
                <textarea 
                  name="details" 
                  required 
                  rows="9" 
                  placeholder="Detail the scope, methodology, and unique selling points of this care service..." 
                  className="w-full px-8 py-6 bg-muted border border-transparent rounded-[2.5rem] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-foreground placeholder-foreground/20 shadow-inner resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <motion.button
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] hover:shadow-2xl hover:shadow-foreground/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
              <span className="relative z-10">{loading ? "Processing Upload..." : "Deploy New Service"}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
