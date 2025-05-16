from backend.app.models.base import Base, TimestampMixin
from backend.app.models.users import User, UserSetting
from backend.app.models.health import (
    GlucoseReading, 
    FoodLog, 
    BiometricData, 
    MedicationLog, 
    InsulinIntakeLog
)
from backend.app.models.lookups import (
    SenderType, 
    MessageType, 
    InsightType, 
    NotificationType, 
    FoodCategory, 
    MealType, 
    MedicationType, 
    ExerciseType, 
    InsulinType
)
from backend.app.models.chat import Conversation, Message
from backend.app.models.ai import AIInsight
from backend.app.models.notifications import Notification

# This file ensures all models are imported and registered with SQLAlchemy
# This allows for string-based relationship references and resolves circular dependencies
