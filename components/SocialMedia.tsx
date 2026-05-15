import { MapPin, Mail } from "lucide-react";
import { motion } from "motion/react";

export default function SocialMedia() {
  const contactLinks = [
    { icon: <MapPin />, label: "Location", href: "#" },
    { icon: <Mail />, label: "Email", href: "#" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="flex gap-6"
    >
      {contactLinks.map((link) => (
        <motion.a
          key={link.label}
          href={link.href}
          variants={item}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="size-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary transition-all shadow-lg hover:shadow-primary/10"
        >
          <span className="material-symbols-outlined text-xl">{link.icon}</span>
        </motion.a>
      ))}
    </motion.div>
  );
}
