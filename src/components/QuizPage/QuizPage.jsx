import React, { useEffect, useRef, useState } from 'react';
import { useQuizContext } from '../../context/QuizContext';
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { useClickOutside, useLocalStorage } from '../../utils/CustomHook';
import { Button1 } from '../../utils/Buttons';
import { Link } from 'react-router-dom';
import { Calculator } from '../../utils/CalculateResult';
import { TbGridDots } from "react-icons/tb";
import { IoStar } from "react-icons/io5";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { resultSummaryCard } from '../../constants';
import { formatTime } from '../../utils/Fomater';
import { BsFillInfoCircleFill } from "react-icons/bs";
import Tooltip from '../../utils/Tooltip';
import { decodeHtmlEntities } from '../../utils/Fomater';

function QuizPage() {
  const { quiz, loading, error, hasQuizInfoChanged, quizInfo } = useQuizContext();
  const { starredQuestions, setStarredQuestions } = useQuizContext();

  const [currentQues, setCurrentQues] = useState(JSON.parse(localStorage.getItem('currentQues')));
  const [optionPattern, setOptionPattern] = useState(JSON.parse(localStorage.getItem('optionPattern')) || []);
  const [boolOptionPatt, setBoolOptionPatt] = useState(JSON.parse(localStorage.getItem('boolOptionPatt')) || []);
  const [responces, setResponces] = useState(JSON.parse(localStorage.getItem('responces')) || []);
  const [showNavigation, setShowNavigation] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [result, setResult] = useState(JSON.parse(localStorage.getItem('result')) || {});
  const [showResult, setShowResult] = useState(JSON.parse(localStorage.getItem('showResult')) || false);
  const [scorePr, setScorePr] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isTotalRunning, setIsTotalRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(JSON.parse(localStorage.getItem('TimeLeft')) || null);

  const navRef = useRef(null);
  const closeButtonRef = useRef(null);


  // 🟩 Timer to show time taken by each questions
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setResponces((prevRes) =>
          prevRes.map((res, index) =>
            index === currentQues && !res.checked ? { ...res, timeTaken: res.timeTaken + 1 } : res
          )
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentQues, isRunning]);

  // 🟩 Timer to show total time left (if user set a time for quiz)
  useEffect(() => {
    let intervel;
    if (timeLeft > 0 && isTotalRunning) {
      useLocalStorage('TimeLeft', timeLeft)
      intervel = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, [1000])
    } else if (quizInfo.time > 0 && timeLeft === 0) {
      handalShowResult();
    }
    return () => clearInterval(intervel)
  }, [timeLeft])

  // 🟩 closing popup or dialog box on clicking outside
  const handelClick = (e) => {

    if (closeButtonRef.current?.contains(e.target)) {
      return;
    }

    if (!navRef.current.contains(e.target)) {
      setShowNavigation(false)
    }
  }
  useClickOutside(handelClick)

  const nextQus = () => {
    if (currentQues < quiz.length - 1) {
      setIsRunning(false);
      setCurrentQues((c) => c < quiz.length - 1 ? c + 1 : c);
      setIsRunning(true);
      setAnimationClass('animate-smoothSlideInBounceLeft');

      const timer = setTimeout(() => {
        setAnimationClass('');
      }, 500);

      return () => clearTimeout(timer);
    }
  }

  const prevQues = () => {
    if (currentQues > 0) {
      setIsRunning(false);
      setCurrentQues((c) => c > 0 ? c - 1 : c);
      setIsRunning(true);
      setAnimationClass('animate-smoothSlideInBounceRight');

      const timer = setTimeout(() => {
        setAnimationClass('');
      }, 500);

      return () => clearTimeout(timer);
    }
  }

  const handelStarred = (question) => {
    const updatedArray = responces.map((element) => {
      return element.id === question.id ? { ...element, starred: !element.starred } : element
    })
    setResponces(updatedArray);
    useLocalStorage('responces', updatedArray);
    const isExist = starredQuestions.find((strQuestion) => question.question === strQuestion.question);
    if (!isExist) {
      setStarredQuestions([...starredQuestions, { ...question, optionPatt: question.type === 'multiple' ? optionPattern[currentQues] : boolOptionPatt[currentQues] }]);
      useLocalStorage('starredQuestions', [...starredQuestions, { ...question, optionPatt: question.type === 'multiple' ? optionPattern[currentQues] : boolOptionPatt[currentQues] }])
    } else {
      const newArray = starredQuestions.filter((tQuestion) => tQuestion.question !== question.question);
      setStarredQuestions(newArray);
      useLocalStorage('starredQuestions', newArray)
    }
  }

  // 🟩 next and previous questions by arrow keys
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentQues]);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      prevQues();
    } else if (event.key === "ArrowRight") {
      nextQus();
    }
  };

  const selectOption = (option) => {
    const updatedResponces = [...responces];
    if (updatedResponces[currentQues].selectedOption === option) {
      updatedResponces[currentQues].status = "not answerd"
      updatedResponces[currentQues].selectedOption = "none";
    } else {
      updatedResponces[currentQues].status = "answerd"
      updatedResponces[currentQues].selectedOption = option;
    }
    setResponces(updatedResponces);
  }

  const checkAnswer = () => {
    const updatedResponces = [...responces];
    updatedResponces[currentQues].checked = true;
    setResponces(updatedResponces);
  }


  // 🟩 Generate new option patterns ,new responce arry and save to localStorage when quiz changed
  useEffect(() => {
    if (!hasQuizInfoChanged || error === 1) {
      return;
    }
    setShowResult(false)
    setResult({})
    useLocalStorage('result', {});
    useLocalStorage('showResult', false);
    if (quiz.length > 0) {
      const generatedPattern = quiz.map(() => {
        return Math.floor(Math.random() * 4) + 0;
      });
      setOptionPattern(generatedPattern);

      const patt = quiz.map(() => {
        return Math.floor(Math.random() * 2)
      })
      setBoolOptionPatt(patt);

      const responceArray = quiz.map((quistion) => {
        return {
          id: quistion.id,
          status: 'not answered',
          selectedOption: 'none',
          correctOption: quistion.correct_answer,
          checked: false,
          starred: false,
          timeTaken: 0,
        };
      })
      setResponces(responceArray);

      useLocalStorage('optionPattern', generatedPattern);
      useLocalStorage('boolOptionPatt', patt);
      useLocalStorage('responces', responces)
      setCurrentQues(0);
    }
    if (quizInfo.time > 0) {
      setTimeLeft(quizInfo.time)
      useLocalStorage('TimeLeft', timeLeft)
      setIsTotalRunning(true);
    } else {
      setTimeLeft(null)
      useLocalStorage('TimeLeft', timeLeft)

    }
  }, [quiz]);

  // 🟩 save current question and responces to localStorage when it changed
  useEffect(() => {
    if (error === 1) return;
    useLocalStorage('currentQues', currentQues);
    useLocalStorage('responces', responces);
  }, [responces, currentQues, quiz])

  // 🟩 show results
  useEffect(() => {
    if (!showResult) {
      return;
    }
    setTimeout(() => {
      if (scorePr < result.score) {
        setScorePr(scorePr + 1);
      }
    }, 10)
  }, [scorePr, result])

  const handalShowResult = () => {
    setIsTotalRunning(false)
    const [result] = Calculator(quiz, responces);
    setResult(result);
    useLocalStorage("result", result);
    setShowResult(true);
    useLocalStorage("showResult", true)
  }

  const exitResult = () => {
    setShowResult(false)
    setResult({})
    useLocalStorage('result', {});
    useLocalStorage('showResult', false);
  }

  return (
    <div className='w-screen h-screen flex flex-col items-center'>
      {loading
        ? <div aria-label="Loading..." role="status" className="flex items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg className="h-20 w-20 animate-spin stroke-gray-100" viewBox="0 0 256 256">
            <line x1="128" y1="32" x2="128" y2="64" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
            <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
            <line x1="224" y1="128" x2="192" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
            <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
            <line x1="128" y1="224" x2="128" y2="192" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
            <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
            <line x1="32" y1="128" x2="64" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
            <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
          </svg>
          <span className="text-4xl font-medium text-gray-50">Loading...</span>
        </div>
        :
        error == 1 ? <div className='w-screen h-screen flex flex-col justify-center items-center'>
          <span className="px-5 text-xl md:text-2xl lg:text-3xl font-medium text-gray-50">Sorry! This Quiz is not available. Try different one.</span>
          <div className='mt-5'><Link to="/"><Button1 text="Back to Quiz Zone" /></Link></div>
        </div>
          : optionPattern.length > 0
            ? <div className='w-full h-full sm:w-[500px] md:w-[700px] mt-3 md:mt-6 flex flex-col gap-1 overflow-x-hidden pb-24 sm:px-3 scroll-smooth'>
              <div className='flex items-center justify-between gap-5 py-2 px-6 mb-1'>
                <Link to="/">
                  <div className=''><Button1 text='Exit' classes='px-4 md:px-6 py-1' /></div>
                </Link>
                <div>{quizInfo.time > 0 && <div className={`text-xl font-bold ${timeLeft <= 10 ? 'bg-white text-red-600' : 'bg-black/50 text-white'}  px-3 py-1 rounded-md`}>{formatTime(timeLeft)}</div>}</div>
                <div onClick={handalShowResult} className=''><Button1 text='Submit' classes='px-4 md:px-6 py-1' /></div>
              </div>
              <div className='bg-black/20 text-xl md:text-2xl rounded-lg py-2 md:py-3 mb-7 mx-2 px-4 text-white flex gap-4 items-center justify-between relative'>
                <div className='flex items-center gap-3'>
                  <div className='relative group' ref={closeButtonRef} onClick={() => setShowNavigation(!showNavigation)}>
                    <TbGridDots className='text-white hover:scale-105 transition-all cursor-pointer text-2xl' />
                    <Tooltip text="Grid view" />
                  </div>
                  <div className='cursor-pointer relative group'>
                    <BsFillInfoCircleFill />
                    <Tooltip text="Quiz info" />
                  </div>
                  <div className='relative group' onClick={() => handelStarred(quiz[currentQues])}>
                    <IoStar className={`${responces[currentQues].starred ? 'text-yellow-500' : 'text-white'} hover:scale-105 transition-all cursor-pointer`} />
                    <Tooltip text="Star this question" />
                  </div>
                </div>
                <div className='font-bold text-white/85'><span>Time/Q: </span><span className='text-white'>{formatTime(responces[currentQues].timeTaken)}</span></div>
                <div ref={navRef} className={`${showNavigation ? 'visible opacity-100 translate-y-0' : '-translate-y-5 opacity-0 invisible'} transition-all duration-300 py-4 px-3 mx-2 md:mx-auto absolute top-12 left-0 md:left-3 z-50 backdrop-blur-md bg-black/40 rounded-xl max-w-[400px]`}>
                  <div className='w-full flex items-center flex-wrap gap-3'>
                    {
                      responces.map((question, index) => (
                        <div key={index} onClick={() => { setCurrentQues(index); setShowNavigation(false) }} className={`h-8 w-8 p-4 flex justify-center items-center ${question.id - 1 === currentQues ? 'border-[3px] border-black' : ''} ${question.checked === true && question.selectedOption === question.correctOption ? 'bg-green-600 text-white' : question.checked === true && question.selectedOption !== question.correctOption ? 'bg-red-600 text-white' : 'bg-white text-black/80'} transition-colors rounded-full font-semibold cursor-pointer text-xl md:text-2xl md:w-12 md:h-12 md:p-6`}>
                          {question.id}
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
              <div className='w-full h-full relative'>
                <div className={`main-div ${animationClass}`}>
                  {/* Question div */}
                  <div className='mx-2 mb-2 mt-2 rounded-lg pb-[0.35rem] pr-[0.35rem] bg-[#092066] relative'>
                    <h1 className='flex items-center absolute -top-7 md:-top-8 left-1/2 -translate-x-1/2 text-xl md:text-2xl bg-white font-bold px-2 rounded-t-lg'>
                      <span>{currentQues + 1}</span>
                      <span className='text-balck/85 pb-[0.1rem]'>/</span>
                      <span>{quiz.length}</span>
                    </h1>
                    <div className='relative bg-white py-2 md:py-4 px-4 lg:px-6 rounded-lg text-xl lg:text-2xl font-bold'>
                      {decodeHtmlEntities(quiz[currentQues].question)}
                    </div>
                  </div>
                  {/* Answers div */}
                  <div className='pt-3'>

                    {quiz[currentQues].type === 'multiple'
                      ? <div className='m-2 grid grid-cols-1 sm:grid-cols-2 gap-5 text-base md:text-lg lg:text-xl my-auto'>

                        {[...Array(optionPattern[currentQues])].map((_, index) => (
                          <div key={index}
                            onClick={() => selectOption(quiz[currentQues].incorrect_answers[index])}
                            className={`${quiz[currentQues].incorrect_answers[index] === responces[currentQues].selectedOption ? responces[currentQues].checked == true ? 'text-white' : 'text-black' : 'text-white'} ${responces[currentQues].checked == true ? 'pointer-events-none text-white' : ''} bg-[#092066] px-3 py-2 font-semibold rounded-lg cursor-pointer relative z-20`}>
                            <span>{decodeHtmlEntities(quiz[currentQues].incorrect_answers[index])}</span>
                            <div
                              className={`${quiz[currentQues].incorrect_answers[index] === responces[currentQues].selectedOption ? 'w-full transition-all' : 'w-0'} ${responces[currentQues].checked == true && quiz[currentQues].incorrect_answers[index] === responces[currentQues].selectedOption ? 'bg-red-500' : 'bg-white'} absolute left-0 bottom-0 top-0 -z-10 rounded-lg`}>
                            </div>
                          </div>
                        ))}

                        <div
                          onClick={() => selectOption(quiz[currentQues].correct_answer)}
                          className={`${quiz[currentQues].correct_answer === responces[currentQues].selectedOption ? responces[currentQues].checked == true ? 'text-white' : 'text-[#000000]' : 'text-white'} ${responces[currentQues].checked == true ? 'pointer-events-none' : ''} bg-[#092066] px-3 py-2 font-semibold rounded-lg cursor-pointer relative z-20`}>
                          <span>{decodeHtmlEntities(quiz[currentQues].correct_answer)}</span>
                          <div
                            className={`${quiz[currentQues].correct_answer === responces[currentQues].selectedOption ? 'w-full transition-all' : 'w-0'} ${responces[currentQues].checked == true ? 'bg-green-500 w-full' : 'bg-white'} absolute left-0 bottom-0 top-0 -z-10 rounded-lg`}>
                          </div>
                        </div>

                        {[...Array(3 - optionPattern[currentQues])].map((_, index) => (
                          <div key={index}
                            onClick={() => selectOption(quiz[currentQues].incorrect_answers[index + optionPattern[currentQues]])}
                            className={`${quiz[currentQues].incorrect_answers[index + optionPattern[currentQues]] === responces[currentQues].selectedOption ? responces[currentQues].checked == true ? 'text-white' : 'text-black' : 'text-white'} ${responces[currentQues].checked == true ? 'pointer-events-none' : ''} bg-[#092066] px-3 py-2 font-semibold rounded-lg cursor-pointer relative z-20`}>
                            <span>{decodeHtmlEntities(quiz[currentQues].incorrect_answers[index + optionPattern[currentQues]])}</span>
                            <div
                              className={`${quiz[currentQues].incorrect_answers[index + optionPattern[currentQues]] === responces[currentQues].selectedOption ? 'w-full transition-all' : 'w-0'} ${responces[currentQues].checked == true && quiz[currentQues].incorrect_answers[index + optionPattern[currentQues]] === responces[currentQues].selectedOption ? 'bg-red-500' : 'bg-white'} absolute left-0 bottom-0 top-0 -z-10 rounded-lg`}>
                            </div>
                          </div>
                        ))}

                      </div>
                      : boolOptionPatt[currentQues] == 0
                        ? <div className='m-2 grid grid-cols-1 sm:grid-cols-2 gap-5 text-base md:text-lg lg:text-2xl my-auto'>

                          <div
                            onClick={() => selectOption(quiz[currentQues].correct_answer)}
                            className={`${quiz[currentQues].correct_answer === responces[currentQues].selectedOption ? responces[currentQues].checked == true ? 'text-white' : 'text-[#000000]' : 'text-white'} ${responces[currentQues].checked == true ? 'pointer-events-none' : ''} bg-[#092066] px-3 py-2 font-semibold rounded-lg cursor-pointer relative z-20`}>
                            <span>{decodeHtmlEntities(quiz[currentQues].correct_answer)}</span>
                            <div
                              className={`${quiz[currentQues].correct_answer === responces[currentQues].selectedOption ? 'w-full transition-all' : 'w-0'} ${responces[currentQues].checked == true ? 'bg-green-500 w-full' : 'bg-white'} absolute left-0 bottom-0 top-0 -z-10 rounded-lg`}>
                            </div>
                          </div>

                          <div
                            onClick={() => selectOption(quiz[currentQues].incorrect_answers[0])}
                            className={`${quiz[currentQues].incorrect_answers[0] === responces[currentQues].selectedOption ? responces[currentQues].checked == true ? 'text-white' : 'text-[#000000]' : 'text-white'} ${responces[currentQues].checked == true ? 'pointer-events-none' : ''} bg-[#092066] px-3 py-2 font-semibold rounded-lg cursor-pointer relative z-20`}>
                            <span>{decodeHtmlEntities(quiz[currentQues].incorrect_answers[0])}</span>
                            <div
                              className={`${quiz[currentQues].incorrect_answers[0] === responces[currentQues].selectedOption ? 'w-full transition-all' : 'w-0'} ${responces[currentQues].checked == true && quiz[currentQues].incorrect_answers[0] === responces[currentQues].selectedOption ? 'bg-red-500' : 'bg-white'} absolute left-0 bottom-0 top-0 -z-10 rounded-lg`}>
                            </div>
                          </div>
                        </div>
                        : <div className='m-2 grid grid-cols-1 sm:grid-cols-2 gap-5 text-base md:text-lg lg:text-2xl my-auto'>

                          <div
                            onClick={() => selectOption(quiz[currentQues].incorrect_answers[0])}
                            className={`${quiz[currentQues].incorrect_answers[0] === responces[currentQues].selectedOption ? responces[currentQues].checked == true ? 'text-white' : 'text-[#000000]' : 'text-white'} ${responces[currentQues].checked == true ? 'pointer-events-none' : ''} bg-[#092066] px-3 py-2 font-semibold rounded-lg cursor-pointer relative z-20`}>
                            <span>{decodeHtmlEntities(quiz[currentQues].incorrect_answers[0])}</span>
                            <div
                              className={`${quiz[currentQues].incorrect_answers[0] === responces[currentQues].selectedOption ? 'w-full transition-all' : 'w-0'} ${responces[currentQues].checked == true && quiz[currentQues].incorrect_answers[0] === responces[currentQues].selectedOption ? 'bg-red-500' : 'bg-white'} absolute left-0 bottom-0 top-0 -z-10 rounded-lg`}>
                            </div>
                          </div>

                          <div
                            onClick={() => selectOption(quiz[currentQues].correct_answer)}
                            className={`${quiz[currentQues].correct_answer === responces[currentQues].selectedOption ? responces[currentQues].checked == true ? 'text-white' : 'text-[#000000]' : 'text-white'} ${responces[currentQues].checked == true ? 'pointer-events-none' : ''} bg-[#092066] px-3 py-2 font-semibold rounded-lg cursor-pointer relative z-20`}>
                            <span>{decodeHtmlEntities(quiz[currentQues].correct_answer)}</span>
                            <div
                              className={`${quiz[currentQues].correct_answer === responces[currentQues].selectedOption ? 'w-full transition-all' : 'w-0'} ${responces[currentQues].checked == true ? 'bg-green-500 w-full' : 'bg-white'} absolute left-0 bottom-0 top-0 -z-10 rounded-lg`}>
                            </div>
                          </div>

                        </div>
                    }
                  </div>
                </div>
                {/* Navigation div */}
                <div className='fixed md:w-[650px] bottom-0 md:bottom-1 left-0 right-0 md:left-1/2 md:-translate-x-1/2 z-50 flex justify-between items-center px-4 py-3 md:py-2 text-2xl bg-black/40 backdrop-blur-xl lg:rounded-lg'>
                  <div onClick={prevQues} ><Button1 text={<GrPrevious />} /></div>
                  {responces[currentQues].checked == true
                    ? ''
                    : <div onClick={checkAnswer} className={`${responces[currentQues].status === 'answerd' ? responces[currentQues].checked == true ? 'scale-0' : 'scale-100' : 'scale-0'} transition-all`}><Button1 text="Check" classes="py-2 px-6" /></div>}
                  <div onClick={nextQus}><Button1 text={<GrNext />} /></div>
                </div>
              </div>
            </div> : ''}
      <div className={`${showResult ? 'visible' : 'invisible'} transition-all fixed inset-0 w-screen h-h-screen bg-black/40 flex justify-center items-center backdrop-blur-md z-50 overflow-hidden`}>
        <div className={`${showResult ? 'visible scale-100' : 'scale-125 invisible'} scrollable-container transition-all bg-white px-3 py-6 w-[300px] sm:w-[350px] h-[400px] md:h-[500px] flex flex-col gap-5 rounded-xl overflow-y-scroll scroll-smooth`}>
          <div>
            <h1 className='my-color text-4xl font-bold text-center'>
              Quiz Results
            </h1>
          </div>
          <div className='w-full flex flex-col items-center'>
            <h1 className='text-xl md:text-2xl font-bold'>{result.score >= 80 ? 'Outstanding performance!' : result.score >= 65 && result.score < 80 ? 'Great job!' : 'Keep practicing!'}</h1>
            <div className='text-center mt-2' style={{ width: 150 }}>
              <h1 className='text-xl font-bold mb-2 text-gray-600'>You scored!</h1>
              <CircularProgressbar
                value={scorePr}
                text={`${scorePr}%`}
                styles={buildStyles({
                  pathColor: scorePr >= 80 ? "green" : scorePr >= 65 && scorePr < 80 ? "orange" : "red",
                  textColor: "#000",
                  trailColor: "#d6d6d6",
                  backgroundColor: "#3e98c7",
                })} />
            </div>
          </div>
          <div className='mx-1 md:mx-4'>
            <h1 className='text-xl font-semibold mb-3'>Summary</h1>
            <div className='flex flex-col gap-3'>
              {
                resultSummaryCard.map((icon, index) => (
                  <div key={index} className='flex justify-between items-center bg-slate-400/40 py-2 px-4 rounded-lg '>
                    <div className='flex items-center gap-3'>
                      <img src={icon.icon} alt={icon.title} />
                      <div className='text-base font-semibold text-black/90'>
                        {icon.title}
                      </div>
                    </div>
                    <div>
                      <h1 className='text-lg font-bold'>
                        {index === 0
                          ? result.totalQuestions
                          : index === 1
                            ? result.attempted
                            : index === 2
                              ? result.correct
                              : index === 3
                                ? result.accuracy + '%'
                                : result.incorrect
                        }
                      </h1>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          <div className='mx-auto mt-1'>
            <Link to='/'>
              <button onClick={exitResult} className="pushable w-fit">
                <span className="shadow"></span>
                <span className="edge"></span>
                <span className="front"> Continue </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizPage;