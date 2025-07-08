// components/Testimonials.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Emily Johnson",
    role: "Product Manager, California",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    content:
      "This platform is absolutely brilliant. I found the exact books I needed in seconds, and the download process was seamless.",
  },
  {
    name: "Michael Anderson",
    role: "Tech Enthusiast, New York",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    content:
      "Clean UI, fast experience, and amazing selection of digital books. This is the future of online reading.",
  },
  {
    name: "Sophia Lee",
    role: "UX Designer, Austin",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    content:
      "I’ve tried other platforms, but nothing compares to this. The quality and ease of use are unmatched.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white dark:bg-zinc-950 py-24 px-6 md:px-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          What Our Users Say
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
          Trusted by thousands of readers around the world — here’s what they think about our platform.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-3xl shadow-lg border border-zinc-200 dark:border-zinc-800 hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center gap-4 mb-5">
              <Image
                src={t.avatar}
                alt={t.name}
                width={50}
                height={50}
                className="rounded-full border-2 border-indigo-500"
              />
              <div>
                <h4 className="font-semibold text-base text-zinc-900 dark:text-white">
                  {t.name}
                </h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.role}</p>
              </div>
            </div>

            <p className="text-zinc-700 dark:text-zinc-300 text-[15px] leading-relaxed mb-4">
              “{t.content}”
            </p>

            <div className="flex gap-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}





// // components/Testimonials.tsx
// "use client";

// import { motion } from "framer-motion";
// import { Star } from "lucide-react";

// const testimonials = [
//   {
//     name: "Emily Johnson",
//     initials: "EJ",
//     role: "Product Manager, California",
//     content:
//       "This platform is absolutely brilliant. I found the exact books I needed in seconds, and the download process was seamless.",
//   },
//   {
//     name: "Michael Lee",
//     initials: "ML",
//     role: "Tech Enthusiast, New York",
//     content:
//       "Clean UI, fast experience, and amazing selection of digital books. This is the future of online reading.",
//   },
//   {
//     name: "Sophia Carter",
//     initials: "SC",
//     role: "UX Designer, Austin",
//     content:
//       "I’ve tried other platforms, but nothing compares to this. The quality and ease of use are unmatched.",
//   },
// ];

// export default function Testimonials() {
//   return (
//     <section className="bg-white dark:bg-zinc-950 py-24 px-6 md:px-20">
//       <div className="text-center mb-16">
//         <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
//           What Our Users Say
//         </h2>
//         <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
//           Trusted by thousands of readers around the world — here’s what they think about our platform.
//         </p>
//       </div>

//       <div className="grid gap-10 md:grid-cols-3">
//         {testimonials.map((t, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: i * 0.2 }}
//             className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-3xl shadow-lg border border-zinc-200 dark:border-zinc-800 hover:scale-[1.02] transition-transform"
//           >
//             <div className="flex items-center gap-4 mb-5">
//               <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-lg shadow-md">
//                 {t.initials}
//               </div>
//               <div>
//                 <h4 className="font-semibold text-base text-zinc-900 dark:text-white">
//                   {t.name}
//                 </h4>
//                 <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.role}</p>
//               </div>
//             </div>

//             <p className="text-zinc-700 dark:text-zinc-300 text-[15px] leading-relaxed mb-4">
//               “{t.content}”
//             </p>

//             <div className="flex gap-1 text-yellow-500">
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} size={16} fill="currentColor" />
//               ))}
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// }
