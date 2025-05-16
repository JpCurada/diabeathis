import React, { useEffect, useRef } from 'react';
import { ThinkingStep } from '../../hooks/use-thinking-process';

interface ThinkingProcessProps {
  isThinking: boolean;
  thinkingSteps: ThinkingStep[];
  currentStep: number;
  finalResponse: string;
}

const ThinkingProcess = ({ 
  isThinking, 
  thinkingSteps, 
  currentStep, 
  finalResponse 
}: ThinkingProcessProps) => {
  const thinkingContainerRef = useRef<HTMLDivElement>(null);
  const finalResponseRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest thinking step or the final response
  useEffect(() => {
    if (isThinking && thinkingContainerRef.current) {
      thinkingContainerRef.current.scrollTop = thinkingContainerRef.current.scrollHeight;
    } else if (!isThinking && finalResponseRef.current) {
      finalResponseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isThinking, currentStep, finalResponse]);

  if (!isThinking && !finalResponse) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto rounded-lg overflow-hidden">
      {isThinking && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-[#d1d1d1] dark:border-gray-700 shadow-md animate-fadeIn">
          <div className="flex items-center mb-4">
            <div className="h-2 w-2 bg-[#005dff] rounded-full animate-pulse mr-2"></div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Debie is thinking...
            </h3>
          </div>
          
          <div 
            ref={thinkingContainerRef}
            className="thinking-steps-container max-h-[400px] overflow-y-auto pr-2"
          >
            {thinkingSteps.map((step, index) => (
              <div 
                key={step.id}
                className={`thinking-step mb-4 transition-all duration-300 ${
                  index < currentStep ? 'animate-slideIn opacity-100' : 'opacity-0 h-0 mb-0 overflow-hidden'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="flex items-start mb-2">
                  <div className="thinking-step-number flex-shrink-0 w-6 h-6 rounded-full bg-[#005dff] text-white flex items-center justify-center text-xs mr-3 animate-scaleIn">
                    {index + 1}
                  </div>
                  <div className={`thinking-step-content bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 flex-grow text-sm ${
                    step.completed ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {step.content}
                    {step.completed && (
                      <span className="ml-2 text-green-500 animate-fadeIn">✓</span>
                    )}
                  </div>
                </div>
                
                {/* Preliminary response section */}
                {step.completed && step.response && (
                  <div className="ml-9 mt-1 animate-fadeIn">
                    <div className="bg-[#f5f9ff] dark:bg-gray-800 p-3 rounded-lg border border-[#e0e9fc] dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center mb-1">
                        <div className="w-4 h-4 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#005dff]">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 16v-4"></path>
                            <path d="M12 8h.01"></path>
                          </svg>
                        </div>
                        <span className="font-medium text-xs text-[#005dff]">Thinking...</span>
                      </div>
                      {step.response}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {finalResponse && !isThinking && (
        <div 
          ref={finalResponseRef}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-[#d1d1d1] dark:border-gray-700 shadow-md transition-all duration-500 ease-in-out animate-fadeUp"
        >
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Debie's Response
          </h3>
          <div className="bg-[#f5f5f5] dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200">
            {finalResponse}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          0% { 
            transform: scale(0.8);
            opacity: 0;
          }
          100% { 
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fadeUp {
          from { 
            opacity: 0; 
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-in-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-in-out;
        }
        
        .animate-fadeUp {
          animation: fadeUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ThinkingProcess; 