# REST API using NestJS

## Purpose

Discovering and putting into practice **NestJS** fundamentals.

## Project

Creation of a **REST API** that exposes endpoints to manipulate **Users** and **Companies** resources, with an **IAM (Identity Access Management)** layer to handle **authentication** and **authorization**.

## Key Features

- **Docker** for API containerization
- **PostgreSQL** as RDBM
- **TypeORM** for Object-relational mapping and database migrations/seeding
- **Service layer pattern** to decouple business logic from controllers
- **Dependency Injection pattern** to decouple components
- **Repository pattern** for data layer abstraction
- **JWT** for authentication (access/refresh tokens) with HTTP Only
- **Redis** for revoking access to JWT tokens
- **Role-based access control (RBAC)** for authorization
- **Claims-based access control (CBAC)** for authorization
- **Jest** as testing framework (Unit and E2E testing)
- **OpenAPI Specification** for API documentation

## Screenshots

![API documentation screenshot](/screenshots/swagger_1.png 'Routes resources')
![API documentation screenshot](/screenshots/swagger_2.png 'User POST request')
![API documentation screenshot](/screenshots/swagger_3.png 'DTOs schemas')
