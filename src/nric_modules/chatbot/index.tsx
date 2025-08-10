import React from "react";
import Chatbot from "./components/Chatbot";
import { useQuestions } from "./hooks/useQuestions";
import "./App.css"; // We'll move styles here

function App() {
  const { questions, findQuestionById, isLoading } = useQuestions();

  if (isLoading) {
    return (
      <div className="safeArea">
        <div className="loadingContainer">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="safeArea">
      <div className="container">
        <div className="chatbotContent">
          <Chatbot questions={questions} findQuestionById={findQuestionById} />
        </div>
      </div>
    </div>
  );
}

export default App;
