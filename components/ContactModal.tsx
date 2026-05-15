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
import { useTranslation } from "react-i18next";

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
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1000&auto=format&fit=crop",
];

export function ContactModal({
  isOpen,
  onClose,
  whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER,
}: ContactModalProps) {
  const { t } = useTranslation();
  const [user_name, setUser_name] = useState("");
  const [user_email, setUser_email] = useState("");
  const [message, setMessage] = useState("");
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

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatus({ type: null, message: "" });

    emailjs
      .sendForm("service_7ddbnph", "template_qci1jnl", form.current!, {
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC,
      })
      .then(
        () => {
          setStatus({
            type: "success",
            message: t("contact.status.success"),
          });
          setUser_name("");
          setUser_email("");
          setMessage("");
          if (form.current) form.current.reset();
        },
        (error) => {
          setStatus({
            type: "error",
            message: t("contact.status.error"),
          });
          console.log("FAILED...", error.text);
        },
      )
      .finally(() => {
        setIsSending(false);
      });
  };

  // Auto-scroll images
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % portfolioImages.length,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleWhatsApp = () => {
    const whatsappMessage = encodeURIComponent(
      t("contact.whatsappTemplate", {
        defaultValue:
          "Bonjour Chretien,\n\nJe souhaite réserver une seance.\n\n" +
          "• Type de seance : \n" +
          "• Date prévue : \n" +
          "• Budget estimé : \n",
      }),
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* Image Gallery Section */}
          <div className="hidden md:block relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
            <div className="absolute inset-0">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={portfolioImages[currentImageIndex]}
                  alt="Portfolio"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-[#0a0a0a]/80"></div>
            </div>

            {/* Image indicators */}
            <div className="absolute bottom-8 left-10 flex gap-2 z-10">
              {portfolioImages.slice(0, 8).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1 rounded-full transition-all ${
                    index === currentImageIndex % 8
                      ? "bg-primary w-8"
                      : "bg-white/20 w-4 hover:bg-white/40"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 flex flex-col p-8 md:p-12">
            {/* Header */}
            <div className="relative mb-10">
              <motion.button
                whileHover={{ rotate: 90 }}
                onClick={onClose}
                className="absolute -top-4 -right-4 p-2 text-white/40 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </motion.button>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-black text-white mb-2 tracking-tighter"
              >
                {t("contact.title")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/50"
              >
                {t("contact.subtitle")}
              </motion.p>
            </div>

            {/* Form */}
            <form onSubmit={sendEmail} className="space-y-6" ref={form}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label
                  htmlFor="name"
                  className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2"
                >
                  {t("contact.fields.name")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="user_name"
                  value={user_name}
                  onChange={(e) => setUser_name(e.target.value)}
                  className="w-full px-0 py-3 bg-transparent border-b border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Ex: Esther Hadassa"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label
                  htmlFor="email"
                  className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2"
                >
                  {t("contact.fields.email")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="user_email"
                  value={user_email}
                  onChange={(e) => setUser_email(e.target.value)}
                  className="w-full px-0 py-3 bg-transparent border-b border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Ex: you@example.com"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label
                  htmlFor="message"
                  className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2"
                >
                  {t("contact.fields.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-0 py-3 bg-transparent border-b border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder={t("contact.fields.messagePlaceholder")}
                  required
                />
              </motion.div>

              <AnimatePresence>
                {status.type && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4 rounded-lg text-sm font-medium flex items-center gap-3 ${
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

              <div className="flex flex-col gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSending}
                  className={`w-full h-14 bg-primary text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 cursor-pointer ${isSending ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isSending
                    ? t("contact.status.sending")
                    : t("contact.status.confirm")}
                  <Send
                    className={`w-4 h-4 ${isSending ? "animate-pulse" : ""}`}
                  />
                </motion.button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 text-[10px] uppercase tracking-widest font-bold text-white/20 bg-[#0a0a0a]">
                      {t("contact.or")}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(242,166,13,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full h-14 bg-transparent border border-white/10 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span>{t("contact.whatsapp")}</span>
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
