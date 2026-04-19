# TrekBuddy - Mobile Tourism Guide App

**An AI-Powered Mobile Tourism Guide Application for Puducherry**

---

## Prerequisites

Before running the project, ensure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Expo CLI** (install globally)
   ```bash
   npm install -g expo-cli
   ```
   Or use npx (no global install needed)

4. **Expo Go App** (for testing on physical device)
   - **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

5. **Android Studio** (for Android emulator - optional)
   - Download from: https://developer.android.com/studio

6. **Xcode** (for iOS simulator - macOS only - optional)
   - Download from: Mac App Store

---

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd d:\TrekBuddy
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

**Note:** If you encounter any errors, try:
```bash
npm install --legacy-peer-deps
```

### 3. Verify Installation

Check if all dependencies are installed:
```bash
npm list --depth=0
```

---

## Running the Application

### Option 1: Start Development Server (Recommended)

```bash
npm start
```

or

```bash
expo start
```

This will:
- Start the Metro bundler
- Open Expo DevTools in your browser
- Display a QR code in the terminal

### Option 2: Run on Android

**Using Android Emulator:**
```bash
npm run android
```

**Using Physical Device:**
1. Start the dev server: `npm start`
2. Open Expo Go app on your Android device
3. Scan the QR code displayed in terminal/browser

### Option 3: Run on iOS (macOS only)

**Using iOS Simulator:**
```bash
npm run ios
```

**Using Physical Device:**
1. Start the dev server: `npm start`
2. Open Expo Go app on your iPhone
3. Scan the QR code displayed in terminal/browser

### Option 4: Run on Web Browser

```bash
npm run web
```

This will open the app in your default web browser.

---

## Development Server Options

When you run `npm start`, you'll see a menu with options:

- Press `a` - Open on Android emulator/device
- Press `i` - Open on iOS simulator/device
- Press `w` - Open in web browser
- Press `r` - Reload the app
- Press `m` - Toggle menu
- Press `j` - Open debugger
- Press `c` - Clear cache

---

## Troubleshooting

### Issue: Metro bundler not starting

**Solution:**
```bash
# Clear cache and restart
expo start -c
```

### Issue: Dependencies not installing

**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Port already in use

**Solution:**
```bash
# Kill process on port 8081 (default Expo port)
# Windows:
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Or use a different port:
expo start --port 8082
```

### Issue: Android emulator not detected

**Solution:**
1. Open Android Studio
2. Start AVD Manager
3. Create/Start an Android Virtual Device
4. Ensure Android SDK is properly configured

### Issue: iOS simulator not working (macOS)

**Solution:**
1. Install Xcode from App Store
2. Open Xcode and accept license agreement
3. Install iOS Simulator from Xcode preferences

### Issue: Expo Go app not connecting ("java.io.IOException: Failed to download remote update")

**Solution:**
This usually happens due to network restrictions or firewall issues.
1. Use the tunnel connection (bypasses local network):
   ```bash
   npm run start:tunnel
   ```
2. Ensure you have `@expo/ngrok` installed globally:
   ```bash
   npm install -g @expo/ngrok
   ```
3. Ensure phone and computer are on the same Wi-Fi network (if not using tunnel).

---

## Project Structure

```
TrekBuddy/
├── assets/              # Images, icons, logos
├── src/
│   ├── components/      # Reusable UI components
│   ├── data/            # JSON data files
│   ├── navigation/      # Navigation configuration
│   ├── screens/         # Screen components
│   ├── theme/           # Colors, typography, spacing
│   └── utils/           # Utility functions
├── App.tsx              # Root component
├── package.json         # Dependencies
└── app.json             # Expo configuration
```

---

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device (macOS only)
- `npm run web` - Run in web browser

---

## Environment Setup

### For AI Features (Gemini API)

1. Open the app and navigate to **Login Screen**
2. Tap the **hamburger menu** (☰) on the left
3. Go to **Settings** (if available) or configure API key in code
4. Enter your Google Gemini API key

**Note:** AI features will work with placeholder data if API key is not configured.

---

## Building for Production

### Android APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### iOS IPA

```bash
eas build --platform ios --profile preview
```

---

## Testing Checklist

- [ ] App launches successfully
- [ ] Welcome screen displays correctly
- [ ] Login/Signup forms work
- [ ] All 12 categories are accessible
- [ ] Category screens load with data
- [ ] Trip planner generates itinerary
- [ ] Transport screen shows bus routes
- [ ] Emergency services are accessible
- [ ] Language switching works
- [ ] Theme toggle works (if implemented)

---

## Support & Documentation

- **Expo Documentation**: https://docs.expo.dev/
- **React Native Documentation**: https://reactnative.dev/
- **React Navigation**: https://reactnavigation.org/

---

## Project Information

- **Project Name:** TrekBuddy
- **Version:** 1.0.0
- **Platform:** Android & iOS
- **Framework:** React Native with Expo
- **Target Location:** Puducherry (Pondicherry), India

---

## Quick Start (TL;DR)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# 3. Scan QR code with Expo Go app on your phone
# OR press 'a' for Android / 'i' for iOS / 'w' for web
```

---

**Happy Coding! 🚀**
