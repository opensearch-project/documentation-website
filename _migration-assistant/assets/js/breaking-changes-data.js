/**
 * Breaking changes data for migration paths
 * 
 * Data structure:
 * - VERSIONS: Array of version strings derived from valid_migrations.yml
 * - VERSION_ORDER: Array of version strings in strict order (derived from VERSIONS)
 * - breakingChanges: Array of breaking change objects with:
 *   - title: Display name of the breaking change
 *   - url: Link to documentation
 *   - introducedIn: Version where the breaking change was introduced
 *   - affects (optional): Object with minSource and maxTarget versions
 *     - minSource: Minimum source version affected
 *     - maxTarget: Maximum target version affected
 *   - comp: Array of components affected
 *   - transformation (optional): Optional object with transformation information
 */
import { getVersionIndex } from './breaking-changes-module.js';

// Variables to store version ordering
let VERSION_ORDER = [];

// Version utility functions that use the dynamically determined version order
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

// Helper function to determine version ordering based on migration paths
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

// Variables to store migration data
let VALID_MIGRATIONS = {};
let VERSIONS = [];
let MIGRATION_MAP = {
  sourceToTargets: {},
  targetToSources: {}
};

// Variables to store breaking changes data
let breakingChanges = [];

// Extract all unique versions for dropdowns
function extractUniqueVersions(migrationsMap) {
  const versions = new Set();
  
  // Add all sources
  Object.keys(migrationsMap).forEach(source => {
    versions.add(source);
  });
  
  // Add all targets
  Object.values(migrationsMap).forEach(targets => {
    targets.forEach(target => {
      versions.add(target);
    });
  });
  
  return Array.from(versions).sort();
}

// Function to generate the reverse mapping (target -> sources)
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

// Function to initialize the migration data from the data attribute
function initializeMigrationData() {
  const migrationDataElement = document.getElementById('migration-data');
  
  if (migrationDataElement && migrationDataElement.dataset.migrationPaths) {
    try {
      // Parse the JSON data from the data attribute
      const migrationPaths = JSON.parse(migrationDataElement.dataset.migrationPaths);
      
      // Transform the data structure from YAML format to the expected JavaScript object format
      VALID_MIGRATIONS = migrationPaths.reduce((acc, path) => {
        acc[path.source] = path.targets;
        return acc;
      }, {});
      
      // Now that we have the migration data, create the derived data structures
      VERSIONS = extractUniqueVersions(VALID_MIGRATIONS);
      MIGRATION_MAP = {
        sourceToTargets: VALID_MIGRATIONS,
        targetToSources: generateReverseMigrationMap(VALID_MIGRATIONS)
      };
      
      // Determine version ordering based on migration paths
      VERSION_ORDER = determineVersionOrder(VERSIONS, MIGRATION_MAP);
      console.log('Determined version order:', VERSION_ORDER);
    } catch (error) {
      console.error('Failed to parse migration data:', error);
      // Fallback to empty object if parsing fails
      VALID_MIGRATIONS = {};
      VERSIONS = [];
      MIGRATION_MAP = { sourceToTargets: {}, targetToSources: {} };
      VERSION_ORDER = [];
    }
  } else {
    console.error('Migration data element not found or empty');
  }
}

// Function to initialize the breaking changes data from the data attribute
function initializeBreakingChangesData() {
  const migrationDataElement = document.getElementById('migration-data');
  
  if (!migrationDataElement || !migrationDataElement.dataset.breakingChanges) {
    console.error('Breaking changes data not found in migration-data element. Make sure to add data-breaking-changes attribute.');
    return;
  }
  
  try {
    // Parse the JSON data from the data attribute
    breakingChanges = JSON.parse(migrationDataElement.dataset.breakingChanges);
    console.log('Loaded breaking changes data:', breakingChanges.length);
  } catch (error) {
    console.error('Failed to parse breaking changes data:', error);
    // Fallback to empty array if parsing fails
    breakingChanges = [];
  }
}

// Initialize the data when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeMigrationData();
  initializeBreakingChangesData();
});

// Export the breaking changes array for use in other modules
export { breakingChanges };
