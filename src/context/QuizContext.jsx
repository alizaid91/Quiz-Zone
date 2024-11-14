import { createContext, useContext, useEffect, useState } from "react"
import { useLocalStorage } from "../utils/CustomHook";


const QuizContext = createContext(null);

export function QuizProvider({ children }) {

    const [quizInfo, setQuizInfo] = useState({
        category: '9',
        questions: 10,
        type: "any",
        difficulty: "any"
    })

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(0);
    const [quiz, setQuiz] = useState(JSON.parse(localStorage.getItem('quiz')) || []);
    const [starredQuestions, setStarredQuestions] = useState(JSON.parse(localStorage.getItem('starredQuestions')) || []);

    const [hasQuizInfoChanged, setHasQuizInfoChanged] = useState(false);

    const fetchQuiz = async (url) => {
        try {
            setLoading(true)
            const resp = await fetch(url);
            if (resp.status === 429) {
                throw new Error("Too Many Requests: Rate-limited by the API");
            }
            if (!resp.ok) {
                throw new Error("Problem in fetching");
            }
            const data = await resp.json();
            if (data.response_code === 1) {
                setError(1);
                setLoading(false)
                return;
            }
            const apiQuiz = data.results.map((question, index) => {
                return { ...question, id: index + 1 }
            })
            useLocalStorage('quiz', apiQuiz);
            setQuiz(apiQuiz);
            setError(0);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError(error);
        }
    }
    useEffect(() => {

        if (!hasQuizInfoChanged) {
            return;
        }

        let BaseUrl = `https://opentdb.com/api.php?amount=${quizInfo.questions}${quizInfo.category !== 'any' ? '&category=' + quizInfo.category : ''}${quizInfo.difficulty !== 'any' ? '&difficulty=' + quizInfo.difficulty : ''}${quizInfo.type !== 'any' ? '&type=' + quizInfo.type : ''}`;
        fetchQuiz(BaseUrl)
    }, [quizInfo]);

    return (
        <QuizContext.Provider value={{ setQuizInfo, setHasQuizInfoChanged, loading, error, quiz, hasQuizInfoChanged, starredQuestions, setStarredQuestions, quizInfo }}>
            {children}
        </QuizContext.Provider>
    )
}

export const useQuizContext = () => {
    return useContext(QuizContext);
}