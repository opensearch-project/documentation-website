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

document.addEventListener('DOMContentLoaded', () => {
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
    
    // Initialize UI
    BreakingChangesUI.UIManager.initialize();
    
    console.log('Breaking changes functionality initialized successfully');
  } catch (error) {
    console.error('Failed to initialize breaking changes functionality:', error);
  }
});
