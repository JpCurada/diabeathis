"""
Calendar integration utilities for the DiaBeatThis platform.
Handles all Google Calendar operations with simplified date handling.
"""

from typing import Dict, List, Optional
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import os
import json
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

SCOPES = ['https://www.googleapis.com/auth/calendar']

def get_calendar_service():
    """Get an authorized Google Calendar service instance."""
    creds = None
    if os.path.exists('token.json'):
        with open('token.json', 'r') as token:
            creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    return build('calendar', 'v3', credentials=creds)

def schedule_workout(
    title: str,
    start_time: str,  # ISO format string: "2024-03-20T09:00:00"
    duration_minutes: int,
    description: str = "",
    location: str = "",
    reminders: Optional[List[int]] = None  # List of minutes before event
) -> Dict[str, str]:
    """
    Schedule a workout event in Google Calendar.
    
    Args:
        title: Event title
        start_time: ISO format datetime string
        duration_minutes: Duration in minutes
        description: Event description
        location: Event location
        reminders: List of reminder times in minutes before event
    
    Returns:
        Dict containing event ID and status
    """
    try:
        service = get_calendar_service()
        
        # Parse start time and calculate end time
        start_dt = datetime.fromisoformat(start_time)
        end_dt = start_dt + timedelta(minutes=duration_minutes)
        
        event = {
            'summary': title,
            'location': location,
            'description': description,
            'start': {
                'dateTime': start_dt.isoformat(),
                'timeZone': 'UTC',
            },
            'end': {
                'dateTime': end_dt.isoformat(),
                'timeZone': 'UTC',
            }
        }
        
        # Add reminders if specified
        if reminders:
            event['reminders'] = {
                'useDefault': False,
                'overrides': [
                    {'method': 'popup', 'minutes': mins}
                    for mins in reminders
                ]
            }
        
        # Add logging reminder
        description_with_logging = (
            f"{description}\n\n"
            "Don't forget to log your workout details after completion!"
        )
        event['description'] = description_with_logging
        
        event = service.events().insert(
            calendarId='primary',
            body=event
        ).execute()
        
        return {
            'status': 'success',
            'event_id': event.get('id', ''),
            'message': f'Workout "{title}" scheduled successfully'
        }
        
    except Exception as e:
        logger.error(f"Error scheduling workout: {str(e)}")
        return {
            'status': 'error',
            'message': f'Failed to schedule workout: {str(e)}'
        }

def schedule_meal(
    title: str,
    start_time: str,  # ISO format string
    duration_minutes: int = 30,
    description: str = "",
    reminders: Optional[List[int]] = None
) -> Dict[str, str]:
    """Schedule a meal event in Google Calendar."""
    try:
        service = get_calendar_service()
        
        start_dt = datetime.fromisoformat(start_time)
        end_dt = start_dt + timedelta(minutes=duration_minutes)
        
        event = {
            'summary': title,
            'description': f"{description}\n\nRemember to log your meal details!",
            'start': {
                'dateTime': start_dt.isoformat(),
                'timeZone': 'UTC',
            },
            'end': {
                'dateTime': end_dt.isoformat(),
                'timeZone': 'UTC',
            }
        }
        
        if reminders:
            event['reminders'] = {
                'useDefault': False,
                'overrides': [
                    {'method': 'popup', 'minutes': mins}
                    for mins in reminders
                ]
            }
        
        event = service.events().insert(
            calendarId='primary',
            body=event
        ).execute()
        
        return {
            'status': 'success',
            'event_id': event.get('id', ''),
            'message': f'Meal "{title}" scheduled successfully'
        }
        
    except Exception as e:
        logger.error(f"Error scheduling meal: {str(e)}")
        return {
            'status': 'error',
            'message': f'Failed to schedule meal: {str(e)}'
        }

