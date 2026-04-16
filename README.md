# Apartment Rental Management System

A full-stack web application for managing short-term apartment rentals. The platform provides a complete workflow for listing apartments, handling reservations, and managing users through a modern, scalable, and maintainable architecture.

---

## Demo

Live Demo: https://repo-apartement.vercel.app/

---

## Overview

This system allows users to browse apartments, check availability, and make reservations, while providing dedicated dashboards for administrators and property owners to manage the platform efficiently.

---

## Screenshots

### Owner Panel
![Owner Panel](https://github.com/user-attachments/assets/279079ce-db0f-42aa-ae1e-9934f4abec80)

### Client Interface
![Client Interface](https://github.com/user-attachments/assets/9a27c733-c3d5-4050-b3e1-bdc09ee81db1)

### Admin Dashboard
![Admin Dashboard](https://github.com/user-attachments/assets/376289a2-20fb-4bd4-8f74-46e71419b1f9)

---

## Features

- Role-based authentication (Admin, Owner, Client)
- Apartment management with full CRUD operations
- Reservation system with real-time availability validation
- Interactive calendar for booking management
- Admin dashboard with analytics and system control
- Responsive and modern UI built with Tailwind CSS

---

## Tech Stack

### Backend
- Laravel (REST API)
- PHP 8.3
- MySQL

### Frontend
- React
- Vite
- Tailwind CSS

### Authentication
- Laravel Sanctum

### Additional Tools
- FullCalendar
- Lucide Icons
- React Hot Toast

---

## Installation

### Requirements

- PHP 8.3+
- Composer
- Node.js 18+
- MySQL
- Git

### Setup

```bash
git clone https://github.com/bahasalah255/airbnb-system.git
cd airbnb-system

composer install
npm install

cp .env.example .env
```
Configure your database in .env
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password

---

php artisan key:generate
php artisan migrate --seed

php artisan serve
npm run dev

---- 
Usage
Test Accounts

Admin
email: admin@example.com

password: password

Owner
email: owner@example.com

password: password

Client
email: client@example.com

password: password

How it works
Clients browse apartments and make reservations
Owners manage their listings and availability
Admin controls users, reservations, and system data

----- 
API Endpoints
Apartments
GET /api/apartments
GET /api/apartments/{id}
Availability
GET /api/apartments/{id}/availability
Reservations
POST /api/reservations
Admin
GET /api/admin/stats

-----

app/                # Backend logic (controllers, models)
database/           # Migrations and seeders
resources/js/       # React frontend (components, pages)
routes/api.php      # API routes
routes/web.php      # Web routes

