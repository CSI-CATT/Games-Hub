import React from 'react'
import { Link } from 'react-router-dom'

export default function GameCard({ title, desc, to, className, imageUrl }) {
  return (
    <div className={` bg-gray-700 rounded-lg p-6 flex flex-col justify-between w-full ${className}`}>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm flex-grow">{desc}</p>
      <img src={imageUrl} alt="game icon" className='w-[80%] self-center' />
      <Link to={to} className="mt-4 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 text-center">
        Play
      </Link>
    </div>
  )
}
