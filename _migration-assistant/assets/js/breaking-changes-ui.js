/**
 * Breaking Changes UI Module
 * 
 * Handles all UI operations for the breaking changes selector
 * Provides a clean separation between UI logic and data logic
 */

import { VERSIONS, MIGRATION_MAP, breakingChanges, getVersionIndex } from './breaking-changes-module.js';

const BreakingChangesUI = (function() {
  // Cache for DOM elements
  const elements = {
    sourceSelect: null,
    targetSelect: null,
    componentContainer: null,
    resultsContainer: null
  };

  // Flag to prevent infinite loops when updating dropdowns
  let isUpdating = false;

  /**
   * UI Manager - Handles all UI operations
   */
  const UIManager = {
    /**
     * Initialize the UI
     */
    initialize() {
      // Cache DOM elements
      elements.sourceSelect = document.getElementById('source-version');
      elements.targetSelect = document.getElementById('target-version');
      elements.componentContainer = document.getElementById('component-checkboxes');
      elements.resultsContainer = document.getElementById('breaking-changes-results');
      
      if (!elements.sourceSelect || !elements.targetSelect || 
          !elements.componentContainer || !elements.resultsContainer) {
        console.error('Required DOM elements not found');
        return;
      }
      
      // Store original values before populating dropdowns
      const originalSourceValue = elements.sourceSelect.value;
      const originalTargetValue = elements.targetSelect.value;
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Populate dropdowns with all versions
      // Use the global VERSIONS array for compatibility with original code
      const allVersions = VERSIONS;
      this.populateVersionDropdowns(allVersions);
      
      // Set up component checkboxes
      this.setupComponentCheckboxes();
      
      // Restore original values if they were set (e.g., when navigating back to the page)
      if (originalSourceValue && originalTargetValue) {
        elements.sourceSelect.value = originalSourceValue;
        elements.targetSelect.value = originalTargetValue;
      }
      
      // Initialize results
      this.updateResults();
      
      // Use requestAnimationFrame to wait for the next rendering cycle
      // This ensures the DOM has been updated before we check for selected values
      requestAnimationFrame(() => {
        if (elements.sourceSelect.value && elements.targetSelect.value) {
          this.updateResults();
        }
      });
    },

    /**
     * Set up event listeners for dropdowns and checkboxes
     */
    setupEventListeners() {
      elements.sourceSelect.addEventListener('change', () => {
        this.onSourceChange();
      });
      
      elements.targetSelect.addEventListener('change', () => {
        this.onTargetChange();
      });
    },

    /**
     * Create an option element for a dropdown
     * @param {string} value - The option value
     * @param {string} text - The option text
     * @returns {HTMLOptionElement} The created option element
     */
    createOption(value, text) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = text;
      return option;
    },

    /**
     * Populate a dropdown with versions
     * @param {Array} versions - Array of version strings
     * @param {HTMLSelectElement} dropdown - The dropdown to populate
     * @param {string} placeholder - Placeholder text for the default option
     */
    populateDropdown(dropdown, versions, placeholder = 'Select Version') {
      const currentValue = dropdown.value;
      
      // Clear existing options
      while (dropdown.firstChild) {
        dropdown.removeChild(dropdown.firstChild);
      }
      
      // Add placeholder option
      dropdown.appendChild(this.createOption('', placeholder));
      
      // Add version options
      versions.forEach(version => {
        dropdown.appendChild(this.createOption(version, version));
      });
      
      // Restore selected value if it still exists
      if (currentValue && versions.includes(currentValue)) {
        dropdown.value = currentValue;
      }
    },

    /**
     * Populate both version dropdowns
     * @param {Array} versions - Array of version strings
     */
    populateVersionDropdowns(versions) {
      // Populate source dropdown with all versions
      this.populateDropdown(elements.sourceSelect, versions, 'Select Source');
      
      // For target dropdown, only show versions that are targets for any source
      const allTargetVersions = new Set();
      
      // Collect all target versions from the migration map
      Object.values(MIGRATION_MAP.sourceToTargets).forEach(targets => {
        targets.forEach(target => allTargetVersions.add(target));
      });
      
      // Convert Set to Array and sort in order (latest version last)
      const targetVersions = Array.from(allTargetVersions).sort((a, b) => {
        // Use the version index to sort in order
        return getVersionIndex(a) - getVersionIndex(b);
      });
      
      // Populate target dropdown with filtered versions
      this.populateDropdown(elements.targetSelect, targetVersions, 'Select Target');
    },

    /**
     * Handle source version change
     */
    onSourceChange() {
      if (isUpdating) return;
      isUpdating = true;
      
      const selectedSource = elements.sourceSelect.value;
      
      if (selectedSource) {
        // Get valid targets for this source and sort in order (latest version last)
        const validTargets = (MIGRATION_MAP.sourceToTargets[selectedSource] || []).sort((a, b) => {
          // Use the version index to sort in order
          return getVersionIndex(a) - getVersionIndex(b);
        });
        this.populateDropdown(elements.targetSelect, validTargets, 'Select Target');
      } else {
        // If no source selected, show all possible targets
        this.populateDropdown(elements.targetSelect, VERSIONS, 'Select Target');
      }
      
      isUpdating = false;
      this.updateResults();
    },

    /**
     * Handle target version change
     */
    onTargetChange() {
      if (isUpdating) return;
      isUpdating = true;
      
      const selectedTarget = elements.targetSelect.value;
      
      if (selectedTarget) {
        // Get valid sources for this target
        const validSources = MIGRATION_MAP.targetToSources[selectedTarget] || [];
        this.populateDropdown(elements.sourceSelect, validSources, 'Select Source');
      } else {
        // If no target selected, show all possible sources
        this.populateDropdown(elements.sourceSelect, VERSIONS, 'Select Source');
      }
      
      isUpdating = false;
      this.updateResults();
    },

    /**
     * Set up component checkboxes based on available components
     */
    setupComponentCheckboxes() {
      // Clear existing checkboxes
      elements.componentContainer.innerHTML = '';
      
      // Get unique components from breaking changes
      const components = this.getUniqueComponents();
      
      // Create a checkbox for each component
      components.forEach(component => {
        const span = document.createElement('span');
        span.className = 'component-checkbox';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `component-${component}`;
        checkbox.value = component;
        checkbox.checked = false; // Unchecked by default
        
        // Add event listener to checkbox
        checkbox.addEventListener('change', () => {
          this.updateResults();
        });
        
        const label = document.createElement('label');
        label.htmlFor = `component-${component}`;
        label.textContent = component.charAt(0).toUpperCase() + component.slice(1); // Capitalize first letter
        
        span.appendChild(checkbox);
        span.appendChild(label);
        elements.componentContainer.appendChild(span);
      });
      
      // If no components found, add a message
      if (components.length === 0) {
        elements.componentContainer.innerHTML = '<p>No component filters available</p>';
      }
    },

    /**
     * Get selected components from checkboxes
     * @returns {Array} Array of selected component names
     */
    getSelectedComponents() {
      const checkboxes = elements.componentContainer.querySelectorAll('input[type="checkbox"]');
      return Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    },
    
    /**
     * Get all unique components from breaking changes
     * @returns {Array} Array of unique component names
     */
    getUniqueComponents() {
      const components = new Set();
      breakingChanges.forEach(change => {
        change.comp.forEach(comp => components.add(comp));
      });
      return Array.from(components);
    },

    /**
     * Update results based on selected filters
     */
    updateResults() {
      const selectedSource = elements.sourceSelect.value;
      const selectedTarget = elements.targetSelect.value;
      
      // Show message if source or target not selected
      if (!selectedSource || !selectedTarget) {
        elements.resultsContainer.innerHTML = '<p>Please select both source and target versions to see breaking changes.</p>';
        return;
      }
      
      // Check if source and target are the same
      if (selectedSource === selectedTarget) {
        elements.resultsContainer.innerHTML = '<p>No breaking changes when source and target versions are the same.</p>';
        return;
      }
      
      // Get selected components
      const selectedComponents = this.getSelectedComponents();
      
      // Filter breaking changes directly using the global variables
      const relevantChanges = this.filterBreakingChanges(selectedSource, selectedTarget, selectedComponents);
      
      // Display results
      this.displayResults(relevantChanges);
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

      try {
        // Use the imported getVersionIndex function
        const sourceVersionIdx = getVersionIndex(source);
        const targetVersionIdx = getVersionIndex(target);
        
        return breakingChanges.filter(change => {
          const introducedInIdx = getVersionIndex(change.introducedIn);
          
          // A breaking change applies if:
          // 1. The breaking change was introduced in a version that is between source and target (inclusive of target)
          // 2. The source version is at or after the minimum source version affected
          // 3. The target version is at or before the maximum target version affected
          
          // Handle optional affects field by using defaults if not present
          const minSource = change.affects && change.affects.minSource ? change.affects.minSource : VERSIONS[0]; // Default to oldest version
          const maxTarget = change.affects && change.affects.maxTarget ? change.affects.maxTarget : VERSIONS[VERSIONS.length - 1]; // Default to newest version
          
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
            change.comp.some(comp => selectedComponents.includes(comp)); // Include if any component matches
          
          return versionMatch && componentMatch;
        });
      } catch (error) {
        console.error('Error filtering breaking changes:', error);
        return [];
      }
    },

    /**
     * Display filtered breaking changes
     * @param {Array} changes - Array of breaking changes to display
     * @param {HTMLElement} container - Optional container element to display results in (defaults to elements.resultsContainer)
     */
    displayResults(changes, container = null) {
      // Use the provided container or default to the UI module's container
      const resultsContainer = container || elements.resultsContainer;
      
      if (changes.length) {
        resultsContainer.innerHTML = `
          <h4>Relevant breaking changes:</h4>
          <ul>${changes.map(change => {
            let transformationHtml = '';
            if (change.transformation) {
              transformationHtml = `
                <div class="transformation-info">
                  <strong>Available migration assistant transformation:</strong> 
                  <a href="${change.transformation.url}">${change.transformation.title}</a>
                </div>
              `;
            }
            return `
              <li>
                <a href="${change.url}">${change.title}</a>
                ${transformationHtml}
              </li>
            `;
          }).join('')}</ul>
          <p class="transformation-request">
            To request additional transformations to be built into the Migration Assistant, 
            open a GitHub issue <a href="https://github.com/opensearch-project/opensearch-migrations/issues">here</a>.
          </p>
        `;
      } else {
        resultsContainer.innerHTML = `
          <p>No specific breaking changes found for your selection.</p>
          <p class="transformation-request">
            To request additional transformations to be built into the Migration Assistant, 
            open a GitHub issue <a href="https://github.com/opensearch-project/opensearch-migrations/issues">here</a>.
          </p>
        `;
      }
    }
  };

  // Public API
  return {
    UIManager
  };
})();

// Export for ES modules
export default BreakingChangesUI;
