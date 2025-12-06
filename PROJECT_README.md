# 🍔 AR Info Gizi Makanan Cepat Saji

**NutriScan AR** - Web-based Augmented Reality Nutrition Information Scanner

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🎯 Overview

NutriScan AR is a complete web-based augmented reality application that allows users to scan fast-food packaging or marker images and instantly see nutritional information displayed as an AR overlay. No app installation required - runs directly in mobile browsers!

## ✨ Features

- 📱 **Web-based AR** - Works on Chrome (Android) and Safari (iOS)
- 🎯 **Image Tracking** - Uses MindAR for robust marker detection
- 🍔 **10 Fast Food Items** - Pre-loaded nutrition database
- 📊 **Dynamic Portion Control** - Adjust servings from 0.5x to 2x
- ⚠️ **Smart Warnings** - Automatic alerts for high calories, sodium, and sugar
- 🔖 **Bookmark System** - Save favorite items with localStorage
- 🎨 **Modern UI** - Glassmorphism design with smooth animations
- 📱 **Mobile-First** - Optimized for touch interactions

## 🛠️ Technologies

- **MindAR** - Image tracking engine
- **Three.js** - 3D rendering (if needed)
- **Vanilla JavaScript** - No framework dependencies
- **HTML5/CSS3** - Modern responsive design
- **LocalStorage** - Client-side data persistence

## 📂 Project Structure

```
/NutriScan AR/
├── index.html              # Main HTML file
├── app.js                  # Application logic
├── style.css               # Styles and animations
├── /assets/
│   ├── /markers/           # AR marker images
│   │   ├── burger-marker.svg
│   │   ├── fries-marker.svg
│   │   ├── soda-marker.svg
│   │   └── README.md
│   └── /icons/             # Nutrition icons
│       ├── calories.svg
│       ├── protein.svg
│       ├── carbs.svg
│       ├── fat.svg
│       ├── sodium.svg
│       └── sugar.svg
├── /data/
│   └── nutrition.json      # Nutrition database (10 items)
└── readme.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome 89+ or Safari 14+)
- Camera-enabled device (smartphone or laptop)
- Local web server (for development)

### Installation

1. **Clone or download** this project

2. **Start a local server**:

   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using PHP
   php -S localhost:8000
   
   # Using Node.js http-server
   npx http-server -p 8000
   ```

3. **Open in browser**:
   ```
   http://localhost:8000
   ```

4. **Allow camera permissions** when prompted

### Using with Laragon (Current Setup)

Since you're using Laragon:

1. Project is already in: `d:\laragon\www\NutriScan AR`
2. Access via: `http://localhost/NutriScan%20AR/`
3. Or: `http://nutriscan-ar.test` (if configured)

## 📱 How to Use

1. **Open the app** in your mobile browser
2. **Point camera** at a marker (see markers folder)
3. **Nutrition panel appears** when marker is detected
4. **Adjust portion** using the slider (0.5x - 2x)
5. **View warnings** for high sodium, sugar, or calories
6. **Bookmark items** to save them for later
7. **Panel hides** automatically when marker is lost

## 🎨 Features Breakdown

### A. Marker Detection
- Detects burger, fries, and soda markers
- Shows corresponding nutrition data
- Hides panel when marker is lost

### B. Portion Control
- Range: 0.5x to 2.0x
- Real-time calculation updates
- Formula: `displayValue = baseValue × portionMultiplier`

### C. Automatic Warnings
- 🔥 **High Calories** - When > 600 kcal
- 🧂 **High Sodium** - When > 800 mg
- 🍬 **High Sugar** - When > 20 g

### D. Bookmark System
- Save items to localStorage
- View saved items in modal
- Remove bookmarks easily
- Persistent across sessions

### E. Mobile-First UI
- Glassmorphism design
- Large tap targets
- Smooth animations
- Readable in sunlight

## 📊 Nutrition Database

The app includes 10 fast-food items:

1. Classic Burger (520 kcal)
2. French Fries (365 kcal)
3. Fried Chicken (430 kcal)
4. Cola Drink (140 kcal)
5. Ice Cream Sundae (330 kcal)
6. Milk Tea (380 kcal)
7. Chicken Wrap (450 kcal)
8. Hot Dog (290 kcal)
9. Glazed Donut (260 kcal)
10. Pizza Slice (285 kcal)

## 🔧 Customization

### Adding New Food Items

Edit `data/nutrition.json`:

```json
{
  "new-item": {
    "name": "Item Name",
    "serving": "1 serving (100 g)",
    "calories": 300,
    "protein_g": 15,
    "fat_g": 10,
    "carbs_g": 35,
    "sugar_g": 5,
    "sodium_mg": 500
  }
}
```

### Creating Custom Markers

1. Take high-quality photos of packaging
2. Use MindAR Compiler: https://hiukim.github.io/mind-ar-js-doc/tools/compile
3. Upload images and download `.mind` file
4. Update `app.js` line 63 with new marker file path

### Adjusting Warning Thresholds

Edit `app.js` in the `updateWarnings()` function:

```javascript
if (calories > 600) { /* Your threshold */ }
if (sodium > 800) { /* Your threshold */ }
if (sugar > 20) { /* Your threshold */ }
```

## 🌐 Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome (Android) | 89+ | ✅ Full |
| Safari (iOS) | 14+ | ✅ Full |
| Firefox Mobile | 90+ | ⚠️ Limited |
| Samsung Internet | 14+ | ✅ Full |

**Note:** HTTPS is required for camera access in production.

## 🐛 Troubleshooting

### Camera Not Working
- Check browser permissions
- Ensure HTTPS (or localhost)
- Try different browser

### Markers Not Detected
- Ensure good lighting
- Print markers at least 10cm wide
- Keep marker flat and steady
- Avoid reflective surfaces

### Panel Not Showing
- Check console for errors
- Verify nutrition.json is loaded
- Ensure marker ID matches data key

## 📝 Development Notes

### Code Structure

- **app.js** - Main application logic
  - `init()` - Initialize app and MindAR
  - `loadNutritionData()` - Fetch JSON data
  - `initMindAR()` - Setup AR tracking
  - `showNutritionPanel()` - Display nutrition info
  - `updateNutritionDisplay()` - Calculate portions
  - `updateWarnings()` - Check thresholds
  - `toggleBookmark()` - Save/remove bookmarks

### LocalStorage Keys

- `nutritionBookmarks` - Array of saved food items

### Performance

- Lightweight (~50KB total)
- No external dependencies beyond MindAR
- Optimized for mobile devices
- Minimal battery impact

## 🚀 Future Enhancements

- [ ] Multi-language support
- [ ] More food items
- [ ] Barcode scanning
- [ ] Daily intake tracker
- [ ] Share functionality
- [ ] Offline mode with PWA
- [ ] Recipe suggestions

## 📄 License

MIT License - Feel free to use and modify!

## 👨‍💻 Author

Built with ❤️ for healthier food choices

## 🙏 Credits

- **MindAR** by HiuKim Yuen
- **Three.js** by Mr.doob
- Nutrition data from USDA FoodData Central

## 📞 Support

For issues or questions:
- Check browser console for errors
- Verify camera permissions
- Ensure proper lighting for markers
- Test with default MindAR markers first

---

**Made with passion for AR and healthy living! 🍎**
