import React from 'react'

function Tooltip({ text, position }) {
    return (
        <div className={`hidden md:block absolute ${position || '-top-10'} -translate-y-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all text-nowrap z-50 left-1/2 -translate-x-1/2 bg-gray-400/60 font-semibold backdrop-blur-lg px-2 py-1 text-base rounded-md`}>
            {text}
        </div>
    )
}

export default Tooltip