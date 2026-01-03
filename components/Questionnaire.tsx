
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ALL_TESTS } from '../constants';
import { UserProfile, UserTestResult, Question } from '../types';
import { generateTestInsights } from '../services/geminiService';

interface QuestionnaireProps {
  user: UserProfile | null;
  onComplete: (result: UserTestResult) => void;
  onAuthRequired: () => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ user, onComplete, onAuthRequired }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const test = useMemo(() => ALL_TESTS.find(t => t.id === id), [id]);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [richAnswers, setRichAnswers] = useState<Record<string, string | number>>({});
  const [textInput, setTextInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!test) return <div>Test not found</div>;

  const currentQuestion = test.questions[currentStep];

  const handleAnswer = (scoreValue: number, richValue?: string | number) => {
    const questionId = currentQuestion.id;
    
    // Store numeric score for graphing
    setAnswers({ ...answers, [questionId]: scoreValue });
    
    // Store rich data (text, choice label) for AI
    if (richValue !== undefined) {
      setRichAnswers({ ...richAnswers, [questionId]: richValue });
    }

    if (currentStep < test.questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setTextInput(''); // Reset text input for next question
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    // For text, we assign a neutral '3' score for the graph, but send the text to AI
    handleAnswer(3, textInput); 
  };

  const calculateResult = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }

    setIsSubmitting(true);
    
    // Weighted scoring logic
    let totalScore = 0;
    const breakdown: Record<string, number> = {};
    
    test.questions.forEach(q => {
      const val = answers[q.id] || 0;
      totalScore += val;
      if (q.category) {
        breakdown[q.category] = (breakdown[q.category] || 0) + val;
      }
    });

    const maxScore = test.questions.length * 5;

    // AI Interpretation passing rich answers
    const aiInsight = await generateTestInsights(test.title, totalScore, maxScore, breakdown, richAnswers);

    const result: UserTestResult = {
      testId: test.id,
      date: new Date().toISOString(),
      score: totalScore,
      maxScore,
      breakdown,
      richAnswers,
      aiInterpretation: aiInsight
    };

    onComplete(result);
    setIsSubmitting(false);
    navigate(`/report/${test.id}/${encodeURIComponent(result.date)}`);
  };

  const progress = ((currentStep + 1) / test.questions.length) * 100;

  // RENDER HELPERS
  const renderLikert = () => (
    <div className="grid grid-cols-1 gap-4">
      {[
        { label: 'Strongly Disagree', value: 1, color: 'hover:bg-red-50 hover:border-red-200 text-red-600' },
        { label: 'Disagree', value: 2, color: 'hover:bg-orange-50 hover:border-orange-200 text-[#FF6D00]' },
        { label: 'Neutral', value: 3, color: 'hover:bg-gray-50 hover:border-gray-200 text-gray-600' },
        { label: 'Agree', value: 4, color: 'hover:bg-blue-50 hover:border-blue-200 text-[#0055FF]' },
        { label: 'Strongly Agree', value: 5, color: 'hover:bg-purple-50 hover:border-purple-200 text-purple-600' },
      ].map((option) => (
        <button
          key={option.value}
          onClick={() => handleAnswer(option.value, option.label)}
          className={`w-full py-5 px-8 rounded-2xl border-2 border-gray-50 bg-gray-50/50 font-bold transition-all text-left flex items-center justify-between group ${option.color} hover:shadow-lg`}
        >
          <span>{option.label}</span>
          <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-current flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-current opacity-0 group-hover:opacity-100" />
          </div>
        </button>
      ))}
    </div>
  );

  const renderScenario = () => (
    <div className="grid grid-cols-1 gap-5">
      {currentQuestion.options?.map((opt, idx) => (
        <button
          key={idx}
          onClick={() => handleAnswer(Number(opt.value), opt.label)}
          className="group w-full p-6 rounded-[1.5rem] border-2 border-gray-100 bg-white hover:border-[#0055FF] hover:bg-blue-50/30 text-left transition-all hover:shadow-xl hover:-translate-y-1 flex items-start gap-6"
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gray-50 border-2 border-gray-100 flex items-center justify-center group-hover:bg-[#0055FF] group-hover:border-[#0055FF] transition-colors">
            <span className="font-black text-gray-400 group-hover:text-white text-lg">
              {String.fromCharCode(65 + idx)}
            </span>
          </div>
          <div className="pt-1">
            <span className="font-bold text-gray-700 text-lg leading-relaxed group-hover:text-gray-900">
              {opt.label}
            </span>
          </div>
        </button>
      ))}
    </div>
  );

  const renderAbstract = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {currentQuestion.options?.map((opt, idx) => (
        <button
          key={idx}
          onClick={() => handleAnswer(Number(opt.value), opt.label)}
          className="group relative w-full aspect-square sm:aspect-[4/3] rounded-[2rem] overflow-hidden border-4 border-transparent hover:border-[#0055FF] transition-all shadow-lg hover:shadow-2xl hover:scale-[1.02]"
        >
          {/* Image with zoom effect */}
          <img 
            src={opt.image} 
            alt={opt.label} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 text-left">
             <span className="text-white font-black text-2xl uppercase tracking-tight transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
               {opt.label}
             </span>
             {/* Decorative Bar */}
             <div className="h-1.5 w-12 bg-[#FFD100] mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
          
          {/* Hover indicator icon */}
          <div className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
            <span className="text-[#0055FF] text-xl">➜</span>
          </div>
        </button>
      ))}
    </div>
  );

  const renderText = () => (
    <div className="space-y-6">
      <textarea
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder={currentQuestion.placeholder}
        rows={6}
        className="w-full p-6 text-xl rounded-3xl border-2 border-gray-100 bg-gray-50 focus:border-[#0055FF] focus:bg-white outline-none transition-all font-medium placeholder:text-gray-300 resize-none"
      />
      <button 
        onClick={handleTextSubmit}
        disabled={!textInput.trim()}
        className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-[#0055FF] disabled:opacity-50 disabled:hover:bg-gray-900 transition-all shadow-xl"
      >
        Submit Answer
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
          <span>{test.title}</span>
          <span>Question {currentStep + 1} of {test.questions.length}</span>
        </div>
        <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner border border-gray-100">
          <div 
            className="h-full bg-[#0055FF] transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-8 sm:p-14 border border-gray-100 shadow-xl shadow-gray-100">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-10 text-center leading-tight">
          {currentQuestion.text}
        </h2>

        {/* Dynamic Render based on Type */}
        {currentQuestion.type === 'likert' && renderLikert()}
        {currentQuestion.type === 'scenario' && renderScenario()}
        {currentQuestion.type === 'abstract' && renderAbstract()}
        {currentQuestion.type === 'text' && renderText()}

        <div className="mt-12 flex justify-between items-center">
          <button 
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(currentStep - 1)}
            className="text-gray-400 font-bold hover:text-gray-600 disabled:opacity-0 transition-all"
          >
            ← Previous
          </button>
          
          {currentStep === test.questions.length - 1 && Object.keys(answers).length === test.questions.length && (
            <button 
              onClick={calculateResult}
              disabled={isSubmitting}
              className="px-10 py-4 bg-[#0055FF] text-white rounded-full font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              {isSubmitting ? 'Generating Report...' : 'View My Results'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
