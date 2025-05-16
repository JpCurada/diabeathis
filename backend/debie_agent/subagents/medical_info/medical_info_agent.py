from google.adk.agents import LlmAgent
from google.adk.tools import google_search
from google.adk.tools import FunctionTool
from typing import Dict, List, Any, Optional
import datetime
import sys
import os

from debie_agent.utils.calendar_integration import schedule_medication_reminder

# Tools for the medical information agent
def provide_diabetes_info(
    query: str, 
    diabetes_type: Optional[str] = None, 
    user_context: Optional[Dict[str, Any]] = None,
    search_online: bool = True
) -> Dict[str, Any]:
    """
    Provides evidence-based information about diabetes management.
    
    Args:
        query: User question about diabetes
        diabetes_type: Type of diabetes the user has (Type 1, Type 2, Gestational, etc.)
        user_context: Additional context about the user's health situation
        search_online: Whether to perform an online search for the latest information
        
    Returns:
        Evidence-based information related to the query with verified sources
    """
    # Implementation would access a medical knowledge base and potentially perform
    # online searches for the latest evidence-based information
    
    # Adapt response based on diabetes type if specified
    diabetes_specific_info = ""
    if diabetes_type:
        if diabetes_type.lower() in ["type 1", "t1d", "type1", "1"]:
            diabetes_specific_info = "This information is specifically relevant for Type 1 diabetes management."
        elif diabetes_type.lower() in ["type 2", "t2d", "type2", "2"]:
            diabetes_specific_info = "This information is specifically relevant for Type 2 diabetes management."
        elif "gestational" in diabetes_type.lower():
            diabetes_specific_info = "This information is specifically relevant for gestational diabetes management."
    
    return {
        "query": query,
        "information": "Detailed answer to the query based on medical knowledge with consideration of the user's specific diabetes type and context.",
        "diabetes_specific_context": diabetes_specific_info,
        "sources": [
            {"title": "American Diabetes Association Guidelines", "url": "https://diabetes.org/", "credibility": "High"},
            {"title": "National Institute of Diabetes and Digestive and Kidney Diseases", "url": "https://www.niddk.nih.gov/", "credibility": "High"},
            {"title": "Recent research publication on this topic", "url": "https://pubmed.ncbi.nlm.nih.gov/", "credibility": "High"}
        ],
        "disclaimer": "This information is for educational purposes only and not a substitute for professional medical advice. Always consult your healthcare provider."
    }

