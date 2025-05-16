from sqlalchemy import Column, String, TIMESTAMP, text, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base, TimestampMixin


class Conversation(TimestampMixin, Base):
    __tablename__ = 'conversations'
    conversation_id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False, index=True)
    start_timestamp = Column(TIMESTAMP(with_timezone=True), server_default=text('CURRENT_TIMESTAMP'), nullable=False)
    last_activity_timestamp = Column(TIMESTAMP(with_timezone=True), server_default=text('CURRENT_TIMESTAMP'), nullable=False, index=True)
    title = Column(String(255))
    status = Column(String(50), default='Open')

    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation")


class Message(TimestampMixin, Base):
    __tablename__ = 'messages'
    message_id = Column(UUID(as_uuid=True), primary_key=True, server_default=text('gen_random_uuid()'))
    conversation_id = Column(UUID(as_uuid=True), ForeignKey('conversations.conversation_id', ondelete='CASCADE'), nullable=False, index=True)
    sender_type_id = Column(Integer, ForeignKey('sender_types.sender_type_id'), nullable=False)
    sender_user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id', ondelete='SET NULL'))
    message_content = Column(Text, nullable=False)
    timestamp = Column(TIMESTAMP(with_timezone=True), server_default=text('CURRENT_TIMESTAMP'), nullable=False, index=True)
    conversation = relationship("Conversation", back_populates="messages")
    sender_type = relationship("SenderType", back_populates="messages")
    message_type_id = Column(Integer, ForeignKey('message_types.message_type_id'), nullable=False, default=1)
    message_type = relationship("MessageType", back_populates="messages")

