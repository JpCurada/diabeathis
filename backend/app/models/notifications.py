# backend/app/models/notifications.py

from sqlalchemy import Column, String, TIMESTAMP, text, ForeignKey, Integer, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base, TimestampMixin


class Notification(TimestampMixin, Base):
    __tablename__ = 'notifications'
    notification_id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False, index=True)
    notification_type_id = Column(Integer, ForeignKey('notification_types.notification_type_id'), nullable=False)
    scheduled_send_time = Column(TIMESTAMP(with_timezone=True))
    sent_at = Column(TIMESTAMP(with_timezone=True))
    is_sent = Column(Boolean, default=False, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    title = Column(String(255))
    body = Column(Text, nullable=False)
    related_insight_id = Column(UUID(as_uuid=True), ForeignKey('ai_insights.insight_id', ondelete='SET NULL'))

    user = relationship("User", back_populates="notifications")
    notification_type = relationship("NotificationType", back_populates="notifications")
    related_insight = relationship("AIInsight", back_populates="notifications")
