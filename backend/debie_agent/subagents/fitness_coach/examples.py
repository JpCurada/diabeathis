"""
Examples of using the Fitness Coach Agent and its calendar integration features.

This file demonstrates how to use the Fitness Coach Agent to:
1. Create personalized exercise plans
2. Schedule workouts in Google Calendar
3. Set up glucose checks and logging reminders
4. Generate exercise instructions and glucose management strategies
"""

import asyncio
import datetime
from typing import Dict, Any, List

# Import the Fitness Coach Agent and calendar integration functions
from .fitness_coach_agent import fitness_coach_agent
from debie_agent.utils.calendar_integration import (
    create_workout_events,
    create_exercise_logging_reminders,
    schedule_glucose_checks
)

# Mock user data for examples
MOCK_USER_DATA = {
    "user_id": "user123",
    "username": "TestUser",
    "age": 45,
    "weight": 75,
    "height": 175,
    "gender": "female",
    "diabetes_type": "Type 2",
    "fitness_level": "beginner",
    "preferences": ["walking", "swimming", "yoga"],
    "glucose_data": [
        {
            "glucose_reading_id": "g1",
            "reading_timestamp": "2023-05-01T07:30:00Z",
            "glucose_value": 130,
            "reading_source": "Manual"
        },
        {
            "glucose_reading_id": "g2",
            "reading_timestamp": "2023-05-01T12:00:00Z",
            "glucose_value": 145,
            "reading_source": "Manual"
        },
        # Additional readings would be here
    ],
    "exercise_logs": [
        {
            "exercise_log_id": "e1",
            "log_timestamp": "2023-05-01T17:00:00Z",
            "exercise_type": "Walking",
            "duration_minutes": 30,
            "intensity": "Moderate"
        },
        # Additional exercise logs would be here
    ]
}

# Mock Google Calendar credentials (these would come from OAuth flow in real app)
MOCK_CREDENTIALS = {
    "token": "mock_token",
    "refresh_token": "mock_refresh_token",
    "client_id": "mock_client_id",
    "client_secret": "mock_client_secret",
    "scopes": ["https://www.googleapis.com/auth/calendar"]
}

async def example_create_exercise_plan():
    """Example of creating a personalized exercise plan"""
    print("\n=== Creating Exercise Plan ===")
    
    # Simulate an LLM agent call to create an exercise plan
    try:
        # In a real implementation, this would be handled by the agent framework
        # Here we're simulating the function call that would be made by the agent
        response = fitness_coach_agent.tools[0].function(
            user_data=MOCK_USER_DATA,
            fitness_level="beginner",
            preferences=["walking", "swimming", "yoga"],
            diabetes_type="Type 2",
            glucose_data=MOCK_USER_DATA["glucose_data"]
        )
        
        # Display the results
        print(f"Plan Name: {response['plan_name']}")
        print("\nWeekly Schedule:")
        for workout in response["weekly_schedule"]:
            print(f"- {workout['day']}: {workout['activity']} ({workout['duration']}, {workout['intensity']})")
        
        print("\nGlucose Management Tips:")
        for tip in response["glucose_management"]:
            print(f"- {tip}")
        
        # Save the exercise plan for use in other examples
        return response
    
    except Exception as e:
        print(f"Error creating exercise plan: {str(e)}")
        return None

async def example_schedule_workouts(exercise_plan):
    """Example of scheduling workouts in Google Calendar"""
    print("\n=== Scheduling Workouts in Calendar ===")
    
    # Set preferred workout times
    preferred_times = {
        "Monday": "7:00 AM",
        "Wednesday": "6:30 PM",
        "Friday": "7:00 AM",
        "Saturday": "9:00 AM",
        "Sunday": "10:00 AM"
    }
    
    try:
        # In a real implementation, this would use actual OAuth credentials
        # and would create real calendar events
        print("Would create the following calendar events:")
        
        for workout in exercise_plan["weekly_schedule"]:
            day = workout["day"]
            activity = workout["activity"]
            duration = workout["duration"]
            
            # Skip rest days
            if workout["intensity"].lower() == "none":
                continue
                
            # Get preferred time or use a default
            time = preferred_times.get(day, "8:00 AM")
            
            print(f"- {day} at {time}: {activity} Workout ({duration}, {workout['intensity']})")
            print(f"  • Pre-workout glucose check reminder (15 min before)")
            print(f"  • Post-workout glucose check reminder (15 min after)")
            print(f"  • Exercise logging reminder (15 min after completion)")
        
        # The actual implementation would call:
        # result = schedule_workouts(
        #     user_credentials=MOCK_CREDENTIALS,
        #     exercise_plan=exercise_plan,
        #     preferred_times=preferred_times,
        #     create_glucose_checks=True
        # )
    
    except Exception as e:
        print(f"Error scheduling workouts: {str(e)}")

