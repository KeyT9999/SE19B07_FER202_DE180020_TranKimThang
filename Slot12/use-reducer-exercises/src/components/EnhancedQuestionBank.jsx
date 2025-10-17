import React, { useReducer, useEffect } from "react";
import { Button, Container, Card, Alert, ProgressBar } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

const initialState = {
  questions: [
    {
      id: 1,
      question: "What is the capital of Australia?",
      options: ["Sydney", "Canberra", "Melbourne", "Perth"],
      answer: "Canberra",
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      answer: "Mars",
    },
    {
      id: 3,
      question: "What is the largest ocean on Earth?",
      options: [
        "Atlantic Ocean",
        "Indian Ocean",
        "Pacific Ocean",
        "Arctic Ocean",
      ],
      answer: "Pacific Ocean",
    },
  ],
  currentQuestion: 0,
  selectedOption: "",
  score: 0,
  showScore: false,
  timeLeft: 10,
  feedback: null,
  highScore: 0,
  isTimeUp: false,
};

function enhancedQuizReducer(state, action) {
  switch (action.type) {
    case "SELECT_OPTION":
      return { ...state, selectedOption: action.payload, feedback: null };

    case "NEXT_QUESTION":
      const isCorrect = state.selectedOption === state.questions[state.currentQuestion].answer;
      const newScore = isCorrect ? state.score + 1 : state.score;
      const newHighScore = Math.max(state.highScore, newScore);
      
      // Lưu high score vào localStorage
      localStorage.setItem('quizHighScore', newHighScore.toString());
      
      return {
        ...state,
        score: newScore,
        highScore: newHighScore,
        currentQuestion: state.currentQuestion + 1,
        selectedOption: "",
        showScore: state.currentQuestion + 1 === state.questions.length,
        timeLeft: 10,
        isTimeUp: false,
        feedback: null,
      };

    case "RESTART_QUIZ":
      return {
        ...initialState,
        highScore: state.highScore,
        timeLeft: 10,
      };

    case "TICK_TIMER":
      if (state.timeLeft <= 1) {
        return {
          ...state,
          timeLeft: 0,
          isTimeUp: true,
          feedback: {
            type: "timeup",
            message: `Hết giờ! Đáp án đúng là: ${state.questions[state.currentQuestion].answer}`,
            isCorrect: false,
          },
        };
      }
      return { ...state, timeLeft: state.timeLeft - 1 };

    case "SHOW_FEEDBACK":
      const correct = state.selectedOption === state.questions[state.currentQuestion].answer;
      return {
        ...state,
        feedback: {
          type: "answer",
          message: correct 
            ? "Correct! 🎉" 
            : `Incorrect! The correct answer is: ${state.questions[state.currentQuestion].answer}`,
          isCorrect: correct,
        },
      };

    case "LOAD_HIGH_SCORE":
      const savedHighScore = parseInt(localStorage.getItem('quizHighScore')) || 0;
      return { ...state, highScore: savedHighScore };

    default:
      return state;
  }
}

function EnhancedQuestionBank() {
  const [state, dispatch] = useReducer(enhancedQuizReducer, initialState);
  const { 
    questions, 
    currentQuestion, 
    selectedOption, 
    score, 
    showScore, 
    timeLeft, 
    feedback, 
    highScore,
    isTimeUp 
  } = state;

  // Load high score khi component mount
  useEffect(() => {
    dispatch({ type: "LOAD_HIGH_SCORE" });
  }, []);

  // Timer effect
  useEffect(() => {
    if (!showScore && !isTimeUp && timeLeft > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: "TICK_TIMER" });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, showScore, isTimeUp]);

  const handleOptionSelect = (option) => {
    if (isTimeUp) return;
    dispatch({ type: "SELECT_OPTION", payload: option });
    dispatch({ type: "SHOW_FEEDBACK" });
  };

  const handleNextQuestion = () => {
    dispatch({ type: "NEXT_QUESTION" });
  };

  const handleRestartQuiz = () => {
    dispatch({ type: "RESTART_QUIZ" });
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / questions.length) * 100;
  };

  const getTimeColor = () => {
    if (timeLeft <= 5) return "danger";
    if (timeLeft <= 7) return "warning";
    return "success";
  };

  return (
    <Container className="mt-4">
      <Card className="p-4">
        {/* Header với tiến trình và điểm cao */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4>Quiz Progress: {currentQuestion + 1}/{questions.length}</h4>
            <ProgressBar 
              now={getProgressPercentage()} 
              variant="info" 
              style={{ width: '200px' }}
            />
          </div>
          <div className="text-end">
            <div className="h5 text-primary">High Score: {highScore}</div>
            <div className="h6">Current Score: {score}</div>
          </div>
        </div>

        {showScore ? (
          <div className="text-center">
            <h2 className="mb-3">
              Quiz Completed! 🎉
            </h2>
            <h3 className="mb-3">
              Final Score: {score} / {questions.length}
            </h3>
            <h4 className="mb-4">
              High Score: {highScore} / {questions.length}
            </h4>
            <Button variant="primary" size="lg" onClick={handleRestartQuiz}>
              Restart Quiz
            </Button>
          </div>
        ) : (
          <div>
            {/* Timer */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>
                Question {questions[currentQuestion].id}:<br />
                {questions[currentQuestion].question}
              </h4>
              <div className={`text-${getTimeColor()}`}>
                <FaClock className="me-2" />
                <span className={`h5 ${timeLeft <= 5 ? 'text-danger fw-bold' : ''}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <Alert 
                variant={feedback.isCorrect ? "success" : "danger"} 
                className="mb-3"
              >
                {feedback.isCorrect ? (
                  <><FaCheckCircle className="me-2" />{feedback.message}</>
                ) : (
                  <><FaTimesCircle className="me-2" />{feedback.message}</>
                )}
              </Alert>
            )}

            {/* Options */}
            <div className="mt-3">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    selectedOption === option 
                      ? feedback?.isCorrect ? "success" : "danger"
                      : "outline-secondary"
                  }
                  className="m-2"
                  onClick={() => handleOptionSelect(option)}
                  disabled={isTimeUp}
                >
                  {option}
                </Button>
              ))}
            </div>

            {/* Next/Finish Button */}
            <div className="mt-4">
              <Button
                variant="primary"
                size="lg"
                disabled={!selectedOption && !isTimeUp}
                onClick={handleNextQuestion}
              >
                {currentQuestion === questions.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </Container>
  );
}

export default EnhancedQuestionBank;
