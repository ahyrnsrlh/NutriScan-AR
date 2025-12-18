// Global variables
let nutritionData = {};
let currentFood = null;
let currentPortion = 1.0;
let baseNutrition = {};
let isTracking = false;

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
    console.log("🚀 Memulai NutriScan AR Production...");
    
    // Show loading
    LoadingManager.show();
    LoadingManager.updateState('init');

    // Check if running in secure context (HTTPS or localhost)
    if (!SecurityUtils.isSecureContext()) {
      throw new Error("AR memerlukan HTTPS. Gunakan https://nutriscanid.vercel.app");
    }

    // Check browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Browser tidak mendukung akses kamera. Gunakan Chrome atau Safari.");
    }

    // Load nutrition data
    LoadingManager.updateState('data');
    PerformanceMonitor.startMeasure('nutrition_data_load');
    await loadNutritionData();
    PerformanceMonitor.endMeasure('nutrition_data_load');
    console.log("✅ Data nutrisi dimuat");

    // Initialize AR Handler
    LoadingManager.updateState('ar');
    PerformanceMonitor.startMeasure('ar_initialization');
    const arInitialized = await arHandler.init();
    PerformanceMonitor.endMeasure('ar_initialization');
    
    if (!arInitialized) {
      throw new Error("AR Handler gagal diinisialisasi");
    }
    console.log("✅ AR Handler siap");

    // Setup event listeners
    LoadingManager.updateState('markers');
    setupEventListeners();
    setupAREventListeners();

    // Load bookmarks
    loadBookmarks();

    // Ready!
    LoadingManager.updateState('ready');
    console.log("✅ Aplikasi berhasil diinisialisasi");
    
    // Hide loading after short delay
    setTimeout(() => {
      LoadingManager.hide();
      ErrorHandler.showInfo("AR siap! Arahkan kamera ke marker makanan", 3000);
    }, 800);
    
    // Log performance summary
    PerformanceMonitor.logSummary();
    
  } catch (error) {
    console.error("❌ Error inisialisasi:", error);
    ErrorHandler.handle(error, "Critical - App Initialization");
    LoadingManager.showError(ErrorHandler.getUserFriendlyMessage(error));
  }
}

/**
 * Setup AR-specific event listeners
 */