async def example_provide_exercise_instructions():
    """Example of providing detailed exercise instructions"""
    print("\n=== Providing Exercise Instructions ===")
    
    activity_type = "Walking"
    
    try:
        # Simulate the agent's tool call to provide exercise instructions
        response = fitness_coach_agent.tools[2].function(
            activity_type=activity_type,
            fitness_level="beginner",
            duration_mins=30,
            has_equipment=False,
            diabetes_considerations=True
        )
        
        # Display the results
        print(f"Instructions for: {response['activity']} ({response['duration']}, {response['fitness_level']})")
        
        print("\nWarm-up:")
        for step in response["warm_up"]:
            print(f"- {step}")
        
        print("\nSafety Tips:")
        for tip in response["safety_tips"]:
            print(f"- {tip}")
        
        print("\nGlucose Management:")
        for phase, guidance in response["glucose_management"].items():
            print(f"- {phase.capitalize()}: {guidance}")
    
    except Exception as e:
        print(f"Error providing exercise instructions: {str(e)}")

async def example_recommend_glucose_management():
    """Example of recommending glucose management for exercise"""
    print("\n=== Recommending Glucose Management ===")
    
    try:
        # Simulate the agent's tool call for glucose management recommendations
        response = fitness_coach_agent.tools[3].function(
            exercise_type="Swimming",
            intensity="Moderate",
            duration=45,
            user_data=MOCK_USER_DATA
        )
        
        # Display the results
        print(f"Exercise: {response['exercise_profile']['type']} ({response['exercise_profile']['intensity']}, {response['exercise_profile']['duration']})")
        print(f"Expected glucose impact: {response['exercise_profile']['expected_glucose_impact']}")
        
        print("\nPre-exercise guidelines:")
        for guideline in response["pre_exercise"]:
            print(f"- {guideline}")
        
        print("\nDuring-exercise guidelines:")
        for guideline in response["during_exercise"]:
            print(f"- {guideline}")
        
        print("\nPost-exercise guidelines:")
        for guideline in response["post_exercise"]:
            print(f"- {guideline}")
        
        if "special_considerations" in response:
            print("\nSpecial considerations:")
            for consideration in response["special_considerations"]:
                print(f"- {consideration}")
    
    except Exception as e:
        print(f"Error recommending glucose management: {str(e)}")

async def example_suggest_workout_nutrition():
    """Example of suggesting workout nutrition"""
    print("\n=== Suggesting Workout Nutrition ===")
    
    user_preferences = {
        "vegetarian": True,
        "gluten_free": False,
        "dairy_free": False,
        "low_carb": False
    }
    
    try:
        # Simulate the agent's tool call for workout nutrition recommendations
        response = fitness_coach_agent.tools[4].function(
            exercise_type="Swimming",
            intensity="Moderate",
            duration=45,
            timing="evening",
            user_preferences=user_preferences
        )
        
        # Display the results
        print(f"Nutrition for: {response['exercise_profile']['type']} ({response['exercise_profile']['intensity']}, {response['exercise_profile']['duration']})")
        
        print("\nPre-workout:")
        print(f"Timing: {response['pre_workout']['timing']}")
        for rec in response['pre_workout']['recommendations']:
            print(f"- {rec}")
        
        if 'example_meals' in response['pre_workout']:
            print("Example meals:")
            for meal in response['pre_workout']['example_meals']:
                print(f"- {meal}")
        
        print("\nPost-workout:")
        print(f"Timing: {response['post_workout']['timing']}")
        for rec in response['post_workout']['recommendations']:
            print(f"- {rec}")
        
        print("\nDiabetes-specific tips:")
        for tip in response['diabetes_specific_tips']:
            print(f"- {tip}")
    
    except Exception as e:
        print(f"Error suggesting workout nutrition: {str(e)}")

async def run_examples():
    """Run all examples"""
    exercise_plan = await example_create_exercise_plan()
    if exercise_plan:
        await example_schedule_workouts(exercise_plan)
    await example_provide_exercise_instructions()
    await example_recommend_glucose_management()
    await example_suggest_workout_nutrition()

if __name__ == "__main__":
    # Run the examples
    asyncio.run(run_examples()) 