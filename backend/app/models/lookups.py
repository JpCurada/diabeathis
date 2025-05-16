from sqlalchemy import Column, Integer, String, TIMESTAMP, text, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base, TimestampMixin


class Medication(TimestampMixin, Base):
    __tablename__ = 'medications'
    medication_id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    medication_name = Column(String(255), unique=True, nullable=False)
    description = Column(Text)
    medication_logs = relationship("MedicationLog", back_populates="medication")


class InsulinType(TimestampMixin, Base):
    __tablename__ = 'insulin_types'
    insulin_type_id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    type_name = Column(String(50), unique=True, nullable=False)
    description = Column(Text)
    insulin_intake_logs = relationship("InsulinIntakeLog", back_populates="insulin_type")


class MealType(TimestampMixin, Base):
    __tablename__ = 'meal_types'
    meal_type_id = Column(Integer, primary_key=True, autoincrement=True)
    type_name = Column(String(50), unique=True, nullable=False)
    food_logs = relationship("FoodLog", back_populates="meal_type")


class BiometricType(TimestampMixin, Base):
    __tablename__ = 'biometric_types'
    biometric_type_id = Column(Integer, primary_key=True, autoincrement=True)
    type_name = Column(String(50), unique=True, nullable=False)
    biometric_data = relationship("BiometricData", back_populates="biometric_type")


class SenderType(TimestampMixin, Base):
    __tablename__ = 'sender_types'
    sender_type_id = Column(Integer, primary_key=True, autoincrement=True)
    type_name = Column(String(20), unique=True, nullable=False)
    messages = relationship("Message", back_populates="sender_type")


class MessageType(TimestampMixin, Base):
    __tablename__ = 'message_types'
    message_type_id = Column(Integer, primary_key=True, autoincrement=True)
    type_name = Column(String(50), unique=True, nullable=False)
    messages = relationship("Message", back_populates="message_type")


class InsightType(TimestampMixin, Base):
    __tablename__ = 'insight_types'
    insight_type_id = Column(Integer, primary_key=True, autoincrement=True)
    type_name = Column(String(50), unique=True, nullable=False)
    description = Column(Text)
    ai_insights = relationship("AIInsight", back_populates="insight_type")


class NotificationType(TimestampMixin, Base):
    __tablename__ = 'notification_types'
    notification_type_id = Column(Integer, primary_key=True, autoincrement=True)
    type_name = Column(String(50), unique=True, nullable=False)
    description = Column(Text)
    notifications = relationship("Notification", back_populates="notification_type")

