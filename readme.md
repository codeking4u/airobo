# Looi Robo - React Native Animated Avatar MVP

A React Native mobile app showcasing an animated avatar with 3 different emotions (Happy, Sad, Surprised) using Lottie animations.

## Features

✨ **Animated Expressions** - 3 emotions with smooth Lottie animations  
🎯 **Touch-Based Interaction** - Tap buttons to switch emotions  
🎨 **Clean UI** - Simple, intuitive design  
📱 **Cross-Platform** - Works on Android and iOS  
🆓 **Open Source Assets** - Free community Lottie animations  

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **React Native CLI** (installed automatically with dependencies)
- For Android: Android Studio & Android SDK
- For iOS: Xcode (macOS only)

## Installation

### 1. Install Dependencies

```bash
npm install
```

This will install:
- React 18.2.0
- React Native 0.71.8
- Lottie React Native 6.4.0
- Metro Bundler (development)

### 2. Start Development Server

```bash
npm start
```

You'll see an interactive menu:
```
r - reload the app
d - open developer menu
i - run on iOS
a - run on Android
```

## Running on Device/Emulator

### Option 1: Android Physical Device (Easiest)

1. **Enable USB debugging** on your Android phone:
   - Settings → Developer Options → Enable "USB Debugging"
   
2. **Connect phone** via USB cable to your computer

3. **In the Metro terminal**, press `a` to deploy to your phone

4. Look for the app on your phone and tap to open

### Option 2: Android Emulator

1. Open **Android Studio**
2. Go to **Device Manager** and start an emulator
3. Wait for emulator to fully boot
4. In Metro terminal, press `a` to deploy

### Option 3: iOS Simulator (macOS only)

1. In Metro terminal, press `i` to deploy to iOS simulator

## Project Structure

```
aiRob/
├── App.js                       # Entry point
├── src/
│   ├── components/
│   │   └── Avatar.js           # Reusable avatar component
│   └── screens/
│       └── HomeScreen.js       # Main interactive screen
├── package.json                # Dependencies
├── metro.config.js             # Metro bundler config
├── .babelrc                    # Babel transpiler config
├── jest.config.js              # Testing config
└── tsconfig.json               # TypeScript config (optional)
```

## How It Works

### Avatar Component
The `Avatar` component displays Lottie animations based on emotion prop:
- **Happy** - Cheerful bouncing animation
- **Sad** - Melancholic animation
- **Surprised** - Shocked expression animation

All animations are fetched from free community Lottie assets.

### HomeScreen Component
Main screen with:
- Large avatar display (300px)
- 3 colored emotion buttons to switch expressions
- Feature list
- Current emotion indicator

## Customization

### Add New Emotions

Edit `src/components/Avatar.js`:
```javascript
const animationMap = {
  happy: 'https://assets8.lottiefiles.com/packages/lf20_7m2dyo2n.json',
  sad: 'https://assets10.lottiefiles.com/packages/lf20_4ieyfpsx.json',
  surprised: 'https://assets9.lottiefiles.com/packages/lf20_uowis2fq.json',
  // Add new emotion here
  angry: 'https://your-lottie-animation-url.json',
};
```

Then add button in `src/screens/HomeScreen.js` emotions array.

### Change Avatar Size

Pass `size` prop to Avatar component:
```javascript
<Avatar emotion={currentEmotion} size={400} />
```

### Find More Lottie Animations

Visit [LottieFiles](https://lottiefiles.com) to find thousands of free animations.

## Troubleshooting

### Metro won't start
```bash
npm cache clean --force
rm -rf node_modules
npm install
npm start
```

### App crashes on physical device
- Ensure phone has internet connection (for loading Lottie animations)
- Check USB debugging is enabled
- Try disconnecting and reconnecting phone

### Animations not loading
- Check your internet connection
- Verify Lottie animation URLs are still valid
- Try alternative animation from LottieFiles

## Future Roadmap (Phase 2+)

- 🎤 Speech recognition integration
- 🔊 Text-to-speech output
- 💬 AI chat functionality
- 🎵 Sound effects
- 👁️ Eye tracking interaction
- 🎭 More emotions and expressions

## Technology Stack

| Technology | Purpose |
|-----------|---------|
| React Native 0.71.8 | Mobile framework |
| React 18.2.0 | UI library |
| Lottie 6.4.0 | Animation library |
| Metro | JavaScript bundler |
| Babel 7.21.3 | Code transpiler |
| Jest 29.5.0 | Testing framework |

## License

Open source and free to use, modify, and distribute.

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Verify all prerequisites are installed
3. Check React Native official documentation: https://reactnative.dev

---

**Status**: MVP Phase 1 - Core animated avatar with 3 emotions ✅  
**Last Updated**: April 2026  
**Next Phase**: AI chat & speech integration
