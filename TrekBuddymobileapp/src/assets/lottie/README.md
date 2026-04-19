# Lottie Animations

This directory contains Lottie animation JSON files used throughout the app.

## Current Animations

- `ai-loading.json` - AI loading animation (used in AIRecommendationCard, AIDetailScreen)
- `bus.json` - Bus animation (used in TransportScreen)
- `emergency.json` - Emergency alert animation (used in EmergencyScreenTab)
- `success.json` - Success checkmark animation (used in TripPlannerOutput)

## Replacing with Better Animations

The current animations are simple placeholders. To replace them with professional animations:

1. Visit [LottieFiles.com](https://lottiefiles.com)
2. Search for animations:
   - **AI Loading**: Search "loading brain", "ai thinking", "sparkles loading"
   - **Bus**: Search "bus transport", "moving bus", "bus animation"
   - **Emergency**: Search "emergency alert", "warning pulse", "alert animation"
   - **Success**: Search "success checkmark", "confetti success", "check animation"
3. Download the JSON files
4. Replace the corresponding files in this directory
5. The app will automatically use the new animations

## Recommended Animations

- **AI Loading**: [Loading Brain](https://lottiefiles.com/search?q=loading+brain)
- **Bus**: [Bus Transport](https://lottiefiles.com/search?q=bus+transport)
- **Emergency**: [Alert Pulse](https://lottiefiles.com/search?q=emergency+alert)
- **Success**: [Success Checkmark](https://lottiefiles.com/search?q=success+checkmark)

## Usage

Animations are imported via `src/assets/lottie/animations.ts`:

```typescript
import { LOTTIE_ANIMATIONS } from '../assets/lottie/animations';

<LottieAnimation
  source={LOTTIE_ANIMATIONS.aiLoading}
  width={100}
  height={100}
  loop={true}
  autoPlay={true}
/>
```

