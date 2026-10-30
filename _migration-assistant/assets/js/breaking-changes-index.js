/**
 * Breaking Changes Index
 * 
 * Main entry point for the breaking changes functionality
 * Initializes modules and wires everything together
 */

import BreakingChangesModule from './breaking-changes-module.js';
import BreakingChangesUI from './breaking-changes-ui.js';

// Export initializeMigrationData function for compatibility with original code
export function initializeMigrationData() {
  // Get migration data from the data attribute
  const migrationDataElement = document.getElementById('migration-data');
  
  if (!migrationDataElement) {
    console.error('Migration data element not found');
    return;
  }
  
  try {
    // Parse the JSON data from the data attribute
    const migrationPaths = JSON.parse(migrationDataElement.dataset.migrationPaths || '[]');
    
    // Initialize the module with data
    BreakingChangesModule.initialize(migrationPaths);
  } catch (error) {
    console.error('Failed to initialize migration data:', error);
  }
}

// Function to initialize the breaking changes functionality
function initializeBreakingChanges() {
  // Get migration data from the data attribute
  const migrationDataElement = document.getElementById('migration-data');
  
  if (!migrationDataElement) {
    console.error('Migration data element not found');
    return;
  }
  
  try {
    // Parse the JSON data from the data attribute
    const migrationPaths = JSON.parse(migrationDataElement.dataset.migrationPaths || '[]');
    const breakingChangesData = JSON.parse(migrationDataElement.dataset.breakingChanges || '[]');
    
    // Initialize the module with data
    BreakingChangesModule.initialize(migrationPaths);
    
    // Initialize UI
    BreakingChangesUI.UIManager.initialize();
  } catch (error) {
    console.error('Failed to initialize breaking changes functionality:', error);
  }
}

// ES modules are deferred, so the DOM is already parsed when this runs.
// DOMContentLoaded may have already fired by the time a module executes,
// so call initialize directly instead of waiting for the event.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBreakingChanges);
} else {
  initializeBreakingChanges();
}

// Re-initialize on back/forward navigation (bfcache restore)
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    initializeBreakingChanges();
  }
});
