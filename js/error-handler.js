/**
 * Comprehensive Error Handler for NutriScan AR
 * Handles all error types with user-friendly messages
 */

class ErrorHandler {
  static errorContainer = null;

  /**
   * Main error handling function
   */
  static handle(error, context = '') {
    console.error(`❌ Error in ${context}:`, error);
    
    const userMessage = this.getUserFriendlyMessage(error);
    this.showErrorUI(userMessage, context);
    
    // Log to analytics if available
    this.logToAnalytics(error, context);
    
    return userMessage;
  }

  /**
   * Convert technical errors to user-friendly messages
   */
  static getUserFriendlyMessage(error) {
    // Camera permission errors
    if (error.name === 'NotAllowedError' || error.message?.includes('permission')) {
      return 'Izin kamera ditolak. Mohon izinkan akses kamera di pengaturan browser Anda.';
    }
    
    // Camera not found
    if (error.name === 'NotFoundError') {
      return 'Kamera tidak ditemukan. Pastikan perangkat Anda memiliki kamera.';
    }
    
    // Network errors
    if (error.message?.includes('fetch') || error.message?.includes('network') || error.message?.includes('Failed to fetch')) {
      return 'Koneksi internet bermasalah. Periksa koneksi Anda dan muat ulang halaman.';
    }
    
    // AR.js / Marker errors
    if (error.message?.includes('marker') || error.message?.includes('AR')) {
      return 'Marker tidak dapat dideteksi. Pastikan pencahayaan cukup dan marker tercetak dengan jelas.';
    }
    
    // Data loading errors
    if (error.message?.includes('JSON') || error.message?.includes('parse')) {
      return 'Gagal memuat data nutrisi. Silakan muat ulang halaman.';
    }
    
    // HTTPS/Security errors
    if (error.message?.includes('secure') || error.message?.includes('https')) {
      return 'AR memerlukan koneksi HTTPS. Gunakan URL https://nutriscanid.vercel.app';
    }
    
    // Generic fallback
    return 'Terjadi kesalahan. Silakan muat ulang halaman atau hubungi support.';
  }

  /**
   * Show error UI to user
   */
  static showErrorUI(message, context) {
    // Create or get error container
    if (!this.errorContainer) {
      this.errorContainer = this.createErrorContainer();
    }
    
    this.errorContainer.innerHTML = `
      <div class="error-card">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">Terjadi Kesalahan</h3>
        <p class="error-message">${this.escapeHtml(message)}</p>
        ${context ? `<p class="error-context">Konteks: ${this.escapeHtml(context)}</p>` : ''}
        <div class="error-actions">
          <button class="error-btn primary" onclick="location.reload()">
            🔄 Muat Ulang
          </button>
          <button class="error-btn secondary" onclick="ErrorHandler.dismissError()">
            ✕ Tutup
          </button>
        </div>
      </div>
    `;
    
    this.errorContainer.classList.remove('hidden');
    
    // Auto-dismiss after 10 seconds for non-critical errors
    if (!context.includes('Critical') && !context.includes('Camera')) {
      setTimeout(() => this.dismissError(), 10000);
    }
  }

  /**
   * Create error container element
   */
  static createErrorContainer() {
    const container = document.createElement('div');
    container.id = 'error-container';
    container.className = 'error-container';
    document.body.appendChild(container);
    return container;
  }

  /**
   * Dismiss error UI
   */
  static dismissError() {
    if (this.errorContainer) {
      this.errorContainer.classList.add('hidden');
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Log error to analytics
   */
  static logToAnalytics(error, context) {
    try {
      // Google Analytics 4
      if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
          description: `${context}: ${error.message}`,
          fatal: false
        });
      }
      
      // Console for development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.group('🐛 Error Details');
        console.error('Context:', context);
        console.error('Error:', error);
        console.error('Stack:', error.stack);
        console.groupEnd();
      }
    } catch (e) {
      console.error('Failed to log error to analytics:', e);
    }
  }

  /**
   * Show warning (non-blocking)
   */
  static showWarning(message, duration = 5000) {
    const warning = document.createElement('div');
    warning.className = 'warning-toast';
    warning.innerHTML = `
      <span class="warning-icon">⚠️</span>
      <span class="warning-text">${this.escapeHtml(message)}</span>
    `;
    
    document.body.appendChild(warning);
    
    // Animate in
    setTimeout(() => warning.classList.add('show'), 100);
    
    // Auto dismiss
    setTimeout(() => {
      warning.classList.remove('show');
      setTimeout(() => warning.remove(), 300);
    }, duration);
  }

  /**
   * Show info message
   */
  static showInfo(message, duration = 3000) {
    const info = document.createElement('div');
    info.className = 'info-toast';
    info.innerHTML = `
      <span class="info-icon">ℹ️</span>
      <span class="info-text">${this.escapeHtml(message)}</span>
    `;
    
    document.body.appendChild(info);
    
    setTimeout(() => info.classList.add('show'), 100);
    
    setTimeout(() => {
      info.classList.remove('show');
      setTimeout(() => info.remove(), 300);
    }, duration);
  }
}

// Make available globally
window.ErrorHandler = ErrorHandler;
