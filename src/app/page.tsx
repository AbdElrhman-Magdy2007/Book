"use client";
import FeaturesSection from "@/components/FeaturesSection";
import Hero from "@/components/Hero/index";
import FeaturedBooks from "@/components/FeaturedBooks";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <Hero />
      <FeaturesSection />
      <FeaturedBooks />
    </main>
  );
}

// "use client";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";

// const PDF_SIZE = "1.2 MB · 12 pages";

// export default function Home() {
//   const [downloading, setDownloading] = useState(false);
//   const [downloaded, setDownloaded] = useState(false);

//   const handleDownload = async () => {
//     setDownloading(true);
//     setDownloaded(false);
//     // Simulate download for animation (remove if you want instant)
//     setTimeout(() => {
//       setDownloading(false);
//       setDownloaded(true);
//       setTimeout(() => setDownloaded(false), 1500);
//     }, 1200);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black  px-4 transition-colors duration-300">
//       <motion.div
//         initial={{ opacity: 0, y: 32 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.7, ease: "easeOut" }}
//         className="w-full max-w-xl bg-black dark:bg-[#181a20]/90 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center backdrop-blur-md"
//       >
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
//           className="mb-6"
//         >
//           <Image
//             src="/file.svg"
//             alt="PDF Icon"
//             width={56}
//             height={56}
//             className="mx-auto mb-3 opacity-90"
//             priority
//           />
//           <h1 className="font-sans font-bold text-2xl sm:text-3xl text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
//             Download Our Free Guide
//           </h1>
//           <p className="text-gray-500 dark:text-gray-300 text-base sm:text-lg font-sans">
//             A quick, beautifully designed PDF that covers all essentials
//           </p>
//         </motion.div>
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
//           className="w-full"
//         >
//           <a
//             href="/guide.pdf"
//             download
//             onClick={handleDownload}
//             className="group relative w-full flex items-center justify-center px-6 py-4 bg-blue-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-lg sm:text-xl select-none overflow-hidden"
//             style={{ minHeight: 56 }}
//           >
//             <span className="mr-2 text-2xl">📄</span>
//             <span className={downloading ? "opacity-60" : ""}>
//               Download PDF
//             </span>
//             <AnimatePresence>
//               {downloading && (
//                 <motion.span
//                   key="spinner"
//                   initial={{ opacity: 0, scale: 0.7 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.7 }}
//                   className="absolute right-5"
//                 >
//                   <svg
//                     className="animate-spin h-6 w-6 text-white"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                     ></path>
//                   </svg>
//                 </motion.span>
//               )}
//               {downloaded && !downloading && (
//                 <motion.span
//                   key="check"
//                   initial={{ opacity: 0, scale: 0.7 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.7 }}
//                   className="absolute right-5"
//                 >
//                   <svg
//                     className="h-6 w-6 text-white"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth="3"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                 </motion.span>
//               )}
//             </AnimatePresence>
//             <span className="absolute left-0 top-0 w-full h-full rounded-xl opacity-0 group-hover:opacity-10 bg-black transition-opacity duration-300" />
//           </a>
//           <div className="mt-2 text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
//             ({PDF_SIZE})
//           </div>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }
