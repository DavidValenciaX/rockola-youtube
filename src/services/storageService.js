// Storage service to replace angular-local-storage functionality
export const storageService = {
  prefix: 'ls.',

  setItem(key, value) {
    try {
      const prefixedKey = this.prefix + key;
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(prefixedKey, serializedValue);
      return true;
    } catch (error) {
      console.error('Error setting localStorage item:', error);
      return false;
    }
  },

  getItem(key) {
    try {
      const prefixedKey = this.prefix + key;
      const item = localStorage.getItem(prefixedKey);
      if (item === null) return null;
      return JSON.parse(item);
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return null;
    }
  },

  removeItem(key) {
    try {
      const prefixedKey = this.prefix + key;
      localStorage.removeItem(prefixedKey);
      return true;
    } catch (error) {
      console.error('Error removing localStorage item:', error);
      return false;
    }
  },

  clear() {
    try {
      // Only clear items with our prefix
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};