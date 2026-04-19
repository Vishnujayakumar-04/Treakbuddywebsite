# Custom Icon System

Custom SVG icons for the TrekBuddy app.

## Design Specifications

- **Style**: Flat minimal vector icons
- **Stroke**: 2px clean outline
- **Color Palette**: 
  - Teal: `#0E7C86`
  - Yellow: `#F4C430`
  - Red: `#E84A4A`
  - Blue: `#2176FF`
- **Shape**: Rounded corners
- **Background**: Transparent

## Usage

```tsx
import { HomeIcon, TripPlannerIcon, TransportIcon } from '../components/icons';

// Basic usage
<HomeIcon />

// With custom size
<HomeIcon size={32} />

// With custom color
<HomeIcon color="#0E7C86" />
```

## Available Icons

### Navigation Icons
- `HomeIcon` - Home screen
- `TripPlannerIcon` - Trip planner
- `TransportIcon` - Transport
- `EmergencyIcon` - Emergency/SOS
- `LoginIcon` - Profile/Login
- `SettingsIcon` - Settings gear

### Trip Planner Icons
- `CalendarLargeIcon` - Calendar header
- `MinusIcon` / `PlusIcon` - Quantity buttons
- `CheckmarkIcon` - Confirmation

### Transport Icons
- `BusIcon` - Bus
- `AutoRickshawIcon` - Auto rickshaw
- `MoneyCoinIcon` - Fare
- `ClockIcon` - Timings

### Emergency Icons
- `PhoneEmergencyIcon` - Emergency phone
- `HospitalIcon` - Hospital
- `PoliceBadgeIcon` - Police
- `FireIcon` - Fire department
- `PharmacyIcon` - Pharmacy

### Common Icons
- `HeartIcon` - Favorites
- `LocationPinIcon` - Location
- `CalendarIcon` - Calendar
- `StarIcon` - Rating
- `ArrowBackIcon` - Back navigation
- `InfoIcon` - Information
- `KeyIcon` - API key/settings

## Color Guidelines

- **Teal** (`#0E7C86`): Primary actions, navigation
- **Yellow** (`#F4C430`): Money, ratings, highlights
- **Red** (`#E84A4A`): Emergency, alerts, favorites
- **Blue** (`#2176FF`): Information, links
