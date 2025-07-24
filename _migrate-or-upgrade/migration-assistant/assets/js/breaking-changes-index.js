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
    
    console.log('Breaking changes functionality initialized successfully');
  } catch (error) {
    console.error('Failed to initialize breaking changes functionality:', error);
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeBreakingChanges);

// Also initialize on window load to handle browser back/forward navigation
window.addEventListener('pageshow', (event) => {
  // The pageshow event is fired when the page is shown, including when navigating back to the page
  // The persisted property is true if the page is being restored from the bfcache
  if (event.persisted) {
    console.log('Page restored from back-forward cache, reinitializing breaking changes');
    initializeBreakingChanges();
  }
});
