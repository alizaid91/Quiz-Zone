import React from 'react'
import heroImg from '../../assets/bg-3.avif'
import Header from './Header'
import { Link } from 'react-router-dom';
import { useQuizContext } from '../../context/QuizContext';
import { Button1 } from '../../utils/Buttons';
import { socialLogos } from '../../constants';

function Hero() {
    const { setQuizInfo, setHasQuizInfoChanged } = useQuizContext();
    const handleStart = () => {
        setQuizInfo({
            category: 'any',
            questions: 10,
            type: "any",
            difficulty: "any"
        })
        setHasQuizInfoChanged(true)
    }
    return (
        <div className='relative h-[70vh] md:h-[80vh]'>
            <img className='object-cover h-full w-full' src={heroImg} alt="heroImg" />
            <div className='absolute inset-0 backdrop-blur-lg'></div>
            <div className='absolute inset-0 flex flex-col justify-center items-center gap-4'>
                <div>
                    <p className='pl-2 text-base xl:text-2xl font-medium text-white/70'>Test Your Knowledge with</p>
                    <h1 className='text-5xl md:text-6xl xl:text-8xl font-bold text-white text-nowrap tracking-wide'>Quiz Zone</h1>
                </div>
                <div onClick={handleStart} className='md:mt-2 '>
                    <Link to='/quiz'><Button1 text='Start Random Quiz' /></Link>
                </div>
            </div>
            <div className='absolute right-0 bottom-0 m-1 md:m-2'>
                <h1 className='relative bg-[#000000] rounded-lg  text-white font-bold md:text-xl tracking-wide px-2 py-2 lg:py-2 lg:px-4'>
                    Design & Developed by Ali Zaid
                    <div className='absolute -top-16 left-1/2 -translate-x-1/2 m-1 sm:mr-9 flex justify-between w-[200px] bg-[#ffffff] py-2 px-4 rounded-lg'>
                        {
                            socialLogos.map((logo, index) => (
                                <a key={index} href={logo.url} target='blank'>
                                    <div key={index} className="group logo-wrapper relative rounded-full p-2 cursor-pointer" style={{
                                        '--hover-color': 'white',
                                        '--hover-background': logo.color.length > 1
                                            ? `linear-gradient(to right, ${logo.color.join(', ')})`
                                            : logo.color[0]
                                    }}>
                                        <logo.logo />
                                        <div className='-translate-y-3 invisible group-hover:visible group-hover:translate-y-0 transition-all absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 z-50 text-white px-3 pb-1 font-normal rounded-lg' style={{
                                            'background': logo.color.length > 1
                                                ? `linear-gradient(to right, ${logo.color.join(', ')})`
                                                : logo.color[0]
                                        }}>
                                            {logo.name}
                                        </div>
                                    </div>
                                </a>
                            ))
                        }
                    </div>
                </h1>
            </div>
            <Header />
        </div>
    )
}

export default Hero