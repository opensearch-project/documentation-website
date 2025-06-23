/**
 * Breaking changes filter - displays relevant breaking changes based on selected versions and components
 * 
 * Features:
 * - Dynamically generates dropdowns and checkboxes from configuration arrays
 * - Automatically checks all component checkboxes by default
 * - Filters breaking changes based on source version, target version, and components
 * - Displays results in a formatted list
 * - Supports bidirectional filtering of source and target versions
 */
import { getVersionIndex } from './breaking-changes-module.js';
import { breakingChanges } from './breaking-changes-data.js';
import BreakingChangesUI from './breaking-changes-ui.js';
document.addEventListener('DOMContentLoaded', () => {
  // Wait for migration data to be initialized
  if (typeof initializeMigrationData === 'function') {
    initializeMigrationData();
  }
  
  // Cache DOM elements
  const src = document.getElementById('source-version');
  const tgt = document.getElementById('target-version');
  const componentContainer = document.getElementById('component-checkboxes');
  const results = document.getElementById('breaking-changes-results');
  
  // Flag to prevent infinite loops when updating dropdowns
  let isUpdating = false;
  
  // Helper function to create dropdown options
  const createOption = (value, text) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    return option;
  };
  
  // Helper function to populate a dropdown with versions
  const populateDropdown = (dropdown, versions, placeholder = 'Select Version') => {
    const currentValue = dropdown.value;
    
    while (dropdown.firstChild) {
      dropdown.removeChild(dropdown.firstChild);
    }
    
    dropdown.appendChild(createOption('', placeholder));
    
    versions.forEach(version => {
      dropdown.appendChild(createOption(version, version));
    });
    
    if (currentValue && versions.includes(currentValue)) {
      dropdown.value = currentValue;
    }
  };
  
  // Get all available version strings
  const allVersions = VERSIONS;
  
  // Populate source dropdown with all versions initially
  populateDropdown(src, allVersions, 'Select Source');
  
  // Populate target dropdown with all versions initially
  populateDropdown(tgt, allVersions, 'Select Target');
  
  // Function to update target dropdown based on selected source
  const updateTargetDropdown = () => {
    if (isUpdating) return;
    isUpdating = true;
    
    const selectedSrc = src.value;
    
    if (selectedSrc) {
      // Get valid targets for this source
      const validTargets = MIGRATION_MAP.sourceToTargets[selectedSrc] || [];
      populateDropdown(tgt, validTargets, 'Select Target');
    } else {
      // If no source selected, show all possible targets
      populateDropdown(tgt, allVersions, 'Select Target');
    }
    
    isUpdating = false;
    updateResults();
  };
  
  // Function to update source dropdown based on selected target
  const updateSourceDropdown = () => {
    if (isUpdating) return;
    isUpdating = true;
    
    const selectedTgt = tgt.value;
    
    if (selectedTgt) {
      // Get valid sources for this target
      const validSources = MIGRATION_MAP.targetToSources[selectedTgt] || [];
      populateDropdown(src, validSources, 'Select Source');
    } else {
      // If no target selected, show all possible sources
      populateDropdown(src, allVersions, 'Select Source');
    }

    isUpdating = false;
    updateResults();
  };
  
  // Add event listeners for dropdown changes
  src.addEventListener('change', updateTargetDropdown);
  tgt.addEventListener('change', updateSourceDropdown);
  
  // Only show Dashboards as an optional component
  const span = document.createElement('span');
  span.className = 'component-checkbox';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'component-dashboards';
  checkbox.value = 'dashboards';
  checkbox.checked = false; // Unchecked by default
  
  const label = document.createElement('label');
  label.htmlFor = 'component-dashboards';
  label.textContent = 'Dashboards';
  
  span.appendChild(checkbox);
  span.appendChild(label);
  componentContainer.appendChild(span);
  
  // Get all checkboxes
  const checkboxes = document.querySelectorAll('#component-checkboxes input[type="checkbox"]');
  
  // Update results based on selected filters
  const updateResults = () => {
    const selectedSrc = src.value;
    const selectedTgt = tgt.value;
    
    // Show message if source or target not selected
    if (!selectedSrc || !selectedTgt) {
      results.innerHTML = '<p>Select both source and target versions to see breaking changes.</p>';
      return;
    }
    
    const selectedComp = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    
    // Check if source and target are the same
    if (selectedSrc === selectedTgt) {
      results.innerHTML = '<p>No breaking changes when source and target versions are the same.</p>';
      return;
    }
    
    // Filter breaking changes based on selection
    const relevantChanges = breakingChanges.filter(change => {
      let introducedInIdx;
      try {
        introducedInIdx = getVersionIndex(change.introducedIn);
      } catch (e) {
        console.warn(`Skipping "${change.title}" — introducedIn version not recognized: ${change.introducedIn}`);
        return false; // Skip this change if version is unknown
      }
      // Check if the breaking change applies to this migration path
      const sourceVersionIdx = getVersionIndex(selectedSrc);
      const targetVersionIdx = getVersionIndex(selectedTgt);
      
      // A breaking change applies if:
      // 1. The breaking change was introduced in a version that is between source and target (inclusive of target)
      // 2. The source version is at or after the minimum source version affected
      // 3. The target version is at or before the maximum target version affected
      
      // Handle optional affects field by using defaults if not present
      const minSource = change.affects?.minSource || VERSIONS[0];
      const maxTarget = change.affects?.maxTarget || VERSIONS[VERSIONS.length - 1];
      
      const versionMatch = 
        introducedInIdx <= targetVersionIdx && // Breaking change was introduced at or before target
        introducedInIdx > sourceVersionIdx && // Breaking change was introduced after source
        sourceVersionIdx < targetVersionIdx && // Valid migration path (source before target)
        sourceVersionIdx >= getVersionIndex(minSource) && // Source is affected
        targetVersionIdx <= getVersionIndex(maxTarget); // Target is affected
      
      // For component filtering:
      // - Always include changes with empty comp array (default/data components)
      // - Only include dashboard components if the checkbox is checked
      const componentMatch = 
        change.comp.length === 0 || // Include changes with no specific component (default/data)
        (change.comp.includes('dashboards') && selectedComp.includes('dashboards')); // Only include dashboards if selected
      
      return versionMatch && componentMatch;
    });
    
    // Use the UI module's displayResults function to avoid duplication
    BreakingChangesUI.UIManager.displayResults(relevantChanges, results);
  };
  
  // Add event listeners for checkboxes
  checkboxes.forEach(el => el.addEventListener('change', updateResults));
  
  // Initialize results
  updateResults();
});
