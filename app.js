// Global variables
let nutritionData = {};
let currentFood = null;
let currentPortion = 1.0;
let baseNutrition = {};
let mindarThree = null;

// DOM Elements
const nutritionPanel = document.getElementById("nutrition-panel");
const scanningHint = document.getElementById("scanning-hint");
const portionSlider = document.getElementById("portion-slider");
const portionValue = document.getElementById("portion-value");
const bookmarkBtn = document.getElementById("bookmark-btn");
const bookmarkListBtn = document.getElementById("bookmark-list-btn");
const bookmarksModal = document.getElementById("bookmarks-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const bookmarksList = document.getElementById("bookmarks-list");

// Initialize app
async function init() {
  try {
    // Check if running in secure context (HTTPS or localhost)
    if (!window.isSecureContext) {
      showError("AR requires HTTPS. Please use a secure connection.");
      return;
    }

    // Check browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showError(
        "Your browser does not support camera access. Please use Chrome or Safari."
      );
      return;
    }

    // Request camera permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      // Stop the stream immediately, MindAR will request it again
      stream.getTracks().forEach((track) => track.stop());
      console.log("Camera permission granted");
    } catch (permError) {
      console.error("Camera permission error:", permError);
      showError(
        "Camera permission denied. Please allow camera access in your browser settings and reload the page."
      );
      return;
    }

    // Load nutrition data
    await loadNutritionData();

    // Initialize MindAR
    await initMindAR();

    // Setup event listeners
    setupEventListeners();

    // Load bookmarks
    loadBookmarks();

    console.log("App initialized successfully");
  } catch (error) {
    console.error("Initialization error:", error);
    showError("Failed to initialize AR: " + error.message);
  }
}

// Show error message
function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(244, 67, 54, 0.95);
        color: white;
        padding: 30px;
        border-radius: 16px;
        max-width: 90%;
        width: 400px;
        text-align: center;
        z-index: 10000;
        font-size: 1rem;
        line-height: 1.5;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    `;
  errorDiv.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 15px;">⚠️</div>
        <div style="font-weight: 600; margin-bottom: 10px;">AR Initialization Failed</div>
        <div style="font-size: 0.9rem; opacity: 0.95;">${message}</div>
        <button onclick="location.reload()" style="
            margin-top: 20px;
            padding: 12px 24px;
            background: white;
            color: #F44336;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
        ">Reload Page</button>
    `;
  document.body.appendChild(errorDiv);
}

// Load nutrition data from JSON
async function loadNutritionData() {
  try {
    const response = await fetch("data/nutrition.json");
    nutritionData = await response.json();
    console.log(
      "Nutrition data loaded:",
      Object.keys(nutritionData).length,
      "items"
    );
  } catch (error) {
    console.error("Error loading nutrition data:", error);
    // Fallback data
    nutritionData = {
      burger: {
        name: "Classic Burger",
        serving: "1 burger (200 g)",
        calories: 520,
        protein_g: 22,
        fat_g: 30,
        carbs_g: 40,
        sugar_g: 8,
        sodium_mg: 950,
      },
    };
  }
}

// Initialize MindAR with Three.js
async function initMindAR() {
  const container = document.getElementById("ar-container");

  try {
    mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: container,
      imageTargetSrc:
        "https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.2/examples/image-tracking/assets/card-example/card.mind",
      maxTrack: 3,
      uiLoading: "yes",
      uiScanning: "yes",
      uiError: "yes",
    });

    const { renderer, scene, camera } = mindarThree;

    // Start AR with error handling
    await mindarThree.start();
    console.log("MindAR started successfully");
  } catch (error) {
    console.error("MindAR initialization failed:", error);
    throw new Error(
      "Failed to start AR camera. Please ensure camera permissions are granted and try again."
    );
  }

  // Setup target tracking (using 3 targets for demo)
  const targets = ["burger", "fries", "soda"];

  targets.forEach((targetId, index) => {
    const anchor = mindarThree.addAnchor(index);

    // On target found
    anchor.onTargetFound = () => {
      console.log(`Target found: ${targetId}`);
      showNutritionPanel(targetId);
    };

    // On target lost
    anchor.onTargetLost = () => {
      console.log(`Target lost: ${targetId}`);
      hideNutritionPanel();
    };
  });

  // Animation loop
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}

// Show nutrition panel
function showNutritionPanel(foodId) {
  if (!nutritionData[foodId]) {
    console.warn(`No nutrition data for: ${foodId}`);
    return;
  }

  currentFood = foodId;
  baseNutrition = nutritionData[foodId];
  currentPortion = 1.0;

  // Hide scanning hint
  scanningHint.style.display = "none";

  // Update UI
  updateNutritionDisplay();

  // Check if bookmarked
  updateBookmarkButton();

  // Show panel with animation
  nutritionPanel.classList.remove("hidden");
}

// Hide nutrition panel
function hideNutritionPanel() {
  nutritionPanel.classList.add("hidden");
  scanningHint.style.display = "block";
  currentFood = null;
}

