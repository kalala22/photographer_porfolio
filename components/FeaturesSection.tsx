import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Camera, Link, Download } from 'lucide-react';

export default function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Camera className="size-8 text-primary" />,
      title: t("delivery.step1.title"),
      desc: t("delivery.step1.desc"),
    },
    {
      icon: <Link className="size-8 text-primary" />,
      title: t("delivery.step2.title"),
      desc: t("delivery.step2.desc"),
    },
    {
      icon: <Download className="size-8 text-primary" />,
      title: t("delivery.step3.title"),
      desc: t("delivery.step3.desc"),
    },
  ];

  return (
    <section className="py-32 px-6 bg-background-dark overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tighter mb-6"
          >
            {t("delivery.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-xl font-light max-w-2xl mx-auto"
          >
            {t("delivery.subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group p-10 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all hover:bg-white/[0.08]"
            >
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-white/40 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
