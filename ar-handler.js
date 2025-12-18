/**
 * AR Handler untuk NutriScan
 * Mengelola deteksi marker, overlay AR, dan interaksi real-time
 */

class ARHandler {
  constructor() {
    this.markers = {};
    this.detectedMarkers = new Set();
    this.currentDetectedFood = null;
    this.detectionTimeout = null;
    this.isInitialized = false;
  }

  /**
   * Inisialisasi AR Handler
   */
  async init() {
    try {
      console.log("🚀 Menginisialisasi AR Handler...");

      // Tunggu A-Frame dan AR.js dimuat
      await this.waitForARjs();

      // Setup marker listeners
      this.setupMarkerListeners();

      // Setup scene
      this.setupScene();

      this.isInitialized = true;
      console.log("✅ AR Handler berhasil diinisialisasi");

      // Update status UI
      this.updateScanStatus("Arahkan kamera ke marker makanan", "ready");

      return true;
    } catch (error) {
      console.error("❌ Error inisialisasi AR:", error);
      this.updateScanStatus("Gagal memulai AR: " + error.message, "error");
      return false;
    }
  }

  /**
   * Tunggu hingga AR.js dan A-Frame siap
   */
  waitForARjs() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(
          new Error("AR.js tidak dapat dimuat dalam waktu yang ditentukan")
        );
      }, 10000);

      const checkInterval = setInterval(() => {
        const scene = document.querySelector("a-scene");
        if (scene && scene.hasLoaded) {
          clearInterval(checkInterval);
          clearTimeout(timeout);
          resolve();
        }
      }, 100);
    });
  }

  /**
   * Setup listener untuk setiap marker
   */
  setupMarkerListeners() {
    const markerIds = [
      "marker-burger",
      "marker-fries",
      "marker-soda",
      "marker-chicken",
      "marker-pizza",
    ];

    console.log(`🔍 Setting up ${markerIds.length} markers...`);

    markerIds.forEach((markerId) => {
      const marker = document.getElementById(markerId);
      if (!marker) {
        console.warn(`⚠️ Marker ${markerId} tidak ditemukan di DOM`);
        return;
      }

      // Extract food type dari marker ID
      const foodType = markerId.replace("marker-", "");
      this.markers[foodType] = marker;
      console.log(`✅ Marker registered: ${foodType} (${markerId})`);

      // Event: Marker ditemukan
      marker.addEventListener("markerFound", () => {
        console.log(`🎯 ========== MARKER FOUND EVENT ==========`);
        console.log(`✨ Marker ditemukan: ${foodType}`);
        console.log(`========================================`);
        this.onMarkerFound(foodType);
      });

      // Event: Marker hilang
      marker.addEventListener("markerLost", () => {
        console.log(`👋 Marker hilang: ${foodType}`);
        this.onMarkerLost(foodType);
      });
    });

    console.log(`📍 ${Object.keys(this.markers).length} marker telah disetup:`, Object.keys(this.markers));
  }

  /**
   * Setup scene dan kamera
   */
  setupScene() {
    const scene = document.querySelector("a-scene");
    if (!scene) {
      throw new Error("A-Frame scene tidak ditemukan");
    }

    // Optimasi rendering untuk mobile
    scene.setAttribute("renderer", {
      logarithmicDepthBuffer: true,
      precision: "medium",
      antialias: false,
      powerPreference: "default",
    });

    // Event listener untuk loading
    scene.addEventListener("loaded", () => {
      console.log("🎬 A-Frame scene loaded");
    });

    // Event listener untuk error
    scene.addEventListener("renderstart", () => {
      console.log("🎥 AR camera started");
    });
  }

  /**
   * Handler ketika marker ditemukan
   */
  onMarkerFound(foodType) {
    console.log(`🎯 MARKER FOUND: ${foodType}`);
    this.detectedMarkers.add(foodType);

    // Clear timeout sebelumnya
    if (this.detectionTimeout) {
      clearTimeout(this.detectionTimeout);
    }

    // Set marker saat ini sebagai yang terdeteksi
    this.currentDetectedFood = foodType;

    // Update UI status
    this.updateScanStatus(`Marker ${foodType} terdeteksi!`, "detected");

    // Show 3D AR card with animation
    this.show3DCard(foodType);

    // Tampilkan nutrition panel setelah delay kecil (untuk stabilitas)
    this.detectionTimeout = setTimeout(() => {
      if (this.detectedMarkers.has(foodType)) {
        console.log(`📊 Showing nutrition for: ${foodType}`);
        this.showNutritionForFood(foodType);
      }
    }, 300); // Kurangi delay dari 500ms ke 300ms

    // Trigger haptic feedback jika tersedia
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Sembunyikan hint overlay
    this.hideHintOverlay();
  }

  /**
   * Handler ketika marker hilang
   */
  onMarkerLost(foodType) {
    this.detectedMarkers.delete(foodType);

    // Clear timeout jika ada
    if (this.detectionTimeout) {
      clearTimeout(this.detectionTimeout);
    }

    // Hide 3D AR card
    this.hide3DCard(foodType);

    // Jika ini adalah marker yang sedang ditampilkan
    if (this.currentDetectedFood === foodType) {
      // Set timeout untuk hide panel (kasih waktu user untuk track lagi)
      this.detectionTimeout = setTimeout(() => {
        if (!this.detectedMarkers.has(foodType)) {
          this.currentDetectedFood = null;
          this.updateScanStatus("Marker hilang - Arahkan kembali", "scanning");

          // Jika tidak ada marker lain yang terdeteksi, hide panel
          if (this.detectedMarkers.size === 0) {
            this.hideNutritionPanel();
            this.showHintOverlay();
          }
        }
      }, 1500); // Grace period 1.5 detik
    }
  }

  /**
   * Tampilkan nutrition panel untuk makanan tertentu
   */
  showNutritionForFood(foodType) {
    console.log(`📊 Menampilkan nutrition untuk: ${foodType}`);

    // Dispatch event ke app.js
    const event = new CustomEvent("ar-food-detected", {
      detail: { foodType: foodType },
      bubbles: true,
      cancelable: true
    });
    console.log(`🚀 Dispatching event ar-food-detected for ${foodType}`);
    document.dispatchEvent(event);
  }

  /**
   * Sembunyikan nutrition panel
   */
  hideNutritionPanel() {
    const event = new CustomEvent("ar-food-lost");
    document.dispatchEvent(event);
  }

  /**
   * Update status scanning di UI
   */
  updateScanStatus(message, status = "scanning") {
    const statusText = document.getElementById("scan-status-text");
    const statusIndicator = document.querySelector(".status-indicator");

    if (statusText) {
      statusText.textContent = message;
    }

    if (statusIndicator) {
      statusIndicator.className = `status-indicator ${status}`;
    }
  }

  /**
   * Sembunyikan hint overlay
   */
  hideHintOverlay() {
    const hintOverlay = document.getElementById("scanning-hint");
    if (hintOverlay) {
      hintOverlay.style.opacity = "0";
      setTimeout(() => {
        hintOverlay.style.display = "none";
      }, 300);
    }
  }

  /**
   * Tampilkan hint overlay
   */
  showHintOverlay() {
    const hintOverlay = document.getElementById("scanning-hint");
    if (hintOverlay) {
      hintOverlay.style.display = "flex";
      setTimeout(() => {
        hintOverlay.style.opacity = "1";
      }, 10);
    }
  }

  /**
   * Get currently detected markers
   */
  getDetectedMarkers() {
    return Array.from(this.detectedMarkers);
  }

  /**
   * Check if any marker is detected
   */
  isAnyMarkerDetected() {
    return this.detectedMarkers.size > 0;
  }

  /**
   * Show 3D AR card with smooth animation
   */
  show3DCard(foodType) {
    const marker = this.markers[foodType];
    if (!marker) {
      console.warn(`⚠️ Cannot find marker for ${foodType}`);
      return;
    }

    const card = marker.querySelector('.ar-3d-card');
    if (!card) {
      console.warn(`⚠️ Cannot find 3D card for ${foodType}`);
      return;
    }

    console.log(`✨ Showing 3D card for ${foodType}`);
    
    // Set visible and animate opacity
    card.setAttribute('visible', 'true');
    
    // Smooth fade-in animation using A-Frame animation component
    card.setAttribute('animation__fadein', {
      property: 'material.opacity',
      from: 0,
      to: 0.95,
      dur: 500,
      easing: 'easeOutQuad'
    });
    
    // Scale animation for dynamic effect
    card.setAttribute('animation__scalein', {
      property: 'scale',
      from: '0.8 0.8 0.8',
      to: '1 1 1',
      dur: 500,
      easing: 'easeOutBack'
    });
  }

  /**
   * Hide 3D AR card with smooth animation
   */
  hide3DCard(foodType) {
    const marker = this.markers[foodType];
    if (!marker) return;

    const card = marker.querySelector('.ar-3d-card');
    if (!card) return;

    console.log(`👋 Hiding 3D card for ${foodType}`);
    
    // Smooth fade-out animation
    card.setAttribute('animation__fadeout', {
      property: 'material.opacity',
      from: 0.95,
      to: 0,
      dur: 400,
      easing: 'easeInQuad'
    });
    
    // Scale down animation
    card.setAttribute('animation__scaleout', {
      property: 'scale',
      from: '1 1 1',
      to: '0.8 0.8 0.8',
      dur: 400,
      easing: 'easeInBack'
    });
    
    // Hide after animation completes
    setTimeout(() => {
      if (!this.detectedMarkers.has(foodType)) {
        card.setAttribute('visible', 'false');
      }
    }, 400);
  }
}

// Export instance
const arHandler = new ARHandler();
