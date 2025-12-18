/**
 * Loading State Manager for NutriScan AR
 * Manages loading indicators and progress
 */

class LoadingManager {
  static overlay = null;
  static currentState = 'init';
  
  static states = {
    'init': { text: 'Menginisialisasi aplikasi...', progress: 10 },
    'camera': { text: 'Meminta izin kamera...', progress: 30 },
    'ar': { text: 'Memuat AR Engine...', progress: 50 },
    'data': { text: 'Memuat data nutrisi...', progress: 70 },
    'markers': { text: 'Menyiapkan marker detection...', progress: 85 },
    'ready': { text: 'Siap untuk scan!', progress: 100 }
  };

  /**
   * Initialize loading overlay
   */
  static init() {
    if (this.overlay) return;
    
    this.overlay = document.createElement('div');
    this.overlay.id = 'loading-overlay';
    this.overlay.className = 'loading-overlay';
    this.overlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">Memuat NutriScan AR</p>
        <div class="loading-progress-bar">
          <div class="loading-progress-fill" id="loading-progress"></div>
        </div>
        <p class="loading-subtext" id="loading-status">Menginisialisasi...</p>
      </div>
    `;
    
    document.body.appendChild(this.overlay);
  }

  /**
   * Update loading state
   */
  static updateState(state) {
    if (!this.overlay) this.init();
    
    this.currentState = state;
    const stateData = this.states[state];
    
    if (!stateData) {
      console.warn(`Unknown loading state: ${state}`);
      return;
    }
    
    // Update text
    const statusEl = document.getElementById('loading-status');
    if (statusEl) {
      statusEl.textContent = stateData.text;
    }
    
    // Update progress bar
    const progressEl = document.getElementById('loading-progress');
    if (progressEl) {
      progressEl.style.width = `${stateData.progress}%`;
    }
    
    console.log(`⏳ Loading: ${stateData.text} (${stateData.progress}%)`);
  }

  /**
   * Show loading
   */
  static show() {
    if (!this.overlay) this.init();
    this.overlay.classList.remove('hidden');
  }

  /**
   * Hide loading with animation
   */
  static hide(delay = 500) {
    if (!this.overlay) return;
    
    setTimeout(() => {
      this.overlay.classList.add('fade-out');
      
      setTimeout(() => {
        this.overlay.classList.add('hidden');
        this.overlay.classList.remove('fade-out');
      }, 500);
    }, delay);
  }

  /**
   * Set custom message
   */
  static setMessage(message, progress = null) {
    const statusEl = document.getElementById('loading-status');
    if (statusEl) {
      statusEl.textContent = message;
    }
    
    if (progress !== null) {
      const progressEl = document.getElementById('loading-progress');
      if (progressEl) {
        progressEl.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      }
    }
  }

  /**
   * Show error in loading screen
   */
  static showError(message) {
    if (!this.overlay) return;
    
    const content = this.overlay.querySelector('.loading-content');
    if (content) {
      content.innerHTML = `
        <div class="loading-error-icon">⚠️</div>
        <p class="loading-error-title">Gagal Memuat</p>
        <p class="loading-error-message">${ErrorHandler.escapeHtml(message)}</p>
        <button class="loading-retry-btn" onclick="location.reload()">
          🔄 Coba Lagi
        </button>
      `;
    }
  }
}

// Make available globally
window.LoadingManager = LoadingManager;
