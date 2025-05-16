import supabase
from supabase import create_client
from typing import Dict, List, Any, Optional
import datetime
import os
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import requests
import json

# Placeholder for configuration - in production, use environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL", "your-supabase-url")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "your-supabase-key")

# Initialize Supabase client
supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ========== SUPABASE TOOLS ==========

def get_user_info(user_id: str, tool_context=None) -> Dict[str, Any]:
    """
    Get user information from the database to serve as the context for the agent
    
    Args:
        user_id: The user's ID
        tool_context: Optional ToolContext object for state management
        
    Returns:
        Dictionary containing user profile information
    """
    try:
        # Check state cache if tool_context is provided
        if tool_context and tool_context.state.get(f"user:{user_id}:info"):
            return {
                "status": "success",
                "data": tool_context.state.get(f"user:{user_id}:info"),
                "source": "state_cache"
            }
        
        # Query the users table according to the schema
        response = supabase_client.table("users").select("""
            user_id, 
            username, 
            email, 
            date_of_birth, 
            gender, 
            weight, 
            height, 
            unit_preference,
            is_cgm_activated,
            is_fitbit_activated
        """).eq("user_id", user_id).execute()
        
        if response.data and len(response.data) > 0:
            user_data = response.data[0]
            
            # Store in state if tool_context provided
            if tool_context:
                tool_context.state[f"user:{user_id}:info"] = user_data
                
            return {
                "status": "success",
                "data": user_data
            }
        else:
            return {
                "status": "error",
                "message": f"User with ID {user_id} not found"
            }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

def get_glucose_readings(user_id: str, tool_context=None, days: int = 7) -> Dict[str, Any]:
    """
    Retrieve glucose readings for a specified user over a time period
    
    Args:
        user_id: The user's ID
        tool_context: Optional ToolContext object for state management
        days: Number of days to look back (default: 7)
        
    Returns:
        Dictionary containing glucose readings data
    """
    try:
        # Check state cache if tool_context is provided
        if tool_context and tool_context.state.get(f"temp:glucose_readings:{user_id}:{days}"):
            cache_time_str = tool_context.state.get(f"temp:glucose_readings_timestamp:{user_id}:{days}")
            if cache_time_str:
                try:
                    # Parse the timestamp
                    cache_time = datetime.datetime.fromisoformat(cache_time_str)
                    now = datetime.datetime.now()
                    # If cache is less than 5 minutes old, use it
                    if (now - cache_time).total_seconds() < 300:  # 5 minutes
                        return {
                            "status": "success",
                            "data": tool_context.state.get(f"temp:glucose_readings:{user_id}:{days}"),
                            "statistics": tool_context.state.get(f"temp:glucose_statistics:{user_id}:{days}", {}),
                            "source": "state_cache"
                        }
                except Exception as e:
                    # If parsing fails, ignore cache and continue with fresh data
                    print(f"Cache timestamp parsing error: {str(e)}")
        
        start_date = (datetime.datetime.now() - datetime.timedelta(days=days)).isoformat()
        
        # Query aligned with the glucose_readings table schema
        response = supabase_client.table("glucose_readings") \
            .select("""
                glucose_reading_id,
                reading_timestamp,
                glucose_value,
                reading_source,
                created_at
            """) \
            .eq("user_id", user_id) \
            .gte("reading_timestamp", start_date) \
            .order("reading_timestamp", desc=False) \
            .execute()
            
        # Process the data to include relevant statistics
        readings = response.data
        if readings:
            avg_glucose = sum(reading['glucose_value'] for reading in readings) / len(readings)
            max_glucose = max(reading['glucose_value'] for reading in readings)
            min_glucose = min(reading['glucose_value'] for reading in readings)
            
            statistics = {
                "average": round(avg_glucose, 2),
                "maximum": max_glucose,
                "minimum": min_glucose
            }
            
            # Cache in state if tool_context provided
            if tool_context:
                now = datetime.datetime.now()
                tool_context.state[f"temp:glucose_readings:{user_id}:{days}"] = readings
                tool_context.state[f"temp:glucose_statistics:{user_id}:{days}"] = statistics
                tool_context.state[f"temp:glucose_readings_timestamp:{user_id}:{days}"] = now.isoformat()
            
            return {
                "status": "success",
                "data": readings,
                "count": len(readings),
                "period": f"Last {days} days",
                "statistics": statistics
            }
        else:
            return {
                "status": "success",
                "data": [],
                "count": 0,
                "period": f"Last {days} days",
                "message": "No glucose readings found for the specified period"
            }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

