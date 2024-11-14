import React from 'react'
import logo from '../../assets/quiz.png';
import { FaRegStar } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Tooltip from '../../utils/Tooltip';

function Header() {
  return (
    <div className='z-10 flex items-center justify-between gap-1 absolute top-0 left-0 right-0 px-6 md:px-24 py-2 mt-4 lg:mt-6'>
      <div className='flex items-center gap-3 lg:gap-5 cursor-pointer'>
        <img className='w-9 object-cover' src={logo} alt="logo" />
        <h1 className='text-2xl lg:text-3xl font-bold mb-1 text-white'>QUIZ ZONE</h1>
      </div>
      <Link to='/starred'>
        <div className='text-[2.3rem] text-white relative group'>
          <FaRegStar className='cursor-pointer bg-black/50 p-2 rounded-full' />
          <Tooltip text="Starred questions" position="-bottom-10" />
        </div>
      </Link>
    </div>
  )
}

export default Header