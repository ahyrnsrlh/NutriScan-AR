/**
 * Performance Monitor for NutriScan AR
 * Tracks and logs performance metrics
 */

class PerformanceMonitor {
  static metrics = {};
  static measurements = [];

  /**
   * Start measuring an operation
   */
  static startMeasure(name) {
    this.metrics[name] = {
      startTime: performance.now(),
      startMark: `${name}-start`
    };
    
    if (performance.mark) {
      performance.mark(this.metrics[name].startMark);
    }
    
    console.log(`⏱️ Start: ${name}`);
  }

  /**
   * End measuring and log duration
   */
  static endMeasure(name) {
    if (!this.metrics[name]) {
      console.warn(`⚠️ No start measure found for: ${name}`);
      return null;
    }
    
    const duration = performance.now() - this.metrics[name].startTime;
    const endMark = `${name}-end`;
    
    if (performance.mark && performance.measure) {
      performance.mark(endMark);
      try {
        performance.measure(name, this.metrics[name].startMark, endMark);
      } catch (e) {
        console.warn('Performance measure failed:', e);
      }
    }
    
    // Store measurement
    this.measurements.push({
      name,
      duration,
      timestamp: Date.now()
    });
    
    // Log with color coding based on duration
    const emoji = duration < 100 ? '✅' : duration < 500 ? '⚠️' : '🐌';
    console.log(`${emoji} ${name}: ${duration.toFixed(2)}ms`);
    
    // Send to analytics if available
    this.sendToAnalytics(name, duration);
    
    // Cleanup
    delete this.metrics[name];
    
    return duration;
  }

  /**
   * Send performance data to analytics
   */
  static sendToAnalytics(name, duration) {
    try {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
          name: name,
          value: Math.round(duration),
          event_category: 'Performance'
        });
      }
    } catch (e) {
      console.warn('Failed to send performance data to analytics:', e);
    }
  }

  /**
   * Get all measurements
   */
  static getMeasurements() {
    return this.measurements;
  }

  /**
   * Get summary statistics
   */
  static getSummary() {
    if (this.measurements.length === 0) {
      return { count: 0, total: 0, average: 0 };
    }
    
    const total = this.measurements.reduce((sum, m) => sum + m.duration, 0);
    const average = total / this.measurements.length;
    
    return {
      count: this.measurements.length,
      total: total.toFixed(2),
      average: average.toFixed(2),
      measurements: this.measurements
    };
  }

  /**
   * Log summary to console
   */
  static logSummary() {
    const summary = this.getSummary();
    
    if (summary.count === 0) {
      console.log('📊 No performance measurements recorded');
      return;
    }
    
    console.group('📊 Performance Summary');
    console.log(`Total Operations: ${summary.count}`);
    console.log(`Total Time: ${summary.total}ms`);
    console.log(`Average Time: ${summary.average}ms`);
    console.table(summary.measurements);
    console.groupEnd();
  }

  /**
   * Clear all measurements
   */
  static clear() {
    this.metrics = {};
    this.measurements = [];
    console.log('🗑️ Performance measurements cleared');
  }

  /**
   * Monitor page load performance
   */
  static monitorPageLoad() {
    if (!window.performance || !window.performance.timing) {
      console.warn('Performance API not supported');
      return;
    }
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;
        
        console.group('📈 Page Load Performance');
        console.log(`Total Page Load: ${pageLoadTime}ms`);
        console.log(`Server Connect: ${connectTime}ms`);
        console.log(`DOM Render: ${renderTime}ms`);
        console.groupEnd();
        
        // Send to analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'timing_complete', {
            name: 'page_load',
            value: pageLoadTime,
            event_category: 'Performance'
          });
        }
      }, 0);
    });
  }
}

// Initialize page load monitoring
PerformanceMonitor.monitorPageLoad();

// Make available globally
window.PerformanceMonitor = PerformanceMonitor;
