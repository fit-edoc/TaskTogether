"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Users, Zap, LayoutDashboard, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Home() {

  return (
    <div className="min-h-screen w-full relative overflow-hidden">

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">

        <Image
          src="/images/ethara.png"
          alt="logo"
          width={500}
          height={500}
          className="h-12 sm:h-16 md:h-20 object-contain"
        />

        <motion.h1 initial={{y:20, filter:'blur(10px)'}} animate={{y:0, filter:'blur(0px)'}} transition={{duration:1}} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light bg-clip-text bg-linear-to-t from-neutral-800 to-gray-100 text-transparent">
          Tasktogether
        </motion.h1>

        <p className="text-black/50 text-sm sm:text-lg md:text-xl lg:text-2xl mt-4 max-w-xl">
          Task Management Built for the Modern Enterprise.
        </p>

        <Link href="/login">
          <button className="bg-white text-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold mt-6 sm:mt-8 hover:scale-105 transition-all duration-300">
            Get Started
          </button>
        </Link>

      </div>

      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full p-2">

        <video
          className="h-full w-full object-cover rounded-2xl md:rounded-[4rem]"
          src="/color.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

      </div>

    </div>
  );
}