function setupAREventListeners() {
  console.log("🎧 Setting up AR event listeners...");
  
  // Listen untuk deteksi marker
  document.addEventListener("ar-food-detected", (event) => {
    console.log(`📊 AR Event Received: ar-food-detected`, event.detail);
    const { foodType } = event.detail;
    console.log(`📊 Processing food detection for: ${foodType}`);
    
    if (!foodType) {
      console.error("❌ foodType is undefined!");
      return;
    }
    
    showNutritionPanel(foodType);
  });

  // Listen untuk marker hilang
  document.addEventListener("ar-food-lost", () => {
    console.log("👋 AR Event: Food lost");
    // Tidak langsung hide panel, biarkan user tetap bisa lihat
    // Panel akan auto-hide jika marker tidak terdeteksi > 3 detik
  });
  
  console.log("✅ AR event listeners setup complete");
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
        <div style="font-weight: 600; margin-bottom: 10px;">Inisialisasi AR Gagal</div>
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
        ">Muat Ulang</button>
    `;
  document.body.appendChild(errorDiv);
}

// Load nutrition data from JSON
async function loadNutritionData() {
  try {
    PerformanceMonitor.startMeasure('fetch_nutrition_data');
    const response = await fetch("data/nutrition.json");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    PerformanceMonitor.endMeasure('fetch_nutrition_data');
    
    // Validate each food item
    PerformanceMonitor.startMeasure('validate_nutrition_data');
    for (const [foodId, foodData] of Object.entries(data)) {
      const validation = SecurityUtils.validateNutritionData(foodId, foodData);
      if (!validation.valid) {
        throw new Error(`Invalid data for ${foodId}: ${validation.error}`);
      }
    }
    PerformanceMonitor.endMeasure('validate_nutrition_data');
    
    nutritionData = data;
    console.log(
      "✅ Nutrition data loaded and validated:",
      Object.keys(nutritionData).length,
      "items"
    );
  } catch (error) {
    console.error("❌ Failed to load nutrition data:", error);
    ErrorHandler.handle(error, "Data Loading");
    
    // Fallback data
    console.warn("⚠️ Using fallback nutrition data");
    nutritionData = {
      burger: {
        name: "Burger Klasik",
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

// AR.js menghandle kamera otomatis, tidak perlu manual setup lagi

// Show nutrition panel
function showNutritionPanel(foodId) {
  console.log(`🍔 showNutritionPanel called with foodId: ${foodId}`);
  console.log(`📊 Available nutrition data:`, Object.keys(nutritionData));
  
  if (!nutritionData[foodId]) {
    console.warn(`❌ No nutrition data for: ${foodId}`);
    console.warn(`Available foods:`, Object.keys(nutritionData));
    showToast(`Data untuk ${foodId} tidak ditemukan`, "error");
    return;
  }

  currentFood = foodId;
  baseNutrition = nutritionData[foodId];
  currentPortion = 1.0;

  console.log(`✅ Setting current food:`, baseNutrition);

  // Hide scanning hint
  if (scanningHint) {
    scanningHint.style.display = "none";
  }

  // Update UI
  updateNutritionDisplay();

  // Check if bookmarked
  updateBookmarkButton();

  // Show panel with animation
  if (nutritionPanel) {
    nutritionPanel.classList.remove("hidden");
    console.log(`✅ Nutrition panel shown`);
  } else {
    console.error(`❌ nutritionPanel element not found!`);
  }
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
    warnings.push({ type: "high-calories", text: "⚠️ Kalori Tinggi" });
  }
  if (sodium > 800) {
    warnings.push({ type: "high-sodium", text: "🧂 Natrium Tinggi" });
  }
  if (sugar > 20) {
    warnings.push({ type: "high-sugar", text: "🍬 Gula Tinggi" });
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
  // DEBUG: Test button untuk simulasi marker detection
  const testBtn = document.getElementById("test-btn");
  if (testBtn) {
    testBtn.addEventListener("click", () => {
      console.log("🧪 TEST BUTTON CLICKED - Simulating burger detection");
      showNutritionPanel("burger");
    });
  }
  
  // Portion slider
  portionSlider.addEventListener("input", (e) => {
    currentPortion = parseFloat(e.target.value);
    updateNutritionDisplay();
  });

  // Bookmark button
  bookmarkBtn.addEventListener("click", toggleBookmark);

  // Close panel button
  const closePanelBtn = document.getElementById("close-panel-btn");
  if (closePanelBtn) {
    closePanelBtn.addEventListener("click", hideNutritionPanel);
  }

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
    showToast("Dihapus dari tersimpan");
  } else {
    // Add bookmark
    bookmarks.push({
      id: currentFood,
      name: baseNutrition.name,
      calories: baseNutrition.calories,
      timestamp: Date.now(),
    });
    showToast("Ditambahkan ke tersimpan");
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
    SecureStorage.set("bookmarks", bookmarks);
    console.log("✅ Bookmarks saved securely");
  } catch (error) {
    console.error("❌ Error saving bookmarks:", error);
    ErrorHandler.showWarning("Gagal menyimpan bookmark");
  }
}

// Get saved bookmarks
function getSavedBookmarks() {
  try {
    const bookmarks = SecureStorage.get("bookmarks");
    return bookmarks || [];
  } catch (error) {
    console.error("❌ Error loading bookmarks:", error);
    return [];
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
    bookmarksList.innerHTML =
      '<p class="empty-message">Belum ada item tersimpan</p>';
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
  showToast("Dihapus dari tersimpan");
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
