import Home from "./components/Home/Home"
import QuizPage from "./components/QuizPage/QuizPage"
import SavedQuestions from "./components/SavedQuestionsPage/SavedQuestions"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QuizProvider } from "./context/QuizContext";


function App() {

  return (
    <QuizProvider>
      <Router >
        <div className="scroll-smooth">
          <Routes >
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/starred" element={<SavedQuestions />} />
          </Routes>
        </div>
      </Router>
    </QuizProvider>
  )
}

export default App
