# DoneIt - Task Management App

**YOU GET STUFF DONE**

DoneIt is a science-based task management app that helps users complete their tasks efficiently using countdown timers and smart breaks.

## Features

### 🎯 Core Features
- **Task Lists**: Create and manage multiple task lists with custom colors
- **Smart Time Estimation**: AI-powered time estimates based on task keywords
- **Countdown Timer**: Visual countdown for each task with auto-advance
- **Smart Breaks**: Science-based break system (Pomodoro technique)
  - 5-minute breaks every 25 minutes
  - 15-minute breaks every 90 minutes
- **Auto-Advance**: Tasks automatically advance with sound notifications
- **Task Completion Tracking**: Visual progress tracking with completion states

### 🧠 Science-Based Efficiency
- Implements the Pomodoro Technique for optimal productivity
- Smart break insertion based on cognitive load research
- Customizable break preferences (Smart, Custom, or None)

### 🎨 Beautiful UI
- Clean, modern interface matching the provided design mockups
- Color-coded task lists (Purple, Yellow, Green, Pink, Blue)
- Intuitive navigation and task management
- Visual feedback for task states (pending, active, completed)

### 📱 Screens
1. **Sign In/Sign Up**: User authentication
2. **Lists View**: View all task lists with quick preview
3. **Create List**: Create new lists with custom colors
4. **Task Detail**: Add, edit, and manage tasks in a list
5. **Task Runner**: Countdown timer with auto-advancing tasks

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack Navigator)
- **State Management**: React Context API
- **Data Persistence**: AsyncStorage
- **UI Components**: React Native Paper
- **Audio**: Expo AV for sound notifications

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Setup

1. Clone the repository:
```bash
git clone https://github.com/sidjones10/Done-It.git
cd Done-It
```

2. Install dependencies:
```bash
npm install
```

3. Create assets folder and add placeholder images:
```bash
mkdir -p assets
```

4. Start the development server:
```bash
npm start
```

5. Run on your device:
   - Install the Expo Go app on your iOS or Android device
   - Scan the QR code shown in the terminal
   - Or press `i` for iOS simulator or `a` for Android emulator

## ⚠️ Windows Users: IMPORTANT!

If you encounter this error on Windows:
```
Error: ENOENT: no such file or directory, mkdir '...\\.expo\\metro\\externals\\node:sea'
```

**Quick Fix:**
```bash
# Run the included clean script
clean-expo.bat

# Or use PowerShell
.\clean-expo.ps1

# Then start with clean cache
npm run start:clean
```

**Alternative Manual Fix:**
```bash
# Delete .expo directory
rmdir /s /q .expo

# Start with clean cache
npm start
```

The project includes a `metro.config.js` that handles this Windows-specific issue, but you may need to clean the cache first.

## Project Structure

```
Done-It/
├── App.js                      # Main app entry point
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── babel.config.js             # Babel configuration
├── src/
│   ├── context/
│   │   ├── AuthContext.js      # Authentication state management
│   │   └── TaskContext.js      # Task and list state management
│   └── screens/
│       ├── SignInScreen.js     # Authentication screen
│       ├── ListsScreen.js      # Lists overview screen
│       ├── CreateListScreen.js # Create new list screen
│       ├── TaskListDetailScreen.js  # Task list detail and editing
│       └── TaskRunnerScreen.js # Task countdown timer screen
└── assets/                     # App icons and images
```

## Usage

### Creating a List
1. Sign in or create an account
2. Tap "+ Create New List"
3. Enter a list name and choose a color
4. Tap "Create List"

### Adding Tasks
1. Select a list from the Lists screen
2. Enter task name in the input field
3. Optionally specify time in minutes (or let the app estimate)
4. Tap the "+" button to add the task

### Running Tasks
1. Open a task list
2. Tap "start tasks" button
3. Choose your break preference (Smart, Custom, or None)
4. Tap Play to start the countdown
5. Tasks will auto-advance with sound notifications

### Smart Time Estimates
The app automatically estimates task duration based on keywords:
- "clean" → 15 mins
- "vacuum" → 30 mins
- "fold" → 5 mins
- "cook" → 30 mins
- "exercise" → 20 mins
- "pack" → 2 hrs
- And more...

## Key Features Implementation

### Smart Break Algorithm
```javascript
- 5 min break after every 25 minutes of work (short break)
- 15 min break after every 90 minutes of work (long break)
- User can choose to skip breaks or disable them entirely
```

### Auto-Advance System
- Tasks automatically complete when timer reaches zero
- Sound notification plays when task completes
- Vibration feedback for task transitions
- Alert dialog prompts for next task or break

### Data Persistence
- All lists and tasks are stored locally using AsyncStorage
- User authentication state persists across app restarts
- Task completion states are saved automatically

## Customization

### Changing Colors
Edit the color palette in `CreateListScreen.js`:
```javascript
const colors = [
  { name: 'Purple', value: '#B8B8D1' },
  { name: 'Yellow', value: '#F4D78C' },
  { name: 'Green', value: '#A8D4A8' },
  // Add more colors...
];
```

### Modifying Time Estimates
Edit `DEFAULT_TIME_ESTIMATES` in `TaskContext.js`:
```javascript
const DEFAULT_TIME_ESTIMATES = {
  'your-keyword': 20, // minutes
  // Add more estimates...
};
```

### Adjusting Break Intervals
Modify the `calculateSmartBreaks` function in `TaskContext.js`.

## Future Enhancements

- [ ] Cloud sync with Firebase
- [ ] Social features (share lists, compete with friends)
- [ ] Advanced statistics and productivity insights
- [ ] Custom sound notifications
- [ ] Widget support
- [ ] Apple Watch / Wear OS integration
- [ ] Dark mode
- [ ] Recurring tasks
- [ ] Task templates
- [ ] Export data to CSV

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Credits

Created with ❤️ for productivity enthusiasts who want to GET STUFF DONE!

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**YOU GET STUFF DONE** 🎯
