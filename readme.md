## **PROMPT:**

You are an expert full-stack developer, AR/WebXR engineer, and UI/UX designer.
Your task is to build a complete **Web AR application** called:

# **📌 Project Name: AR Info Gizi Makanan Cepat Saji**

The goal of this project is to allow users to scan fast-food packaging or special marker images and see **nutritional information** appear as a floating **AR overlay**, using web-based AR (MindAR or AR.js).

---

# **🎯 OBJECTIVE**

Build a complete, clean, documented, and mobile-friendly **Web-based AR application** that provides:

1. **Marker/Image Tracking (MindAR or AR.js)**
2. **AR Nutrition Overlay UI** (HTML/CSS overlay or 3D UI)
3. **Nutrition Database** stored in local JSON
4. **Dynamic portion control** (0.5x – 2x)
5. **Highlight warnings** (e.g., high sodium, high sugar)
6. **Bookmark feature** stored in localStorage
7. **Simple UI/UX for mobile browsers (Android/iOS)**

---

# **🛠️ TECHNOLOGY REQUIREMENTS**

Use the following technologies:

* **MindAR Image Tracking** (preferred)
  OR AR.js if necessary.
* **Three.js** (only for 3D icons if needed)
* **Vanilla JS, HTML, CSS**
* Project must run on:

  * Chrome Android
  * Safari iOS
  * Without installing any app (pure WebAR)

No backend required.
All data stored in JSON + localStorage.

---

# **📂 PROJECT STRUCTURE**

Generate the project with this folder structure:

```
/ar-nutrition/
  index.html
  app.js
  style.css
  /assets/
    markers/
      burger-marker.png
      fries-marker.png
      soda-marker.png
    icons/
      calories.svg
      protein.svg
      carbs.svg
      fat.svg
      sodium.svg
      sugar.svg
  /data/
    nutrition.json
  /libs/
    mindar-image.min.js
    mindar-image-three.min.js
    three.min.js
```

---

# **📄 FILE REQUIREMENTS**

## 1️⃣ index.html

Must include:

* MindAR setup
* Camera tracking
* Marker definitions
* Overlay UI container
* Nutrition panel
* Portion slider
* Bookmark button

## 2️⃣ app.js

Implement:

### ✔ Load JSON nutrition data

### ✔ Detect marker → show correct data

### ✔ Portion calculation formula

### ✔ Warning labels (high sodium, sugar, calories)

### ✔ localStorage bookmark handling

### ✔ Hide UI when marker lost

## 3️⃣ nutrition.json

Include at least **10 fast food menu items** such as:

* Classic Burger
* Fries
* Fried Chicken
* Cola Drink
* Ice Cream Sundae
* Milk Tea
* Chicken Wrap
* Hotdog
* Donut
* Pizza Slice

Format example:

```json
{
  "burger": {
    "name": "Classic Burger",
    "serving": "1 burger (200 g)",
    "calories": 520,
    "protein_g": 22,
    "fat_g": 30,
    "carbs_g": 40,
    "sugar_g": 8,
    "sodium_mg": 950,
    "warning": "High Sodium"
  }
}
```

## 4️⃣ style.css

Mobile-first UI:

* Rounded card panels
* Semi-transparent (glassmorphism)
* Large tap targets
* Smooth animations
* Icons inline with text

---

# **✨ FEATURES TO IMPLEMENT**

## **A. Marker Detection**

When marker is found:

* Load item ID (matching marker name)
* Fetch nutrition from JSON
* Show AR overlay panel
* Hide when lost

## **B. Portion Slider**

Range: **0.5 – 2.0**
Updates all values dynamically:

```
displayValue = baseValue * portionMultiplier
```

## **C. Automatic Warnings**

If:

* calories > 600 → label: "⚠️ High Calories"
* sodium_mg > 800 → label: "🧂 High Sodium"
* sugar_g > 20 → label: "🍬 High Sugar"

## **D. Bookmark**

Store saved items in localStorage:

```
localStorage.setItem("savedItems", JSON.stringify([...]))
```

## **E. Clean and modern UI**

Use:

* Glassmorphism
* Icons
* Big text for calories
* Responsive design

---

# **📱 UX FLOW**

1. User opens web page
2. Camera opens and starts scanning
3. When marker detected → panel slides up
4. User adjusts portion
5. Values update live
6. User can bookmark
7. If marker lost → panel hides

---

# **📦 DELIVERABLES REQUIRED**

Generate **all files** with fully working code:

✔ Complete project folder
✔ Fully working WebAR demo (HTML+JS)
✔ nutrition.json with 10 food items
✔ 3 sample marker images
✔ All UI/UX implemented
✔ All warnings + portion calculations
✔ LocalStorage bookmarks

---

# **🎨 IMPORTANT UI RULES**

* Must be mobile-friendly
* Buttons big and easy to tap
* Use subtle shadows and blur
* AR overlay must not block camera too much
* Values must be readable under sunlight

---

# **💬 OUTPUT FORMAT**

Generate output as:

1. **Folder structure**
2. **Every file content** (index.html, app.js, style.css, nutrition.json, etc.)
3. **Inline explanations** only if needed
4. Do not omit or skip code
5. Code must be complete and runnable

---

# **⚠️ VERY IMPORTANT**

* Do **not** produce pseudo-code
* Do **not** skip details
* Do **not** generate incomplete MindAR setup
* All code must be clean, readable, and correct

---