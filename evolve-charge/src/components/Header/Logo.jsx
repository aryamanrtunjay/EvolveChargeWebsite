"use client"

import Link from 'next/link'
import React from 'react'
import clsx from "clsx"
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import LogoImg from "@/images/Header/Logo.png"

export default function Logo({ className, ...props }) {

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div>
      <Link href={"/"} 
        onMouseEnter={() => {setIsHovered(true)}}
        onMouseLeave={() => {setIsHovered(false)}}
      >
        <div className="flex gap-3 items-center pb-2">
          <Image src={LogoImg} alt="logo" width={50} height={50} />
          <h2 className="text-3xl inset-0 font-bold text-white">EVolve Charge</h2>
        </div>
      </Link>
      <AnimatePresence>
        <motion.div
          className="border-b-2 border-pioneer-orange inset-0"
          initial={false}
          animate={{
            width: isHovered ? "100%" : 0,
          }}  
        >
        </motion.div>
      </AnimatePresence>
    </div>
  )
}