def explain_medication(
    medication_name: str,
    user_diabetes_type: Optional[str] = None,
    current_medications: Optional[List[str]] = None,
    user_health_conditions: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Explains medication mechanisms, potential side effects, and diabetes-specific considerations.
    
    Args:
        medication_name: Name of the diabetes medication
        user_diabetes_type: The user's type of diabetes for tailored information
        current_medications: List of other medications the user is taking for interaction checks
        user_health_conditions: Other health conditions for contraindication checks
        
    Returns:
        Comprehensive information about the medication's mechanism, side effects, and considerations
    """
    # Implementation would access a medication database with diabetes-specific information
    # and check for potential interactions with current medications
    
    # Different medication information based on diabetes type
    diabetes_specific_info = ""
    if user_diabetes_type:
        if user_diabetes_type.lower() in ["type 1", "t1d", "type1", "1"]:
            diabetes_specific_info = "For Type 1 diabetes, this medication may be used alongside insulin therapy."
        elif user_diabetes_type.lower() in ["type 2", "t2d", "type2", "2"]:
            diabetes_specific_info = "This medication is commonly prescribed for Type 2 diabetes management."
    
    # Check for potential interactions with current medications
    interactions = []
    if current_medications:
        # Simulation of interaction checking
        for med in current_medications:
            if med.lower() != medication_name.lower():  # Avoid listing the medication itself
                interactions.append(f"Potential interaction with {med} - monitor for [specific effects]")
    
    # Check for contraindications with other health conditions
    contraindications = []
    if user_health_conditions:
        # Simulation of contraindication checking
        for condition in user_health_conditions:
            contraindications.append(f"Special consideration for patients with {condition}: [specific guidance]")
    
    return {
        "name": medication_name,
        "drug_class": "Classification of the medication (e.g., Biguanide, SGLT2 inhibitor)",
        "prescribed_for": "Primary conditions this medication treats",
        "mechanism": "Detailed explanation of how this medication works in the body",
        "diabetes_specific_information": diabetes_specific_info,
        "common_side_effects": [
            "Side effect 1 with frequency information",
            "Side effect 2 with frequency information",
            "Side effect 3 with frequency information"
        ],
        "serious_side_effects": [
            "Serious side effect 1 (seek medical attention immediately)",
            "Serious side effect 2 (seek medical attention immediately)"
        ],
        "potential_interactions": interactions,
        "contraindications": contraindications,
        "typical_dosage": "Information about common dosing protocols",
        "administration_guidance": "How and when to take the medication (with meals, etc.)",
        "glucose_monitoring_recommendations": "How often to check glucose while taking this medication",
        "storage_instructions": "How to properly store the medication",
        "sources": [
            {"title": "FDA Medication Guide", "url": "https://www.fda.gov/"},
            {"title": "American Diabetes Association Medication Guidance", "url": "https://diabetes.org/medications"}
        ],
        "disclaimer": "This information is for educational purposes only. Follow your healthcare provider's specific instructions regarding your medication regimen."
    }

def assess_symptom_severity(
    symptom: str, 
    duration: str, 
    intensity: str, 
    user_context: Dict[str, Any],
    related_glucose_readings: Optional[List[Dict[str, Any]]] = None,
    additional_symptoms: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Flags concerning symptoms that may require medical attention with specific diabetes considerations.
    
    Args:
        symptom: Description of the symptom
        duration: How long the symptom has been present
        intensity: Severity of the symptom (mild, moderate, severe)
        user_context: User's medical history, diabetes type, and other relevant information
        related_glucose_readings: Recent glucose readings that may be related to the symptom
        additional_symptoms: Other symptoms the user is experiencing simultaneously
        
    Returns:
        Assessment of symptom severity, recommended action, and diabetes-specific considerations
    """
    # Implementation would evaluate symptom severity against medical criteria
    # with special consideration for diabetes-related emergencies
    
    # Extract diabetes type from user context
    diabetes_type = user_context.get("diabetes_type", "unspecified")
    
    # Assign urgency level based on symptom, duration, and intensity
    urgency = "non-urgent"  # Default
    if intensity.lower() in ["severe", "extreme", "high"]:
        urgency = "emergency"
    elif intensity.lower() in ["moderate", "medium"] and duration.lower() not in ["brief", "minutes", "short"]:
        urgency = "urgent"
    
    # Check if the symptom might be related to glucose levels
    glucose_related = False
    glucose_related_symptoms = [
        "dizziness", "lightheaded", "shaky", "sweating", "confusion", 
        "headache", "extreme thirst", "frequent urination", "blurry vision",
        "fatigue", "nausea", "vomiting", "fruity breath", "numbness", "tingling"
    ]
    
    for glucose_symptom in glucose_related_symptoms:
        if glucose_symptom in symptom.lower():
            glucose_related = True
            break
    
    # Create diabetes-specific recommendations
    diabetes_specific_advice = ""
    if glucose_related:
        diabetes_specific_advice = "This symptom may be related to your glucose levels. Check your blood sugar immediately and follow your hypoglycemia or hyperglycemia treatment plan if needed."
    
    # Determine if this could be a diabetes emergency
    potential_emergency = False
    emergency_symptoms = [
        "unconscious", "seizure", "cannot keep fluids down", "fruity breath", 
        "cannot wake up", "difficulty breathing", "chest pain"
    ]
    
    for emergency_symptom in emergency_symptoms:
        if emergency_symptom in symptom.lower() or (additional_symptoms and any(emergency_symptom in s.lower() for s in additional_symptoms)):
            potential_emergency = True
            urgency = "emergency"
            break
    
    # Examine any related glucose readings
    glucose_analysis = None
    if related_glucose_readings and len(related_glucose_readings) > 0:
        recent_readings = [reading.get("glucose_value", 0) for reading in related_glucose_readings]
        if any(reading > 250 for reading in recent_readings):
            glucose_analysis = "Your recent high glucose readings may be contributing to these symptoms."
            urgency = "urgent" if urgency != "emergency" else urgency
        elif any(reading < 70 for reading in recent_readings):
            glucose_analysis = "Your recent low glucose readings may be contributing to these symptoms."
            urgency = "urgent" if urgency != "emergency" else urgency
    
    # Create action recommendations based on urgency
    action_recommendation = ""
    if urgency == "emergency":
        action_recommendation = "Seek immediate medical attention or call emergency services (911)."
    elif urgency == "urgent":
        action_recommendation = "Contact your healthcare provider today for guidance."
    else:
        action_recommendation = "Monitor your symptoms and discuss with your healthcare provider at your next appointment if they persist or worsen."
    
    return {
        "symptom": symptom,
        "reported_duration": duration,
        "reported_intensity": intensity,
        "urgency_assessment": urgency,
        "is_potential_emergency": potential_emergency,
        "glucose_related": glucose_related,
        "glucose_analysis": glucose_analysis,
        "recommendation": action_recommendation,
        "diabetes_specific_advice": diabetes_specific_advice,
        "reasoning": "Medical reasoning behind the recommendation based on symptom characteristics and diabetes considerations",
        "disclaimer": "This assessment is not a substitute for professional medical advice or diagnosis. When in doubt, always consult a healthcare provider."
    }

def record_side_effect(
    user_id: str,
    medication_name: str,
    side_effect: str,
    severity: str,
    onset_date: Optional[str] = None,
    duration: Optional[str] = None,
    details: Optional[str] = None,
    related_to_glucose: bool = False,
    glucose_reading: Optional[int] = None
) -> Dict[str, Any]:
    """
    Records medication side effects for healthcare provider review and future reference.
    
    Args:
        user_id: The user's ID
        medication_name: Name of the medication causing side effects
        side_effect: Description of the side effect
        severity: Severity level (mild, moderate, severe)
        onset_date: When the side effect started (default: today)
        duration: How long the side effect has lasted
        details: Additional details about the side effect
        related_to_glucose: Whether the side effect seems related to glucose levels
        glucose_reading: Glucose reading at the time of the side effect, if available
        
    Returns:
        Confirmation of side effect recording and recommendations
    """
    # Implementation would save this information to the user's health record
    # and provide guidance based on the severity of the side effect
    
    # Set default onset date to today if not provided
    if not onset_date:
        onset_date = datetime.datetime.now().strftime("%Y-%m-%d")
    
    # Determine recommendation based on severity
    recommendation = ""
    if severity.lower() == "severe":
        recommendation = "Based on the reported severity, contact your healthcare provider immediately or seek emergency care if symptoms are life-threatening."
    elif severity.lower() == "moderate":
        recommendation = "Contact your healthcare provider to discuss this side effect at your earliest convenience."
    else:  # mild
        recommendation = "Monitor this side effect. If it persists or worsens, contact your healthcare provider."
    
    # Add glucose-specific recommendation if relevant
    if related_to_glucose and glucose_reading:
        if glucose_reading > 180:
            recommendation += " Your high glucose reading may be related to this side effect. Follow your management plan for hyperglycemia."
        elif glucose_reading < 70:
            recommendation += " Your low glucose reading may be related to this side effect. Follow your management plan for hypoglycemia."
    
    return {
        "status": "success",
        "record": {
            "user_id": user_id,
            "medication_name": medication_name,
            "side_effect": side_effect,
            "severity": severity,
            "onset_date": onset_date,
            "duration": duration,
            "details": details,
            "related_to_glucose": related_to_glucose,
            "glucose_reading": glucose_reading,
            "recorded_at": datetime.datetime.now().isoformat()
        },
        "recommendation": recommendation,
        "share_with_provider": "This information will be available in your health records for review with your healthcare provider."
    }

def search_medical_literature(
    query: str,
    diabetes_specific: bool = True,
    max_results: int = 5,
    include_recent_only: bool = True
) -> Dict[str, Any]:
    """
    Searches reliable medical databases for peer-reviewed information on diabetes topics.
    
    Args:
        query: The medical topic to search for
        diabetes_specific: Whether to limit results to diabetes-related research
        max_results: Maximum number of results to return
        include_recent_only: Whether to include only recent publications (last 2 years)
        
    Returns:
        Curated list of relevant medical literature with summaries
    """
    # Implementation would query medical databases like PubMed, Cochrane, etc.
    # This is a simulation of what that would return
    
    # Refine the search query to be diabetes-specific if requested
    refined_query = query
    if diabetes_specific:
        refined_query = f"{query} diabetes"
    
    # Search parameters for recency if requested
    date_filter = ""
    if include_recent_only:
        current_year = datetime.datetime.now().year
        date_filter = f"published in the last 2 years ({current_year-2}-{current_year})"
    
    return {
        "query": refined_query,
        "date_filter": date_filter,
        "results_count": max_results,
        "results": [
            {
                "title": "Example Research Paper 1",
                "authors": "Smith J, Johnson A, et al.",
                "journal": "Diabetes Care",
                "publication_date": "2023-01-15",
                "doi": "10.xxxx/example",
                "url": "https://pubmed.ncbi.nlm.nih.gov/example1",
                "abstract": "Brief summary of the research findings relevant to the query."
            },
            {
                "title": "Example Research Paper 2",
                "authors": "Garcia M, Wilson T, et al.",
                "journal": "Journal of Clinical Endocrinology & Metabolism",
                "publication_date": "2022-06-22",
                "doi": "10.xxxx/example2",
                "url": "https://pubmed.ncbi.nlm.nih.gov/example2",
                "abstract": "Brief summary of the research findings relevant to the query."
            }
            # Additional results would be here up to max_results
        ],
        "disclaimer": "These research findings may have limitations and should be interpreted in the context of your personal health situation. Consult with your healthcare provider before making any changes to your diabetes management plan."
    }

# Create the medical information agent
medical_info_agent = LlmAgent(
    name="medical_info",
    description="""
    The Medical Information Agent provides evidence-based information about diabetes management:
    
    - Delivers evidence-based information about diabetes management tailored to specific diabetes types
    - Explains medication mechanisms, side effects, and contraindications with comprehensive details
    - Assesses symptom severity with specific attention to diabetes-related emergencies
    - Sets up medication reminders in Google Calendar with follow-up logging confirmations
    - Records and tracks medication side effects for healthcare provider review
    - Searches reliable medical literature for peer-reviewed diabetes information
    
    This agent helps users understand their condition and medications while providing timely reminders
    and emergency guidance for diabetes-specific health concerns.
    """,
    tools=[
        FunctionTool(provide_diabetes_info),
        FunctionTool(explain_medication),
        FunctionTool(assess_symptom_severity),
        FunctionTool(schedule_medication_reminder),
        FunctionTool(record_side_effect),
        FunctionTool(search_medical_literature),
        google_search,
    ],
    model="gemini-2.0-pro"
) 