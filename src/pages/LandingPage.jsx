import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import logo from "../assets/image.png";

const VIDEO_SRC =
  "https://videos.pexels.com/video-files/7578554/7578554-uhd_2560_1440_30fps.mp4";

export default function LandingPage() {
  const navigate = useNavigate();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black select-none">
      {/* ——— VIDEO ——— */}
      <motion.video
        ref={videoRef}
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => setVideoLoaded(true)}
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{
          opacity: videoLoaded ? 1 : 0,
          scale: videoLoaded ? 1 : 1.15,
        }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* ——— OVERLAYS ——— */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40 z-[2]" />

      {/* ——— LOGO TOP LEFT ——— */}
      <motion.img
        src={logo}
        alt="K Developments"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
        className="absolute top-8 left-8 md:left-14 z-20 h-10 md:h-12 w-auto object-contain"
      />

      {/* ——— SIGN IN ——— */}
      <motion.button
        onClick={() => navigate("/login")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute top-10 right-8 md:right-14 z-20 text-white/50 text-xs tracking-[0.25em] uppercase hover:text-white transition-colors duration-300"
      >
        Sign in
      </motion.button>

      {/* ——— CENTER CONTENT ——— */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        {/* Decorative line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          className="w-px h-20 bg-gradient-to-b from-transparent via-[var(--pcolor1)]/60 to-transparent mb-10 origin-top"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-white/30 text-[10px] sm:text-xs tracking-[0.6em] uppercase mb-8"
        >
          Luxury Real Estate
        </motion.p>

        {/* Main heading */}
        <h1 className="font-display font-bold text-white leading-[0.95] mb-8">
          {["Own", "Your", "Dream", "Home"].map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 100, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 1.2,
                delay: 1.1 + i * 0.18,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`inline-block mr-[0.22em] text-5xl sm:text-7xl md:text-8xl lg:text-9xl ${
                word === "Dream" ? "text-[var(--pcolor1)] italic" : ""
              }`}
              style={{ perspective: "1200px" }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 2 }}
          className="text-white/30 text-sm sm:text-base md:text-lg max-w-md leading-relaxed mb-14"
        >
          Step inside extraordinary living spaces
          <br className="hidden sm:block" />
          designed for those who settle for nothing less.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.button
            onClick={() => navigate("/properties")}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="group relative px-14 py-5 bg-[var(--pcolor1)] text-white text-sm tracking-[0.2em] uppercase overflow-hidden flex items-center gap-4 shadow-2xl shadow-[var(--pcolor1)]/30 hover:shadow-[var(--pcolor1)]/50 transition-shadow duration-500"
          >
            {/* Shine effect */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-0 -skew-x-12"
              initial={{ x: "-200%" }}
              animate={{ x: "200%" }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut",
              }}
            />
            <span className="relative z-10 font-semibold">Explore Units</span>
            <motion.span
              className="relative z-10 inline-block"
              animate={{ x: [0, 6, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
