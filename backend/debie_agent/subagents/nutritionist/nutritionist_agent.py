from google.adk.agents import LlmAgent
from google.adk.tools import google_search
from google.adk.tools import FunctionTool

# Tools for the nutritionist agent
def create_meal_plan(dietary_preferences, restrictions, glucose_data, diabetes_type, health_goals):
    """
    Creates personalized meal plans based on dietary needs and preferences.
    
    Args:
        dietary_preferences: User's food preferences
        restrictions: Dietary restrictions and allergies
        glucose_data: Historical glucose readings
        diabetes_type: Type of diabetes the user has
        health_goals: User's health goals
        
    Returns:
        A personalized meal plan
    """
    # Implementation would create personalized meal plan
    return {
        "plan_name": "Low-carb diabetes-friendly meal plan",
        "daily_meals": [
            {
                "meal": "Breakfast",
                "options": [
                    {"name": "Veggie omelet with whole grain toast", "carbs": 20, "protein": 15, "fat": 10},
                    {"name": "Greek yogurt with berries and nuts", "carbs": 25, "protein": 20, "fat": 12}
                ]
            },
            {
                "meal": "Lunch",
                "options": [
                    {"name": "Grilled chicken salad with olive oil dressing", "carbs": 15, "protein": 30, "fat": 15},
                    {"name": "Lentil soup with side salad", "carbs": 30, "protein": 15, "fat": 8}
                ]
            },
            {
                "meal": "Dinner",
                "options": [
                    {"name": "Baked salmon with roasted vegetables", "carbs": 20, "protein": 25, "fat": 15},
                    {"name": "Stir-fried tofu with vegetables and brown rice", "carbs": 35, "protein": 20, "fat": 10}
                ]
            },
            {
                "meal": "Snacks",
                "options": [
                    {"name": "Apple with almond butter", "carbs": 15, "protein": 5, "fat": 8},
                    {"name": "Hummus with vegetable sticks", "carbs": 12, "protein": 4, "fat": 6}
                ]
            }
        ],
        "nutritional_summary": {
            "avg_daily_carbs": 120,
            "avg_daily_protein": 85,
            "avg_daily_fat": 50,
            "avg_daily_calories": 1600
        }
    }

def schedule_meals(meal_plan):
    """
    Schedules meals in Google Calendar with logging reminders.
    
    Args:
        meal_plan: The meal plan to schedule
        
    Returns:
        Confirmation of calendar events creation
    """
    # Implementation would create Google Calendar events
    return {
        "status": "success",
        "events_created": [
            {"meal": "Breakfast", "time": "8:00 AM", "event_id": "event1"},
            {"meal": "Lunch", "time": "12:30 PM", "event_id": "event2"},
            {"meal": "Dinner", "time": "6:30 PM", "event_id": "event3"},
            {"meal": "Snack", "time": "3:30 PM", "event_id": "event4"}
        ],
        "logging_reminders": "Meal logging reminders have been set for 15 minutes after each scheduled meal."
    }

def suggest_recipes(dietary_preferences, restrictions, meal_type):
    """
    Suggests diabetes-friendly recipes and meal alternatives.
    
    Args:
        dietary_preferences: User's food preferences
        restrictions: Dietary restrictions and allergies
        meal_type: Type of meal (breakfast, lunch, dinner, snack)
        
    Returns:
        Recipe suggestions
    """
    # Implementation would provide recipe suggestions
    return {
        "recipes": [
            {
                "name": "Recipe 1",
                "ingredients": ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
                "instructions": "Step by step cooking instructions",
                "nutritional_info": {
                    "carbs": 30,
                    "protein": 20,
                    "fat": 10,
                    "fiber": 5,
                    "glycemic_index": "low"
                }
            },
            {
                "name": "Recipe 2",
                "ingredients": ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
                "instructions": "Step by step cooking instructions",
                "nutritional_info": {
                    "carbs": 25,
                    "protein": 15,
                    "fat": 12,
                    "fiber": 7,
                    "glycemic_index": "medium"
                }
            }
        ]
    }

def create_grocery_list(meal_plan):
    """
    Provides grocery lists for meal plans.
    
    Args:
        meal_plan: The meal plan to create a grocery list for
        
    Returns:
        A grocery list
    """
    # Implementation would create a grocery list
    return {
        "grocery_list": [
            {"category": "Proteins", "items": ["Chicken breast", "Salmon", "Tofu", "Greek yogurt"]},
            {"category": "Vegetables", "items": ["Spinach", "Bell peppers", "Broccoli", "Carrots"]},
            {"category": "Fruits", "items": ["Apples", "Berries", "Oranges"]},
            {"category": "Grains", "items": ["Brown rice", "Whole grain bread", "Quinoa"]},
            {"category": "Dairy", "items": ["Low-fat milk", "Cheese", "Eggs"]},
            {"category": "Other", "items": ["Olive oil", "Nuts", "Seeds", "Herbs and spices"]}
        ]
    }

def restaurant_guidance(restaurant_type, menu=None):
    """
    Offers real-time advice for restaurant dining or special occasions.
    
    Args:
        restaurant_type: Type of restaurant
        menu: Optional menu items if available
        
    Returns:
        Dining recommendations
    """
    # Implementation would provide restaurant dining advice
    return {
        "general_tips": [
            "Choose grilled, baked, or steamed dishes over fried",
            "Ask for sauces and dressings on the side",
            "Consider sharing an entree or taking half home",
            "Check glucose before and after the meal"
        ],
        "recommended_choices": [
            "Grilled fish or chicken with vegetables",
            "Salad with lean protein and dressing on the side",
            "Clear broth-based soups"
        ],
        "foods_to_limit": [
            "Fried appetizers",
            "Creamy sauces and soups",
            "Desserts high in sugar"
        ],
        "portioning_advice": "Focus on filling half your plate with non-starchy vegetables, quarter with lean protein, and quarter with whole grains or starchy vegetables."
    }

# Create the nutritionist agent
nutritionist_agent = LlmAgent(
    name="nutritionist",
    description="""
    The Nutritionist Agent provides personalized dietary guidance for diabetes management:
    
    - Creates personalized meal plans based on dietary needs and preferences
    - Schedules meals in Google Calendar with logging reminders
    - Suggests diabetes-friendly recipes and meal alternatives
    - Provides grocery lists for meal plans
    - Offers real-time advice for restaurant dining or special occasions
    """,
    tools=[
        FunctionTool(create_meal_plan),
        FunctionTool(schedule_meals),
        FunctionTool(suggest_recipes),
        FunctionTool(create_grocery_list),
        FunctionTool(restaurant_guidance),
        google_search
    ],
    model="gemini-2.0-pro"
)
