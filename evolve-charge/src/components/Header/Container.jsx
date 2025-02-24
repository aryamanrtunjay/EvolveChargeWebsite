import React from 'react'
import clsx from "clsx"

export default function Container({ className, ...props }) {
  return (
    <div 
        className={clsx(
            "max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8",
            className
        )}
        {...props}
    />
  )
}
