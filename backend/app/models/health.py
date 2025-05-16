from sqlalchemy import Column, String, TIMESTAMP, text, DECIMAL, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base, TimestampMixin


class GlucoseReading(TimestampMixin, Base):
    __tablename__ = 'glucose_readings'
    glucose_reading_id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False, index=True)
    reading_timestamp = Column(TIMESTAMP(with_timezone=True), nullable=False, index=True)
    glucose_value = Column(DECIMAL(6, 2), nullable=False)
    reading_source = Column(String(50))
    user = relationship("User", back_populates="glucose_readings")


class FoodLog(TimestampMixin, Base):
    __tablename__ = 'food_logs'
    food_log_id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False, index=True)
    log_timestamp = Column(TIMESTAMP(with_timezone=True), nullable=False, index=True)
    meal_type_id = Column(Integer, ForeignKey('meal_types.meal_type_id'))
    food_description = Column(Text, nullable=False)
    quantity = Column(DECIMAL(10, 2))
    unit_of_measure = Column(String(50))
    estimated_carbs = Column(DECIMAL(10, 2))
    estimated_calories = Column(DECIMAL(10, 2))
    user = relationship("User", back_populates="food_logs")
    meal_type = relationship("MealType", back_populates="food_logs")


class BiometricData(TimestampMixin, Base):
    __tablename__ = 'biometric_data'
    biometric_data_id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False, index=True)
    reading_timestamp = Column(TIMESTAMP(with_timezone=True), nullable=False, index=True)
    biometric_type_id = Column(Integer, ForeignKey('biometric_types.biometric_type_id'), nullable=False)
    value = Column(DECIMAL(10, 2), nullable=False)
    systolic_bp = Column(DECIMAL(5, 2))
    diastolic_bp = Column(DECIMAL(5, 2))
    source = Column(String(50))
    user = relationship("User", back_populates="biometric_data")
    biometric_type = relationship("BiometricType", back_populates="biometric_data")


class MedicationLog(TimestampMixin, Base):
    __tablename__ = 'medications_log'
    medication_log_id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False, index=True)
    log_timestamp = Column(TIMESTAMP(with_timezone=True), nullable=False, index=True)
    medication_id = Column(UUID(as_uuid=True), ForeignKey('medications.medication_id'), nullable=False, index=True)
    dosage = Column(String(100))
    notes = Column(Text)
    user = relationship("User", back_populates="medications_log")
    medication = relationship("Medication", back_populates="medication_logs")


class InsulinIntakeLog(TimestampMixin, Base):
    __tablename__ = 'insulin_intake_log'
    insulin_log_id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False, index=True)
    log_timestamp = Column(TIMESTAMP(with_timezone=True), nullable=False, index=True)
    insulin_type_id = Column(UUID(as_uuid=True), ForeignKey('insulin_types.insulin_type_id'), nullable=False, index=True)
    dosage_units = Column(DECIMAL(10, 2), nullable=False)
    notes = Column(Text)
    user = relationship("User", back_populates="insulin_intake_logs")
    insulin_type = relationship("InsulinType", back_populates="insulin_intake_logs")

