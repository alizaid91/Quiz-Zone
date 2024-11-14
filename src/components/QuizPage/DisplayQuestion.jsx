import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Button1 } from "../../utils/Buttons";
import { decodeHtmlEntities } from "../../utils/Fomater";

const DisplayQuestion = ({ questionData, displayQuestion, setDisplayQuestion }) => {
    const [selected, setSelected] = useState("");
    const [showAnswer, setShowAnswer] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (displayQuestion === questionData.id) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [displayQuestion]);
    return (
        <div className={`${displayQuestion === questionData.id ? 'visible bg-black/65' : 'invisible'} transition-colors duration-500 fixed inset-0 flex justify-center items-center`}>
            <div onClick={() => setDisplayQuestion(null)} className="absolute top-5 left-1/2 -translate-x-1/2 bg-white hover:bg-slate-200 text-2xl rounded-full p-1 cursor-pointer">
                <RxCross2 />
            </div>
            <div className={`${displayQuestion === questionData.id ? 'scale-100 opacity-100' : 'scale-125 opacity-0'} transition-all duration-300 relative mx-3 w-full sm:w-[400px] md:w-[600px] lg:w-[700px] max-h-[400px] md:max-h-max overflow-y-scroll md:overflow-y-auto bg-blue-500 rounded-xl no-scrollbar py-5 px-3`}>
                {/* Question div */}
                <div className="flex items-center gap-3">
                    <span class="text-base font-bold text-white">Try</span>
                    <label class="inline-flex items-center cursor-pointer">
                        <input onClick={() => setShowAnswer(!showAnswer)} type="checkbox" value={showAnswer} class="sr-only peer" />
                        <div class="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 bg-black/80 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-800"></div>
                    </label>
                    <span class="text-base font-bold text-white">Show answer</span>
                </div>
                <div className='mx-2 mb-2 mt-2 rounded-lg pb-[0.35rem] pr-[0.35rem] bg-[#092066] relative'>
                    <div className={`relative bg-white py-2 md:py-4 px-4 lg:px-6 rounded-lg text-xl lg:text-2xl font-bold`}>
                        {decodeHtmlEntities(questionData.question)}
                    </div>
                </div>
                {/* Answers div */}
                <div className='pt-3 w-full'>
                    {questionData.type === 'multiple'
                        ? <div className='m-2 grid grid-cols-1 sm:grid-cols-2 gap-5 text-base md:text-lg lg:text-xl my-auto'>

                            {[...Array(questionData.optionPatt)].map((_, index) => (
                                <div key={index}
                                    onClick={() => setSelected(c => c === questionData.incorrect_answers[index] ? "" : questionData.incorrect_answers[index])}
                                    className={`${showAnswer ? 'bg-[#092066] text-white pointer-events-none' : checked && questionData.incorrect_answers[index] === selected ? 'bg-red-600 text-white' : selected === questionData.incorrect_answers[index] ? 'bg-white text-black' : 'bg-[#092066] text-white'} ${checked && 'pointer-events-none'} transition-all cursor-pointer p-3 rounded-md relative font-semibold z-20`}>
                                    <span className="">{decodeHtmlEntities(questionData.incorrect_answers[index])}</span>
                                </div>
                            ))}

                            <div
                                onClick={() => setSelected(c => c === questionData.correct_answer ? "" : questionData.correct_answer)}
                                className={`${showAnswer || checked ? 'bg-green-600 text-white pointer-events-none' : selected === questionData.correct_answer ? 'bg-white text-black' : 'bg-[#092066] text-white'}  ${checked && 'pointer-events-none'}  transition-all cursor-pointer p-3 rounded-md relative font-semibold z-20}`}>
                                <span>{decodeHtmlEntities(questionData.correct_answer)}</span>
                            </div>

                            {[...Array(3 - questionData.optionPatt)].map((_, index) => (
                                <div key={index}
                                    onClick={() => setSelected(c => c === questionData.incorrect_answers[index + questionData.optionPatt] ? "" : questionData.incorrect_answers[index + questionData.optionPatt])}
                                    className={`${showAnswer ? 'bg-[#092066] text-white pointer-events-none' : checked && questionData.incorrect_answers[index + questionData.optionPatt] === selected ? 'bg-red-600 text-white' : selected === questionData.incorrect_answers[index + questionData.optionPatt] ? 'bg-white text-black' : 'bg-[#092066] text-white'}  ${checked && 'pointer-events-none'} transition-all cursor-pointer p-3 rounded-md relative font-semibold z-20`}>
                                    <span>{decodeHtmlEntities(questionData.incorrect_answers[index + questionData.optionPatt])}</span>
                                </div>
                            ))}

                        </div>
                        : questionData.optionPatt == 0
                            ? <div className='m-2 grid grid-cols-1 sm:grid-cols-2 gap-5 text-base md:text-lg lg:text-2xl my-auto'>

                                <div
                                    onClick={() => setSelected(c => c === questionData.correct_answer ? "" : questionData.correct_answer)}
                                    className={`${showAnswer || checked ? 'bg-green-600 text-white pointer-events-none' : selected === questionData.correct_answer ? 'bg-white text-black' : 'bg-[#092066] text-white'}  ${checked && 'pointer-events-none'}  transition-all cursor-pointer p-3 rounded-md relative font-semibold z-20}`}>
                                    <span>{decodeHtmlEntities(questionData.correct_answer)}</span>
                                </div>

                                <div
                                    onClick={() => setSelected(c => c === questionData.incorrect_answers[0] ? "" : questionData.incorrect_answers[0])}
                                    className={`${showAnswer ? 'bg-[#092066] text-white pointer-events-none' : checked && questionData.incorrect_answers[0] === selected ? 'bg-red-600 text-white' : selected === questionData.incorrect_answers[0] ? 'bg-white text-black' : 'bg-[#092066] text-white'} ${checked && 'pointer-events-none'} transition-all cursor-pointer p-3 rounded-md relative font-semibold z-20`}>
                                    <span>{decodeHtmlEntities(questionData.incorrect_answers[0])}</span>
                                </div>
                            </div>
                            : <div className='m-2 grid grid-cols-1 sm:grid-cols-2 gap-5 text-base md:text-lg lg:text-2xl my-auto'>

                                <div
                                    onClick={() => setSelected(c => c === questionData.incorrect_answers[0] ? "" : questionData.incorrect_answers[0])}
                                    className={`${showAnswer ? 'bg-[#092066] text-white pointer-events-none' : checked && questionData.incorrect_answers[0] === selected ? 'bg-red-600 text-white' : selected === questionData.incorrect_answers[0] ? 'bg-white text-black' : 'bg-[#092066] text-white'} ${checked && 'pointer-events-none'} transition-all cursor-pointer p-3 rounded-md relative font-semibold z-20`}>
                                    <span>{decodeHtmlEntities(questionData.incorrect_answers[0])}</span>
                                </div>

                                <div
                                    onClick={() => setSelected(c => c === questionData.correct_answer ? "" : questionData.correct_answer)}
                                    className={`${showAnswer || checked ? 'bg-green-600 text-white pointer-events-none' : selected === questionData.correct_answer ? 'bg-white text-black' : 'bg-[#092066] text-white'}  ${checked && 'pointer-events-none'}  transition-all cursor-pointer p-3 rounded-md relative font-semibold z-20}`}>
                                    <span>{decodeHtmlEntities(questionData.correct_answer)}</span>
                                </div>

                            </div>
                    }
                    <div onClick={() => setChecked(true)} className={`${selected && !showAnswer ? 'scale-100' : 'scale-0'} transition-all w-full flex justify-center mt-5`}><Button1 text="Check" /></div>
                </div>
            </div>
        </div>
    );
};

export default DisplayQuestion;
