# Setup Guide for DoneIt

## Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm start
```

### Step 3: Run on Device
- **iOS**: Press `i` in the terminal or scan QR code with Camera app
- **Android**: Press `a` in the terminal or scan QR code with Expo Go app
- **Web**: Press `w` to open in browser

## Development Setup

### Prerequisites Check
```bash
# Check Node.js version (should be 14+)
node --version

# Check npm version
npm --version

# Install Expo CLI globally
npm install -g expo-cli
```

### Environment Setup

1. **For iOS Development (Mac only)**:
   ```bash
   # Install Xcode from App Store
   # Install Xcode Command Line Tools
   xcode-select --install
   ```

2. **For Android Development**:
   - Download Android Studio
   - Install Android SDK
   - Set up Android emulator

3. **For Physical Device Testing**:
   - iOS: Install "Expo Go" from App Store
   - Android: Install "Expo Go" from Play Store

## Troubleshooting

### Common Issues

#### 1. Metro Bundler Port Already in Use
```bash
# Kill the process on port 8081
lsof -ti:8081 | xargs kill -9

# Or start on different port
expo start --port 8082
```

#### 2. Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. Expo Go App Won't Connect
- Ensure your phone and computer are on the same WiFi network
- Try using tunnel connection: `expo start --tunnel`
- Check firewall settings

#### 4. AsyncStorage Warnings
```bash
# If you see AsyncStorage warnings, install the community package
npm install @react-native-async-storage/async-storage
```

## Building for Production

### iOS Build (requires Apple Developer account)
```bash
expo build:ios
```

### Android Build
```bash
expo build:android
```

### Web Build
```bash
expo build:web
```

## Testing

### Manual Testing Checklist
- [ ] Sign up new user
- [ ] Sign in existing user
- [ ] Create new list
- [ ] Add tasks to list
- [ ] Edit task time
- [ ] Delete task
- [ ] Start task runner
- [ ] Test countdown timer
- [ ] Test auto-advance
- [ ] Test break notifications
- [ ] Test task completion
- [ ] Test data persistence (close and reopen app)

## Performance Optimization

### For Smoother Performance
1. Enable Fast Refresh in Expo DevTools
2. Use production mode: `expo start --no-dev`
3. Optimize images before adding to assets/
4. Profile with React DevTools

## Debugging

### Useful Commands
```bash
# View app logs
expo start --clear

# Debug with Chrome DevTools
# Shake device and select "Debug Remote JS"

# View native logs
# iOS
react-native log-ios

# Android
react-native log-android
```

### VS Code Setup
Install recommended extensions:
- ES7+ React/Redux/React-Native snippets
- React Native Tools
- Prettier
- ESLint

## Code Style

### Formatting
We use Prettier for code formatting:
```bash
npm install --save-dev prettier
```

Create `.prettierrc`:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

## Version Control

### Branch Naming
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical fixes
- `docs/` - Documentation updates

### Commit Messages
Follow conventional commits:
- `feat: Add new feature`
- `fix: Fix bug`
- `docs: Update documentation`
- `style: Format code`
- `refactor: Refactor code`
- `test: Add tests`
- `chore: Update dependencies`

## Next Steps

1. Customize the app colors and branding
2. Add custom sound files for notifications
3. Implement additional features from the roadmap
4. Set up CI/CD pipeline
5. Publish to App Store and Play Store

Happy coding! 🚀
