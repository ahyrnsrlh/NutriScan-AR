# 🍔 AR Nutrition Scanner - NutriScan AR

## Marker Images for Testing

Since custom MindAR marker training requires the MindAR Compiler, this project uses the default MindAR card example for demonstration purposes.

### How to Use Markers:

1. **Download the official MindAR test image:**

   - Visit: https://github.com/hiukim/mind-ar-js/tree/master/examples/image-tracking/assets/card-example
   - Download: `card.png`
   - Or use any printed card/image with sufficient features

2. **Print the marker image** on white paper (A4 or Letter size)

3. **Open the app** in Chrome (Android) or Safari (iOS)

4. **Point your camera** at the printed marker

5. **Nutrition panel will appear** when marker is detected

### Creating Custom Markers:

To create custom markers for burger, fries, and soda:

1. Use real fast-food packaging photos (high contrast, clear features)
2. Visit: https://hiukim.github.io/mind-ar-js-doc/tools/compile
3. Upload your images
4. Download the compiled `.mind` file
5. Update `app.js` line 63 with your `.mind` file path

### Marker Requirements:

- **High contrast** features
- **Non-reflective** surface
- **Clear patterns** (logos, text, images)
- **Minimum size**: 10cm x 10cm when printed
- **Good lighting** conditions

### Sample Marker Ideas:

- McDonald's burger box
- KFC bucket
- Coca-Cola can
- Starbucks cup
- Pizza Hut box

---

**Note:** The app currently uses the default MindAR example markers. Replace with custom trained markers for production use.
