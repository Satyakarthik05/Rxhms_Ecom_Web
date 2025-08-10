import { useState, useCallback, useEffect } from 'react';
import { Question } from '../types/Question';
import { initialPharmacyQuestions } from '../data/pharmacyQuestions';
import { saveQuestionsToBackend, loadQuestionsFromBackend } from '../services/questionService';

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load questions from backend on initial render
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const loadedQuestions = await loadQuestionsFromBackend();
        if (loadedQuestions && loadedQuestions.length > 0) {
          setQuestions(loadedQuestions);
        } else {
          // If no questions in backend, use initial ones
          setQuestions(initialPharmacyQuestions);
        }
      } catch (error) {
        console.error('Failed to load questions, using initial data', error);
        setQuestions(initialPharmacyQuestions);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, []);

  const generateId = () => `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const findQuestionById = useCallback((id: string, questionList: Question[] = questions): Question | null => {
    for (const question of questionList) {
      if (question.id === id) return question;
      const found = findQuestionById(id, question.children);
      if (found) return found;
    }
    return null;
  }, [questions]);

  const addQuestion = useCallback((parentId: string | null, text: string) => {
    const newQuestion: Question = {
      id: generateId(),
      text,
      parentId,
      level: parentId ? (findQuestionById(parentId)?.level || 0) + 1 : 0,
      isRoot: !parentId,
      children: []
    };

    setQuestions(prev => {
      if (!parentId) {
        return [...prev, newQuestion];
      }

      const updateQuestions = (questionList: Question[]): Question[] => {
        return questionList.map(q => {
          if (q.id === parentId) {
            return { ...q, children: [...q.children, newQuestion] };
          }
          return { ...q, children: updateQuestions(q.children) };
        });
      };

      return updateQuestions(prev);
    });
  }, [findQuestionById]);

  const updateQuestion = useCallback((id: string, text: string) => {
    const updateQuestions = (questionList: Question[]): Question[] => {
      return questionList.map(q => {
        if (q.id === id) {
          return { ...q, text };
        }
        return { ...q, children: updateQuestions(q.children) };
      });
    };

    setQuestions(prev => updateQuestions(prev));
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    const removeQuestion = (questionList: Question[]): Question[] => {
      return questionList
        .filter(q => q.id !== id)
        .map(q => ({ ...q, children: removeQuestion(q.children) }));
    };

    setQuestions(prev => removeQuestion(prev));
  }, []);

  const saveQuestions = async () => {
    try {
      setIsLoading(true);
      await saveQuestionsToBackend(questions);
    } catch (error) {
      console.error('Error saving questions:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    questions,
    isLoading,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    findQuestionById,
    saveQuestions
  };
};