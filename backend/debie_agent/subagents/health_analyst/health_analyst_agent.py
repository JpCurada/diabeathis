from google.adk.agents import LlmAgent
from google.adk.tools import FunctionTool

# Tools for the health analyst agent
def generate_health_report(user_id, glucose_data, medication_data, exercise_data, food_data, time_range="last_week"):
    """
    Generate a comprehensive health report based on user-logged data.
    
    Args:
        user_id: The user's ID for personalization
        glucose_data: Historical glucose readings with timestamps
        medication_data: Medication logs with timestamps
        exercise_data: Exercise logs with timestamps
        food_data: Food logs with timestamps
        time_range: Time period for the report (last_week, last_month, custom)
        
    Returns:
        A comprehensive health report with insights and recommendations
    """
    # Implementation would process and analyze this data
    return {
        "report_title": f"Health Analysis Report - {time_range}",
        "summary": "Your diabetes management shows overall improvement with some areas for attention.",
        "glucose_metrics": {
            "average": 132,
            "standard_deviation": 28,
            "time_in_range": "72%",
            "hypo_events": 2,
            "hyper_events": 5,
            "best_day": "Wednesday",
            "challenging_day": "Sunday"
        },
        "medication_adherence": {
            "adherence_rate": "92%",
            "missed_doses": 3,
            "consistent_timing": "85%"
        },
        "exercise_impact": {
            "glucose_reduction": "-18 mg/dL average",
            "optimal_timing": "Morning (6-9 AM)",
            "most_effective_type": "Moderate aerobic activity"
        },
        "nutrition_insights": {
            "high_impact_foods": ["White rice", "Whole grain bread", "Greek yogurt"],
            "beneficial_patterns": ["Protein with breakfast", "Fiber-rich snacks"],
            "suggested_adjustments": ["Reduce evening carbs", "Add more leafy greens"]
        },
        "insights": [
            "Your glucose levels tend to spike after high-carb meals",
            "Exercise in the morning appears to stabilize your glucose levels throughout the day",
            "Your medication adherence has improved by 15% in the last month",
            "Weekend glucose management shows more variability than weekdays"
        ],
        "recommendations": [
            "Consider reducing carbohydrate intake in evening meals",
            "Continue with your morning exercise routine",
            "Log your meals more consistently for better pattern analysis",
            "Implement a more structured weekend glucose monitoring schedule"
        ],
        "next_steps": [
            "Schedule a review with your healthcare provider",
            "Update your meal plan based on the identified patterns",
            "Adjust exercise timing to maximize glucose benefits"
        ]
    }