def schedule_medication(
    title: str,
    start_time: str,  # ISO format string
    dosage: str,
    frequency: str,
    reminders: Optional[List[int]] = None
) -> Dict[str, str]:
    """Schedule a medication reminder in Google Calendar."""
    try:
        service = get_calendar_service()
        
        start_dt = datetime.fromisoformat(start_time)
        end_dt = start_dt + timedelta(minutes=15)  # Default 15-min duration
        
        description = (
            f"Medication: {title}\n"
            f"Dosage: {dosage}\n"
            f"Frequency: {frequency}\n\n"
            "Please log your medication after taking it."
        )
        
        event = {
            'summary': f"Medicine: {title}",
            'description': description,
            'start': {
                'dateTime': start_dt.isoformat(),
                'timeZone': 'UTC',
            },
            'end': {
                'dateTime': end_dt.isoformat(),
                'timeZone': 'UTC',
            }
        }
        
        if reminders:
            event['reminders'] = {
                'useDefault': False,
                'overrides': [
                    {'method': 'popup', 'minutes': mins}
                    for mins in reminders
                ]
            }
        
        event = service.events().insert(
            calendarId='primary',
            body=event
        ).execute()
        
        return {
            'status': 'success',
            'event_id': event.get('id', ''),
            'message': f'Medication reminder for "{title}" scheduled successfully'
        }
        
    except Exception as e:
        logger.error(f"Error scheduling medication: {str(e)}")
        return {
            'status': 'error',
            'message': f'Failed to schedule medication reminder: {str(e)}'
        }

def schedule_glucose_check(
    start_time: str,  # ISO format string
    context: str = "Regular check",
    reminders: Optional[List[int]] = None
) -> Dict[str, str]:
    """Schedule a glucose check reminder in Google Calendar."""
    try:
        service = get_calendar_service()
        
        start_dt = datetime.fromisoformat(start_time)
        end_dt = start_dt + timedelta(minutes=5)  # Short duration for checks
        
        event = {
            'summary': "Glucose Check",
            'description': (
                f"Context: {context}\n\n"
                "Please log your glucose reading after checking."
            ),
            'start': {
                'dateTime': start_dt.isoformat(),
                'timeZone': 'UTC',
            },
            'end': {
                'dateTime': end_dt.isoformat(),
                'timeZone': 'UTC',
            }
        }
        
        if reminders:
            event['reminders'] = {
                'useDefault': False,
                'overrides': [
                    {'method': 'popup', 'minutes': mins}
                    for mins in reminders
                ]
            }
        
        event = service.events().insert(
            calendarId='primary',
            body=event
        ).execute()
        
        return {
            'status': 'success',
            'event_id': event.get('id', ''),
            'message': 'Glucose check reminder scheduled successfully'
        }
        
    except Exception as e:
        logger.error(f"Error scheduling glucose check: {str(e)}")
        return {
            'status': 'error',
            'message': f'Failed to schedule glucose check: {str(e)}'
        }

def create_workout_events(
    user_credentials: Dict[str, Any],
    exercise_plan: Dict[str, Any],
    start_date: Optional[str] = None,  # ISO format date string "YYYY-MM-DD"
    calendar_id: str = "primary"
) -> Dict[str, Any]:
    """
    Create workout events in Google Calendar based on a fitness plan.
    
    Args:
        user_credentials: Google OAuth credentials for the user
        exercise_plan: Dictionary containing workout schedule information
        start_date: Optional start date in ISO format (YYYY-MM-DD)
        calendar_id: Calendar ID to create events in (default: primary calendar)
        
    Returns:
        Dictionary containing operation result and created events
    """
    try:
        # Initialize the Calendar API client
        credentials = Credentials.from_authorized_user_info(user_credentials)
        service = build('calendar', 'v3', credentials=credentials)
        
        # Set default start date to next Monday if not provided
        if not start_date:
            today = datetime.datetime.now()
            days_until_monday = (7 - today.weekday()) % 7
            if days_until_monday == 0:
                days_until_monday = 7  # Schedule for next Monday, not today
            start_date = (today + datetime.timedelta(days=days_until_monday)).strftime("%Y-%m-%d")
        
        # Convert start_date string to datetime.date for calculations
        try:
            start_date_obj = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
        except ValueError:
            return {
                "status": "error",
                "message": "Invalid start date format. Please use YYYY-MM-DD"
            }
        
        created_events = []
        errors = []
        
        # Get the weekly schedule from the exercise plan
        weekly_schedule = exercise_plan.get("weekly_schedule", [])
        
        # Process each workout in the schedule
        for workout in weekly_schedule:
            try:
                # Extract workout details
                day_name = workout.get("day")
                activity = workout.get("activity")
                duration_str = workout.get("duration", "30 min")
                intensity = workout.get("intensity", "Moderate")
                
                # Skip rest days
                if activity.lower() == "rest" or intensity.lower() == "none":
                    continue
                
                # Parse the workout day
                day_index = ["monday", "tuesday", "wednesday", "thursday", 
                            "friday", "saturday", "sunday"].index(day_name.lower())
                
                # Calculate the date of this workout based on the start date
                days_from_monday = day_index  # Monday is index 0
                workout_date = start_date_obj + datetime.timedelta(days=days_from_monday)
                
                # Set default time based on the day (mornings for weekdays, later for weekends)
                default_time = "7:00 AM" if day_index < 5 else "9:00 AM"
                time_str = workout.get("time", default_time)
                
                # Parse time string
                time_format = "%I:%M %p" if "AM" in time_str or "PM" in time_str else "%H:%M"
                workout_time = datetime.datetime.strptime(time_str, time_format).time()
                
                # Calculate duration in minutes
                if isinstance(duration_str, str):
                    duration_mins = int(duration_str.split()[0])
                else:
                    duration_mins = 30  # Default to 30 minutes
                
                # Combine date and time
                start_datetime = datetime.datetime.combine(workout_date, workout_time)
                end_datetime = start_datetime + datetime.timedelta(minutes=duration_mins)
                
                # Create title and description
                title = f"{activity} Workout"
                description = (
                    f"Activity: {activity}\n"
                    f"Duration: {duration_str}\n"
                    f"Intensity: {intensity}\n\n"
                    f"DIABETES MANAGEMENT TIPS:\n"
                )
                
                # Add diabetes management tips from the exercise plan
                for tip in exercise_plan.get("glucose_management", []):
                    description += f"• {tip}\n"
                
                description += "\nCreated by Debie Fitness Coach"
                
                # Create the event object
                event = {
                    'summary': title,
                    'description': description,
                    'start': {
                        'dateTime': start_datetime.isoformat(),
                        'timeZone': 'America/New_York',  # Should be dynamic based on user's timezone
                    },
                    'end': {
                        'dateTime': end_datetime.isoformat(),
                        'timeZone': 'America/New_York',  # Should be dynamic based on user's timezone
                    },
                    'reminders': {
                        'useDefault': False,
                        'overrides': [
                            {'method': 'popup', 'minutes': 60},  # 1 hour before
                            {'method': 'popup', 'minutes': 15}   # 15 minutes before
                        ]
                    },
                    'colorId': get_event_color_id("Exercise"),
                    'recurrence': ['RRULE:FREQ=WEEKLY;COUNT=4']  # Repeat for 4 weeks
                }
                
                # Create the event in Google Calendar
                created_event = service.events().insert(calendarId=calendar_id, body=event).execute()
                
                # Store created event details
                created_events.append({
                    "id": created_event.get('id'),
                    "activity": activity,
                    "day": day_name,
                    "time": time_str,
                    "summary": created_event.get('summary'),
                    "start": created_event.get('start')
                })
                
            except Exception as e:
                errors.append({
                    "day": workout.get("day", "Unknown"),
                    "activity": workout.get("activity", "Unknown"),
                    "error": str(e)
                })
        
        return {
            "status": "success" if created_events else "error",
            "events_created": created_events,
            "errors": errors,
            "message": f"Created {len(created_events)} workout events"
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to create workout schedule: {str(e)}"
        }

def create_exercise_logging_reminders(
    user_credentials: Dict[str, Any],
    workout_events: List[Dict[str, Any]],
    minutes_after: int = 15
) -> Dict[str, Any]:
    """
    Create follow-up logging reminders for each workout event.
    
    Args:
        user_credentials: Google OAuth credentials for the user
        workout_events: List of created workout events with IDs
        minutes_after: Minutes after workout to schedule reminder (default: 15)
        
    Returns:
        Dictionary containing operation result
    """
    try:
        # Initialize the Calendar API client
        credentials = Credentials.from_authorized_user_info(user_credentials)
        service = build('calendar', 'v3', credentials=credentials)
        
        created_reminders = []
        errors = []
        
        # Create a reminder for each workout event
        for workout in workout_events:
            try:
                event_id = workout.get("id")
                activity = workout.get("activity", "workout")
                
                # Get the original event to determine when to schedule the reminder
                original_event = service.events().get(calendarId='primary', eventId=event_id).execute()
                
                # Determine end time of the original event
                if 'dateTime' in original_event['end']:
                    original_end_time = datetime.datetime.fromisoformat(
                        original_event['end']['dateTime'].replace('Z', '+00:00')
                    )
                else:
                    # For all-day events, use noon as a default time
                    original_end_time = datetime.datetime.fromisoformat(original_event['end']['date'])
                    original_end_time = datetime.datetime.combine(original_end_time.date(), datetime.time(12, 0))
                
                # Calculate reminder timing
                reminder_start_time = original_end_time + datetime.timedelta(minutes=minutes_after)
                reminder_end_time = reminder_start_time + datetime.timedelta(minutes=5)  # Brief reminder
                
                # Create reminder title and description
                title = f"Log your {activity} workout"
                description = (
                    f"Time to log your {activity} workout!\n\n"
                    f"Please record:\n"
                    f"• Duration\n"
                    f"• Intensity level\n"
                    f"• Pre/post glucose levels (if measured)\n"
                    f"• How you felt during/after\n\n"
                    f"This helps improve your personalized fitness recommendations."
                )
                
                # Create the reminder event
                reminder_event = {
                    'summary': f"📝 {title}",
                    'description': description,
                    'start': {
                        'dateTime': reminder_start_time.isoformat(),
                        'timeZone': original_event['start'].get('timeZone', 'America/New_York'),
                    },
                    'end': {
                        'dateTime': reminder_end_time.isoformat(),
                        'timeZone': original_event['end'].get('timeZone', 'America/New_York'),
                    },
                    'reminders': {
                        'useDefault': False,
                        'overrides': [
                            {'method': 'popup', 'minutes': 0}  # Immediate notification
                        ]
                    },
                    'colorId': '11',  # Bold Red for logging reminders
                    # Link to parent event
                    'extendedProperties': {
                        'private': {
                            'parentEventId': event_id,
                            'isLoggingReminder': 'true',
                            'activityType': 'exercise'
                        }
                    }
                }
                
                # Add recurrence if original event has it
                if 'recurrence' in original_event:
                    reminder_event['recurrence'] = original_event['recurrence']
                
                # Create the event
                created_reminder = service.events().insert(calendarId='primary', body=reminder_event).execute()
                
                created_reminders.append({
                    "id": created_reminder.get('id'),
                    "summary": created_reminder.get('summary'),
                    "parent_event_id": event_id,
                    "parent_activity": activity
                })
                
            except Exception as e:
                errors.append({
                    "event_id": workout.get("id", "Unknown"),
                    "activity": workout.get("activity", "Unknown"),
                    "error": str(e)
                })
        
        return {
            "status": "success" if created_reminders else "error",
            "reminders_created": created_reminders,
            "errors": errors,
            "message": f"Created {len(created_reminders)} exercise logging reminders"
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to create logging reminders: {str(e)}"
        }

def schedule_glucose_checks(
    user_credentials: Dict[str, Any],
    exercise_events: List[Dict[str, Any]],
    check_times: List[str] = ["before", "after"]
) -> Dict[str, Any]:
    """
    Schedule glucose check reminders around exercise events.
    
    Args:
        user_credentials: Google OAuth credentials for the user
        exercise_events: List of created exercise events with IDs
        check_times: When to schedule checks (before, during, after)
        
    Returns:
        Dictionary containing operation result
    """
    try:
        # Initialize the Calendar API client
        credentials = Credentials.from_authorized_user_info(user_credentials)
        service = build('calendar', 'v3', credentials=credentials)
        
        created_checks = []
        errors = []
        
        # Create glucose check reminders for each exercise event
        for exercise in exercise_events:
            try:
                event_id = exercise.get("id")
                activity = exercise.get("activity", "workout")
                
                # Get the original event details
                original_event = service.events().get(calendarId='primary', eventId=event_id).execute()
                
                # Process each check time (before, after)
                for check_time in check_times:
                    try:
                        # Determine when to check glucose based on the exercise timing
                        if check_time.lower() == "before":
                            # Schedule before exercise (15 min before start)
                            if 'dateTime' in original_event['start']:
                                exercise_start = datetime.datetime.fromisoformat(
                                    original_event['start']['dateTime'].replace('Z', '+00:00')
                                )
                                check_start_time = exercise_start - datetime.timedelta(minutes=15)
                            else:
                                # For all-day events, use 7 AM
                                exercise_date = datetime.datetime.fromisoformat(original_event['start']['date'])
                                check_start_time = datetime.datetime.combine(exercise_date.date(), datetime.time(7, 0))
                            
                            title_prefix = "Before"
                            description_guidance = "Check glucose 15 minutes before exercise to ensure safe levels. If below 90 mg/dL, consider having a small snack before starting."
                            
                        elif check_time.lower() == "after":
                            # Schedule after exercise (right after end)
                            if 'dateTime' in original_event['end']:
                                exercise_end = datetime.datetime.fromisoformat(
                                    original_event['end']['dateTime'].replace('Z', '+00:00')
                                )
                                check_start_time = exercise_end
                            else:
                                # For all-day events, use 6 PM
                                exercise_date = datetime.datetime.fromisoformat(original_event['end']['date'])
                                check_start_time = datetime.datetime.combine(exercise_date.date(), datetime.time(18, 0))
                            
                            title_prefix = "After"
                            description_guidance = "Check glucose immediately after exercise to monitor for post-exercise changes. Be aware that effects on glucose can continue for hours after activity."
                            
                        else:  # during - not normally used but included for completeness
                            # Schedule during extended exercise (midway through)
                            if 'dateTime' in original_event['start'] and 'dateTime' in original_event['end']:
                                exercise_start = datetime.datetime.fromisoformat(
                                    original_event['start']['dateTime'].replace('Z', '+00:00')
                                )
                                exercise_end = datetime.datetime.fromisoformat(
                                    original_event['end']['dateTime'].replace('Z', '+00:00')
                                )
                                exercise_duration = (exercise_end - exercise_start).total_seconds() / 60  # in minutes
                                
                                # Only add during-exercise check for longer workouts (45+ minutes)
                                if exercise_duration >= 45:
                                    midpoint = exercise_start + (exercise_end - exercise_start) / 2
                                    check_start_time = midpoint
                                else:
                                    # Skip "during" checks for shorter exercises
                                    continue
                            else:
                                # For all-day events, use noon
                                exercise_date = datetime.datetime.fromisoformat(original_event['start']['date'])
                                check_start_time = datetime.datetime.combine(exercise_date.date(), datetime.time(12, 0))
                            
                            title_prefix = "During"
                            description_guidance = "For longer exercise sessions, it's important to check glucose midway to prevent hypoglycemia. Pause briefly to check your levels."
                        
                        # Add 5 minutes for the end time
                        check_end_time = check_start_time + datetime.timedelta(minutes=5)
                        
                        # Create title and description
                        title = f"{title_prefix} {activity} - Glucose Check"
                        description = (
                            f"Time to check your glucose {check_time.lower()} your {activity} session.\n\n"
                            f"{description_guidance}\n\n"
                            f"Target range for exercise:\n"
                            f"• Before: 90-180 mg/dL\n"
                            f"• During/After: Monitor for drops below 70 mg/dL\n\n"
                            f"Remember to log this reading!"
                        )
                        
                        # Create the reminder event
                        check_event = {
                            'summary': f"🩸 {title}",
                            'description': description,
                            'start': {
                                'dateTime': check_start_time.isoformat(),
                                'timeZone': original_event['start'].get('timeZone', 'America/New_York'),
                            },
                            'end': {
                                'dateTime': check_end_time.isoformat(),
                                'timeZone': original_event['end'].get('timeZone', 'America/New_York'),
                            },
                            'reminders': {
                                'useDefault': False,
                                'overrides': [
                                    {'method': 'popup', 'minutes': 0}  # Immediate notification
                                ]
                            },
                            'colorId': '6',  # Orange for glucose checks
                            # Link to parent event
                            'extendedProperties': {
                                'private': {
                                    'parentEventId': event_id,
                                    'isGlucoseCheck': 'true',
                                    'checkTime': check_time.lower(),
                                    'activityType': 'exercise'
                                }
                            }
                        }
                        
                        # Add recurrence if original event has it
                        if 'recurrence' in original_event:
                            check_event['recurrence'] = original_event['recurrence']
                        
                        # Create the event
                        created_check = service.events().insert(calendarId='primary', body=check_event).execute()
                        
                        created_checks.append({
                            "id": created_check.get('id'),
                            "summary": created_check.get('summary'),
                            "parent_event_id": event_id,
                            "check_time": check_time.lower(),
                            "parent_activity": activity
                        })
                    
                    except Exception as e:
                        errors.append({
                            "event_id": event_id,
                            "check_time": check_time,
                            "error": str(e)
                        })
            
            except Exception as e:
                errors.append({
                    "event_id": exercise.get("id", "Unknown"),
                    "activity": exercise.get("activity", "Unknown"),
                    "error": str(e)
                })
        
        return {
            "status": "success" if created_checks else "error",
            "checks_created": created_checks,
            "errors": errors,
            "message": f"Created {len(created_checks)} glucose check reminders"
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to create glucose check reminders: {str(e)}"
        }

