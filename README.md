# Anomaly Trap

![Anomaly Trap Hero](src/assets/hero.png)

**Anomaly Trap** is a fast-paced, brain-teasing mobile game built with **Vue 3**, **TypeScript**, and **Capacitor**. Challenge your perception, memory, and logic through various game modes designed to push your cognitive limits.

## 🎮 Game Modes

- **Anomaly Hunt**: Find the outlier in a sea of patterns.
- **Sequence Breaker**: Predict the next item in complex logical sequences.
- **Word Trap**: Don't let the colors fool you (Stroop effect challenge).
- **Memory Matrix**: Test your short-term recall with evolving grids.
- **Riddle Master**: Solve quick-fire logic puzzles.
- **Cipher**: Decode hidden patterns on the fly.
...and more!

## 🚀 Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Mobile Foundation**: [Capacitor](https://capacitorjs.com/)
- **Native Features**: 
  - AdMob Integration
  - Haptic Feedback 
  - Adaptive Safe Areas

## 🛠️ Development

### Prerequisites
- Node.js (Latest LTS)
- Android Studio (for Android builds)
- Xcode (for iOS builds)

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```

### Mobile Builds
To build and sync for mobile:
```bash
npm run mobile:build
```

To open in Android Studio:
```bash
npm run mobile:open
```

## 📱 Mobile Optimizations
- **Haptics**: Tactical vibration for correct/incorrect answers and UI interactions.
- **Safe Area Insets**: Full-screen experience that respects notches and home indicators.
- **Performance**: Lightweight Vue components optimized for mobile web views.
- **Offline Ready**: Built to handle various network conditions.
