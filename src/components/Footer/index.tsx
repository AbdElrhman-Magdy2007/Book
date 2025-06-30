"use client";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaLinkedinIn,
  FaCcPaypal,
  FaCcStripe,
} from "react-icons/fa";

const socialIconVariants = {
  hover: {
    scale: 1.3,
    rotate: [0, 5, -5, 0],
    color: "#4c51bf",
    transition: {
      duration: 0.3,
      rotate: { duration: 0.4, repeat: 1 },
    },
  },
};

const linkVariants = {
  hover: {
    color: "#4c51bf",
    x: 5,
    transition: {
      duration: 0.3,
    },
  },
};

export default function Footer() {
  return (
    <footer className="py-12 sm:py-16 bg-gradient-to-t from-indigo-100 to-white dark:from-indigo-950/80 dark:to-zinc-950 border-t border-indigo-200 dark:border-indigo-900/60">
      <style jsx>{`
        .footer-container {
          font-family: "Inter", -apple-system, sans-serif;
        }
        .footer-title {
          background: linear-gradient(90deg, #4c51bf, #7f9cf5, #4c51bf);
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: gradientFlow 4s ease-in-out infinite;
        }
        .footer-social-icon,
        .footer-link {
          transition: all 0.3s ease-out;
        }
        .footer-social-icon:hover,
        .footer-link:hover {
          filter: drop-shadow(0 2px 8px rgba(79, 70, 229, 0.5));
        }
        @keyframes gradientFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @media (max-width: 640px) {
          .footer-container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .footer-title {
            font-size: 1.5rem;
          }
          .footer-text {
            font-size: 0.875rem;
          }
        }
        @media (min-width: 640px) {
          .footer-title {
            font-size: 1.75rem;
          }
          .footer-text {
            font-size: 0.9375rem;
          }
        }
        @media (min-width: 1280px) {
          .footer-title {
            font-size: 2rem;
          }
          .footer-text {
            font-size: 1rem;
          }
        }
      `}</style>
      <div className="footer-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
        {/* Logo & About */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="footer-title text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white mb-4"
          >
            ReadFlow<span className="text-indigo-400">.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="footer-text text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xs"
          >
            Discover curated digital books that inspire your mind and elevate
            your thinking — with beautiful design, instant access, and full
            ownership.
          </motion.p>
        </div>

        {/* Navigation */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-3 uppercase tracking-wider"
          >
            Explore
          </motion.h3>
          <ul className="footer-text text-sm text-zinc-600 dark:text-zinc-300 space-y-2">
            {["Home", "Our Books", "Pricing", "Contact"].map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
              >
                <motion.a
                  href="#"
                  variants={linkVariants}
                  whileHover="hover"
                  className="footer-link hover:text-indigo-400 transition"
                >
                  {item}
                </motion.a>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-3 uppercase tracking-wider"
          >
            Legal
          </motion.h3>
          <ul className="footer-text text-sm text-zinc-600 dark:text-zinc-300 space-y-2">
            {["Privacy Policy", "Terms of Service", "Refund Policy"].map(
              (item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                >
                  <motion.a
                    href="#"
                    variants={linkVariants}
                    whileHover="hover"
                    className="footer-link hover:text-indigo-400 transition"
                  >
                    {item}
                  </motion.a>
                </motion.li>
              )
            )}
          </ul>
        </div>

        {/* Social & Payment */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-3 uppercase tracking-wider"
          >
            Connect
          </motion.h3>
          <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 text-lg sm:text-xl mb-4">
            {[
              { icon: FaFacebookF, label: "Facebook" },
              { icon: FaInstagram, label: "Instagram" },
              { icon: FaTiktok, label: "TikTok" },
              { icon: FaYoutube, label: "YouTube" },
              { icon: FaLinkedinIn, label: "LinkedIn" },
            ].map(({ icon: Icon, label }, index) => (
              <motion.a
                key={label}
                href="#"
                variants={socialIconVariants}
                whileHover="hover"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                className="footer-social-icon"
              >
                <Icon aria-label={label} />
              </motion.a>
            ))}
          </div>
          <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-300 text-xl sm:text-2xl">
            <motion.div
              whileHover={{ scale: 1.2, color: "#4c51bf" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <FaCcStripe title="Stripe" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2, color: "#4c51bf" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <FaCcPaypal title="PayPal" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mt-8 sm:mt-10 border-t border-indigo-200 dark:border-indigo-900/60 pt-6 text-center text-xs sm:text-sm text-zinc-500 dark:text-zinc-300"
      >
        © {new Date().getFullYear()} ReadFlow. All rights reserved.
      </motion.div>
    </footer>
  );
}