def schedule_medication_reminder(
    user_credentials: Dict[str, Any],
    medication_name: str,
    dosage: str,
    frequency: str,
    times: List[str],
    start_date: Optional[datetime.date] = None,
    end_date: Optional[datetime.date] = None,
    with_meals: bool = False,
    special_instructions: Optional[str] = None,
    create_logging_reminders: bool = True
) -> Dict[str, Any]:
    """
    Sets up medication reminders in Google Calendar with follow-up logging prompts.
    
    Args:
        user_credentials: Google OAuth credentials for the user
        medication_name: Name of the medication
        dosage: Dosage information
        frequency: How often the medication should be taken (daily, twice daily, etc.)
        times: Specific times for medication (e.g., ["8:00 AM", "8:00 PM"])
        start_date: When to start the reminders (default: tomorrow)
        end_date: When to end the reminders (default: 30 days from start)
        with_meals: Whether the medication should be taken with food
        special_instructions: Any additional instructions for taking the medication
        create_logging_reminders: Whether to create follow-up reminders to log medication
        
    Returns:
        Confirmation of calendar events creation with event details
    """
    try:
        # Initialize the Calendar API client
        credentials = Credentials.from_authorized_user_info(user_credentials)
        service = build('calendar', 'v3', credentials=credentials)
        
        # Set default start date to tomorrow if not provided
        if not start_date:
            start_date = (datetime.datetime.now() + datetime.timedelta(days=1)).date()
        
        # Set default end date to 30 days from start if not provided
        if not end_date:
            end_date = start_date + datetime.timedelta(days=30)
        
        # Parse frequency to determine recurrence pattern
        recurrence_pattern = "DAILY"
        if "week" in frequency.lower():
            recurrence_pattern = "WEEKLY"
        elif "month" in frequency.lower():
            recurrence_pattern = "MONTHLY"
        
        # Calculate how many events would be created (for information only)
        days_difference = (end_date - start_date).days + 1
        events_per_day = len(times)
        
        created_events = []
        errors = []
        
        # Create medication events for each time
        for time_str in times:
            try:
                # Parse time string
                time_format = "%I:%M %p" if "AM" in time_str or "PM" in time_str else "%H:%M"
                medication_time = datetime.datetime.strptime(time_str, time_format).time()
                
                # Combine date and time for the start
                start_datetime = datetime.datetime.combine(start_date, medication_time)
                end_datetime = start_datetime + datetime.timedelta(minutes=15)  # 15-minute event
                
                # Create title and description
                title = f"Take {medication_name}"
                
                # Add meal context if needed
                if with_meals:
                    title += " with food"
                
                description = (
                    f"Medication: {medication_name}\n"
                    f"Dosage: {dosage}\n"
                    f"Frequency: {frequency}\n"
                )
                
                if with_meals:
                    description += "Take with food\n"
                
                if special_instructions:
                    description += f"\nSpecial Instructions:\n{special_instructions}\n"
                
                description += "\nCreated by Debie Medical Info Agent"
                
                # Create the event object
                event = {
                    'summary': title,
                    'description': description,
                    'start': {
                        'dateTime': start_datetime.isoformat(),
                        'timeZone': 'America/New_York',  # Should be dynamic based on user's timezone
                    },
                    'end': {
                        'dateTime': end_datetime.isoformat(),
                        'timeZone': 'America/New_York',  # Should be dynamic based on user's timezone
                    },
                    'reminders': {
                        'useDefault': False,
                        'overrides': [
                            {'method': 'popup', 'minutes': 30},  # 30 minutes before
                            {'method': 'popup', 'minutes': 5}    # 5 minutes before
                        ]
                    },
                    'colorId': get_event_color_id("Medication"),
                    'recurrence': [f'RRULE:FREQ={recurrence_pattern}']
                }
                
                # Create the event in Google Calendar
                created_event = service.events().insert(calendarId='primary', body=event).execute()
                
                # Store created event details
                created_events.append({
                    "id": created_event.get('id'),
                    "medication": medication_name,
                    "dosage": dosage,
                    "time": time_str,
                    "summary": created_event.get('summary'),
                    "start": created_event.get('start'),
                    "with_meals": with_meals,
                    "special_instructions": special_instructions
                })
                
            except Exception as e:
                errors.append({
                    "time": time_str,
                    "medication": medication_name,
                    "error": str(e)
                })
        
        # Create logging reminders if requested
        logging_reminders = []
        if create_logging_reminders and created_events:
            for event in created_events:
                try:
                    event_id = event.get("id")
                    medication = event.get("medication")
                    
                    # Get the original event to determine when to schedule the logging reminder
                    original_event = service.events().get(calendarId='primary', eventId=event_id).execute()
                    
                    # Determine end time of the original event
                    if 'dateTime' in original_event['end']:
                        original_end_time = datetime.datetime.fromisoformat(
                            original_event['end']['dateTime'].replace('Z', '+00:00')
                        )
                    else:
                        # For all-day events, use noon as a default time
                        original_end_time = datetime.datetime.fromisoformat(original_event['end']['date'])
                        original_end_time = datetime.datetime.combine(original_end_time.date(), datetime.time(12, 0))
                    
                    # Calculate reminder timing (15 minutes after medication time)
                    reminder_start_time = original_end_time + datetime.timedelta(minutes=15)
                    reminder_end_time = reminder_start_time + datetime.timedelta(minutes=5)  # Brief reminder
                    
                    # Create reminder title and description
                    title = f"Log {medication} medication"
                    description = (
                        f"Time to log your {medication} medication!\n\n"
                        f"Please record:\n"
                        f"• Whether you took the full dose\n"
                        f"• Any side effects experienced\n"
                        f"• Current glucose level (if available)\n\n"
                        f"This helps track your medication adherence and any patterns with side effects."
                    )
                    
                    # Create the reminder event
                    reminder_event = {
                        'summary': f"📝 {title}",
                        'description': description,
                        'start': {
                            'dateTime': reminder_start_time.isoformat(),
                            'timeZone': original_event['start'].get('timeZone', 'America/New_York'),
                        },
                        'end': {
                            'dateTime': reminder_end_time.isoformat(),
                            'timeZone': original_event['end'].get('timeZone', 'America/New_York'),
                        },
                        'reminders': {
                            'useDefault': False,
                            'overrides': [
                                {'method': 'popup', 'minutes': 0}  # Immediate notification
                            ]
                        },
                        'colorId': '11',  # Bold Red for logging reminders
                        # Link to parent event
                        'extendedProperties': {
                            'private': {
                                'parentEventId': event_id,
                                'isLoggingReminder': 'true',
                                'activityType': 'medication'
                            }
                        }
                    }
                    
                    # Add recurrence if original event has it
                    if 'recurrence' in original_event:
                        reminder_event['recurrence'] = original_event['recurrence']
                    
                    # Create the event
                    created_reminder = service.events().insert(calendarId='primary', body=reminder_event).execute()
                    
                    logging_reminders.append({
                        "id": created_reminder.get('id'),
                        "summary": created_reminder.get('summary'),
                        "parent_event_id": event_id,
                        "parent_medication": medication
                    })
                    
                except Exception as e:
                    errors.append({
                        "event_id": event.get("id", "Unknown"),
                        "medication": event.get("medication", "Unknown"),
                        "error": f"Error creating logging reminder: {str(e)}"
                    })
        
        return {
            "status": "success" if created_events else "error",
            "events_created": created_events,
            "logging_reminders": logging_reminders,
            "errors": errors,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "total_reminders": len(created_events),
            "total_logging_prompts": len(logging_reminders),
            "next_steps": "Medication reminders have been added to your Google Calendar. You'll receive notifications before each dose, and logging reminders will appear 15 minutes after each scheduled medication time."
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to schedule medication reminders: {str(e)}"
        }

def get_event_color_id(event_type: str) -> str:
    """
    Returns the appropriate color ID for different types of events in Google Calendar.
    
    Args:
        event_type: Type of event (Exercise, Medication, Meal, GlucoseCheck, etc.)
        
    Returns:
        Color ID string
    """
    # Color IDs reference:
    # 1: Lavender, 2: Sage, 3: Grape, 4: Flamingo, 5: Banana
    # 6: Tangerine, 7: Peacock, 8: Graphite, 9: Blueberry, 10: Basil, 11: Tomato
    
    color_mapping = {
        "Exercise": "7",       # Peacock (blue-green)
        "Medication": "3",     # Grape (purple)
        "Meal": "5",           # Banana (yellow)
        "GlucoseCheck": "6",   # Tangerine (orange)
        "Doctor": "9",         # Blueberry (blue)
        "Logging": "11",       # Tomato (red)
        "Other": "8"           # Graphite (gray)
    }
    
    return color_mapping.get(event_type, "8")  # Default to Graphite if not found 