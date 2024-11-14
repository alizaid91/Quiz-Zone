import { categories } from "../../constants";

import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { RxCross1 } from "react-icons/rx";
import { useQuizContext } from "../../context/QuizContext";
import { Button1 } from "../../utils/Buttons";
import { useClickOutside } from "../../utils/CustomHook";
import { formatTime } from "../../utils/Fomater";

function Categegories() {
    const { setQuizInfo, setHasQuizInfoChanged } = useQuizContext();
    const [openedCard, setOpendCard] = useState({})
    const [opened, setOpened] = useState(false)
    const [quizDetails, setQuizDetails] = useState({
        category: 0,
        questions: 10,
        type: "any",
        difficulty: "any",
        time: 0,
    })
    const [preTime, setPreTime] = useState([]);
    useEffect(() => {
        setPreTime([(quizDetails.questions + 5) * 60, (quizDetails.questions + 20) * 60]);
    }, [quizDetails])
    const handleOpenCard = (card) => {
        setOpendCard({
            img: card.thumbImg,
            id: card.id
        });
        setQuizDetails({ ...quizDetails, category: card.id })
        setOpened(true)
    }

    const handleCloseCard = () => {
        setQuizDetails({
            category: 0,
            questions: 10,
            type: "any",
            difficulty: "any",
            time: 0,
        });
        setOpened(false)
    }

    const increment = () => {
        if (quizDetails.questions < 20) {
            setQuizDetails({ ...quizDetails, questions: quizDetails.questions + 1 });
        }
    };

    const decrement = () => {
        if (quizDetails.questions > 10) {
            setQuizDetails({ ...quizDetails, questions: quizDetails.questions - 1 });
        }
    }

    const handleStart = () => {
        setQuizInfo(quizDetails);
        setHasQuizInfoChanged(true)
    }

    const popUpRef = useRef(null);

    const handelClick = (e) => {
        if (!popUpRef.current.contains(e.target)) {
            handleCloseCard();
        }
    }

    useClickOutside(handelClick)

    useEffect(() => {
        if (opened) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [opened]);

    return (
        <div className="mt-6 xl:mt-8 scroll-smooth">
            <div className="bg-[#092066] mx-auto sm:ml-14 lg:ml-20 rounded-lg pb-1 pr-1 w-fit">
                <h1 className="text-2xl xl:text-3xl font-bold bg-white rounded-lg w-fit px-2 pb-1">Categories</h1>
            </div>
            <div className="mx-6 sm:mx-12 lg:mx-16 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 lg:gap-10 mt-3 lg:mt-6 pb-8">
                {categories.map((category, index) => (
                    <div onClick={() => handleOpenCard(category)} key={index} className="group relative w-[250px] sm:w-auto max-w-[250px] h-[350px] mx-auto sm:mx-0 sm:max-w-none rounded-xl overflow-hidden hover:scale-105 transition-all duration-500 cursor-pointer">
                        <img className="object-cover w-full h-full" src={category.thumbImg} alt={category.name} />
                        <p className="absolute w-[95%] text-center bottom-0 left-1/2 -translate-x-1/2 text-white bg-black/50 text-lg font-bold tracking-wide py-2 backdrop-blur-lg rounded-xl mb-1">{category.name}</p>
                    </div>
                ))}
            </div>
            <div className={`${opened ? 'visible bg-black/60' : 'invisible'} transition-colors duration-500 fixed inset-0 z-50 flex justify-center items-center`}>
                <div className={`${opened ? 'scale-100 opacity-100' : 'scale-125 opacity-0'} transition-all duration-300 relative rounded-2xl overflow-hidden mx-5 min-w-[300px] md:min-w-[400px]`}>
                    <img className="absolute inset-0 -z-20 w-full h-full object-cover" src={openedCard.img} alt="" />
                    <div onClick={() => handleCloseCard()} className="absolute top-6 right-5 z-50 cursor-pointer">
                        <RxCross1 className="text-black text-xl md:text-2xl xl:text-3xl" />
                    </div>
                    <div className="absolute inset-0 -z-10 bg-white/10 backdrop-blur-xl"></div>
                    <div ref={popUpRef} className="p-5 w-full flex flex-col items-center">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-5 md:gap-12">Create Quiz</h1>
                        <div className="max-w-sm w-full flex flex-col gap-5">
                            <div>
                                <label htmlFor="noOfQuestions" className="block mb-2 text-sm sm:text-lg md:text-xl font-medium text-gray-900">
                                    Choose Number of questions:
                                </label>
                                <div className="relative flex items-center max-w-[8rem]">
                                    <button
                                        type="button"
                                        onClick={decrement}
                                        className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none"
                                    >
                                        <svg className="w-3 h-3 text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                                        </svg>
                                    </button>
                                    <input
                                        type="text"
                                        id="number-of-questions"
                                        value={quizDetails.questions}
                                        readOnly
                                        className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm sm:text-lg md:text-xl font-medium focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 "
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={increment}
                                        className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none"
                                    >
                                        <svg className="w-3 h-3 text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="small" className="block mb-2 text-sm sm:text-lg md:text-xl font-medium text-gray-900">
                                    Select Difficuty
                                </label>
                                <select value={quizDetails.difficulty}
                                    onChange={(e) => setQuizDetails({ ...quizDetails, difficulty: e.target.value })}
                                    id="small"
                                    className="block w-full p-2 text-sm sm:text-lg md:text-xl font-medium  text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="any">Any</option>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="default" className="block mb-2 text-sm sm:text-lg md:text-xl font-medium text-gray-900">
                                    Select Type
                                </label>
                                <select value={quizDetails.type}
                                    onChange={(e) => setQuizDetails({ ...quizDetails, type: e.target.value })}
                                    id="default"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-lg md:text-xl font-medium rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                    <option value="any">Any</option>
                                    <option value="multiple">Multiple choise</option>
                                    <option value="boolean">True/False</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="default" className="block mb-2 text-sm sm:text-lg md:text-xl font-medium text-gray-900">
                                    Set Time
                                </label>
                                <div className="flex items-center gap-3 px-1 font-semibold">
                                    {preTime.map((ttime, index) => (
                                        <div onClick={() => setQuizDetails(q => q.time === ttime ? { ...q, time: 0 } : { ...q, time: ttime })} className={`${ttime === quizDetails.time ? 'bg-black hover:bg-black/80 text-white ' : 'bg-white text-black hover:bg-white/60'} transition-all py-1 px-3 rounded-md cursor-pointer`} key={index}>
                                            {formatTime(ttime)}
                                        </div>
                                    ))}
                                    <div className="">
                                        <input type="number" min="0" max="120" onChange={(e) => setQuizDetails({ ...quizDetails, time: e.target.value * 60 > 120 ? 0 : e.target.value * 60 })} placeholder="custom" className="w-24 py-1 pl-2 box-border rounded-md" />
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div onClick={handleStart} className="mt-5">
                            <Link to="/quiz"><Button1 text='Start' /></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Categegories