
// Import React và hook useReducer để quản lý state phức tạp
import React, { useReducer } from 'react';
// Import các component UI từ react-bootstrap
import { Button, Container, Card } from 'react-bootstrap';

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
function QuestionBank() {
  // Sử dụng useReducer để quản lý trạng thái quiz
  const [state, dispatch] = useReducer(quizReducer, initialState);
  // Destructure các biến state cho dễ dùng
  const { questions, currentQuestion, selectedOption, score, showScore } = state;

  // Khi người dùng chọn đáp án
  const handleOptionSelect = (option) => {
    dispatch({ type: 'SELECT_OPTION', payload: option });
  };

  // Khi bấm Next/Finish
  const handleNextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  // Khi bấm Restart Quiz
  const handleRestartQuiz = () => {
    dispatch({ type: 'RESTART_QUIZ' });
  };

  // Luồng hoạt động:
  // 1) Hiển thị câu hỏi hiện tại và các đáp án
  // 2) Khi chọn đáp án, cập nhật selectedOption
  // 3) Khi bấm Next/Finish, kiểm tra đúng/sai, tăng điểm, chuyển câu hoặc hiện điểm
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
            {/* Nút Next/Finish Quiz */}
            <Button
              variant="primary"
              className="mt-3"
              disabled={!selectedOption}
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
export default QuestionBank;
