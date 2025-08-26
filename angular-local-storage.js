/**
 * Angular Local Storage Module
 * Simplified version for Rockola de YouTube
 */

(function() {
  'use strict';

  angular.module('LocalStorageModule', [])
    .provider('localStorageService', function() {
      
      this.prefix = 'ls';
      this.storageType = 'localStorage';
      this.cookie = {
        expiry: 30,
        path: '/'
      };
      this.notify = {
        setItem: true,
        removeItem: false
      };

      this.setPrefix = function(prefix) {
        this.prefix = prefix;
        return this;
      };

      this.setStorageType = function(storageType) {
        this.storageType = storageType;
        return this;
      };

      this.$get = ['$rootScope', function($rootScope) {
        var prefix = this.prefix;
        var notify = this.notify;
        var storageType = this.storageType;

        // Helper functions
        var isSupported = function(storageType) {
          var supported = storageType in window && window[storageType] !== null;
          if (supported) {
            var key = '___' + Math.round(Math.random() * 1000000) + '___';
            try {
              window[storageType].setItem(key, 'test');
              window[storageType].removeItem(key);
            } catch (e) {
              supported = false;
            }
          }
          return supported;
        };

        var getStorageType = function() {
          var type = null;
          switch (storageType) {
            case 'localStorage':
              type = 'localStorage';
              break;
            case 'sessionStorage':
              type = 'sessionStorage';
              break;
          }
          return type;
        };

        var deriveKey = function(key) {
          return prefix + '.' + key;
        };

        var broadcastItemSet = function(key, newVal, oldVal) {
          if (notify.setItem) {
            $rootScope.$broadcast('LocalStorageModule.notification.setitem', {
              key: key,
              newvalue: newVal,
              oldvalue: oldVal,
              storageType: storageType
            });
          }
        };

        var broadcastItemRemove = function(key, oldVal) {
          if (notify.removeItem) {
            $rootScope.$broadcast('LocalStorageModule.notification.removeitem', {
              key: key,
              oldvalue: oldVal,
              storageType: storageType
            });
          }
        };

        var storage = getStorageType();

        return {
          isSupported: isSupported(storageType),
          
          set: function(key, value) {
            if (!this.isSupported) {
              return false;
            }

            var sKey = deriveKey(key);
            var oldValue = this.get(key);
            
            try {
              if (angular.isObject(value) || angular.isArray(value) || angular.isNumber(+value || value)) {
                value = angular.toJson(value);
              }
              window[storage].setItem(sKey, value);
              broadcastItemSet(key, value, oldValue);
              return true;
            } catch (e) {
              return false;
            }
          },

          get: function(key) {
            if (!this.isSupported) {
              return null;
            }

            var sKey = deriveKey(key);
            var item = window[storage].getItem(sKey);
            
            if (!item || item === 'null') {
              return null;
            }

            if (item.charAt(0) === "{" || item.charAt(0) === "[" || angular.isNumber(+item || item)) {
              try {
                return angular.fromJson(item);
              } catch (e) {
                return item;
              }
            }

            return item;
          },

          keys: function() {
            if (!this.isSupported) {
              return [];
            }

            var prefixLength = prefix.length + 1;
            var keys = [];
            for (var key in window[storage]) {
              if (key.substr(0, prefixLength) === prefix + '.') {
                try {
                  keys.push(key.substr(prefixLength));
                } catch (e) {
                  // Ignore
                }
              }
            }
            return keys;
          },

          remove: function(key) {
            if (!this.isSupported) {
              return false;
            }

            var sKey = deriveKey(key);
            var oldValue = this.get(key);
            
            try {
              window[storage].removeItem(sKey);
              broadcastItemRemove(key, oldValue);
              return true;
            } catch (e) {
              return false;
            }
          },

          clearAll: function() {
            if (!this.isSupported) {
              return false;
            }

            var prefixLength = prefix.length + 1;
            for (var key in window[storage]) {
              if (key.substr(0, prefixLength) === prefix + '.') {
                try {
                  this.remove(key.substr(prefixLength));
                } catch (e) {
                  // Ignore
                }
              }
            }
            return true;
          },

          bind: function($scope, key, def) {
            def = angular.isDefined(def) ? def : null;
            if (!this.get(key)) {
              this.set(key, def);
            }

            $scope[key] = this.get(key);

            $scope.$watch(key, function(newVal) {
              this.set(key, newVal);
            }.bind(this), true);

            $scope.$on('LocalStorageModule.notification.setitem', function(e, parameters) {
              if (parameters.key === key) {
                $scope[key] = parameters.newvalue;
              }
            });

            return this.get(key);
          }
        };
      }.bind(this)];
    });

})();
