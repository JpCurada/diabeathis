from sqlalchemy import Column, String, TIMESTAMP, text, DECIMAL, Boolean, Date, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from .base import Base, TimestampMixin


class User(TimestampMixin, Base):
    __tablename__ = 'users'
    user_id = Column(UUID(as_uuid=True), primary_key=True, ondelete='CASCADE') #ForeignKey('auth.users.id', ))
    username = Column(String(100), unique=True)
    email = Column(String(255), unique=True)
    last_login_at = Column(TIMESTAMP(with_timezone=True))
    date_of_birth = Column(Date)
    gender = Column(String(20))
    weight = Column(DECIMAL(5, 2))
    height = Column(DECIMAL(5, 2))
    unit_preference = Column(String(10), default='metric')
    is_cgm_activated = Column(Boolean, default=False, nullable=False)
    is_fitbit_activated = Column(Boolean, default=False, nullable=False)
    fitbit_access_token = Column(String(255))
    fitbit_refresh_token = Column(String(255))
    cgm_device_info = Column(JSONB)

    glucose_readings = relationship("GlucoseReading", back_populates="user")
    food_logs = relationship("FoodLog", back_populates="user")
    biometric_data = relationship("BiometricData", back_populates="user")
    medications_log = relationship("MedicationLog", back_populates="user")
    insulin_intake_logs = relationship("InsulinIntakeLog", back_populates="user")
    conversations = relationship("Conversation", back_populates="user")
    ai_insights = relationship("AIInsight", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    user_settings = relationship("UserSetting", back_populates="user", uselist=False)


class UserSetting(TimestampMixin, Base):
    __tablename__ = 'user_settings'
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id', ondelete='CASCADE'), primary_key=True)
    food_log_reminder_enabled = Column(Boolean, default=True, nullable=False)
    food_log_reminder_frequency_hours = Column(Integer, default=4)
    medication_reminder_enabled = Column(Boolean, default=True, nullable=False)
    insulin_reminder_enabled = Column(Boolean, default=True, nullable=False)
    notification_delivery_method = Column(String(50), default='in_app')
    user = relationship("User", back_populates="user_settings")

