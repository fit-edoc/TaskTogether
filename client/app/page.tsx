"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Users, Zap, LayoutDashboard, ArrowRight } from "lucide-react";
import Image from "next/image";
export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen w-screen relative">
    <div className="h-screen w-screen  z-20 absolute flex flex-col justify-center items-center ">
     <Image src="/images/ethara.png" alt="logo" width={500} height={500} className=" h-20 object-contain" />
      <h1 className="text-8xl font-light bg-clip-text bg-linear-to-t from-gray-700 to-gray-100 text-transparent">Tasktogether</h1>
      <p className="text-black/50 text-2xl mt-4">Task Management Built for the Modern Enterprise.</p>
      <Link href="/login">
        <button className="bg-white text-primary px-8 py-4 rounded-full font-bold mt-8 hover:scale-105 transition-all duration-300">Get Started</button>
      </Link>
    </div>
      <div className="absolute top-0 left-0 inset-0 h-screen w-screen  p-2">

        <video className="h-full w-full object-cover rounded-[4rem]" src="/color.mp4" autoPlay loop muted></video>
      </div>  
    </div>
  );
}
