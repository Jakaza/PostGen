# Database Schema Exporter - Backend

A FastAPI-based backend API that accepts a JSON database schema description and generates a complete PostgreSQL schema SQL file with tables, foreign keys, indexes, and comments. Ideal for designing and exporting database schemas programmatically.

---

## Table of Contents

- [Database Schema Exporter - Backend](#database-schema-exporter---backend)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)

---

## Project Overview

This project provides a backend API to:

- Accept database schema definitions in JSON format (tables, fields, relationships).
- Validate schema structure.
- Generate PostgreSQL schema SQL files including tables, foreign keys, indexes, and comments.
- Return generated SQL file for easy download.

---

## Features

- Input validation using Pydantic models  
- Handles foreign key relationships from fields or separate relationships array  
- Generates drop/create table statements in dependency order  
- Adds indexes on foreign key columns  
- Includes helpful comments and sample insert templates  
- CORS enabled for frontend integration  
- Health check endpoint  

---

## Tech Stack

- Python 3.10+  
- FastAPI  
- Pydantic  
- Uvicorn (ASGI server)  

---

## Getting Started

### Prerequisites

- Python 3.10 or newer  
- Git (for cloning repo)  

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Jakaza/PostGen.git
   cd PostGen
   cd backend
    ```

2. Create and activate a virtual environment:
   ``` bash
    python -m venv .venv
    source .venv/bin/activate   # Linux/macOS
    .venv\Scripts\activate      # Windows
    ```

3. Install dependencies:
   ``` bash
    pip install -r requirements.txt
    ```

4. Start the server:
   ``` bash
    uvicorn main:app --reload
   ```