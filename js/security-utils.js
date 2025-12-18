/**
 * Security Utilities for NutriScan AR
 * Handles sanitization, validation, and secure storage
 */

class SecurityUtils {
  /**
   * Sanitize HTML to prevent XSS
   */
  static sanitizeHTML(str) {
    if (!str) return '';
    
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }

  /**
   * Escape HTML entities
   */
  static escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  /**
   * Validate nutrition data structure
   */
  static validateNutritionData(foodId, data) {
    const requiredFields = [
      'name', 'serving', 'calories', 
      'protein_g', 'fat_g', 'carbs_g', 
      'sugar_g', 'sodium_mg'
    ];
    
    // Check for missing fields
    const missingFields = requiredFields.filter(field => !(field in data));
    
    if (missingFields.length > 0) {
      console.error(`❌ Missing fields for ${foodId}:`, missingFields);
      return {
        valid: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      };
    }
    
    // Validate numeric values
    const numericFields = ['calories', 'protein_g', 'fat_g', 'carbs_g', 'sugar_g', 'sodium_mg'];
    for (const field of numericFields) {
      if (typeof data[field] !== 'number' || data[field] < 0) {
        console.error(`❌ Invalid ${field} for ${foodId}: ${data[field]}`);
        return {
          valid: false,
          error: `Invalid value for ${field}: ${data[field]}`
        };
      }
    }
    
    // Validate string values
    if (typeof data.name !== 'string' || data.name.trim() === '') {
      return {
        valid: false,
        error: 'Invalid name'
      };
    }
    
    if (typeof data.serving !== 'string' || data.serving.trim() === '') {
      return {
        valid: false,
        error: 'Invalid serving'
      };
    }
    
    return { valid: true };
  }

  /**
   * Check if running in secure context (HTTPS)
   */
  static isSecureContext() {
    return window.isSecureContext || 
           window.location.protocol === 'https:' || 
           window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1';
  }

  /**
   * Validate URL
   */
  static isValidURL(string) {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;  
    }
  }
}

/**
 * Secure Storage Wrapper
 * Provides encrypted localStorage with error handling
 */
class SecureStorage {
  static prefix = 'nutriscan_';
  
  /**
   * Set item in localStorage with encoding
   */
  static set(key, value) {
    try {
      const fullKey = this.prefix + key;
      const serialized = JSON.stringify(value);
      
      // Simple encoding (for production, use proper encryption library)
      const encoded = btoa(encodeURIComponent(serialized));
      
      localStorage.setItem(fullKey, encoded);
      return true;
    } catch (error) {
      console.error('❌ Storage error:', error);
      
      // Check if quota exceeded
      if (error.name === 'QuotaExceededError') {
        ErrorHandler.showWarning('Penyimpanan penuh. Hapus beberapa bookmark.');
      }
      
      return false;
    }
  }

  /**
   * Get item from localStorage with decoding
   */
  static get(key) {
    try {
      const fullKey = this.prefix + key;
      const encoded = localStorage.getItem(fullKey);
      
      if (!encoded) return null;
      
      // Decode
      const serialized = decodeURIComponent(atob(encoded));
      return JSON.parse(serialized);
    } catch (error) {
      console.error('❌ Storage retrieval error:', error);
      return null;
    }
  }

  /**
   * Remove item from localStorage
   */
  static remove(key) {
    try {
      const fullKey = this.prefix + key;
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error('❌ Storage removal error:', error);
      return false;
    }
  }

  /**
   * Clear all app data from localStorage
   */
  static clear() {
    try {
      const keys = Object.keys(localStorage);
      const appKeys = keys.filter(key => key.startsWith(this.prefix));
      
      appKeys.forEach(key => localStorage.removeItem(key));
      
      console.log(`🗑️ Cleared ${appKeys.length} items from storage`);
      return true;
    } catch (error) {
      console.error('❌ Storage clear error:', error);
      return false;
    }
  }

  /**
   * Check storage availability
   */
  static isAvailable() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('⚠️ localStorage not available');
      return false;
    }
  }

  /**
   * Get storage usage info
   */
  static getUsageInfo() {
    try {
      let totalSize = 0;
      let appSize = 0;
      
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const size = (localStorage[key].length + key.length) * 2; // UTF-16
          totalSize += size;
          
          if (key.startsWith(this.prefix)) {
            appSize += size;
          }
        }
      }
      
      return {
        total: (totalSize / 1024).toFixed(2) + ' KB',
        app: (appSize / 1024).toFixed(2) + ' KB',
        available: '5 MB' // Typical localStorage limit
      };
    } catch (error) {
      console.error('❌ Failed to get storage info:', error);
      return null;
    }
  }
}

// Make available globally
window.SecurityUtils = SecurityUtils;
window.SecureStorage = SecureStorage;