def identify_glucose_patterns(user_id, glucose_data, time_period="last_30_days"):
    """
    Identify patterns and trends in user's glucose levels with detailed analysis.
    
    Args:
        user_id: The user's ID for personalization
        glucose_data: Historical glucose readings with timestamps
        time_period: Period for analysis (default: last 30 days)
        
    Returns:
        Identified patterns and anomalies in glucose readings with visualizable data
    """
    # Implementation would analyze glucose data for patterns
    return {
        "time_period": time_period,
        "daily_patterns": [
            {"name": "Dawn phenomenon", "confidence": "High", "description": "Glucose rises 10-20 mg/dL between 4-8 AM"},
            {"name": "Post-lunch spikes", "confidence": "High", "description": "Average 45 mg/dL increase 1 hour after lunch"},
            {"name": "Overnight stability", "confidence": "Medium", "description": "Consistent readings between 11 PM - 3 AM"}
        ],
        "weekly_patterns": [
            {"name": "Weekend elevation", "confidence": "High", "description": "Average 22 mg/dL higher on weekend mornings"},
            {"name": "Mid-week stability", "confidence": "Medium", "description": "Tuesday-Thursday shows most consistent levels"}
        ],
        "meal_response_patterns": [
            {"meal_type": "Breakfast", "avg_spike": "+38 mg/dL", "recovery_time": "2.5 hours"},
            {"meal_type": "Lunch", "avg_spike": "+45 mg/dL", "recovery_time": "3 hours"},
            {"meal_type": "Dinner", "avg_spike": "+52 mg/dL", "recovery_time": "3.5 hours"}
        ],
        "risk_assessment": {
            "hypoglycemia_risk": {
                "level": "Low", 
                "risk_factors": ["Post-exercise (evenings)", "Delayed meals"],
                "prevention_suggestions": [
                    "Consume a small snack before evening exercise",
                    "Set meal reminders to maintain regular eating schedule"
                ]
            },
            "hyperglycemia_risk": {
                "level": "Moderate",
                "risk_factors": ["High-carb dinners", "Weekend dietary changes", "Stress events"],
                "prevention_suggestions": [
                    "Adjust evening insulin for high-carb meals",
                    "Maintain consistent carb intake on weekends",
                    "Implement stress management techniques"
                ]
            },
            "variability_assessment": {
                "level": "Medium",
                "contributing_factors": ["Inconsistent meal timing", "Variable exercise intensity"],
                "improvement_suggestions": [
                    "Standardize meal times with calendar reminders",
                    "Develop a more consistent exercise routine"
                ]
            }
        },
        "anomalies": [
            {"date": "2023-05-15", "reading": "210 mg/dL", "deviation": "+65 mg/dL", "potential_cause": "Missed medication dose"},
            {"date": "2023-05-22", "reading": "65 mg/dL", "deviation": "-50 mg/dL", "potential_cause": "Extended exercise without carb intake"}
        ],
        "time_in_range_analysis": {
            "overall": "72%",
            "by_day_part": [
                {"part": "Morning (6-11 AM)", "in_range": "65%"},
                {"part": "Afternoon (11 AM-5 PM)", "in_range": "78%"},
                {"part": "Evening (5-11 PM)", "in_range": "70%"},
                {"part": "Overnight (11 PM-6 AM)", "in_range": "82%"}
            ]
        },
        "visualization_data": {
            "time_series": "[Data structure for glucose time series visualization]",
            "daily_distribution": "[Data structure for time-of-day distribution chart]",
            "heatmap": "[Data structure for weekday/time heatmap]"
        }
    }

def correlate_factors(user_id, glucose_data, food_data, medication_data, exercise_data, sleep_data=None):
    """
    Analyze correlations between glucose levels and other factors with statistical confidence.
    
    Args:
        user_id: The user's ID for personalization
        glucose_data: Historical glucose readings
        food_data: Food consumption logs
        medication_data: Medication logs
        exercise_data: Exercise logs
        sleep_data: Optional sleep quality data if available
        
    Returns:
        Detailed correlation analysis between different factors and glucose levels
    """
    # Implementation would perform correlation analysis
    return {
        "analysis_period": "Last 90 days",
        "data_quality": {
            "completeness": "87%",
            "consistency": "High",
            "sufficient_for_analysis": True
        },
        "primary_correlations": [
            {
                "factor": "High carb meals (>60g)",
                "effect": "+48 mg/dL average increase after 1-2 hours",
                "confidence": "High (p<0.01)",
                "consistency": "93% of instances",
                "specific_triggers": ["White rice", "Pasta", "Sweetened beverages"]
            },
            {
                "factor": "Evening exercise (30+ minutes)",
                "effect": "-22 mg/dL lower morning glucose",
                "confidence": "Medium (p<0.05)",
                "consistency": "78% of instances",
                "specific_benefit": "Improved insulin sensitivity for ~14 hours"
            },
            {
                "factor": "Missed medication dose",
                "effect": "+64 mg/dL elevated glucose for 24-36 hours",
                "confidence": "High (p<0.01)",
                "consistency": "95% of instances",
                "recovery_pattern": "Gradual return to baseline over 2-3 days"
            },
            {
                "factor": "Protein-rich breakfast",
                "effect": "Reduced mid-morning glucose variability (-35%)",
                "confidence": "Medium (p<0.05)",
                "consistency": "82% of instances",
                "mechanism": "Slower gastric emptying and reduced glycemic response"
            }
        ],
        "secondary_correlations": [
            {
                "factor": "Stress events",
                "effect": "+15-25 mg/dL for 3-5 hours after event",
                "confidence": "Medium (p<0.05)",
                "consistency": "65% of instances",
                "notes": "Identified from unusual glucose patterns and user notes"
            },
            {
                "factor": "Poor sleep (<6 hours)",
                "effect": "+18 mg/dL higher fasting glucose",
                "confidence": "Medium-Low (p<0.1)",
                "consistency": "60% of instances",
                "notes": "More data needed for stronger conclusion"
            }
        ],
        "time_lag_effects": [
            {
                "factor": "High-intensity exercise",
                "immediate_effect": "-30 mg/dL during and immediately after",
                "delayed_effect": "Potential +10-15 mg/dL increase 6-12 hours later",
                "mechanism": "Initial glucose utilization followed by stress hormone response"
            },
            {
                "factor": "High-fat meals",
                "immediate_effect": "Minimal change in 1-2 hours",
                "delayed_effect": "Potential insulin resistance 4-8 hours later",
                "mechanism": "Delayed fat absorption and metabolic processing"
            }
        ],
        "causal_assessment": {
            "strong_evidence": ["Carbohydrate intake", "Medication adherence", "Moderate exercise"],
            "moderate_evidence": ["Sleep quality", "Stress levels", "Fat intake timing"],
            "insufficient_evidence": ["Specific vitamins", "Meal order", "Exercise type"]
        },
        "action_recommendations": [
            "Schedule meals with consistent carbohydrate content using Calendar reminders",
            "Set medication reminders at optimal timing based on identified patterns",
            "Plan exercise sessions to maximize glucose-stabilizing effects",
            "Consider stress management techniques during identified high-stress periods"
        ]
    }

