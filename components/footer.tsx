import { Aperture, MapPin, Mail } from "lucide-react";
import {} from "lucide-react";
export default function Footer() {
  const contactLinks = [
    { icon: <MapPin />, label: "Location", href: "#" },
    { icon: <Mail />, label: "Email", href: "#" },
  ];
  return (
    <footer className="bg-black py-20 px-6 md:px-10 lg:px-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col gap-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4 group">
            <span className="material-symbols-outlined text-primary text-3xl">
              <Aperture />
            </span>
            <h2 className="text-2xl font-black tracking-widest uppercase">
              Chretien Kalala
            </h2>
          </div>

          <div className="flex gap-10">
            {["Privacy", "Terms", "Licensing"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="flex gap-6">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="size-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary transition-all"
              >
                <span className="material-symbols-outlined text-xl">
                  {link.icon}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-6 text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold">
          <p>© 2026 Chretien Kalala Photography. All rights reserved.</p>
          <p>Capturing the world one frame at a time.</p>
        </div>
      </div>
    </footer>
  );
}
