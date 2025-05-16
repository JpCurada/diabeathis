"""
Utility functions for Debie Agent, particularly focusing on Google Calendar integration.
"""



import datetime
from typing import Dict, List, Any, Optional

def create_calendar_event(
    summary: str,
    start_time: datetime.datetime,
    end_time: datetime.datetime,
    description: Optional[str] = None,
    location: Optional[str] = None,
    reminders: Optional[List[Dict[str, Any]]] = None,
    color_id: Optional[str] = None,
    calendar_id: str = "primary"
) -> Dict[str, Any]:
    """
    Creates a Google Calendar event with the specified parameters.
    
    This is a placeholder function. In a real implementation, this would use
    the Google Calendar API to create the event.
    
    Args:
        summary: Event title/summary
        start_time: Start time of the event
        end_time: End time of the event
        description: Optional description of the event
        location: Optional location of the event
        reminders: Optional list of reminder settings
        color_id: Optional color ID for event categorization
        calendar_id: ID of the calendar to create the event in (default: primary)
        
    Returns:
        Dictionary containing event details including the event ID
    """
    # This is a placeholder implementation
    # In a real implementation, this would make an API call to Google Calendar
    
    event_id = f"event_{datetime.datetime.now().timestamp()}"
    
    return {
        "id": event_id,
        "summary": summary,
        "description": description,
        "start": {"dateTime": start_time.isoformat()},
        "end": {"dateTime": end_time.isoformat()},
        "location": location,
        "reminders": reminders or {"useDefault": True},
        "colorId": color_id,
        "calendar_id": calendar_id
    }

def add_logging_reminder(event_id: str, minutes_after: int = 15) -> Dict[str, Any]:
    """
    Adds a logging reminder after an event has occurred.
    
    This creates a follow-up reminder to prompt the user to log data
    related to the original event (e.g., logging glucose after a meal).
    
    Args:
        event_id: ID of the original event
        minutes_after: Minutes after the original event to set the reminder
        
    Returns:
        Dictionary containing the reminder details
    """
    # This is a placeholder implementation
    # In a real implementation, this would create a follow-up event or notification
    
    reminder_id = f"reminder_{datetime.datetime.now().timestamp()}"
    
    return {
        "id": reminder_id,
        "original_event_id": event_id,
        "minutes_after": minutes_after,
        "type": "logging_reminder",
        "status": "created"
    }

def get_upcoming_events(
    calendar_id: str = "primary", 
    max_results: int = 10,
    time_min: Optional[datetime.datetime] = None
) -> List[Dict[str, Any]]:
    """
    Retrieves upcoming events from the user's Google Calendar.
    
    Args:
        calendar_id: ID of the calendar to query (default: primary)
        max_results: Maximum number of events to retrieve
        time_min: Minimum time for events (default: current time)
        
    Returns:
        List of upcoming events
    """
    # This is a placeholder implementation
    # In a real implementation, this would query the Google Calendar API
    
    time_min = time_min or datetime.datetime.now()
    
    # Mock data for demonstration
    events = [
        {
            "id": f"event_{i}",
            "summary": f"Sample Event {i}",
            "start": {"dateTime": (time_min + datetime.timedelta(hours=i*2)).isoformat()},
            "end": {"dateTime": (time_min + datetime.timedelta(hours=i*2+1)).isoformat()},
        }
        for i in range(max_results)
    ]
    
    return events

def categorize_event(event_summary: str) -> str:
    """
    Categorizes an event based on its summary to determine which agent should handle it.
    
    Args:
        event_summary: The summary/title of the event
        
    Returns:
        Category of the event: 'medication', 'meal', 'exercise', 'glucose_check', or 'other'
    """
    event_summary = event_summary.lower()
    
    if any(term in event_summary for term in ["medicine", "medication", "pill", "insulin", "injection", "dose"]):
        return "medication"
    elif any(term in event_summary for term in ["breakfast", "lunch", "dinner", "meal", "snack", "food", "eat"]):
        return "meal"
    elif any(term in event_summary for term in ["exercise", "workout", "walk", "run", "jog", "swim", "gym", "training"]):
        return "exercise"
    elif any(term in event_summary for term in ["glucose", "sugar", "check", "test", "reading", "meter"]):
        return "glucose_check"
    else:
        return "other"

def create_calendar_integration_context(user_id: str) -> Dict[str, Any]:
    """
    Creates a context object with calendar integration information for the Debie agent.
    
    Args:
        user_id: ID of the user to create context for
        
    Returns:
        Dictionary containing calendar integration context information
    """
    # This is a placeholder implementation
    # In a real implementation, this would gather real data about the user's calendar
    
    now = datetime.datetime.now()
    
    return {
        "user_id": user_id,
        "calendar_connected": True,
        "upcoming_events": get_upcoming_events(time_min=now, max_results=5),
        "event_categories": {
            "medication": 5,
            "meal": 10,
            "exercise": 3,
            "glucose_check": 8,
            "other": 2
        },
        "logging_stats": {
            "logging_rate": 0.75,  # 75% of events are logged
            "average_delay": 10,  # minutes after event before logging
            "missed_events": 3
        }
    }