def get_food_logs(user_id: str, tool_context=None, days: int = 7) -> Dict[str, Any]:
    """
    Retrieve food log entries for a specified user
    
    Args:
        user_id: The user's ID
        tool_context: Optional ToolContext object for state management
        days: Number of days to look back (default: 7)
        
    Returns:
        Dictionary containing food log data
    """
    try:
        # Check state cache if tool_context is provided
        if tool_context and tool_context.state.get(f"temp:food_logs:{user_id}:{days}"):
            cache_time_str = tool_context.state.get(f"temp:food_logs_timestamp:{user_id}:{days}")
            if cache_time_str:
                try:
                    # Parse the timestamp
                    cache_time = datetime.datetime.fromisoformat(cache_time_str)
                    now = datetime.datetime.now()
                    # If cache is less than 5 minutes old, use it
                    if (now - cache_time).total_seconds() < 300:  # 5 minutes
                        return {
                            "status": "success",
                            "data": tool_context.state.get(f"temp:food_logs:{user_id}:{days}"),
                            "summary": tool_context.state.get(f"temp:food_logs_summary:{user_id}:{days}", {}),
                            "source": "state_cache"
                        }
                except Exception as e:
                    # If parsing fails, ignore cache and continue with fresh data
                    print(f"Cache timestamp parsing error: {str(e)}")
        
        start_date = (datetime.datetime.now() - datetime.timedelta(days=days)).isoformat()
        
        # Query aligned with the food_logs table schema
        response = supabase_client.table("food_logs") \
            .select("""
                food_log_id,
                log_timestamp,
                meal_type_id,
                food_description,
                quantity,
                unit_of_measure,
                estimated_carbs,
                estimated_calories,
                created_at,
                meal_types(type_name)
            """) \
            .eq("user_id", user_id) \
            .gte("log_timestamp", start_date) \
            .order("log_timestamp", desc=False) \
            .execute()
            
        # Process the data for easier consumption
        logs = response.data
        total_carbs = sum(log.get('estimated_carbs', 0) or 0 for log in logs)
        total_calories = sum(log.get('estimated_calories', 0) or 0 for log in logs)
        
        summary = {
            "total_carbs": round(total_carbs, 2),
            "total_calories": round(total_calories, 2),
            "daily_avg_carbs": round(total_carbs / days, 2) if logs else 0,
            "daily_avg_calories": round(total_calories / days, 2) if logs else 0
        }
        
        # Cache in state if tool_context provided
        if tool_context:
            now = datetime.datetime.now()
            tool_context.state[f"temp:food_logs:{user_id}:{days}"] = logs
            tool_context.state[f"temp:food_logs_summary:{user_id}:{days}"] = summary
            tool_context.state[f"temp:food_logs_timestamp:{user_id}:{days}"] = now.isoformat()
        
        return {
            "status": "success",
            "data": logs,
            "count": len(logs),
            "period": f"Last {days} days",
            "summary": summary
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

def get_medication_logs(user_id: str, tool_context=None, days: int = 7) -> Dict[str, Any]:
    """
    Retrieve medication log entries for a specified user
    
    Args:
        user_id: The user's ID
        tool_context: Optional ToolContext object for state management
        days: Number of days to look back (default: 7)
        
    Returns:
        Dictionary containing medication log data
    """
    try:
        # Check state cache if tool_context is provided
        if tool_context and tool_context.state.get(f"temp:medication_logs:{user_id}:{days}"):
            cache_time_str = tool_context.state.get(f"temp:medication_logs_timestamp:{user_id}:{days}")
            if cache_time_str:
                try:
                    # Parse the timestamp
                    cache_time = datetime.datetime.fromisoformat(cache_time_str)
                    now = datetime.datetime.now()
                    # If cache is less than 5 minutes old, use it
                    if (now - cache_time).total_seconds() < 300:  # 5 minutes
                        return {
                            "status": "success",
                            "data": tool_context.state.get(f"temp:medication_logs:{user_id}:{days}"),
                            "source": "state_cache"
                        }
                except Exception as e:
                    # If parsing fails, ignore cache and continue with fresh data
                    print(f"Cache timestamp parsing error: {str(e)}")
        
        # Rest of implementation remains the same
        start_date = (datetime.datetime.now() - datetime.timedelta(days=days)).isoformat()
        
        # Query the medication_logs table
        response = supabase_client.table("medication_logs") \
            .select("""
                medication_log_id,
                log_timestamp,
                medication_id,
                dosage,
                unit_of_measure,
                notes,
                created_at,
                medications(medication_name, dosage_form)
            """) \
            .eq("user_id", user_id) \
            .gte("log_timestamp", start_date) \
            .order("log_timestamp", desc=False) \
            .execute()
            
        # Process the data
        logs = response.data
        
        # Cache in state if tool_context provided
        if tool_context:
            now = datetime.datetime.now()
            tool_context.state[f"temp:medication_logs:{user_id}:{days}"] = logs
            tool_context.state[f"temp:medication_logs_timestamp:{user_id}:{days}"] = now.isoformat()
        
        return {
            "status": "success",
            "data": logs,
            "count": len(logs),
            "period": f"Last {days} days"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

def get_exercise_logs(user_id: str, tool_context=None, days: int = 7) -> Dict[str, Any]:
    """
    Retrieve exercise log entries for a specified user
    
    Args:
        user_id: The user's ID
        tool_context: Optional ToolContext object for state management
        days: Number of days to look back (default: 7)
        
    Returns:
        Dictionary containing exercise log data
    """
    try:
        # Check state cache if tool_context is provided
        if tool_context and tool_context.state.get(f"temp:exercise_logs:{user_id}:{days}"):
            cache_time_str = tool_context.state.get(f"temp:exercise_logs_timestamp:{user_id}:{days}")
            if cache_time_str:
                try:
                    # Parse the timestamp
                    cache_time = datetime.datetime.fromisoformat(cache_time_str)
                    now = datetime.datetime.now()
                    # If cache is less than 5 minutes old, use it
                    if (now - cache_time).total_seconds() < 300:  # 5 minutes
                        return {
                            "status": "success",
                            "data": tool_context.state.get(f"temp:exercise_logs:{user_id}:{days}"),
                            "summary": tool_context.state.get(f"temp:exercise_logs_summary:{user_id}:{days}", {}),
                            "source": "state_cache"
                        }
                except Exception as e:
                    # If parsing fails, ignore cache and continue with fresh data
                    print(f"Cache timestamp parsing error: {str(e)}")
        
        # Rest of implementation remains the same
        start_date = (datetime.datetime.now() - datetime.timedelta(days=days)).isoformat()
        
        # Query the exercise_logs table
        response = supabase_client.table("exercise_logs") \
            .select("""
                exercise_log_id,
                log_timestamp,
                exercise_type_id,
                duration_minutes,
                intensity,
                calories_burned,
                notes,
                created_at,
                exercise_types(type_name)
            """) \
            .eq("user_id", user_id) \
            .gte("log_timestamp", start_date) \
            .order("log_timestamp", desc=False) \
            .execute()
            
        # Process the data
        logs = response.data
        total_calories = sum(log.get('calories_burned', 0) or 0 for log in logs)
        total_duration = sum(log.get('duration_minutes', 0) or 0 for log in logs)
        
        summary = {
            "total_calories": round(total_calories, 2),
            "total_duration": total_duration,
            "daily_avg_calories": round(total_calories / days, 2) if logs else 0,
            "daily_avg_duration": round(total_duration / days, 2) if logs else 0
        }
        
        # Cache in state if tool_context provided
        if tool_context:
            now = datetime.datetime.now()
            tool_context.state[f"temp:exercise_logs:{user_id}:{days}"] = logs
            tool_context.state[f"temp:exercise_logs_summary:{user_id}:{days}"] = summary
            tool_context.state[f"temp:exercise_logs_timestamp:{user_id}:{days}"] = now.isoformat()
        
        return {
            "status": "success",
            "data": logs,
            "count": len(logs),
            "period": f"Last {days} days",
            "summary": summary
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

def save_insight(user_id: str, insight_type: str, content: Dict[str, Any]) -> Dict[str, Any]:
    """
    Save an AI-generated insight to the database
    
    Args:
        user_id: The user's ID
        insight_type: Type of insight (glucose_pattern, food_correlation, etc.)
        content: The insight content
        
    Returns:
        Dictionary containing operation result
    """
    try:
        # Get the insight_type_id first
        insight_type_response = supabase_client.table("insight_types") \
            .select("insight_type_id") \
            .eq("type_name", insight_type) \
            .execute()
            
        if not insight_type_response.data:
            # If the insight type doesn't exist, create it
            new_type = supabase_client.table("insight_types").insert({
                "type_name": insight_type,
                "description": f"AI-generated insights about {insight_type}"
            }).execute()
            
            insight_type_id = new_type.data[0]['insight_type_id']
        else:
            insight_type_id = insight_type_response.data[0]['insight_type_id']
        
        # Now create the insight record
        data = {
            "user_id": user_id,
            "insight_type_id": insight_type_id,
            "generated_timestamp": datetime.datetime.now().isoformat(),
            "insight_details": content,
            "model_version": "debie-agent-1.0"  # Track which model version generated the insight
        }
        
        response = supabase_client.table("ai_insights").insert(data).execute()
        
        return {
            "status": "success",
            "data": response.data[0] if response.data else {},
            "message": "Insight saved successfully"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

# ========== GOOGLE CALENDAR TOOLS ==========

def get_calendar_events(user_credentials: Dict[str, Any], days: int = 7) -> Dict[str, Any]:
    """
    Retrieve upcoming calendar events for a user
    
    Args:
        user_credentials: Google OAuth credentials for the user
        days: Number of days to look ahead (default: 7)
        
    Returns:
        Dictionary containing calendar events
    """
    try:
        # This is a placeholder - in a real implementation, you would use proper credentials
        credentials = Credentials.from_authorized_user_info(user_credentials)
        service = build('calendar', 'v3', credentials=credentials)
        
        # Get upcoming events
        now = datetime.datetime.utcnow().isoformat() + 'Z'
        end_time = (datetime.datetime.utcnow() + datetime.timedelta(days=days)).isoformat() + 'Z'
        
        events_result = service.events().list(
            calendarId='primary',
            timeMin=now,
            timeMax=end_time,
            singleEvents=True,
            orderBy='startTime'
        ).execute()
        
        events = events_result.get('items', [])
        
        # Process events into a more usable format
        processed_events = []
        for event in events:
            start = event['start'].get('dateTime', event['start'].get('date'))
            processed_events.append({
                'id': event['id'],
                'summary': event['summary'],
                'start': start,
                'end': event['end'].get('dateTime', event['end'].get('date')),
                'description': event.get('description', ''),
                'location': event.get('location', '')
            })
        
        return {
            "status": "success",
            "data": processed_events,
            "count": len(processed_events),
            "period": f"Next {days} days"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

def create_calendar_event(
    user_credentials: Dict[str, Any], 
    summary: str, 
    start_time: datetime.datetime, 
    end_time: datetime.datetime, 
    description: str = "", 
    location: str = "",
    reminders: List[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Create a new event in Google Calendar
    
    Args:
        user_credentials: Google OAuth credentials for the user
        summary: Event title
        start_time: Start time for the event
        end_time: End time for the event
        description: Event description
        location: Event location
        reminders: List of reminder settings
        
    Returns:
        Dictionary containing operation result and created event
    """
    try:
        # This is a placeholder - in a real implementation, you would use proper credentials
        credentials = Credentials.from_authorized_user_info(user_credentials)
        service = build('calendar', 'v3', credentials=credentials)
        
        # Set up default reminders if none provided
        if not reminders:
            reminders = [
                {'method': 'popup', 'minutes': 24 * 60},  # 24 hours before
                {'method': 'popup', 'minutes': 60},       # 1 hour before
                {'method': 'popup', 'minutes': 15}        # 15 minutes before
            ]
        
        event = {
            'summary': summary,
            'location': location,
            'description': description,
            'start': {
                'dateTime': start_time.isoformat(),
                'timeZone': 'America/Los_Angeles',  # Should be dynamic based on user's timezone
            },
            'end': {
                'dateTime': end_time.isoformat(),
                'timeZone': 'America/Los_Angeles',  # Should be dynamic based on user's timezone
            },
            'reminders': {
                'useDefault': False,
                'overrides': reminders
            }
        }
        
        created_event = service.events().insert(calendarId='primary', body=event).execute()
        
        return {
            "status": "success",
            "data": {
                "id": created_event['id'],
                "htmlLink": created_event['htmlLink'],
                "summary": created_event['summary'],
                "start": created_event['start'],
                "end": created_event['end']
            },
            "message": "Event created successfully"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

def create_log_reminder(
    user_credentials: Dict[str, Any],
    parent_event_id: str,
    activity_type: str,
    minutes_after: int = 15
) -> Dict[str, Any]:
    """
    Create a follow-up logging reminder after a scheduled activity
    
    Args:
        user_credentials: Google OAuth credentials for the user
        parent_event_id: ID of the original event
        activity_type: Type of activity (medication, meal, exercise, glucose)
        minutes_after: Minutes after the original event (default: 15)
        
    Returns:
        Dictionary containing operation result
    """
    try:
        # This is a placeholder - in a real implementation, you would use proper credentials
        credentials = Credentials.from_authorized_user_info(user_credentials)
        service = build('calendar', 'v3', credentials=credentials)
        
        # Get the parent event to determine when to schedule the reminder
        parent_event = service.events().get(calendarId='primary', eventId=parent_event_id).execute()
        
        # Determine end time of the parent event
        if 'dateTime' in parent_event['end']:
            parent_end_time = datetime.datetime.fromisoformat(parent_event['end']['dateTime'].replace('Z', '+00:00'))
        else:
            # For all-day events, use noon as a default time
            parent_end_time = datetime.datetime.fromisoformat(parent_event['end']['date'])
            parent_end_time = datetime.datetime.combine(parent_end_time.date(), datetime.time(12, 0))
        
        # Calculate start and end times for the reminder event
        reminder_start_time = parent_end_time + datetime.timedelta(minutes=minutes_after)
        reminder_end_time = reminder_start_time + datetime.timedelta(minutes=15)  # 15-minute reminder event
        
        # Create reminder title and description based on activity type
        activity_titles = {
            "medication": "Log your medication",
            "meal": "Log your meal",
            "exercise": "Log your workout",
            "glucose": "Log your glucose reading"
        }
        
        title = activity_titles.get(activity_type, f"Log your {activity_type}")
        description = f"Time to log your {activity_type} from the earlier event: {parent_event['summary']}. Open the app to log now!"
        
        # Create the reminder event
        reminder_event = {
            'summary': f"📝 {title}",
            'description': description,
            'start': {
                'dateTime': reminder_start_time.isoformat(),
                'timeZone': parent_event['start'].get('timeZone', 'America/Los_Angeles'),
            },
            'end': {
                'dateTime': reminder_end_time.isoformat(),
                'timeZone': parent_event['end'].get('timeZone', 'America/Los_Angeles'),
            },
            'reminders': {
                'useDefault': False,
                'overrides': [
                    {'method': 'popup', 'minutes': 0}  # Immediate notification
                ]
            },
            # Link to parent event
            'extendedProperties': {
                'private': {
                    'parentEventId': parent_event_id,
                    'isLoggingReminder': 'true',
                    'activityType': activity_type
                }
            }
        }
        
        created_event = service.events().insert(calendarId='primary', body=reminder_event).execute()
        
        return {
            "status": "success",
            "data": {
                "id": created_event['id'],
                "htmlLink": created_event['htmlLink'],
                "summary": created_event['summary'],
                "start": created_event['start'],
                "parentEventId": parent_event_id
            },
            "message": f"Logging reminder created for {minutes_after} minutes after {activity_type}"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

# ========== FITBIT TOOLS ==========

def get_fitbit_activity(user_credentials: Dict[str, Any], date: str = None) -> Dict[str, Any]:
    """
    Retrieve Fitbit activity data for a specific date
    
    Args:
        user_credentials: Fitbit OAuth credentials for the user
        date: Date to retrieve data for (YYYY-MM-DD format, default: today)
        
    Returns:
        Dictionary containing Fitbit activity data
    """
    try:
        # Use today's date if not specified
        if not date:
            date = datetime.datetime.now().strftime('%Y-%m-%d')
            
        # This is a placeholder - in a real implementation, you would use proper auth
        access_token = user_credentials.get('access_token')
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Accept-Language': 'en_US'
        }
        
        # Get daily activity summary
        response = requests.get(
            f'https://api.fitbit.com/1/user/-/activities/date/{date}.json',
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            
            # Extract relevant activity metrics
            summary = data.get('summary', {})
            
            return {
                "status": "success",
                "date": date,
                "data": {
                    "steps": summary.get('steps', 0),
                    "distance": summary.get('distances', [{}])[0].get('distance', 0),
                    "calories": summary.get('caloriesOut', 0),
                    "active_minutes": sum([
                        summary.get('fairlyActiveMinutes', 0),
                        summary.get('veryActiveMinutes', 0)
                    ]),
                    "sedentary_minutes": summary.get('sedentaryMinutes', 0),
                    "activities": data.get('activities', [])
                }
            }
        else:
            return {
                "status": "error",
                "code": response.status_code,
                "message": f"Failed to retrieve Fitbit activity data: {response.text}"
            }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

def get_fitbit_heart_rate(user_credentials: Dict[str, Any], date: str = None) -> Dict[str, Any]:
    """
    Retrieve Fitbit heart rate data for a specific date
    
    Args:
        user_credentials: Fitbit OAuth credentials for the user
        date: Date to retrieve data for (YYYY-MM-DD format, default: today)
        
    Returns:
        Dictionary containing Fitbit heart rate data
    """
    try:
        # Use today's date if not specified
        if not date:
            date = datetime.datetime.now().strftime('%Y-%m-%d')
            
        # This is a placeholder - in a real implementation, you would use proper auth
        access_token = user_credentials.get('access_token')
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Accept-Language': 'en_US'
        }
        
        # Get heart rate data
        response = requests.get(
            f'https://api.fitbit.com/1/user/-/activities/heart/date/{date}/1d.json',
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            
            # Extract heart rate data
            activities_heart = data.get('activities-heart', [{}])[0]
            value = activities_heart.get('value', {})
            
            return {
                "status": "success",
                "date": date,
                "data": {
                    "resting_heart_rate": value.get('restingHeartRate', 0),
                    "heart_rate_zones": value.get('heartRateZones', []),
                    "intraday_data": data.get('activities-heart-intraday', {}).get('dataset', [])
                }
            }
        else:
            return {
                "status": "error",
                "code": response.status_code,
                "message": f"Failed to retrieve Fitbit heart rate data: {response.text}"
            }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

def get_fitbit_sleep(user_credentials: Dict[str, Any], date: str = None) -> Dict[str, Any]:
    """
    Retrieve Fitbit sleep data for a specific date
    
    Args:
        user_credentials: Fitbit OAuth credentials for the user
        date: Date to retrieve data for (YYYY-MM-DD format, default: today)
        
    Returns:
        Dictionary containing Fitbit sleep data
    """
    try:
        # Use today's date if not specified
        if not date:
            date = datetime.datetime.now().strftime('%Y-%m-%d')
            
        # This is a placeholder - in a real implementation, you would use proper auth
        access_token = user_credentials.get('access_token')
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Accept-Language': 'en_US'
        }
        
        # Get sleep data
        response = requests.get(
            f'https://api.fitbit.com/1.2/user/-/sleep/date/{date}.json',
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            
            # Extract sleep summary data
            summary = data.get('summary', {})
            
            return {
                "status": "success",
                "date": date,
                "data": {
                    "total_minutes_asleep": summary.get('totalMinutesAsleep', 0),
                    "total_time_in_bed": summary.get('totalTimeInBed', 0),
                    "sleep_efficiency": summary.get('efficiency', 0),
                    "stages": summary.get('stages', {}),
                    "sleep_records": data.get('sleep', [])
                }
            }
        else:
            return {
                "status": "error",
                "code": response.status_code,
                "message": f"Failed to retrieve Fitbit sleep data: {response.text}"
            }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

# ========== INTEGRATED TOOLS ==========

def save_biometric_data(
    user_id: str, 
    biometric_type: str, 
    value: float, 
    source: str = "Manual", 
    systolic_bp: float = None, 
    diastolic_bp: float = None
) -> Dict[str, Any]:
    """
    Save biometric data to the database
    
    Args:
        user_id: The user's ID
        biometric_type: Type of biometric data (e.g., 'Steps', 'Heart Rate', 'Blood Pressure')
        value: The main numeric value of the reading
        source: Source of the data (e.g., 'Manual', 'Fitbit', 'API')
        systolic_bp: Optional systolic blood pressure (for BP readings)
        diastolic_bp: Optional diastolic blood pressure (for BP readings)
        
    Returns:
        Dictionary containing operation result
    """
    try:
        # Get the biometric_type_id first
        biometric_type_response = supabase_client.table("biometric_types") \
            .select("biometric_type_id") \
            .eq("type_name", biometric_type) \
            .execute()
            
        if not biometric_type_response.data:
            # If the biometric type doesn't exist, create it
            new_type = supabase_client.table("biometric_types").insert({
                "type_name": biometric_type
            }).execute()
            
            biometric_type_id = new_type.data[0]['biometric_type_id']
        else:
            biometric_type_id = biometric_type_response.data[0]['biometric_type_id']
        
        # Now create the biometric data record
        data = {
            "user_id": user_id,
            "reading_timestamp": datetime.datetime.now().isoformat(),
            "biometric_type_id": biometric_type_id,
            "value": value,
            "source": source
        }
        
        # Add blood pressure values if provided
        if systolic_bp is not None:
            data["systolic_bp"] = systolic_bp
        
        if diastolic_bp is not None:
            data["diastolic_bp"] = diastolic_bp
        
        response = supabase_client.table("biometric_data").insert(data).execute()
        
        return {
            "status": "success",
            "data": response.data[0] if response.data else {},
            "message": f"{biometric_type} data saved successfully"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

def get_user_notifications(user_id: str) -> Dict[str, Any]:
    """
    Get pending notifications for a user
    
    Args:
        user_id: The user's ID
        
    Returns:
        Dictionary containing notification data
    """
    try:
        # This would need a notifications table, which isn't in the schema
        # For now, we'll create a mock response based on other data
        
        # Get user settings first
        settings_response = supabase_client.table("user_settings") \
            .select("*") \
            .eq("user_id", user_id) \
            .execute()
            
        if not settings_response.data:
            return {
                "status": "error",
                "message": "User settings not found"
            }
            
        settings = settings_response.data[0]
        
        # Mock notifications based on settings
        notifications = []
        
        # Check if food logging reminders are enabled
        if settings.get('food_log_reminder_enabled', True):
            notifications.append({
                "type": "food_log_reminder",
                "title": "Time to log your meal",
                "message": "Don't forget to log what you've eaten today",
                "priority": "medium",
                "created_at": datetime.datetime.now().isoformat()
            })
            
        # Check if medication reminders are enabled
        if settings.get('medication_reminder_enabled', True):
            notifications.append({
                "type": "medication_reminder",
                "title": "Medication reminder",
                "message": "Time to take your medication",
                "priority": "high",
                "created_at": datetime.datetime.now().isoformat()
            })
            
        return {
            "status": "success",
            "data": notifications,
            "count": len(notifications)
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

def get_comprehensive_user_data(user_id: str, tool_context=None, days: int = 7) -> Dict[str, Any]:
    """
    Retrieve comprehensive user data from all sources for agent context
    
    Args:
        user_id: The user's ID in Supabase
        tool_context: Optional ToolContext object for state management
        days: Number of days of data to retrieve (default: 7)
        
    Returns:
        Dictionary containing comprehensive user data
    """
    # First check if we have a cached version in state when tool_context is provided
    if tool_context and tool_context.state.get(f"temp:comprehensive_data:{user_id}"):
        cache_time_str = tool_context.state.get(f"temp:comprehensive_data_timestamp:{user_id}")
        if cache_time_str:
            try:
                # Parse the timestamp
                cache_time = datetime.datetime.fromisoformat(cache_time_str)
                now = datetime.datetime.now()
                # If cache is less than 30 minutes old, use it
                if (now - cache_time).total_seconds() < 1800:  # 30 minutes
                    return {
                        "status": "success",
                        "data": tool_context.state.get(f"temp:comprehensive_data:{user_id}"),
                        "source": "state_cache"
                    }
            except Exception as e:
                # If parsing fails, ignore cache and continue with fresh data
                print(f"Cache timestamp parsing error: {str(e)}")
    
    # Get basic user info
    user_info = get_user_info(user_id, tool_context)
    
    # Get health data from Supabase
    glucose_data = get_glucose_readings(user_id, tool_context, days)
    food_data = get_food_logs(user_id, tool_context, days)
    medication_data = get_medication_logs(user_id, tool_context, days)
    
    # Get biometric data for different types
    biometric_types = ["Steps", "Heart Rate", "Exercise", "Weight"]
    biometric_data = {}
    
    for biometric_type in biometric_types:
        # Get the biometric_type_id
        type_response = supabase_client.table("biometric_types") \
            .select("biometric_type_id") \
            .eq("type_name", biometric_type) \
            .execute()
            
        if type_response.data:
            type_id = type_response.data[0]['biometric_type_id']
            
            # Get the data for this type
            start_date = (datetime.datetime.now() - datetime.timedelta(days=days)).isoformat()
            response = supabase_client.table("biometric_data") \
                .select("*") \
                .eq("user_id", user_id) \
                .eq("biometric_type_id", type_id) \
                .gte("reading_timestamp", start_date) \
                .order("reading_timestamp", desc=False) \
                .execute()
                
            biometric_data[biometric_type.lower().replace(" ", "_")] = response.data
    
    # Get insulin data if applicable
    insulin_data = {}
    if user_info.get('data', {}).get('diabetes_type') in [1, "1", "Type 1"]:
        start_date = (datetime.datetime.now() - datetime.timedelta(days=days)).isoformat()
        insulin_response = supabase_client.table("insulin_intake_log") \
            .select("""
                insulin_log_id,
                log_timestamp,
                insulin_type_id,
                dosage_units,
                notes,
                created_at,
                insulin_types(type_name)
            """) \
            .eq("user_id", user_id) \
            .gte("log_timestamp", start_date) \
            .order("log_timestamp", desc=False) \
            .execute()
            
        insulin_data = insulin_response.data
    
    # Get Fitbit data if enabled
    fitbit_data = {}
    if user_info.get('data', {}).get('is_fitbit_activated', False):
        # Get Fitbit credentials from tool_context if available, otherwise use dummy
        fitbit_credentials = {}
        
        if tool_context:
            # In a real implementation, we would use:
            # try:
            #     from google.adk.auth import AuthConfig
            #     FITBIT_AUTH_CONFIG = AuthConfig(
            #         provider="oauth2",
            #         client_id=os.getenv("FITBIT_CLIENT_ID"),
            #         auth_uri="https://www.fitbit.com/oauth2/authorize",
            #         token_uri="https://api.fitbit.com/oauth2/token",
            #         scope=["activity", "heartrate", "sleep"]
            #     )
            #     # Request authentication if needed
            #     fitbit_credentials = tool_context.get_auth_response(FITBIT_AUTH_CONFIG)
            # except Exception as e:
            #     print(f"Fitbit auth error: {str(e)}")
            
            # For now, just use from state if available
            fitbit_credentials = tool_context.state.get("user:fitbit_credentials", {})
        
        yesterday = (datetime.datetime.now() - datetime.timedelta(days=1)).strftime('%Y-%m-%d')
        fitbit_activity = get_fitbit_activity(fitbit_credentials, yesterday)
        fitbit_heart_rate = get_fitbit_heart_rate(fitbit_credentials, yesterday)
        fitbit_sleep = get_fitbit_sleep(fitbit_credentials, yesterday)
        
        fitbit_data = {
            "activity": fitbit_activity.get('data', {}),
            "heart_rate": fitbit_heart_rate.get('data', {}),
            "sleep": fitbit_sleep.get('data', {})
        }
    
    # Get Google Calendar events
    calendar_events = []
    if tool_context:
        # Similar to Fitbit, in a real implementation we would use:
        # try:
        #     from google.adk.auth import AuthConfig
        #     GOOGLE_AUTH_CONFIG = AuthConfig(
        #         provider="oauth2",
        #         client_id=os.getenv("GOOGLE_CLIENT_ID"),
        #         auth_uri="https://accounts.google.com/o/oauth2/v2/auth",
        #         token_uri="https://oauth2.googleapis.com/token",
        #         scope=["https://www.googleapis.com/auth/calendar.readonly"]
        #     )
        #     # Request authentication if needed
        #     google_credentials = tool_context.get_auth_response(GOOGLE_AUTH_CONFIG)
        #     calendar_response = get_calendar_events(google_credentials, days)
        #     calendar_events = calendar_response.get('data', [])
        # except Exception as e:
        #     print(f"Google Calendar auth error: {str(e)}")
        
        # For now, just access state
        calendar_events = tool_context.state.get("user:calendar_events", [])
    
    # Get recent AI insights
    insights_response = supabase_client.table("ai_insights") \
        .select("*") \
        .eq("user_id", user_id) \
        .order("generated_timestamp", desc=True) \
        .limit(5) \
        .execute()
        
    recent_insights = insights_response.data
    
    # Get user settings
    settings_response = supabase_client.table("user_settings") \
        .select("*") \
        .eq("user_id", user_id) \
        .execute()
        
    user_settings = settings_response.data[0] if settings_response.data else {}
    
    # Compile all data
    result = {
        "user_info": user_info.get('data', {}),
        "user_settings": user_settings,
        "health_data": {
            "glucose": glucose_data.get('data', []),
            "food": food_data.get('data', []),
            "medication": medication_data.get('data', []),
            "insulin": insulin_data,
            "biometric": biometric_data
        },
        "fitbit_data": fitbit_data,
        "calendar_events": calendar_events,
        "recent_insights": recent_insights,
        "period": f"Last {days} days",
        "timestamp": datetime.datetime.now().isoformat()
    }
    
    # Cache the data in state if tool_context is provided
    if tool_context:
        now = datetime.datetime.now()
        tool_context.state[f"temp:comprehensive_data:{user_id}"] = result
        tool_context.state[f"temp:comprehensive_data_timestamp:{user_id}"] = now.isoformat()
    
    return {
        "status": "success",
        "data": result
    }

def enrich_with_user_context(user_id: str, query: str, tool_context=None) -> Dict[str, Any]:
    """
    Enriches the user query with comprehensive user context information
    
    This function ensures every interaction begins with complete user context
    and is a critical component for the root agent's operations.
    
    Args:
        user_id: The user's ID
        query: The original user query
        tool_context: Optional ToolContext object for state management
        
    Returns:
        Dictionary containing the enriched query with user context
    """
    try:
        # Check if we have user info in state already
        user_info = {}
        if tool_context and tool_context.state.get("user_info"):
            user_info = tool_context.state.get("user_info")
        else:
            # First retrieve basic user information
            user_info_result = get_user_info(user_id, tool_context)
            
            if user_info_result.get("status") != "success":
                return {
                    "status": "error",
                    "message": f"Failed to retrieve user context: {user_info_result.get('message', 'Unknown error')}",
                    "original_query": query
                }
            
            user_info = user_info_result.get("data", {})
            
            # Store in state if tool_context is provided
            if tool_context:
                tool_context.state["user_info"] = user_info
        
        # Format a user context summary
        diabetes_type = user_info.get("diabetes_type", "unspecified")
        
        context_summary = f"""
USER CONTEXT:
- Name: {user_info.get('username', 'User')}
- Diabetes Type: {diabetes_type}
- Weight: {user_info.get('weight', 'Not specified')} {user_info.get('unit_preference', 'metric')}
- Height: {user_info.get('height', 'Not specified')} {user_info.get('unit_preference', 'metric')}
- Fitbit Connected: {user_info.get('is_fitbit_activated', False)}
- CGM Device Connected: {user_info.get('is_cgm_activated', False)}
"""
        
        # Check if we have more specific information about this diabetes type
        if diabetes_type in [1, "1", "Type 1"]:
            # If we have state data, use it instead of querying
            if tool_context and tool_context.state.get("health_data", {}).get("insulin"):
                insulin_data = tool_context.state.get("health_data", {}).get("insulin", [])
                if insulin_data:
                    context_summary += "- Uses insulin for management\n"
            else:
                # Get insulin information
                insulin_data = supabase_client.table("insulin_intake_log") \
                    .select("*") \
                    .eq("user_id", user_id) \
                    .order("log_timestamp", desc=True) \
                    .limit(5) \
                    .execute()
                
                if insulin_data.data:
                    context_summary += "- Uses insulin for management\n"
        
        # Get recent glucose info for context - use cached data if available
        glucose_stats = {}
        if tool_context and tool_context.state.get("health_data", {}).get("glucose"):
            # Use cached data from state
            glucose_data = tool_context.state.get("health_data", {}).get("glucose", {})
            if isinstance(glucose_data, dict) and "statistics" in glucose_data:
                stats = glucose_data.get("statistics", {})
                glucose_stats = stats
            elif isinstance(glucose_data, list) and len(glucose_data) > 0:
                # Calculate stats if we only have raw data
                avg_glucose = sum(reading.get('glucose_value', 0) for reading in glucose_data) / len(glucose_data)
                max_glucose = max(reading.get('glucose_value', 0) for reading in glucose_data)
                min_glucose = min(reading.get('glucose_value', 0) for reading in glucose_data)
                glucose_stats = {
                    "average": round(avg_glucose, 2),
                    "maximum": max_glucose,
                    "minimum": min_glucose
                }
        else:
            # Query directly
            glucose_data = get_glucose_readings(user_id, tool_context, days=3)
            if glucose_data.get("status") == "success":
                glucose_stats = glucose_data.get("statistics", {})
        
        # Add glucose stats to context if available
        if glucose_stats:
            context_summary += f"""- Recent glucose trends:
  * Average: {glucose_stats.get('average', 'N/A')} mg/dL
  * Highest: {glucose_stats.get('maximum', 'N/A')} mg/dL
  * Lowest: {glucose_stats.get('minimum', 'N/A')} mg/dL
"""
        
        # Enrich the query with context
        enriched_query = f"{context_summary}\n\nUSER QUERY:\n{query}"
        
        # Cache the result in state if tool_context is provided
        if tool_context:
            tool_context.state["temp:enriched_query"] = enriched_query
        
        return {
            "status": "success",
            "enriched_query": enriched_query,
            "user_context": user_info,
            "original_query": query
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error enriching query with context: {str(e)}",
            "original_query": query
        }