def identify_logging_gaps(user_id, glucose_data, medication_data, exercise_data, food_data, target_logging_frequency=None):
    """
    Identify gaps in user's data logging patterns and suggest calendar-based solutions.
    
    Args:
        user_id: The user's ID for personalization
        glucose_data: Historical glucose readings
        medication_data: Medication logs
        exercise_data: Exercise logs
        food_data: Food logs
        target_logging_frequency: Optional dictionary with target frequencies by category
        
    Returns:
        Analysis of logging consistency with calendar-integrated recommendations
    """
    # Implementation would analyze logging patterns
    return {
        "overall_consistency_score": "76/100",
        "analysis_period": "Last 30 days",
        "logging_gaps": [
            {
                "category": "Glucose",
                "actual_frequency": "2.3 times/day",
                "target_frequency": "4 times/day",
                "pattern": "Missing pre-lunch and weekend readings",
                "impact": "High - missing crucial data points for meal impact analysis",
                "gap_days": ["Saturday", "Sunday"],
                "gap_times": ["11:00 AM - 1:00 PM"]
            },
            {
                "category": "Food",
                "actual_frequency": "2.1 meals/day",
                "target_frequency": "3 meals/day",
                "pattern": "Inconsistent dinner logging (43% completion)",
                "impact": "Medium - limits evening glucose correlation analysis",
                "gap_days": ["All days"],
                "gap_times": ["6:00 PM - 9:00 PM"]
            },
            {
                "category": "Exercise",
                "actual_frequency": "2.2 sessions/week",
                "target_frequency": "4 sessions/week",
                "pattern": "Logged duration but missing intensity data",
                "impact": "Medium - cannot accurately assess exercise impact",
                "gap_details": "85% of entries missing heart rate and perceived exertion"
            },
            {
                "category": "Medication",
                "actual_frequency": "1.8 logs/day",
                "target_frequency": "2 logs/day",
                "pattern": "Evening medication frequently not logged",
                "impact": "High - cannot verify adherence to treatment plan",
                "gap_days": ["Monday", "Thursday", "Friday"],
                "gap_times": ["7:00 PM - 10:00 PM"]
            }
        ],
        "data_quality_issues": [
            {
                "category": "Meal photos",
                "issue": "76% of food logs missing visual documentation",
                "impact": "Medium - harder to verify portion sizes and actual consumption"
            },
            {
                "category": "Contextual notes",
                "issue": "92% of abnormal glucose readings lack explanatory notes",
                "impact": "High - difficult to identify causes of outlier values"
            }
        ],
        "calendar_recommendations": [
            {
                "purpose": "Weekend glucose monitoring",
                "suggested_events": [
                    {"day": "Saturday", "times": ["9:00 AM", "1:00 PM", "6:00 PM", "10:00 PM"]},
                    {"day": "Sunday", "times": ["9:00 AM", "1:00 PM", "6:00 PM", "10:00 PM"]}
                ],
                "notification_strategy": "Double reminders with confirmation required"
            },
            {
                "purpose": "Pre-lunch glucose check",
                "suggested_events": [
                    {"days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                     "time": "11:30 AM",
                     "recurrence": "Weekdays"}
                ],
                "notification_strategy": "Calendar alert with glucose icon"
            },
            {
                "purpose": "Evening medication logging",
                "suggested_events": [
                    {"days": ["Monday", "Thursday", "Friday"],
                     "time": "8:00 PM",
                     "recurrence": "Weekly"}
                ],
                "notification_strategy": "High priority reminder with sound alert"
            }
        ],
        "implementation_plan": {
            "immediate_actions": [
                "Set up weekend glucose monitoring schedule in Calendar",
                "Create recurring pre-lunch glucose check reminders"
            ],
            "habit_building_strategy": "Start with highest impact gaps first (weekend glucose, evening medication)",
            "progress_tracking": "Weekly consistency score updates"
        }
    }