// Update nutrition display
function updateNutritionDisplay() {
  if (!currentFood || !baseNutrition) return;

  // Calculate values with portion multiplier
  const calories = Math.round(baseNutrition.calories * currentPortion);
  const protein = (baseNutrition.protein_g * currentPortion).toFixed(1);
  const carbs = (baseNutrition.carbs_g * currentPortion).toFixed(1);
  const fat = (baseNutrition.fat_g * currentPortion).toFixed(1);
  const sugar = (baseNutrition.sugar_g * currentPortion).toFixed(1);
  const sodium = Math.round(baseNutrition.sodium_mg * currentPortion);

  // Update DOM
  document.getElementById("food-name").textContent = baseNutrition.name;
  document.getElementById("food-serving").textContent = baseNutrition.serving;
  document.getElementById("calories-value").textContent = calories;
  document.getElementById("protein-value").textContent = protein + " g";
  document.getElementById("carbs-value").textContent = carbs + " g";
  document.getElementById("fat-value").textContent = fat + " g";
  document.getElementById("sugar-value").textContent = sugar + " g";
  document.getElementById("sodium-value").textContent = sodium + " mg";
  document.getElementById("portion-value").textContent =
    currentPortion.toFixed(1) + "x";

  // Update warnings
  updateWarnings(calories, sodium, sugar);
}

// Update warning badges
function updateWarnings(calories, sodium, sugar) {
  const warningBadges = document.getElementById("warning-badges");
  warningBadges.innerHTML = "";

  const warnings = [];

  if (calories > 600) {
    warnings.push({ type: "high-calories", text: "⚠️ High Calories" });
  }
  if (sodium > 800) {
    warnings.push({ type: "high-sodium", text: "🧂 High Sodium" });
  }
  if (sugar > 20) {
    warnings.push({ type: "high-sugar", text: "🍬 High Sugar" });
  }

  warnings.forEach((warning) => {
    const badge = document.createElement("span");
    badge.className = `warning-badge ${warning.type}`;
    badge.textContent = warning.text;
    warningBadges.appendChild(badge);
  });
}

// Setup event listeners
function setupEventListeners() {
  // Portion slider
  portionSlider.addEventListener("input", (e) => {
    currentPortion = parseFloat(e.target.value);
    updateNutritionDisplay();
  });

  // Bookmark button
  bookmarkBtn.addEventListener("click", toggleBookmark);

  // Bookmark list button
  bookmarkListBtn.addEventListener("click", () => {
    bookmarksModal.classList.remove("hidden");
    renderBookmarks();
  });

  // Close modal
  closeModalBtn.addEventListener("click", () => {
    bookmarksModal.classList.add("hidden");
  });

  // Close modal on background click
  bookmarksModal.addEventListener("click", (e) => {
    if (e.target === bookmarksModal) {
      bookmarksModal.classList.add("hidden");
    }
  });
}

// Toggle bookmark
function toggleBookmark() {
  if (!currentFood) return;

  let bookmarks = getSavedBookmarks();
  const index = bookmarks.findIndex((item) => item.id === currentFood);

  if (index > -1) {
    // Remove bookmark
    bookmarks.splice(index, 1);
    showToast("Removed from bookmarks");
  } else {
    // Add bookmark
    bookmarks.push({
      id: currentFood,
      name: baseNutrition.name,
      calories: baseNutrition.calories,
      timestamp: Date.now(),
    });
    showToast("Added to bookmarks");
  }

  saveBookmarks(bookmarks);
  updateBookmarkButton();
}

// Update bookmark button appearance
function updateBookmarkButton() {
  if (!currentFood) return;

  const bookmarks = getSavedBookmarks();
  const isBookmarked = bookmarks.some((item) => item.id === currentFood);

  if (isBookmarked) {
    bookmarkBtn.classList.add("bookmarked");
  } else {
    bookmarkBtn.classList.remove("bookmarked");
  }
}

// Get saved bookmarks from localStorage
function getSavedBookmarks() {
  try {
    const saved = localStorage.getItem("nutritionBookmarks");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error reading bookmarks:", error);
    return [];
  }
}

// Save bookmarks to localStorage
function saveBookmarks(bookmarks) {
  try {
    localStorage.setItem("nutritionBookmarks", JSON.stringify(bookmarks));
  } catch (error) {
    console.error("Error saving bookmarks:", error);
  }
}

// Load and display bookmarks
function loadBookmarks() {
  renderBookmarks();
}

// Render bookmarks in modal
function renderBookmarks() {
  const bookmarks = getSavedBookmarks();

  if (bookmarks.length === 0) {
    bookmarksList.innerHTML = '<p class="empty-message">No saved items yet</p>';
    return;
  }

  bookmarksList.innerHTML = "";

  bookmarks.forEach((bookmark) => {
    const item = document.createElement("div");
    item.className = "bookmark-item";

    item.innerHTML = `
            <div class="bookmark-item-info">
                <h3>${bookmark.name}</h3>
                <p>${bookmark.calories} kcal</p>
            </div>
            <button class="remove-bookmark-btn" data-id="${bookmark.id}">
                🗑️
            </button>
        `;

    // Add remove event
    const removeBtn = item.querySelector(".remove-bookmark-btn");
    removeBtn.addEventListener("click", () => {
      removeBookmark(bookmark.id);
    });

    bookmarksList.appendChild(item);
  });
}

// Remove specific bookmark
function removeBookmark(foodId) {
  let bookmarks = getSavedBookmarks();
  bookmarks = bookmarks.filter((item) => item.id !== foodId);
  saveBookmarks(bookmarks);
  renderBookmarks();
  updateBookmarkButton();
  showToast("Bookmark removed");
}

// Show toast notification
function showToast(message) {
  const toast = document.createElement("div");
  toast.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1000;
        font-size: 0.9rem;
        backdrop-filter: blur(10px);
        animation: slideDown 0.3s ease;
    `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideUp 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Add animation styles
const style = document.createElement("style");
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Start the app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
