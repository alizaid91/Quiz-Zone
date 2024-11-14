import React, { useEffect, useState } from 'react'
import newsletterImg from '../../assets/newsletter_bg.avif'
import { RxCross2 } from "react-icons/rx";
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { useLocalStorage } from '../../utils/CustomHook';

function Newsletter() {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});

    const [showNewsLetter, setShowNewsLetter] = useState(false);
    const [showed, setShowed] = useState(JSON.parse(localStorage.getItem('showed')) || false)

    const [subscribing, setSubscribing] = useState(false);
    const [subscribedMsg, setSubscribedMsg] = useState(false);

    useEffect(() => {
        if (!showed) {
            setTimeout(() => {
                setShowNewsLetter(true);
                setShowed(true)
                useLocalStorage('showed', true)
            }, 5000)
        }
    }, [])

    const validate = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubscribe = async () => {
        if (validate()) {
            try {
                setSubscribing(true);
                await addDoc(collection(db, 'subscribers'), { email });
                setSubscribing(false);
                setShowNewsLetter(false);
                setSubscribedMsg(true);
            } catch (error) {
                setSubscribing(false);
                console.error("Error subscribing:", error);
            }
        }
    };

    useEffect(() => {
        if (showNewsLetter || subscribedMsg) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showNewsLetter, subscribedMsg]);


    return (
        <div className={`${showNewsLetter || subscribedMsg ? 'visible' : 'invisible'} transition-all fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center`}>
            <div className={`${showNewsLetter || subscribedMsg ? 'visible scale-100' : 'scale-0 invisible'} transition-all duration-500 bg-gray-100 w-[300px] grid grid-cols-1 md:grid-cols-2 md:w-[700px] rounded-xl overflow-hidden relative`}>
                <div className=''>
                    <img className='object-cover' src={newsletterImg} alt="newsletterImg" />
                </div>
                <div className='mybg flex items-center'>
                    <div className={`${!subscribedMsg && showNewsLetter ? 'block' : 'hidden'}`}>
                        <div className={`sm:flex sm:flex-col justify-center items-center`}>
                            <div className='mt-3 mb-1 px-3 md:px-6 w-full flex gap-1 flex-col text-center'>
                                <h1 className='text-white text-2xl md:text-3xl font-bold'>Stay in the Loop!</h1>
                                <p className='text-base font-semibold text-white/80 pl-1'>Subscribe to get the latest updates on new features and improvements delivered right to your inbox.</p>
                            </div>
                            <div className="sm:bg-transparent p-3">
                                <div className="bg-white/60 flex p-1 rounded-full focus-within:bg-white/80 transition-all">
                                    <input
                                        type='email'
                                        placeholder='Enter your email'
                                        className="w-full outline-none bg-transparent text-base text-black px-4 py-2 placeholder:text-black/90"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} />
                                    <button onClick={handleSubscribe} disabled={subscribing} type="button" className="bg-black/80 hover:bg-black/75 transition-all text-white font-semibold text-sm rounded-full px-3 py-2 inline-flex items-center">
                                        {
                                            subscribing
                                                ? <svg aria-hidden="true" role="status" className="inline w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                                </svg>
                                                : 'Subscribe'
                                        }
                                    </button>
                                </div>
                                {errors.email && <p className="text-white text-sm pl-4 pt-1">{errors.email}</p>}
                            </div>
                        </div>
                    </div>
                    <div className={`${subscribedMsg ? 'block' : 'hidden'} px-3 py-4 text-center`}>
                        <h1 className='px-4 font-bold text-white text-lg mb-3'>Thank you for subscribing! 🎉 You’ll be the first to know about new features and updates. Stay tuned for exciting news in your inbox!</h1>
                        <button onClick={() => setSubscribedMsg(false)} className="md:text-xl bg-black/80 hover:bg-black/75 transition-all text-white font-bold text-sm rounded-full px-6 py-2 inline-flex items-center">
                            Continue
                        </button>
                    </div>
                </div>
                <div onClick={() => setShowNewsLetter(false)} className='absolute top-2 right-2 bg-black/60 hover:bg-black/50 p-1 rounded-full text-white text-2xl cursor-pointer '>
                    <RxCross2 />
                </div>
            </div>
        </div>
    )
}

export default Newsletter