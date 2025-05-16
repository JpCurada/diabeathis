import { useState, useEffect, useCallback } from 'react';

export interface ThinkingStep {
  id: string;
  content: string;
  completed: boolean;
  response?: string;
}

// Mock thinking steps for different prompt types
const mockThinkingData = {
  glucose: [
    { 
      id: '1', 
      content: 'Agent Selection: Health Analyst Agent activated for glucose pattern analysis', 
      completed: false,
      response: 'Selecting Health Analyst Agent as the most appropriate for analyzing glucose patterns and fluctuations.'
    },
    { 
      id: '2', 
      content: 'Retrieving recent glucose readings from the past 7 days...', 
      completed: false,
      response: 'Found 23 glucose readings from the past week. Average: 142 mg/dL, Highest: 210 mg/dL, Lowest: 87 mg/dL.'
    },
    { 
      id: '3', 
      content: 'Analyzing time-of-day patterns in glucose fluctuations...', 
      completed: false,
      response: 'Identified consistent post-lunch glucose spikes between 2-3pm, with readings averaging 178 mg/dL.'
    },
    { 
      id: '4', 
      content: 'Examining correlation between logged meals and glucose spikes...', 
      completed: false,
      response: 'High-carbohydrate lunches (>60g carbs) correlate with 83% of afternoon glucose spikes above 170 mg/dL.'
    },
    { 
      id: '5', 
      content: 'Checking medication adherence impact on glucose stability...', 
      completed: false,
      response: 'Medication adherence is 94% consistent. No significant correlation found between missed doses and glucose spikes.'
    },
    { 
      id: '6', 
      content: 'Retrieving exercise data from Fitbit integration...', 
      completed: false,
      response: 'Exercise data shows moderate activity 3 days/week. Post-exercise glucose readings are 15-20 mg/dL lower on average.'
    },
    { 
      id: '7', 
      content: 'Identifying potential triggers for glucose variations...', 
      completed: false,
      response: 'Primary trigger identified: high-carbohydrate lunch meals, particularly those containing refined grains and sugars.'
    },
    { 
      id: '8', 
      content: 'Formulating personalized glucose management recommendations...', 
      completed: false,
      response: 'Recommendations: 1) Increase protein intake at lunch, 2) Add 10-minute post-lunch walk, 3) Distribute carbs more evenly throughout the day.'
    }
  ],
  diet: [
    { 
      id: '1', 
      content: 'Agent Selection: Nutritionist Agent activated for dietary analysis', 
      completed: false,
      response: 'Activating Nutritionist Agent to analyze food logs and provide dietary recommendations.'
    },
    { 
      id: '2', 
      content: 'Analyzing recent food log entries...', 
      completed: false,
      response: 'Analyzed 18 food log entries from the past week. Average daily intake: 2100 calories, 340g carbs, 70g protein, 65g fat.'
    },
    { 
      id: '3', 
      content: 'Calculating average carbohydrate intake per meal...', 
      completed: false,
      response: 'Carbohydrate distribution: Breakfast 25%, Lunch 40%, Dinner 30%, Snacks 5%. Lunch has highest carb concentration.'
    },
    { 
      id: '4', 
      content: 'Examining meal timing patterns...', 
      completed: false,
      response: 'Meals are consistently timed. Breakfast 7-8am, Lunch 12-1pm, Dinner 6-7pm. No significant late-night eating detected.'
    },
    { 
      id: '5', 
      content: 'Reviewing glycemic impact of commonly consumed foods...', 
      completed: false,
      response: 'High glycemic foods frequently consumed: white rice (4x/week), white bread (5x/week), sweetened beverages (3x/week).'
    },
    { 
      id: '6', 
      content: 'Checking nutritional balance across logged meals...', 
      completed: false,
      response: 'Nutritional gaps identified: fiber intake below target (15g vs. 25g recommended), vegetable servings low (2 vs. 5 recommended).'
    },
    { 
      id: '7', 
      content: 'Comparing intake against personalized dietary goals...', 
      completed: false,
      response: 'Current macronutrient ratio (65% carbs, 15% protein, 20% fat) differs from recommended diabetes ratio (45% carbs, 25% protein, 30% fat).'
    },
    { 
      id: '8', 
      content: 'Developing targeted meal suggestions based on findings...', 
      completed: false,
      response: 'Meal suggestions: Replace white rice with brown rice/quinoa, increase vegetable portions, add lean proteins like fish or tofu to meals.'
    }
  ],
  exercise: [
    { 
      id: '1', 
      content: 'Agent Selection: Exercise Coach Agent activated for activity analysis', 
      completed: false,
      response: 'Selecting Exercise Coach Agent to develop a personalized workout plan based on fitness level and preferences.'
    },
    { 
      id: '2', 
      content: 'Analyzing exercise patterns from manual logs and Fitbit...', 
      completed: false,
      response: 'Current exercise pattern: 3 days/week, primarily evening walks (20-25 minutes) and occasional strength training (15 minutes).'
    },
    { 
      id: '3', 
      content: 'Calculating weekly activity minutes against targets...', 
      completed: false,
      response: 'Current: 75 minutes/week. Target for diabetes management: 150 minutes/week. Currently achieving 50% of recommended activity.'
    },
    { 
      id: '4', 
      content: 'Examining impact of exercise on glucose readings...', 
      completed: false,
      response: 'Evening walks reduce glucose by average of 18% when performed before dinner. Morning exercise shows minimal data points.'
    },
    { 
      id: '5', 
      content: 'Checking for optimal exercise timing patterns...', 
      completed: false,
      response: 'Optimal timing identified: 5-6pm exercise shows most significant glucose benefits. Morning schedule has availability for additional sessions.'
    },
    { 
      id: '6', 
      content: 'Reviewing exercise intensity and duration...', 
      completed: false,
      response: 'Current intensity: primarily low-moderate (average heart rate 110 BPM). Duration consistent but below recommendations.'
    },
    { 
      id: '7', 
      content: 'Assessing cardiovascular metrics during activity...', 
      completed: false,
      response: 'Cardiovascular response healthy: heart rate recovery within normal range, no concerning patterns detected in Fitbit data.'
    },
    { 
      id: '8', 
      content: 'Formulating personalized exercise recommendations...', 
      completed: false,
      response: 'Recommendations: Add two 15-minute morning walks (Tue/Thu), maintain evening walks (Mon/Wed/Fri), gradually increase duration to 30 minutes.'
    }
  ],
  medication: [
    { 
      id: '1', 
      content: 'Agent Selection: Medical Information Agent activated for medication analysis', 
      completed: false,
      response: 'Activating Medical Information Agent to analyze medication adherence and optimize medication schedule.'
    },
    { 
      id: '2', 
      content: 'Retrieving medication logs from the past 30 days...', 
      completed: false,
      response: 'Retrieved 87 medication logs. Current regimen: Metformin 1000mg twice daily, meal-time insulin with variable dosing.'
    },
    { 
      id: '3', 
      content: 'Analyzing adherence patterns for prescribed medications...', 
      completed: false,
      response: 'Metformin adherence: 92% (morning dose: 96%, evening dose: 88%). Insulin adherence: 85% with timing variations.'
    },
    { 
      id: '4', 
      content: 'Checking timing consistency for insulin administration...', 
      completed: false,
      response: 'Insulin timing issue identified: average 23-minute delay between meals and insulin administration in 65% of instances.'
    },
    { 
      id: '5', 
      content: 'Examining correlation between medication and glucose stability...', 
      completed: false,
      response: 'Delayed insulin administration correlates with 30% higher post-meal glucose peaks compared to properly timed doses.'
    },
    { 
      id: '6', 
      content: 'Reviewing potential medication interactions...', 
      completed: false,
      response: 'No concerning medication interactions found in current regimen. All medications compatible with each other.'
    },
    { 
      id: '7', 
      content: 'Comparing dosage patterns against prescription guidelines...', 
      completed: false,
      response: 'Current dosing aligns with prescription. Insulin dose calculation appears appropriate based on carbohydrate intake.'
    },
    { 
      id: '8', 
      content: 'Preparing medication management insights...', 
      completed: false,
      response: 'Key insight: Evening medication adherence and insulin timing are primary areas for improvement. Calendar reminders could address both issues.'
    }
  ],
  general: [
    { 
      id: '1', 
      content: 'Agent Selection: Determining optimal agent for query analysis...', 
      completed: false,
      response: 'Query analysis complete. Utilizing multiple agents with Health Analyst as primary coordinator for comprehensive response.'
    },
    { 
      id: '2', 
      content: 'Processing query and identifying relevant health domains...', 
      completed: false,
      response: 'Relevant domains identified: glucose management, medication adherence, sleep patterns, and overall diabetes management strategy.'
    },
    { 
      id: '3', 
      content: 'Retrieving user profile and historical health context...', 
      completed: false,
      response: 'Profile retrieved: 42-year-old with Type 2 diabetes (diagnosed 3 years ago), A1C: 7.2%, target range: 80-150 mg/dL.'
    },
    { 
      id: '4', 
      content: 'Analyzing recent health metrics across glucose, diet, activity...', 
      completed: false,
      response: 'Health metrics summary: Average glucose 142 mg/dL, 65% in target range, 3 days/week exercise, 92% medication adherence.'
    },
    { 
      id: '5', 
      content: 'Examining patterns and correlations in health data...', 
      completed: false,
      response: 'Key correlation: Sleep quality significantly impacts next-day glucose levels. 7+ hours sleep results in 15% better glucose control.'
    },
    { 
      id: '6', 
      content: 'Checking adherence to personalized health goals...', 
      completed: false,
      response: 'Goal progress: Glucose monitoring (excellent), medication adherence (good), physical activity (needs improvement), diet (needs improvement).'
    },
    { 
      id: '7', 
      content: 'Reviewing relevant medical guidelines and best practices...', 
      completed: false,
      response: 'Applied ADA guidelines for Type 2 diabetes management: target A1C <7%, 150+ minutes weekly exercise, balanced macronutrient intake.'
    },
    { 
      id: '8', 
      content: 'Formulating comprehensive health insights and recommendations...', 
      completed: false,
      response: 'Holistic recommendations: Redistribute carbs throughout day, add brief post-meal activity, improve sleep hygiene, maintain medication schedule.'
    }
  ]
};