def forecast_glucose_trends(user_id, glucose_data, food_data, medication_data, exercise_data, future_events=None):
    """
    Predict future glucose trends based on historical patterns and upcoming calendar events.
    
    Args:
        user_id: The user's ID for personalization
        glucose_data: Historical glucose readings
        food_data: Food consumption logs
        medication_data: Medication logs
        exercise_data: Exercise logs
        future_events: Upcoming events from Google Calendar
        
    Returns:
        Glucose forecasts and preventative recommendations
    """
    # Implementation would analyze patterns and predict future trends
    return {
        "forecast_period": "Next 7 days",
        "overall_assessment": "Moderate risk of glucose variability based on historical patterns and upcoming events",
        "day_by_day_forecast": [
            {
                "day": "Monday",
                "risk_level": "Low",
                "predicted_pattern": "Stable glucose with minor post-lunch elevation",
                "key_events": ["Morning workout", "Regular medication schedule"]
            },
            {
                "day": "Wednesday",
                "risk_level": "Moderate",
                "predicted_pattern": "Potential evening hyperglycemia based on scheduled dinner event",
                "key_events": ["Business dinner (7 PM)", "Reduced physical activity"]
            },
            {
                "day": "Saturday",
                "risk_level": "High",
                "predicted_pattern": "Significant glucose variability throughout day",
                "key_events": ["Birthday party (2 PM)", "Unusual meal timing", "Potential medication timing changes"]
            }
        ],
        "high_risk_situations": [
            {
                "event": "Birthday party (Saturday)",
                "specific_risks": ["High-carb food options", "Altered meal schedule", "Social stress"],
                "preventative_strategies": [
                    "Pre-plan carbohydrate intake with 50% normal portion size",
                    "Set medication reminder 30 minutes before meal",
                    "Check glucose before, during (1 hour in) and after event",
                    "Schedule a 15-minute walk for 1-2 hours after eating"
                ]
            },
            {
                "event": "Business dinner (Wednesday)",
                "specific_risks": ["Unknown food options", "Later than usual meal time", "Limited exercise opportunity"],
                "preventative_strategies": [
                    "Have a small protein snack before dinner",
                    "Choose lower-carb options when available",
                    "Adjust evening medication timing to align with meal",
                    "Schedule brief morning walk to improve day-long insulin sensitivity"
                ]
            }
        ],
        "calendar_management_suggestions": [
            {
                "purpose": "Preventative glucose checks",
                "suggested_events": [
                    {"day": "Saturday", "time": "1:00 PM", "title": "Pre-party glucose check"},
                    {"day": "Saturday", "time": "3:00 PM", "title": "During-party glucose check"},
                    {"day": "Saturday", "time": "5:00 PM", "title": "Post-party glucose check"}
                ]
            },
            {
                "purpose": "Medication adjustments",
                "suggested_events": [
                    {"day": "Wednesday", "time": "6:30 PM", "title": "Pre-dinner medication"},
                    {"day": "Saturday", "time": "1:30 PM", "title": "Adjusted pre-party medication"}
                ]
            },
            {
                "purpose": "Compensatory exercise",
                "suggested_events": [
                    {"day": "Wednesday", "time": "7:00 AM", "title": "Morning walk - 20 minutes"},
                    {"day": "Saturday", "time": "4:00 PM", "title": "Brief walk during/after party - 15 minutes"}
                ]
            }
        ]
    }

