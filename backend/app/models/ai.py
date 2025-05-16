from sqlalchemy import Column, TIMESTAMP, text, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from .base import Base, TimestampMixin


class AIInsight(TimestampMixin, Base):
    __tablename__ = 'ai_insights'
    insight_id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False, index=True)
    insight_type_id = Column(Integer, ForeignKey('insight_types.insight_type_id'), nullable=False)
    generated_timestamp = Column(TIMESTAMP(with_timezone=True), server_default=text('CURRENT_TIMESTAMP'), nullable=False, index=True)
    insight_details = Column(JSONB, nullable=False)
    related_data_points = Column(JSONB)
    model_version = Column(String(50))

    user = relationship("User", back_populates="ai_insights")
    insight_type = relationship("InsightType", back_populates="ai_insights")
    notifications = relationship("Notification", back_populates="related_insight")
