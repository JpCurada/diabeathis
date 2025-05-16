from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, TIMESTAMP, text

Base = declarative_base()


class TimestampMixin:
    created_at = Column(TIMESTAMP(with_timezone=True), server_default=text('CURRENT_TIMESTAMP'), nullable=False)
    updated_at = Column(TIMESTAMP(with_timezone=True), server_default=text('CURRENT_TIMESTAMP'), nullable=False)
    