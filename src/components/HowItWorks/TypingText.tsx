"use client";
import { motion } from "framer-motion";
import { BookOpenCheck, CreditCard, Download, Sparkles } from "lucide-react";

const steps = [
  {
    icon: <BookOpenCheck className="w-7 h-7 text-indigo-500" />,
    title: "Pick Your Book",
    description:
      "Browse our curated library and select the book that aligns with your growth journey.",
  },
  {
    icon: <CreditCard className="w-7 h-7 text-indigo-500" />,
    title: "Pay Securely",
    description:
      "Complete your purchase safely with Stripe or PayPal — no subscriptions required.",
  },
  {
    icon: <Download className="w-7 h-7 text-indigo-500" />,
    title: "Download Instantly",
    description:
      "Access your book instantly on any device, with no delays or restrictions.",
  },
  {
    icon: <Sparkles className="w-7 h-7 text-indigo-500" />,
    title: "Read & Grow",
    description:
      "Immerse in premium content designed to spark clarity and drive real impact.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
    },
  },
  hover: {
    scale: 1.05,
    y: -5,
    transition: {
      duration: 0.3,
    },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -10 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
    },
  },
  hover: {
    scale: 1.2,
    rotate: 5,
    transition: {
      duration: 0.3,
    },
  },
};

const titleVariants = {
  animate: {
    scale: [1, 1.03, 1],
    textShadow: [
      "0 0 10px rgba(79, 70, 229, 0.5)",
      "0 0 20px rgba(79, 70, 229, 0.8)",
      "0 0 10px rgba(79, 70, 229, 0.5)",
    ],
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      scale: {
        duration: 2.5,
        repeat: Infinity,
      },
      textShadow: {
        duration: 2.5,
        repeat: Infinity,
      },
      backgroundPosition: {
        duration: 2.5,
        repeat: Infinity,
      },
    },
  },
  hover: {
    scale: 1.05,
    textShadow: "0 0 25px rgba(79, 70, 229, 1)",
    transition: {
      duration: 0.3,
    },
  },
};

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-indigo-50 dark:from-zinc-950 dark:to-indigo-950/50">
      <div className="how-it-works-container max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 text-center">
        {/* العنوان مع تأثير متحرك مستمر ومتقطع */}
        <motion.h2
          variants={titleVariants}
          initial={{ opacity: 0, y: 30 }}
          animate="animate"
          whileHover="hover"
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="how-it-works-title text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 text-transparent bg-clip-text tracking-[-0.03em] mb-10"
          data-text="How It Works"
          style={{
            backgroundSize: "200% 100%",
            filter: "drop-shadow(0 4px 12px rgba(79, 70, 229, 0.3))",
          }}
        >
          How It Works
        </motion.h2>

        {/* الوصف التسويقي */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-zinc-600 dark:text-zinc-300 max-w-xl sm:max-w-2xl mx-auto mb-12 sm:mb-14 text-base sm:text-lg lg:text-xl leading-relaxed"
        >
          Unlock your next favorite book in just a few clicks. Our seamless
          process delivers curated knowledge designed to sharpen your mind and
          fuel your growth.
        </motion.p>

        {/* الخطوات مع تأثيرات تفاعلية */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:gap-8 lg:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              className="how-it-works-step relative flex flex-col items-center text-center bg-white dark:bg-zinc-900/95 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-lg hover:shadow-[0_10px_30px_rgba(79,70,229,0.35)] transition-all duration-500"
            >
              <motion.div
                variants={iconVariants}
                className="bg-indigo-50 dark:bg-indigo-950/60 p-4 rounded-full mb-4 sm:mb-5 shadow-md"
              >
                {step.icon}
              </motion.div>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-zinc-900 dark:text-white mb-2 sm:mb-3">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xs">
                {step.description}
              </p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-indigo-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
