import {
  X,
  Send,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { AnimatePresence, motion } from "motion/react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber?: string;
}

const portfolioImages = [
  "https://images.unsplash.com/photo-1706824258534-c3740a1ae96b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1758905728020-a888617aecd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1742540425845-8d8dabe893ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1631187512153-807144860f80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  // Nouvelles images ajoutées
  // Portrait & Studio
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",

  // Weddings / Mariage
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",

  // Fashion / Mode
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop",

  // Landscape / Paysage
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1000&auto=format&fit=crop",

  // Street & Architecture
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1000&auto=format&fit=crop",
];

export function ContactModal({
  isOpen,
  onClose,
  whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER,
}: ContactModalProps) {
  const [user_name, setUser_name] = useState("");
  const [user_email, setUser_email] = useState("");
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "loading" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatus({ type: null, message: "" });

    emailjs
      .sendForm("service_w9sgd09", "template_iy1k5qg", form.current, {
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC,
      })
      .then(
        () => {
          setStatus({
            type: "success",
            message: "Message envoyé avec succès",
          });
          setUser_name("");
          setUser_email("");
          setMessage("");
          if (form.current) form.current.reset();
        },
        (error) => {
          setStatus({
            type: "error",
            message: "Une erreur est survenue lors de l'envoi du message",
          });
          console.log("FAILED...", error.text);
        },
      )
      .finally(() => {
        setIsSending(false);
      });
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Auto-scroll images
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % portfolioImages.length,
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Form submitted:", { email, message });
  //   // Logique de soumission ici
  //   setEmail("");
  //   setMessage("");
  //   onClose();
  // };

  const handleWhatsApp = () => {
    const whatsappMessage = encodeURIComponent(
      "Bonjour Chretien,\n\nJe souhaite réserver une seance.\n\n" +
        "• Type de seance : \n" +
        "• Date prévue : \n" +
        "• Budget estimé : \n",
    );
    window.open(
      `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`,
      "_blank",
    );
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image Gallery Section */}
          <div className="hidden md:block relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
            <div className="absolute inset-0">
              {portfolioImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Portfolio ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent to-[#0a0a0a]/40"></div>
            </div>

            {/* Image indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {portfolioImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-primary w-6"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 flex flex-col">
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-white/10">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-1 text-white/60 hover:text-white transition-colors z-10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-white mb-1">
                Get in Touch
              </h2>
              <p className="text-sm text-white/60">
                Let's capture your story together.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={sendEmail} className="p-6 space-y-4" ref={form}>
              {/* Email Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm text-white/80 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="user_name"
                  value={user_name}
                  onChange={(e) => setUser_name(e.target.value)}
                  className="w-full px-4 py-3 bg-[#27231b] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Ex: Esther Hadassa"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-white/80 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="user_email"
                  value={user_email}
                  onChange={(e) => setUser_email(e.target.value)}
                  className="w-full px-4 py-3 bg-[#27231b] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Ex: you@example.com"
                  required
                />
              </div>

              {/* Message Textarea */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm text-white/80 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#27231b] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Tell us about your project..."
                  required
                />
              </div>

              <AnimatePresence>
                {status.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`p-4 rounded-lg text-sm font-medium mb-4 flex items-center gap-3 ${
                      status.type === "success"
                        ? "bg-green-500/10 border border-green-500/20 text-green-400"
                        : "bg-red-500/10 border border-red-500/20 text-red-400"
                    }`}
                  >
                    {status.type === "success" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}
                    {status.message}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSending}
                className={`w-full px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-[#d99509] transition-all flex items-center justify-center gap-2 shadow-lg shadow-bg-primary ${isSending ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isSending ? "Envoi en cours..." : "Confirmer la réservation"}
                <Send
                  className={`w-4 h-4 ${isSending ? "animate-pulse" : ""}`}
                />
              </button>

              {/* Separator */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-sm text-white/40 bg-[#0a0a0a]">
                    OR
                  </span>
                </div>
              </div>

              {/* WhatsApp Button */}
              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full px-6 py-3 bg-transparent border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
