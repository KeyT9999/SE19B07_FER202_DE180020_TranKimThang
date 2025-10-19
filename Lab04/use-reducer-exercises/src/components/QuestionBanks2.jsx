
// Import React, useReducer, useState để quản lý state phức tạp
import React, { useReducer, useState } from 'react';
// Import các component UI từ react-bootstrap
import { Button, Container, Card } from 'react-bootstrap';
// Import icon phản hồi đúng/sai
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// 1. Khởi tạo trạng thái ban đầu cho quiz
const initialState = {
  questions: [ // Danh sách câu hỏi trắc nghiệm
    {
      id: 1,
      question: 'What is the capital of Australia?',
      options: ['Sydney', 'Canberra', 'Melbourne', 'Perth'],
      answer: 'Canberra',
    },
    {
      id: 2,
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      answer: 'Mars',
    },
    {
      id: 3,
      question: 'What is the largest ocean on Earth?',
      options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
      answer: 'Pacific Ocean',
    },
  ],
  currentQuestion: 0, // Số thứ tự câu hỏi hiện tại
  selectedOption: '', // Đáp án người dùng chọn
  score: 0,           // Điểm số hiện tại
  showScore: false,   // Đã hoàn thành quiz hay chưa
};

// 2. Định nghĩa reducer quản lý mọi thay đổi trạng thái quiz
function quizReducer(state, action) {
  switch (action.type) {
    case 'SELECT_OPTION':
      // Khi người dùng chọn đáp án, cập nhật selectedOption
      return { ...state, selectedOption: action.payload };
    case 'NEXT_QUESTION': {
      // Khi bấm Next/Finish: kiểm tra đáp án, tăng điểm nếu đúng, chuyển sang câu tiếp theo
      const isCorrect = state.selectedOption === state.questions[state.currentQuestion].answer;
      return {
        ...state,
        score: isCorrect ? state.score + 1 : state.score, // tăng điểm nếu đúng
        currentQuestion: state.currentQuestion + 1, // sang câu tiếp theo
        selectedOption: '', // reset đáp án đã chọn
        showScore: state.currentQuestion + 1 === state.questions.length, // true nếu hết câu hỏi
      };
    }
    case 'RESTART_QUIZ':
      // Khi bấm Restart, reset về trạng thái ban đầu
      return {
        ...initialState,
      };
    default:
      // Nếu action không hợp lệ, giữ nguyên state
      return state;
  }
}

// 3. Component chính quản lý quiz
function QuestionBanks2() {
  // Sử dụng useReducer để quản lý trạng thái quiz
  const [state, dispatch] = useReducer(quizReducer, initialState);
  // Destructure các biến state cho dễ dùng
  const { questions, currentQuestion, selectedOption, score, showScore } = state;

  // State feedback: null | true | false
  const [feedback, setFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Khi người dùng chọn đáp án
  const handleOptionSelect = (option) => {
    dispatch({ type: 'SELECT_OPTION', payload: option });
    setShowFeedback(false);
  };

  // Khi bấm Next/Finish
  const handleNextQuestion = () => {
    // Kiểm tra đúng/sai trước khi chuyển câu
    const isCorrect = selectedOption === questions[currentQuestion].answer;
    setFeedback(isCorrect);
    setShowFeedback(true);
    // Sau 1s mới chuyển câu để hiển thị feedback
    setTimeout(() => {
      setShowFeedback(false);
      setFeedback(null);
      dispatch({ type: 'NEXT_QUESTION' });
    }, 1000);
  };

  // Khi bấm Restart Quiz
  const handleRestartQuiz = () => {
    dispatch({ type: 'RESTART_QUIZ' });
    setFeedback(null);
    setShowFeedback(false);
  };

  // Luồng hoạt động:
  // 1) Hiển thị câu hỏi hiện tại và các đáp án
  // 2) Khi chọn đáp án, cập nhật selectedOption
  // 3) Khi bấm Next/Finish, kiểm tra đúng/sai, hiện feedback, sau đó chuyển câu hoặc hiện điểm
  // 4) Khi hết quiz, hiện điểm và nút Restart
  return (
    <Container className="mt-4">
      <Card className="p-4">
        {showScore ? (
          <div className="text-center">
            {/* Hiển thị điểm số khi hoàn thành quiz */}
            <h2>
              Your Score: {score} / {questions.length}
            </h2>
            <Button variant="primary" onClick={handleRestartQuiz}>
              Restart Quiz
            </Button>
          </div>
        ) : (
          <div>
            {/* Hiển thị câu hỏi hiện tại */}
            <h4>
              Question {questions[currentQuestion].id}:<br />
              {questions[currentQuestion].question}
            </h4>
            {/* Hiển thị các đáp án */}
            <div className="mt-3">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedOption === option ? "success" : "outline-secondary"}
                  className="m-2"
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
            {/* Feedback đúng/sai */}
            {showFeedback && (
              <div className="mt-3" style={{ fontSize: 20, fontWeight: 'bold', color: feedback ? 'green' : 'red', display: 'flex', alignItems: 'center', gap: 8 }}>
                {feedback ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />}
                {feedback ? 'Correct! 🎉' : `Incorrect! The correct answer is: ${questions[currentQuestion].answer}`}
              </div>
            )}
            {/* Nút Next/Finish Quiz */}
            <Button
              variant="primary"
              className="mt-3"
              disabled={!selectedOption || showFeedback}
              onClick={handleNextQuestion}
            >
              {currentQuestion === questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </Button>
          </div>
        )}
      </Card>
    </Container>
  );
}

// Export component để dùng ở file khác
export default QuestionBanks2;
