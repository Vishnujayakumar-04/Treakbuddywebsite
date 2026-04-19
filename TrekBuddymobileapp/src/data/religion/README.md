# Religion Data

Local JSON data for religion places (temples, churches, mosques, etc.)

## Structure

### JSON Files
- `hindu-temples.json` - Hindu temples data
- `christian-churches.json` - Christian churches data
- `muslim-mosques.json` - Muslim mosques data
- `jain-temples.json` - Jain temples data
- `buddhist-temples.json` - Buddhist temples data

## Usage

```typescript
import { getReligionData, getAllReligionData } from '../data/religion/religionDataFetcher';

// Get specific category
const hinduTemples = await getReligionData('hindu-temples');

// Get all categories
const allData = await getAllReligionData();
```

## Data Format

Each JSON file contains an array of `ReligionPlace` objects:

```json
[
  {
    "id": "place_id_123",
    "name": "Temple Name",
    "address": "Full address",
    "location": {
      "lat": 11.9352,
      "lng": 79.8312
    },
    "opening_hours": [
      "Monday: 6:00 AM – 12:30 PM"
    ],
    "rating": 4.7,
    "maps_url": "https://maps.google.com/...",
    "phone": "+91 413 233 XXXX",
    "image": "https://...",
    "description": "Optional description",
    "entry_fee": "Free",
    "dress_code": "Modest attire recommended"
  }
]
```