// Mock final responses for different prompt types
const mockFinalResponses = {
  glucose: "Based on your glucose data from the past week, I've noticed your readings tend to spike between 2-3pm, often after lunch. Your average glucose is 142 mg/dL, with highs reaching 210 mg/dL. The data suggests your afternoon meals may contain more carbs than optimal. Consider adding more protein to your lunch and taking a short 10-minute walk afterward, which has shown to reduce your post-meal glucose by 15-20 mg/dL based on your historical patterns.",
  
  diet: "After analyzing your food logs, I see you're consuming about 65% of your daily calories from carbohydrates, which is higher than the recommended 45-50% for your diabetes management plan. Your vegetable intake averages 2 servings daily, below the target of 5 servings. I recommend increasing fiber-rich vegetables and replacing some rice portions with protein sources like bangus (milkfish) or tofu to help stabilize your glucose levels throughout the day.",
  
  exercise: "Your activity data shows you're averaging 22 minutes of exercise 3 days per week, primarily in the evenings. When you exercise before dinner (between 5-6pm), your evening glucose readings improve by about 18%. I've noticed you enjoy walking and occasional swimming based on your logs. For optimal glucose management, I recommend adding two 15-minute morning walks to your routine, which aligns with both your preference for walking and your goal of more consistent glucose levels throughout the day.",
  
  medication: "Your medication logs show you've taken your Metformin consistently (92% adherence), but your meal-time insulin is often delayed by 20+ minutes after eating (happening in 65% of instances). This timing gap may explain the post-meal glucose spikes we're seeing. I recommend setting an additional reminder through your Google Calendar that triggers immediately when you log a meal to help maintain the proper timing between eating and insulin administration.",
  
  general: "Looking at your overall diabetes management, you're doing well with consistent glucose monitoring (average 5 checks daily) and medication adherence. Your greatest opportunity is in meal composition and timing—particularly your carbohydrate distribution throughout the day. Your Fitbit data shows excellent sleep patterns (7.2 hours average), which positively impacts your morning glucose levels. Based on your comprehensive data, focusing on better balancing your lunch carbohydrates and adding brief activity after meals would likely have the most significant impact on your glucose stability."
};

