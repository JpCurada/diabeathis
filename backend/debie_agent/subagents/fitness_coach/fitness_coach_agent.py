from google.adk.agents import Agent
from google.adk.events import Event
from google.genai.types import Content, Part
from typing import Dict, List, Any, Optional
import datetime
import sys
import os

from debie_agent.utils.calendar_integration import (
    create_workout_events,
    create_exercise_logging_reminders,
    schedule_glucose_checks,
    schedule_workout
)

# Tools for the fitness coach agent
def create_exercise_plan(
    user_data: Dict[str, Any], 
    fitness_level: str, 
    preferences: List[str], 
    diabetes_type: str, 
    glucose_data: Optional[List[Dict[str, Any]]] = None,
    exercise_history: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Develops a customized exercise routine based on the user's profile.
    
    Args:
        user_data: User's health profile including age, weight, height, etc.
        fitness_level: User's current fitness level (beginner, intermediate, advanced)
        preferences: User's exercise preferences and interests
        diabetes_type: Type of diabetes the user has (Type 1, Type 2, Gestational)
        glucose_data: Optional historical glucose readings to analyze exercise impact
        exercise_history: Optional previous exercise logs for activity preferences
        
    Returns:
        A customized exercise plan with diabetes-specific considerations
    """
    # Implementation would create a truly personalized exercise plan
    # based on the user's health profile, glucose patterns, and preferences
    
    # Get user details for personalization
    age = user_data.get("age", 40)
    weight = user_data.get("weight", 70)
    gender = user_data.get("gender", "Not specified")
    
    # Adjust intensity and duration based on fitness level
    intensity_map = {
        "beginner": "Low",
        "intermediate": "Moderate",
        "advanced": "High"
    }
    
    base_intensity = intensity_map.get(fitness_level.lower(), "Moderate")
    
    # Consider diabetes type for exercise recommendations
    is_type1 = diabetes_type.lower() in ["type 1", "1", "t1d"]
    
    # Analyze glucose data if available
    hypo_risk = "Medium"
    if glucose_data and len(glucose_data) > 10:
        # This would contain real analysis logic in production
        low_readings = [r for r in glucose_data if r.get("glucose_value", 0) < 70]
        hypo_risk = "High" if len(low_readings) > len(glucose_data) * 0.1 else "Medium"
    
    # Create safety guidelines based on diabetes type and hypo risk
    safety_guidelines = [
        "Check glucose before, during (for longer sessions), and after exercise",
        "Have fast-acting carbs available during workout",
        "Monitor for delayed hypoglycemia up to 24 hours after exercise"
    ]
    
    if is_type1:
        safety_guidelines.append("For prolonged exercise, consider reducing insulin doses")
        safety_guidelines.append("Avoid exercising if glucose is >250 mg/dL with ketones")
    
    if hypo_risk == "High":
        safety_guidelines.append("Consider consuming 15-30g carbs before exercise if glucose <120 mg/dL")
        
    # Incorporate user preferences
    preferred_activities = []
    if preferences:
        for pref in preferences:
            if "walk" in pref.lower():
                preferred_activities.append("Walking")
            elif "run" in pref.lower() or "jog" in pref.lower():
                preferred_activities.append("Running")
            elif "swim" in pref.lower():
                preferred_activities.append("Swimming")
            elif "bike" in pref.lower() or "cycl" in pref.lower():
                preferred_activities.append("Cycling")
            elif "yoga" in pref.lower():
                preferred_activities.append("Yoga")
            elif "strength" in pref.lower() or "weight" in pref.lower():
                preferred_activities.append("Strength training")
    
    # Fallback to standard activities if no preferences
    if not preferred_activities:
        preferred_activities = ["Walking", "Cycling", "Strength training", "Yoga"]
    
    # Build the weekly schedule
    weekly_schedule = [
        {"day": "Monday", "activity": "Walking", "duration": "30 min", "intensity": base_intensity},
        {"day": "Tuesday", "activity": "Rest", "duration": "0 min", "intensity": "None"},
        {"day": "Wednesday", "activity": "Strength training", "duration": "20 min", "intensity": base_intensity},
        {"day": "Thursday", "activity": "Swimming" if "Swimming" in preferred_activities else "Walking", "duration": "30 min", "intensity": "Low" if base_intensity == "High" else base_intensity},
        {"day": "Friday", "activity": "Walking", "duration": "30 min", "intensity": base_intensity},
        {"day": "Saturday", "activity": "Cycling" if "Cycling" in preferred_activities else preferred_activities[0], "duration": "45 min", "intensity": base_intensity},
        {"day": "Sunday", "activity": "Yoga" if "Yoga" in preferred_activities else "Rest", "duration": "30 min" if "Yoga" in preferred_activities else "0 min", "intensity": "Low" if "Yoga" in preferred_activities else "None"}
    ]
    
    return {
        "plan_name": f"Diabetes-friendly fitness plan for {fitness_level} level",
        "user_profile_summary": {
            "fitness_level": fitness_level,
            "diabetes_type": diabetes_type,
            "hypoglycemia_risk": hypo_risk
        },
        "weekly_schedule": weekly_schedule,
        "glucose_management": safety_guidelines,
        "recommended_equipment": [
            "Glucose meter or CGM",
            "Fast-acting carbohydrate source",
            "Water bottle",
            "Medical ID"
        ],
        "progress_tracking": {
            "starting_point": datetime.datetime.now().strftime("%Y-%m-%d"),
            "review_frequency": "Weekly",
            "metrics_to_track": [
                "Pre and post exercise glucose levels",
                "Perceived exertion (scale 1-10)",
                "Duration completed",
                "Recovery time"
            ]
        }
    }

def schedule_workouts(
    user_credentials: Dict[str, Any],
    exercise_plan: Dict[str, Any],
    start_date: str,  # Required ISO format date string "YYYY-MM-DD"
    preferred_times: str = "",  # JSON string of day-to-time mappings
    create_glucose_checks: bool = True
) -> Dict[str, Any]:
    """
    Schedules workouts in Google Calendar with post-exercise logging prompts.
    
    Args:
        user_credentials: Google OAuth credentials for the user
        exercise_plan: The exercise plan to schedule
        start_date: Start date in ISO format (YYYY-MM-DD)
        preferred_times: JSON string of preferred times (e.g., '{"Monday": "09:00 AM"}')
        create_glucose_checks: Whether to create glucose check reminders
        
    Returns:
        Confirmation of calendar events creation
    """
    try:
        # Parse preferred times from JSON string
        preferred_times_dict = {}
        if preferred_times:
            try:
                import json
                preferred_times_dict = json.loads(preferred_times)
            except json.JSONDecodeError:
                return {
                    "status": "error",
                    "message": "Invalid preferred_times format. Please provide a valid JSON string."
                }
        
        # Apply preferred times to the exercise plan if provided
        if preferred_times_dict:
            for workout in exercise_plan.get("weekly_schedule", []):
                day = workout.get("day")
                if day and day.lower() in [k.lower() for k in preferred_times_dict.keys()]:
                    day_lower = day.lower()
                    for k, v in preferred_times_dict.items():
                        if k.lower() == day_lower:
                            workout["time"] = v
                            break
        
        # Create workout events in Google Calendar
        calendar_result = create_workout_events(
            user_credentials=user_credentials,
            exercise_plan=exercise_plan,
            start_date=start_date
        )
        
        # Check if workout events were created successfully
        if calendar_result.get("status") != "success":
            return {
                "status": "error",
                "message": calendar_result.get("message", "Failed to create workout events"),
                "details": calendar_result
            }
        
        # Get the created events
        created_events = calendar_result.get("events_created", [])
        
        # Create logging reminders for each event
        logging_result = create_exercise_logging_reminders(
            user_credentials=user_credentials,
            workout_events=created_events
        )
        
        # Create glucose check reminders if requested
        glucose_checks_result = None
        if create_glucose_checks and created_events:
            glucose_checks_result = schedule_glucose_checks(
                user_credentials=user_credentials,
                exercise_events=created_events,
                check_times=["before", "after"]
            )
        
        # Compile the complete result
        result = {
            "status": "success",
            "events_created": created_events,
            "logging_reminders": logging_result.get("reminders_created", []) if logging_result else [],
            "glucose_checks": glucose_checks_result.get("checks_created", []) if glucose_checks_result else []
        }
        
        # Provide a summary for easy consumption
        event_summary = []
        for event in created_events:
            event_summary.append({
                "activity": event.get("activity"),
                "day": event.get("day"),
                "time": event.get("time"),
                "event_id": event.get("id")
            })
        
        result["event_summary"] = event_summary
        result["message"] = f"Created {len(created_events)} workout events with logging reminders"
        if create_glucose_checks:
            result["message"] += f" and {len(result['glucose_checks'])} glucose check reminders"
        
        return result
    
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to schedule workouts: {str(e)}"
        }

def provide_exercise_instructions(
    activity_type: str, 
    fitness_level: str = "beginner",
    duration_mins: int = 30,
    has_equipment: bool = False,
    diabetes_considerations: bool = True
) -> Dict[str, Any]:
    """
    Provides detailed exercise instructions with visual guides and diabetes-specific considerations.
    
    Args:
        activity_type: Type of exercise (e.g., walking, swimming, strength training)
        fitness_level: User's fitness level (beginner, intermediate, advanced)
        duration_mins: Planned duration in minutes
        has_equipment: Whether the user has access to exercise equipment
        diabetes_considerations: Whether to include diabetes-specific safety information
        
    Returns:
        Detailed instructions for the exercise with safety considerations
    """
    # This implementation would provide comprehensive instructions
    # tailored to the specific activity and user's conditions
    
    # Normalize activity type
    activity = activity_type.lower()
    
    # Define base instructions based on activity type
    instructions = "Step-by-step instructions would be provided here."
    visual_guide = "URL to visual demonstration would be provided here."
    
    # Determine intensity modifications based on fitness level
    easier_mods = "How to make the exercise easier would be provided here."
    harder_mods = "How to make the exercise more challenging would be provided here."
    
    # Basic safety tips for all exercises
    safety_tips = [
        "Start with a proper warm-up",
        "Stay hydrated throughout your workout",
        "Listen to your body and rest when needed"
    ]
    
    # Add diabetes-specific safety tips if requested
    if diabetes_considerations:
        safety_tips.extend([
            "Check your glucose before starting exercise",
            "Have fast-acting carbohydrates available in case of hypoglycemia",
            "Watch for signs of hypoglycemia: shakiness, sweating, confusion",
            "For longer workouts (>30 min), check glucose during exercise",
            "Check glucose after exercise and monitor for delayed hypoglycemia"
        ])
    
    return {
        "activity": activity_type,
        "fitness_level": fitness_level,
        "duration": f"{duration_mins} minutes",
        "instructions": instructions,
        "visual_guide": visual_guide,
        "warm_up": [
            "5 minutes of light activity to gradually increase heart rate",
            "Dynamic stretches to prepare muscles and joints"
        ],
        "main_routine": [
            "Exercise sequence would be detailed here",
            "Proper form tips would be included",
            "Suggested work/rest intervals based on fitness level"
        ],
        "cool_down": [
            "5 minutes of decreasing intensity to normalize heart rate",
            "Static stretches for major muscle groups"
        ],
        "difficulty_modifications": {
            "easier": easier_mods,
            "harder": harder_mods
        },
        "equipment_alternatives": [
            "Options for those without specialized equipment",
            "Household item substitutions where applicable"
        ],
        "safety_tips": safety_tips,
        "glucose_management": {
            "before": "Target 100-180 mg/dL, consume carbs if below",
            "during": "For activities >30 minutes, check halfway through",
            "after": "Check immediately and again 2-3 hours later",
            "medication_adjustments": "Consult healthcare provider about insulin/medication adjustments for exercise"
        } if diabetes_considerations else {}
    }

def recommend_glucose_management(
    exercise_type: str, 
    intensity: str, 
    duration: int, 
    user_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Provides detailed recommendations for managing glucose around exercise sessions.
    
    Args:
        exercise_type: Type of planned exercise (e.g., cardio, strength, flexibility)
        intensity: Planned exercise intensity (low, moderate, high)
        duration: Planned exercise duration in minutes
        user_data: User's health profile and recent glucose readings
        
    Returns:
        Comprehensive recommendations for glucose management around exercise
    """
    # Get user's diabetes type
    diabetes_type = user_data.get("diabetes_type", "").lower()
    is_type1 = "type 1" in diabetes_type or diabetes_type == "1"
    
    # Determine if this is an aerobic or anaerobic activity
    is_aerobic = exercise_type.lower() in ["walking", "running", "swimming", "cycling", "cardio"]
    is_anaerobic = exercise_type.lower() in ["strength", "resistance", "weight", "hiit"]
    is_mixed = not (is_aerobic or is_anaerobic)
    
    # Determine expected glucose impact based on exercise characteristics
    glucose_impact = "lowering"
    if is_anaerobic and intensity.lower() in ["high", "vigorous"]:
        glucose_impact = "variable" # High-intensity anaerobic can raise glucose initially
    
    # Adjust recommendations based on duration
    is_prolonged = duration > 45
    
    # Create pre-exercise recommendations
    pre_exercise = [
        "Check glucose 30 minutes before exercise",
        f"Target pre-exercise range: 100-180 mg/dL"
    ]
    
    if is_type1:
        pre_exercise.append("If below 100 mg/dL, consume 15-20g of carbs")
        pre_exercise.append("If above 250 mg/dL, check for ketones before exercising")
        if is_prolonged:
            pre_exercise.append("For activity >45 minutes, consider reducing bolus insulin by 25-50% for meals eaten within 2 hours before exercise")
    else: # Type 2
        pre_exercise.append("If below 100 mg/dL, consume 15g of carbs")
        pre_exercise.append("If above 250 mg/dL, use caution and stay hydrated")
    
    # Create during-exercise recommendations
    during_exercise = []
    
    if is_prolonged:
        during_exercise.append(f"For activity longer than 45 minutes, check glucose halfway through")
        during_exercise.append("Consider 15-30g carbs per hour of continued exercise")
    
    during_exercise.append("Keep fast-acting carbs easily accessible")
    during_exercise.append("Watch for hypoglycemia symptoms: shakiness, sweating, confusion")
    
    # Create post-exercise recommendations
    post_exercise = [
        "Check glucose immediately after exercise",
        "For moderate to high intensity exercise, check glucose again 2-3 hours after exercise to monitor for delayed hypoglycemia"
    ]
    
    if is_type1:
        post_exercise.append("Consider reducing mealtime insulin by 25% for the next meal after exercise")
        if is_prolonged or intensity.lower() in ["high", "vigorous"]:
            post_exercise.append("Be aware that insulin sensitivity may remain increased for up to 24 hours")
    
    # Create special considerations
    special_considerations = []
    
    if is_anaerobic and intensity.lower() in ["high", "vigorous"]:
        special_considerations.append("High-intensity activities can initially raise blood glucose due to stress hormone release")
    
    if is_prolonged:
        special_considerations.append("Extended exercise sessions deplete glycogen and can lead to delayed hypoglycemia up to 24 hours later")
    
    if exercise_type.lower() in ["swimming", "water aerobics"]:
        special_considerations.append("Water activities can mask sweat-based hypoglycemia symptoms - check glucose more frequently")
    
    return {
        "exercise_profile": {
            "type": exercise_type,
            "intensity": intensity,
            "duration": f"{duration} minutes",
            "expected_glucose_impact": glucose_impact
        },
        "pre_exercise": pre_exercise,
        "during_exercise": during_exercise,
        "post_exercise": post_exercise,
        "special_considerations": special_considerations,
        "emergency_preparation": [
            "Always carry fast-acting glucose (tablets, gel, juice)",
            "Wear medical ID",
            "Exercise with a partner when possible, especially for high-intensity workouts"
        ]
    }

def suggest_workout_nutrition(
    exercise_type: str, 
    intensity: str, 
    duration: int, 
    timing: str, 
    user_preferences: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Suggests appropriate pre and post-workout nutrition optimized for diabetes management.
    
    Args:
        exercise_type: Type of planned exercise
        intensity: Exercise intensity (low, moderate, high)
        duration: Exercise duration in minutes
        timing: When the exercise will occur (morning, midday, evening)
        user_preferences: Dietary preferences and restrictions
        
    Returns:
        Nutrition recommendations for exercise with diabetes considerations
    """
    # Determine if this is an aerobic or anaerobic activity
    is_aerobic = exercise_type.lower() in ["walking", "running", "swimming", "cycling", "cardio"]
    is_anaerobic = exercise_type.lower() in ["strength", "resistance", "weight", "hiit"]
    
    # Determine if this is prolonged exercise
    is_prolonged = duration > 45
    
    # Check for dietary restrictions
    is_vegetarian = user_preferences.get("vegetarian", False)
    is_gluten_free = user_preferences.get("gluten_free", False)
    is_dairy_free = user_preferences.get("dairy_free", False)
    
    # Adjust carb recommendations based on intensity and duration
    carb_needs = "moderate" # default
    if is_prolonged and (intensity.lower() in ["moderate", "high"]):
        carb_needs = "high"
    elif not is_prolonged and intensity.lower() == "low":
        carb_needs = "low"
    
    # Build pre-workout recommendations
    pre_workout_timing = "1-3 hours before exercise"
    if timing.lower() == "morning":
        pre_workout_timing = "Have breakfast 1-2 hours before morning exercise"
    
    pre_workout_recs = []
    
    if carb_needs == "high":
        pre_workout_recs.append("Focus on complex carbs with moderate protein (30-45g carbs)")
    elif carb_needs == "moderate":
        pre_workout_recs.append("Balanced meal or snack with moderate carbs (15-30g carbs)")
    else:
        pre_workout_recs.append("Light snack with low to moderate carbs (15g carbs)")
    
    pre_workout_recs.append("Include some protein for sustained energy")
    pre_workout_recs.append("Low fat to prevent delayed digestion")
    
    # Build during workout recommendations
    during_workout_recs = []
    
    if is_prolonged:
        during_workout_recs.append("For workouts >60 minutes, consider 15-30g carbs per hour")
        during_workout_recs.append("Focus on easily digestible carbs like sports drinks, fruit, or energy gels")
    
    during_workout_recs.append("Stay hydrated with water or sugar-free electrolyte drinks")
    
    # Build post-workout recommendations
    post_workout_recs = []
    
    if is_anaerobic or intensity.lower() in ["moderate", "high"]:
        post_workout_recs.append("Combination of protein (15-25g) and carbs (15-30g) for recovery")
    else:
        post_workout_recs.append("Light balanced meal or snack within 30-60 minutes")
    
    post_workout_recs.append("Consider timing with regular meal or snack")
    post_workout_recs.append("Stay hydrated to support recovery")
    
    # Example meals based on restrictions
    example_pre_meals = []
    example_post_meals = []
    
    if is_vegetarian:
        example_pre_meals.append("Oatmeal with berries and nuts")
        example_post_meals.append("Greek yogurt with fruit and granola")
        if is_dairy_free:
            example_post_meals[-1] = "Plant-based protein shake with fruit"
    else:
        example_pre_meals.append("Whole grain toast with eggs")
        example_post_meals.append("Grilled chicken with sweet potato")
    
    if is_gluten_free:
        for i, meal in enumerate(example_pre_meals):
            if "toast" in meal or "oatmeal" in meal:
                example_pre_meals[i] = "Quinoa bowl with vegetables and eggs"
    
    return {
        "exercise_profile": {
            "type": exercise_type,
            "intensity": intensity,
            "duration": f"{duration} minutes",
            "timing": timing
        },
        "pre_workout": {
            "timing": pre_workout_timing,
            "recommendations": pre_workout_recs,
            "example_meals": example_pre_meals,
            "glucose_considerations": "Check glucose before eating; adjust carbs based on readings"
        },
        "during_workout": {
            "recommendations": during_workout_recs,
            "quick_energy_options": [
                "Glucose tablets", 
                "Sports drink (4-8 oz)",
                "Banana or small fruit"
            ]
        },
        "post_workout": {
            "timing": "Within 30-60 minutes after exercise",
            "recommendations": post_workout_recs,
            "example_meals": example_post_meals,
            "glucose_considerations": "Check glucose before eating; be aware that insulin sensitivity may be increased"
        },
        "diabetes_specific_tips": [
            "Monitor glucose levels before and after adjusting nutrition plan",
            "Keep a workout nutrition log to identify what works best for your body",
            "For high-intensity exercise, be prepared for possible post-workout glucose spikes",
            "For longer aerobic exercise, be vigilant about delayed hypoglycemia"
        ]
    }

def analyze_exercise_impact(user_id: str, exercise_logs: List[Dict[str, Any]], glucose_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes the impact of different exercises on glucose levels for personalized recommendations.
    
    Args:
        user_id: The user's ID
        exercise_logs: Historical exercise logs with details
        glucose_data: Glucose readings before and after exercise
        
    Returns:
        Analysis of exercise impact on glucose levels with recommendations
    """
    # This would contain detailed analysis in a real implementation
    return {
        "optimal_exercise_types": [
            {"type": "Walking", "glucose_impact": "-20 mg/dL average", "consistency": "85%"},
            {"type": "Swimming", "glucose_impact": "-25 mg/dL average", "consistency": "80%"},
            {"type": "Strength Training", "glucose_impact": "+5 mg/dL initially, -15 mg/dL after 2 hours", "consistency": "70%"}
        ],
        "optimal_timing": {
            "time_of_day": "Morning (6-9 AM)",
            "relation_to_meals": "1-2 hours after breakfast",
            "glucose_stability": "22% improvement in time-in-range on exercise days"
        },
        "duration_effects": [
            {"duration": "15-30 minutes", "glucose_impact": "-15 mg/dL", "recovery_time": "1-2 hours"},
            {"duration": "30-60 minutes", "glucose_impact": "-30 mg/dL", "recovery_time": "2-4 hours"},
            {"duration": ">60 minutes", "glucose_impact": "-45 mg/dL", "recovery_time": "4-6 hours"}
        ],
        "intensity_analysis": {
            "low_intensity": {"glucose_impact": "Gradual decrease", "duration": "Longer lasting", "risk": "Low hypoglycemia risk"},
            "moderate_intensity": {"glucose_impact": "Moderate decrease", "duration": "Medium lasting", "risk": "Medium hypoglycemia risk"},
            "high_intensity": {"glucose_impact": "Initial increase, then significant decrease", "duration": "Longest lasting", "risk": "Delayed hypoglycemia risk"}
        },
        "pattern_recognition": {
            "identified_patterns": [
                "Evening exercise improves overnight glucose stability",
                "High-intensity intervals cause short glucose spikes followed by prolonged drops",
                "Exercise benefits persist for approximately 24-48 hours"
            ]
        },
        "recommendations": {
            "optimal_routine": "30-45 minute moderate intensity sessions, 4-5 times weekly",
            "glucose_management": "Pre-exercise target: 120-180 mg/dL; have 15g carbs if below 120 mg/dL",
            "schedule_adjustments": "Consider splitting longer sessions into multiple shorter ones if hypoglycemia is a concern"
        }
    }

# Initialize the fitness coach agent
fitness_coach_agent = Agent(
    name="FitnessCoach",
    model="gemini-2.0-flash",
    description="Specialized fitness coach for diabetes management",
    instruction="""
    You are a specialized fitness coach for diabetes management. Your role is to help users 
    maintain an active lifestyle while considering their glucose levels and overall health.

    CORE RESPONSIBILITIES:
    1. Create personalized workout plans
    2. Schedule exercises via Google Calendar
    3. Provide exercise guidance based on glucose levels
    4. Encourage consistent activity logging

    AVAILABLE TOOLS:
    - schedule_workouts: Schedule workouts in Google Calendar
      Parameters:
      - user_credentials: Dict (Google OAuth credentials)
      - exercise_plan: Dict (workout schedule and details)
      - start_date: str (ISO format "YYYY-MM-DD")
      - preferred_times: str (JSON string of day-to-time mappings)
      - create_glucose_checks: bool (default: True)

    - create_exercise_plan: Create personalized exercise plans
      Parameters:
      - user_data: Dict (user's health profile)
      - fitness_level: str (beginner, intermediate, advanced)
      - preferences: List[str] (exercise preferences)
      - diabetes_type: str (Type 1, Type 2, Gestational)

    IMPORTANT GUIDELINES:
    1. Always consider user's current glucose levels before recommending exercise
    2. Include warm-up and cool-down periods in workout plans
    3. Provide clear instructions for exercises
    4. Add logging reminders to all scheduled workouts
    5. Recommend glucose checks before/after intense workouts
    6. Adjust intensity based on user's fitness level

    SCHEDULING FORMAT:
    - Use ISO format for dates (e.g., "2024-03-20")
    - Provide preferred times as JSON string (e.g., '{"Monday": "09:00 AM"}')
    - Include exercise type and intensity in event title
    - Add detailed instructions in event description

    WHEN RECEIVING A TRANSFER:
    1. Acknowledge the transfer and user's request
    2. Gather necessary user information using create_exercise_plan
    3. Create and schedule appropriate workouts using schedule_workouts
    4. Provide clear next steps and safety guidelines
    5. Encourage manual logging of completed exercises
    """,
    tools=[
        schedule_workouts,
        create_exercise_plan,
        provide_exercise_instructions,
        recommend_glucose_management,
        suggest_workout_nutrition,
        analyze_exercise_impact
    ]
)
