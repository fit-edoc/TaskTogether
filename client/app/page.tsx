import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
   <div className="h-screen w-screen bg-linear-to-b from-blue-500 to-purple-500 flex  flex-col items-center justify-center">
    <h1 className="text-6xl font-bold text-white">Welcome to task together</h1>
    <p className="text-2xl font-bold text-white">Track your tasks together</p>
   <div className="flex justify-center gap-3">
     <Link href="/login">
    <button className="bg-white text-blue-500 px-4 py-2 rounded-full">Login</button>
   </Link>
   <Link href="/register">
    <button className="bg-white text-blue-500 px-4 py-2 rounded-full">Register</button>
   </Link>
   </div>
    </div>
  );
}
