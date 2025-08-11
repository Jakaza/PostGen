# models.py
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class Field(BaseModel):
    id: int
    name: str
    type: str
    isPrimary: bool = False
    isRequired: bool = False
    isForeignKey: bool = False
    referencesTable: Optional[int] = None
    referencesField: Optional[int] = None

class Table(BaseModel):
    id: int
    name: str
    fields: List[Field]

class Relationship(BaseModel):
    id: int
    fromTable: int
    fromField: int
    toTable: int
    toField: int

class SchemaRequest(BaseModel):
    tables: List[Table]
    relationships: List[Relationship]
    tablePositions: Optional[Dict[str, Any]] = None
