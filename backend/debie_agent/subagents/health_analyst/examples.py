"""
Examples of using the Health Analyst Agent and its calendar integration features.

This file demonstrates how to use the Health Analyst Agent to:
1. Generate health reports
2. Identify glucose patterns
3. Create calendar-based monitoring schedules
4. Set up follow-up logging reminders
"""

import asyncio
import datetime
from typing import Dict, Any

# Import the Health Analyst Agent and calendar integration functions
from .health_analyst_agent import health_analyst_agent


# Mock user data for examples
MOCK_USER_DATA = {
    "user_id": "user123",
    "glucose_data": [
        {
            "glucose_reading_id": "g1",
            "reading_timestamp": "2023-05-01T08:00:00Z",
            "glucose_value": 120,
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
    "food_data": [
        {
            "food_log_id": "f1",
            "log_timestamp": "2023-05-01T07:30:00Z",
            "food_description": "Oatmeal with berries",
            "estimated_carbs": 35,
            "estimated_calories": 320
        },
        # Additional food logs would be here
    ],
    "medication_data": [
        {
            "medication_log_id": "m1",
            "log_timestamp": "2023-05-01T08:00:00Z",
            "medication_name": "Metformin",
            "dosage": 500,
            "unit_of_measure": "mg"
        },
        # Additional medication logs would be here
    ],
    "exercise_data": [
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

async def example_generate_health_report():
    """Example of generating a comprehensive health report"""
    print("\n=== Generating Health Report ===")
    
    # Simulate an LLM agent call to generate a health report
    try:
        # In a real implementation, this would be handled by the agent framework
        # Here we're simulating the function call that would be made by the agent
        response = health_analyst_agent.tools[0].function(
            user_id=MOCK_USER_DATA["user_id"],
            glucose_data=MOCK_USER_DATA["glucose_data"],
            medication_data=MOCK_USER_DATA["medication_data"],
            exercise_data=MOCK_USER_DATA["exercise_data"],
            food_data=MOCK_USER_DATA["food_data"]
        )
        
        # Display the results
        print(f"Health Report Title: {response['report_title']}")
        print(f"Summary: {response['summary']}")
        print("\nInsights:")
        for insight in response["insights"]:
            print(f"- {insight}")
        
        print("\nRecommendations:")
        for recommendation in response["recommendations"]:
            print(f"- {recommendation}")
    
    except Exception as e:
        print(f"Error generating health report: {str(e)}")

async def example_identify_glucose_patterns():
    """Example of identifying glucose patterns"""
    print("\n=== Identifying Glucose Patterns ===")
    
    try:
        # Simulate the agent's tool call to identify glucose patterns
        response = health_analyst_agent.tools[1].function(
            user_id=MOCK_USER_DATA["user_id"],
            glucose_data=MOCK_USER_DATA["glucose_data"]
        )
        
        # Display the results
        print(f"Analysis period: {response['time_period']}")
        
        print("\nDaily Patterns:")
        for pattern in response["daily_patterns"]:
            print(f"- {pattern['name']} ({pattern['confidence']}): {pattern['description']}")
        
        print("\nRisk Assessment:")
        hypo_risk = response["risk_assessment"]["hypoglycemia_risk"]
        print(f"Hypoglycemia Risk: {hypo_risk['level']}")
        print("Risk factors:")
        for factor in hypo_risk["risk_factors"]:
            print(f"- {factor}")
    
    except Exception as e:
        print(f"Error identifying glucose patterns: {str(e)}")

async def example_create_glucose_monitoring_schedule():
    """Example of creating a glucose monitoring schedule in Google Calendar"""
    print("\n=== Creating Glucose Monitoring Schedule ===")
    
    # Sample monitoring schedule based on the health analyst's recommendations
    monitoring_schedule = [
        {
            "day": "Saturday",
            "times": ["9:00 AM", "1:00 PM", "6:00 PM", "10:00 PM"]
        },
        {
            "day": "Sunday",
            "times": ["9:00 AM", "1:00 PM", "6:00 PM", "10:00 PM"]
        }
    ]
    
    try:
        # In a real implementation, this would use actual OAuth credentials
        # and would create real calendar events
        print("Would create the following calendar events:")
        for day_entry in monitoring_schedule:
            day = day_entry["day"]
            for time in day_entry["times"]:
                print(f"- {day} at {time}: Glucose Check (recurring weekly)")
        
        # The actual implementation would call:
        # result = create_glucose_monitoring_schedule(
        #     user_credentials=MOCK_CREDENTIALS,
        #     monitoring_schedule=monitoring_schedule
        # )
    
    except Exception as e:
        print(f"Error creating glucose monitoring schedule: {str(e)}")

async def example_create_medication_reminders():
    """Example of creating medication reminders in Google Calendar"""
    print("\n=== Creating Medication Reminders ===")
    
    # Sample medication schedule based on health analyst's recommendations
    medication_schedule = [
        {
            "medication": "Metformin",
            "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "time": "8:00 AM"
        },
        {
            "medication": "Insulin",
            "days": "Weekdays",
            "time": "6:00 PM"
        }
    ]
    
    try:
        # In a real implementation, this would use actual OAuth credentials
        # and would create real calendar events
        print("Would create the following medication reminders:")
        for med in medication_schedule:
            if isinstance(med["days"], list):
                for day in med["days"]:
                    print(f"- {day} at {med['time']}: {med['medication']} Reminder (recurring weekly)")
            else:
                print(f"- {med['days']} at {med['time']}: {med['medication']} Reminder")
        
        # The actual implementation would call:
        # result = create_medication_reminders(
        #     user_credentials=MOCK_CREDENTIALS,
        #     medication_schedule=medication_schedule
        # )
    
    except Exception as e:
        print(f"Error creating medication reminders: {str(e)}")

async def example_create_follow_up_logging_reminder():
    """Example of creating a follow-up logging reminder after a health event"""
    print("\n=== Creating Follow-up Logging Reminder ===")
    
    # In a real implementation, this would be the ID of an existing calendar event
    mock_event_id = "mock_event_123"
    
    try:
        # In a real implementation, this would use actual OAuth credentials
        # and would create a real calendar event
        print("Would create a follow-up logging reminder:")
        print(f"- 15 minutes after event {mock_event_id}")
        print("- Title: 📝 Log your glucose reading")
        print("- With immediate notification when due")
        
        # The actual implementation would call:
        # result = create_follow_up_logging_reminder(
        #     user_credentials=MOCK_CREDENTIALS,
        #     original_event_id=mock_event_id,
        #     activity_type="glucose"
        # )
    
    except Exception as e:
        print(f"Error creating follow-up logging reminder: {str(e)}")

async def run_examples():
    """Run all examples"""
    await example_generate_health_report()
    await example_identify_glucose_patterns()
    await example_create_glucose_monitoring_schedule()
    await example_create_medication_reminders()
    await example_create_follow_up_logging_reminder()

if __name__ == "__main__":
    # Run the examples
    asyncio.run(run_examples()) 