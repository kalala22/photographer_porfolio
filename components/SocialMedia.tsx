import { MapPin, Mail } from "lucide-react";

export default function SocialMedia() {
  const contactLinks = [
    { icon: <MapPin />, label: "Location", href: "#" },
    { icon: <Mail />, label: "Email", href: "#" },
  ];
  return (
    <div className="flex gap-6">
      {contactLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="size-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary transition-all"
        >
          <span className="material-symbols-outlined text-xl">{link.icon}</span>
        </a>
      ))}
    </div>
  );
}