def assess_a1c_trajectory(user_id, glucose_data, previous_a1c_values=None, forecast_period="3_months"):
    """
    Assess likely A1C trajectory based on glucose data and provide improvement strategies.
    
    Args:
        user_id: The user's ID for personalization
        glucose_data: Historical glucose readings
        previous_a1c_values: Previous lab-measured A1C results
        forecast_period: Period for A1C prediction
        
    Returns:
        A1C trajectory assessment and improvement strategies
    """
    # Implementation would analyze glucose trends and predict A1C
    return {
        "current_estimated_a1c": "7.2%",
        "calculation_basis": "Average glucose of 154 mg/dL over past 90 days",
        "confidence_interval": "±0.3%",
        "data_quality_assessment": "85% - Good coverage with some weekend gaps",
        "historical_a1c_trend": [
            {"date": "2023-01-15", "value": "7.9%", "source": "Lab test"},
            {"date": "2023-04-22", "value": "7.5%", "source": "Lab test"},
            {"date": "2023-07-30", "estimated": "7.2%", "source": "Calculated from CGM"}
        ],
        "projected_a1c": {
            "value": "7.0%",
            "date": "2023-10-30",
            "confidence": "Medium",
            "influential_factors": [
                "Improving post-meal recovery times",
                "Reduced overnight hyperglycemia",
                "Better medication adherence"
            ]
        },
        "target_assessment": {
            "user_target": "6.8%",
            "healthcare_provider_target": "7.0%",
            "feasibility": "Achievable with targeted improvements",
            "risk_balance": "Low hypoglycemia risk with current trajectory"
        },
        "improvement_strategies": [
            {
                "focus_area": "Post-dinner glucose",
                "potential_impact": "-0.2% A1C",
                "specific_actions": [
                    "Reduce evening carbohydrates by 15-20%",
                    "Add 10-minute post-dinner walk",
                    "Consider adjusting timing of evening medication"
                ],
                "calendar_implementation": {
                    "reminder_schedule": "Daily at 6:00 PM",
                    "reminder_text": "Lower-carb dinner choice + evening walk"
                }
            },
            {
                "focus_area": "Weekend glucose management",
                "potential_impact": "-0.15% A1C",
                "specific_actions": [
                    "Maintain consistent meal timing on weekends",
                    "Set specific glucose checking times",
                    "Limit high-glycemic breakfast options"
                ],
                "calendar_implementation": {
                    "reminder_schedule": "Weekends at 8:00 AM, 12:00 PM, 6:00 PM",
                    "reminder_text": "Weekend glucose check + log meal"
                }
            }
        ]
    }

# Create the health analyst agent
health_analyst_agent = LlmAgent(
    name="health_analyst",
    description="""
    The Health Analyst Agent processes user health data to provide meaningful insights about diabetes management:
    
    - Generates comprehensive health reports based on all available user data
    - Identifies detailed trends and patterns in glucose levels with statistical analysis
    - Performs correlation analysis between food, medication, exercise, and glucose readings
    - Conducts risk assessment for hypoglycemic or hyperglycemic events
    - Identifies logging gaps and suggests calendar-based solutions for better tracking
    - Forecasts glucose trends based on historical patterns and upcoming calendar events
    - Assesses likely A1C trajectory and provides targeted improvement strategies
    - Creates calendar events and reminders to support diabetes management goals
    
    The Health Analyst uses rigorous data analysis techniques to turn raw diabetes data into actionable insights, 
    with a focus on practical recommendations integrated with Google Calendar for implementation.
    """,
    tools=[
        FunctionTool(generate_health_report),
        FunctionTool(identify_glucose_patterns),
        FunctionTool(correlate_factors),
        FunctionTool(identify_logging_gaps),
        FunctionTool(forecast_glucose_trends),
        FunctionTool(assess_a1c_trajectory),
    ],
    model="gemini-2.0-pro"
) 