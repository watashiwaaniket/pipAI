# PIP-AI: Personal Information Processor 📟

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Expo](https://img.shields.io/badge/Expo-000000?style=flat&logo=expo&logoColor=white)](https://expo.dev)

**PIP-AI** is a fully offline, privacy-first AI companion inspired by retro-futuristic terminal aesthetics. Built with React Native and powered by `llama.cpp` (via `llama.rn`), it allows you to run powerful Large Language Models directly on your mobile device without any internet connection.

> [!IMPORTANT]
> This is a fully offline build. Your data never leaves your device.

---

## 🚀 Quick Start (Android APK)

Download the latest standalone APK and install it directly on your Android device.

**[Download PIP-AI v1.0.0 (Alpha) APK](https://expo.dev/accounts/hisukurifu01/projects/pipAI/builds/bb4984ca-88e7-4316-b210-c578ecb06f32)**

---

## ✨ Features

- **📟 Terminal Interface**: A high-fidelity retro CRT aesthetic with scanlines, typewriter effects, and mono-spaced fonts.
- **🧠 Local Inference**: Run GGUF models (Gemma, Llama 3, etc.) locally on your phone's CPU/NPU.
- **🛰️ SOS Signals**: Integrated emergency visual signal protocols (SOS, Signal Mirrors, Morse code codes).
- **🔒 Privacy First**: No tracking, no telemetry, no cloud.
- **💬 Persistent Memory**: Full chat history stored locally via encrypted storage.
- **🛠️ Configurable Engine**: Tweak temperature, context window, and model tiers directly from the `CONFIG` panel.

---

## 🛠️ Tech Stack & Dependencies

PIP-AI is built on top of the following amazing open-source projects:

- **Core**: [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)
- **Native AI Engine**: [llama.rn](https://github.com/mybigday/llama.rn) (based on [llama.cpp](https://github.com/ggerganov/llama.cpp))
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Storage**: [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- **Icons**: [@expo/vector-icons](https://icons.expo.fyi/)

---

## 📦 Developer Setup

If you want to build PIP-AI from source, follow these steps:

### 1. Prerequisites
- Node.js (v18+)
- Homebrew (macOS)
- Android Studio & SDK

### 2. Install Native Requirements
```bash
brew install openjdk@17
# Link OpenJDK
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

### 3. Installation
```bash
git clone https://github.com/yourusername/pipAI.git
cd pipAI
npm install
```

### 4. Running
To run with native AI support, you MUST use a Development Build or standalone build:
```bash
# Build & Run on Android
npx expo run:android

# Build Standalone APK via EAS
eas build --platform android --profile preview
```

---

## 🤝 Contributing

Contributions are welcome! Please check our **[CONTRIBUTING.md](./CONTRIBUTING.md)** for guidelines on how to get started.

---

## ⚖️ License & Credits

- Licensed under the **MIT License**.
- Aesthetics inspired by various retro-futuristic 80s/90s sci-fi terminals.
- Developed by **[@astriknormal](https://github.com/astriknormal)**.

---

*“Information is the ultimate survival tool.”*
