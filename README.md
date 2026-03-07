📘 README — Backend
Sistema de Gestión de Turnos — API REST

Backend desarrollado en Node.js con Express, orientado a la gestión de turnos para pequeños negocios (manicuristas, peluqueros, barberos, estilistas).

El sistema implementa autenticación basada en JWT, control de acceso por roles y validaciones de lógica de negocio en servidor.

🏗️ Arquitectura

Node.js

Express.js (API REST)

PostgreSQL

Prisma ORM

JWT Authentication

Bcrypt para hash de contraseñas

Arquitectura modular basada en separación de responsabilidades

Estructura General

backend/

├── prisma/

    └── schema.prisma

├── src/

    └── middlewares/

    ├── modules/
         └──appointment
         |   └──cAppointment.js
         |  ├──rAppointment.js
         |  └──sAppointment.js
         └──apoointmentFilters
         ├──auth
         ├──client
         ├──dashboard
         ├──service
         └──user

├── app.js

└── .env

🔐 Autenticación y Autorización

Autenticación:

Implementada con JWT

Token enviado en headers (Authorization: Bearer token)

Passwords hasheados con Bcrypt

Autorización por Roles:

Role: ADMIN

Role: USER

Middlewares personalizados:

mAuth → verifica token

mError → manejo centralizado de errores

mRole → restringe acceso por rol

🧠 Lógica de Negocio

El backend concentra las reglas críticas del sistema:

Validaciones implementadas

No se permiten turnos en fechas pasadas

No se permiten turnos duplicados (misma fecha y hora)

No se pueden crear turnos sin:

- Cliente existente

- Servicio existente

Integridad relacional garantizada vía Prisma

Control de aislamiento entre negocios

📦 Endpoints Principales

Auth

POST /auth/register (Admin)

POST /auth/login

Users (Admin)

POST /users

PUT /users/:id

PATCH /users/:id/activate

PATCH /users/:id/deactivate

DELETE users/:id

Clients

GET /clients

POST /clients

PUT /clients/:id

DELETE /clients/:id

Services

GET /services

POST /services

PUT /services/:id

DELETE /services/:id

Appointments

GET /appointments

POST /appointments

PUT /appointments/:id

DELETE /appointments/:id

🗄️ Modelo de Datos (Simplificado)

Entidades principales:

User

Client

Service

Appointment

Relaciones:

Un Admin tiene muchos Users

Un User tiene muchos Clients

Un User tiene muchos Services

Un User tiene muchos Appointments

Un Appointment pertenece a un Client

Un Appointment pertenece a un Service

🌐 Entorno y Configuración

Variables de entorno requeridas

DATABASE_URL=

JWT_SECRET=

PORT=

⚙️ Instalación Local

git clone <https://github.com/JulioCesarSolis266/manicuria-backend>

cd backend

npm install

Configurar archivo .env

npx prisma migrate dev

npm run dev

🚀 Deploy

Backend: Render

Base de datos: PostgreSQL (producción)

🔍 Decisiones Técnicas Relevantes

Middleware de errores centralizado.

Migración desde entorno local inicial con xampp hacia PostgreSQL con Prisma para mayor escalabilidad.

Estructura preparada para evolución hacia arquitectura más robusta (ej: TypeScript).

🔮 Próximas Mejoras

Migración a TypeScript

Soporte para múltiples empleados por usuario.

Permitir turnos simultáneos según recurso(employees)

Implementación de métricas y reportes

Mejora en modularización de servicios

Repositorio del frontend <https://github.com/JulioCesarSolis266/manicuria-frontend>
