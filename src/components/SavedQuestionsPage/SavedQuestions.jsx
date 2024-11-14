import React, { useEffect, useState } from 'react'
import { useQuizContext } from '../../context/QuizContext'
import { MdDelete } from "react-icons/md";
import { useLocalStorage } from '../../utils/CustomHook';
import star from '../../assets/icons/star.png'
import DisplayQuestion from '../QuizPage/DisplayQuestion';
import { decodeHtmlEntities } from '../../utils/Fomater';

function SavedQuestions() {
  const { starredQuestions, setStarredQuestions } = useQuizContext();
  const [categories, setCategories] = useState(["all"]);
  const [filteredStarred, setFilteredStarred] = useState([])
  const [displayQuestion, setDisplayQuestion] = useState(null);
  const [showCategory, setShowCategory] = useState("all");
  useEffect(() => {
    if (!starredQuestions) {
      return;
    }

    const extractCategories = starredQuestions.map((question) => question.category);
    const uniqueCategories = ["all", ...new Set(extractCategories)];
    setCategories(uniqueCategories)
  }, [starredQuestions])

  useEffect(() => {
    if (showCategory === "all") {
      setFilteredStarred(starredQuestions);
    } else {
      const filter = starredQuestions.filter((question) => question.category === showCategory);
      setFilteredStarred(filter);
    }
  }, [showCategory, starredQuestions])

  const handalUnStar = (sQuestion) => {
    const updatedStarred = starredQuestions.filter((question) => question.question !== sQuestion)
    setStarredQuestions(updatedStarred);
    useLocalStorage('starredQuestions', updatedStarred);
  }

  return (
    <div className=''>
      {starredQuestions.length > 0
        ?
        <div className='mx-auto w-full sm:max-w-[400px] pb-6'>
          <h1 className='text-2xl font-bold text-center my-5 bg-white w-fit mx-auto px-3 pb-1 rounded-lg'>Starred Questions</h1>
          <div className='flex gap-2 overflow-x-scroll no-scrollbar p-3 mx-1'>
            {
              categories.map((category, index) => (
                <div onClick={() => setShowCategory(category)} className={`cursor-pointer flex-shrink-0 ${category === showCategory ? 'bg-white text-black' : 'bg-black/70 hover:bg-black/80 text-white'} transition-all p-2 rounded-md font-semibold`} key={index}>
                  {decodeHtmlEntities(category)}
                </div>
              ))
            }
          </div>
          <div className='p-2 flex flex-col gap-3 mt-2 rounded-lg overflow-hidden'>
            {
              filteredStarred.map((question, index) => (
                <div key={index} className='flex items-center gap-2 bg-white/30 rounded-lg pr-2 '>
                  <div onClick={() => setDisplayQuestion(question.id)} className='bg-white/90 pl-2 pr-1 py-2 rounded-lg text-base sm:text-lg font-semibold cursor-pointer flex-1'>
                    <span>{decodeHtmlEntities(question.question).slice(0, 40)}...</span>
                  </div>
                  <div onClick={() => handalUnStar(question.question)} className='text-2xl cursor-pointer' >
                    <MdDelete />
                  </div>
                  <DisplayQuestion displayQuestion={displayQuestion} setDisplayQuestion={setDisplayQuestion} questionData={question} />
                </div>
              ))
            }
          </div>
        </div>
        : <div className='w-screen h-screen flex justify-center items-center'>
          <div className='flex flex-col items-center'>
            <img className='w-40 md:w-44 lg:w-52 object-cover' src={star} alt="" />
            <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-white'>No starred questions!</h1>
          </div>
        </div>
      }
    </div>
  )
}

export default SavedQuestions