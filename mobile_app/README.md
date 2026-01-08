# Smart Construction App

## Overview
A comprehensive mobile application for construction site management, built with Flutter and Riverpod. This app features real-time site monitoring, inventory management (Rates), plan viewing, vehicle charge tracking, and location services.

## Features
- **Authentication**: Secure login with JWT support and persistent session.
- **Home Dashboard**:
  - User profile and project selector.
  - Live Camera feed placeholder.
  - Available Stock summary.
  - Site Team roster.
  - Quick access to Site Plans.
- **Rates (Inventory)**:
  - List of materials with real-time pricing and stock status.
  - Search and filter capabilities.
- **Site Plans**:
  - Grid view of construction plans (Elevation, Flooring, Electrical, etc.).
- **Charge Monitoring**:
  - Vehicle charging status with visual indicators and metrics.
- **Location**:
  - Interactive map view for tracking assets/vehicles.

## Architecture
The project follows **Clean Architecture** principles:
- **Presentation Layer**: Widgets, Pages, and Riverpod Notifiers.
- **Domain Layer**: Entities and Repository Interfaces.
- **Data Layer**: Repositories, API Services, and Caching (Hive).

### Key Technologies
- **Flutter**: UI Framework (Material 3).
- **Riverpod**: State Management.
- **GoRouter**: Navigation (ShellRoute for Bottom Nav).
- **Dio**: HTTP Client.
- **Hive**: Local Caching.
- **Flutter Secure Storage**: Secure token storage.

## Getting Started

1. **Prerequisites**:
   - Flutter SDK (3.x+)
   - Dart SDK

2. **Installation**:
   ```bash
   cd mobile_app
   flutter pub get
   ```

3. **Running the App**:
   ```bash
   flutter run
   ```

4. **Testing**:
   ```bash
   flutter test
   ```

## Project Structure
```
lib/
├── core/               # Core utilities (Config, Theme, Router, UI Components)
├── data/               # Data repositories and services
├── domain/             # Business logic entities
├── features/           # Feature-specific code
│   ├── auth/           # Login & Authentication
│   ├── home/           # Main Dashboard
│   ├── rates/          # Inventory/Rates List
│   ├── plans/          # Site Plans
│   ├── request/        # Charge/Request Status
│   ├── map/            # Location Map
│   └── ...
└── main.dart           # Entry point
```

## Design Compliance
The app strictly follows the "Smart Construction" design template:
- **Font**: DM Sans.
- **Colors**: Primary Dark Blue (#03053D), Background Light Gray (#F3F4F4).
- **UI Components**: Custom rounded inputs, cards with shadows, clean typography.