// Detect which thinking process to use based on the prompt
function detectPromptType(prompt: string): keyof typeof mockThinkingData {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('glucose') || lowerPrompt.includes('sugar') || lowerPrompt.includes('blood')) {
    return 'glucose';
  } else if (lowerPrompt.includes('food') || lowerPrompt.includes('eat') || lowerPrompt.includes('diet') || lowerPrompt.includes('meal')) {
    return 'diet';
  } else if (lowerPrompt.includes('exercise') || lowerPrompt.includes('activity') || lowerPrompt.includes('workout')) {
    return 'exercise';
  } else if (lowerPrompt.includes('medicine') || lowerPrompt.includes('medication') || lowerPrompt.includes('insulin')) {
    return 'medication';
  } else {
    return 'general';
  }
}

export function useThinkingProcess() {
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [finalResponse, setFinalResponse] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  // Cleanup function to clear any existing intervals
  const clearThinkingInterval = useCallback(() => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [intervalId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearThinkingInterval();
    };
  }, [clearThinkingInterval]);

  // Function to start the thinking process
  const startThinking = useCallback((prompt: string) => {
    // Clear any existing thinking process
    clearThinkingInterval();
    
    // Reset state for new thinking process
    setFinalResponse('');
    setCurrentStep(0);
    
    const promptType = detectPromptType(prompt);
    const steps = mockThinkingData[promptType].map(step => ({ ...step, completed: false }));
    
    setThinkingSteps(steps);
    setIsThinking(true);
    
    // Simulate the thinking process with progressive step completion
    let stepIndex = 0;
    
    const newIntervalId = window.setInterval(() => {
      if (stepIndex < steps.length) {
        setThinkingSteps(prevSteps => {
          const updatedSteps = [...prevSteps];
          updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], completed: true };
          return updatedSteps;
        });
        setCurrentStep(stepIndex + 1);
        stepIndex++;
      } else {
        // All steps completed
        clearInterval(newIntervalId);
        setIntervalId(null);
        setFinalResponse(mockFinalResponses[promptType]);
        
        // Short delay before ending the thinking mode
        setTimeout(() => {
          setIsThinking(false);
        }, 1000);
      }
    }, 5000); // Each step takes 5 seconds (increased from 1.2 seconds)
    
    setIntervalId(newIntervalId);
  }, [clearThinkingInterval]);

  // Allow manually clearing the thinking process and response
  const resetThinking = useCallback(() => {
    clearThinkingInterval();
    setIsThinking(false);
    setThinkingSteps([]);
    setFinalResponse('');
    setCurrentStep(0);
  }, [clearThinkingInterval]);

  return {
    isThinking,
    thinkingSteps,
    currentStep,
    finalResponse,
    startThinking,
    resetThinking
  };
} 