/**
 * Breaking Changes Module
 * 
 * Handles version management, breaking changes data, and filtering logic
 * Provides a clean API for the UI layer to interact with
 */

// Global variables for compatibility with existing code
// These will be initialized by the module and exported
export let VERSIONS = [];
export let VERSION_ORDER = [];
export let MIGRATION_MAP = { sourceToTargets: {}, targetToSources: {} };
export let breakingChanges = [];

// Export utility functions for compatibility with existing code
export function getVersionIndex(version) {
  const index = VERSION_ORDER.indexOf(version);
  if (index === -1) throw new Error(`Unknown version: ${version}`);
  return index;
}

export function isVersionBetween(target, min, max) {
  const targetIdx = getVersionIndex(target);
  const minIdx = getVersionIndex(min);
  const maxIdx = getVersionIndex(max);
  return targetIdx >= minIdx && targetIdx <= maxIdx;
}

const BreakingChangesModule = (function() {
  // Private variables
  let versions = [];
  let versionOrder = [];
  let migrationMap = { sourceToTargets: {}, targetToSources: {} };
  
  // Breaking changes data - will be loaded from the data attribute
  let breakingChangesData = [];

  /**
   * Version Manager - Handles all version-related operations
   */
  const VersionManager = {
    /**
     * Get the index of a version in the ordered version array
     * @param {string} version - The version to find
     * @returns {number} The index of the version
     */
    getVersionIndex(version) {
      const index = versionOrder.indexOf(version);
      if (index === -1) throw new Error(`Unknown version: ${version}`);
      return index;
    },

    /**
     * Check if a version is between two other versions (inclusive)
     * @param {string} target - The version to check
     * @param {string} min - The minimum version
     * @param {string} max - The maximum version
     * @returns {boolean} True if the target is between min and max
     */
    isVersionBetween(target, min, max) {
      const targetIdx = this.getVersionIndex(target);
      const minIdx = this.getVersionIndex(min);
      const maxIdx = this.getVersionIndex(max);
      return targetIdx >= minIdx && targetIdx <= maxIdx;
    },

    /**
     * Get all valid target versions for a given source version
     * @param {string} source - The source version
     * @returns {Array} Array of valid target versions
     */
    getValidTargets(source) {
      return migrationMap.sourceToTargets[source] || [];
    },

    /**
     * Get all valid source versions for a given target version
     * @param {string} target - The target version
     * @returns {Array} Array of valid source versions
     */
    getValidSources(target) {
      return migrationMap.targetToSources[target] || [];
    },

    /**
     * Get all available versions
     * @returns {Array} Array of all versions
     */
    getAllVersions() {
      return versions;
    },

    /**
     * Get the ordered list of versions
     * @returns {Array} Array of versions in order
     */
    getVersionOrder() {
      return versionOrder;
    }
  };

  /**
   * Breaking Changes Manager - Handles breaking changes data and filtering
   */
  const BreakingChangesManager = {
    /**
     * Get all breaking changes
     * @returns {Array} Array of breaking changes
     */
    getBreakingChanges() {
      return breakingChangesData;
    },

    /**
     * Filter breaking changes based on source, target, and components
     * @param {string} source - The source version
     * @param {string} target - The target version
     * @param {Array} selectedComponents - Array of selected component names
     * @returns {Array} Filtered breaking changes
     */
    filterBreakingChanges(source, target, selectedComponents) {
      if (!source || !target || source === target) {
        return [];
      }

      return breakingChangesData.filter(change => {
        // Check if the breaking change applies to this migration path
        const sourceVersionIdx = VersionManager.getVersionIndex(source);
        const targetVersionIdx = VersionManager.getVersionIndex(target);
        const introducedInIdx = VersionManager.getVersionIndex(change.introducedIn);
        
        // A breaking change applies if:
        // 1. The breaking change was introduced in a version that is between source and target (inclusive of target)
        // 2. The source version is at or after the minimum source version affected
        // 3. The target version is at or before the maximum target version affected
        
        // Handle optional affects field by using defaults if not present
        const minSource = change.affects && change.affects.minSource ? change.affects.minSource : versions[0]; // Default to oldest version
        const maxTarget = change.affects && change.affects.maxTarget ? change.affects.maxTarget : versions[versions.length - 1]; // Default to newest version
        
        const versionMatch = 
          introducedInIdx <= targetVersionIdx && // Breaking change was introduced at or before target
          introducedInIdx > sourceVersionIdx && // Breaking change was introduced after source
          sourceVersionIdx < targetVersionIdx && // Valid migration path (source before target)
          sourceVersionIdx >= VersionManager.getVersionIndex(minSource) && // Source is affected
          targetVersionIdx <= VersionManager.getVersionIndex(maxTarget); // Target is affected
        
        // For component filtering:
        // - Always include changes with empty comp array (default/data components)
        // - Only include dashboard components if the checkbox is checked
        const componentMatch = 
          change.comp.length === 0 || // Include changes with no specific component (default/data)
          change.comp.some(comp => selectedComponents.includes(comp)); // Include if any component matches
        
        return versionMatch && componentMatch;
      });
    },

    /**
     * Get all unique components from breaking changes
     * @returns {Array} Array of unique component names
     */
    getUniqueComponents() {
      const components = new Set();
      breakingChangesData.forEach(change => {
        change.comp.forEach(comp => components.add(comp));
      });
      return Array.from(components);
    }
  };

  /**
   * Initialize the module with migration data
   * @param {Array} migrationPaths - Array of migration paths from YAML
   */
  function initialize(migrationPaths) {
    // Get the migration data element
    const migrationDataElement = document.getElementById('migration-data');
    
    if (!migrationDataElement) {
      console.error('Migration data element not found');
      return;
    }
    
    // Load breaking changes data if available
    if (migrationDataElement.dataset.breakingChanges) {
      try {
        breakingChangesData = JSON.parse(migrationDataElement.dataset.breakingChanges);
        console.log('Loaded breaking changes data:', breakingChangesData.length);
      } catch (error) {
        console.error('Failed to parse breaking changes data:', error);
        breakingChangesData = [];
      }
    } else {
      console.error('Breaking changes data not found in migration-data element');
      breakingChangesData = [];
    }
    try {
      // Transform the data structure from YAML format to the expected JavaScript object format
      const validMigrations = migrationPaths.reduce((acc, path) => {
        acc[path.source] = path.targets;
        return acc;
      }, {});
      
      // Extract unique versions
      versions = extractUniqueVersions(validMigrations);
      
      // Generate migration maps
      migrationMap = {
        sourceToTargets: validMigrations,
        targetToSources: generateReverseMigrationMap(validMigrations)
      };
      
      // Determine version ordering
      versionOrder = determineVersionOrder(versions, migrationMap);
      
      // Update global variables for compatibility with existing code
      VERSIONS = [...versions];
      VERSION_ORDER = [...versionOrder];
      MIGRATION_MAP = {
        sourceToTargets: {...migrationMap.sourceToTargets},
        targetToSources: {...migrationMap.targetToSources}
      };
      breakingChanges = [...breakingChangesData];
      
      console.log('Initialized version order:', versionOrder);
    } catch (error) {
      console.error('Failed to initialize migration data:', error);
      // Fallback to empty arrays if initialization fails
      versions = [];
      versionOrder = [];
      migrationMap = { sourceToTargets: {}, targetToSources: {} };
    }
  }

  /**
   * Extract all unique versions from migration paths
   * @param {Object} migrationsMap - Map of source versions to target versions
   * @returns {Array} Array of unique versions
   */
  function extractUniqueVersions(migrationsMap) {
    const versionsSet = new Set();
    
    // Add all sources
    Object.keys(migrationsMap).forEach(source => {
      versionsSet.add(source);
    });
    
    // Add all targets
    Object.values(migrationsMap).forEach(targets => {
      targets.forEach(target => {
        versionsSet.add(target);
      });
    });
    
    return Array.from(versionsSet).sort();
  }

  /**
   * Generate a reverse mapping from target versions to source versions
   * @param {Object} forwardMap - Map of source versions to target versions
   * @returns {Object} Map of target versions to source versions
   */
  function generateReverseMigrationMap(forwardMap) {
    const reverseMap = {};
    
    Object.entries(forwardMap).forEach(([source, targets]) => {
      targets.forEach(target => {
        if (!reverseMap[target]) {
          reverseMap[target] = [];
        }
        reverseMap[target].push(source);
      });
    });
    
    return reverseMap;
  }

  /**
   * Determine the order of versions based on migration paths
   * @param {Array} versions - Array of all versions
   * @param {Object} migrationMap - Map of source versions to target versions and vice versa
   * @returns {Array} Ordered array of versions
   */
  function determineVersionOrder(versions, migrationMap) {
    // Start with a copy of all versions
    const remainingVersions = [...versions];
    const orderedVersions = [];
    
    // First, find versions that are only sources (not targets)
    // These are the oldest versions
    const onlySources = versions.filter(v => 
      !Object.values(migrationMap.targetToSources).flat().includes(v) && 
      migrationMap.sourceToTargets[v]
    );
    
    // Add oldest versions first
    onlySources.forEach(v => {
      orderedVersions.push(v);
      const index = remainingVersions.indexOf(v);
      if (index !== -1) remainingVersions.splice(index, 1);
    });
    
    // Then add the rest based on migration paths
    while (remainingVersions.length > 0) {
      let added = false;
      
      for (let i = 0; i < remainingVersions.length; i++) {
        const version = remainingVersions[i];
        const sources = migrationMap.targetToSources[version] || [];
        
        // If all sources of this version are already in orderedVersions,
        // we can add this version next
        if (sources.every(s => orderedVersions.includes(s))) {
          orderedVersions.push(version);
          remainingVersions.splice(i, 1);
          added = true;
          break;
        }
      }
      
      // If we couldn't add any version in this pass, there might be a cycle
      // Just add the first remaining version to break the cycle
      if (!added && remainingVersions.length > 0) {
        orderedVersions.push(remainingVersions[0]);
        remainingVersions.splice(0, 1);
      }
    }
    
    return orderedVersions;
  }

  // Public API
  return {
    initialize,
    VersionManager,
    BreakingChangesManager
  };
})();

// Export for ES modules
export default BreakingChangesModule;
