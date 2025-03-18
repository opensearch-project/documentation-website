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
document.addEventListener('DOMContentLoaded', () => {
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
    
    versions.forEach(versionStr => {
      const [type, value] = versionStr.split(':');
      dropdown.appendChild(createOption(versionStr, `${type} ${value}`));
    });
    
    if (currentValue && versions.includes(currentValue)) {
      dropdown.value = currentValue;
    }
  };
  
  // Get all available version strings
  const allVersionStrings = VERSIONS.map(v => `${v.type}:${v.value}`);
  
  // Populate source dropdown with all versions initially
  populateDropdown(src, allVersionStrings, 'Select Source');
  
  // Populate target dropdown with all versions initially
  populateDropdown(tgt, allVersionStrings, 'Select Target');
  
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
      populateDropdown(tgt, allVersionStrings, 'Select Target');
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
      populateDropdown(src, allVersionStrings, 'Select Source');
    }

    isUpdating = false;
    updateResults();
  };
  
  // Add event listeners for dropdown changes
  src.addEventListener('change', updateTargetDropdown);
  tgt.addEventListener('change', updateSourceDropdown);
  
  const uiComponents = COMPONENTS;
  
  uiComponents.forEach(comp => {
    const id = `component-${comp}`;
    
    const span = document.createElement('span');
    span.className = 'component-checkbox';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.value = comp;
    checkbox.checked = true; // Check by default
    
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = comp.charAt(0).toUpperCase() + comp.slice(1);
    
    span.appendChild(checkbox);
    span.appendChild(label);
    componentContainer.appendChild(span);
  });
  
  // Get all checkboxes
  const checkboxes = document.querySelectorAll('#component-checkboxes input[type="checkbox"]');
  
  // Update results based on selected filters
  const updateResults = () => {
    const selectedSrc = src.value;
    const selectedTgt = tgt.value;
    
    // Show message if source or target not selected
    if (!selectedSrc || !selectedTgt) {
      results.innerHTML = '<p>Please select both source and target versions to see breaking changes.</p>';
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
    const relevantChanges = breakingChanges.filter(change => 
      change.src.includes(selectedSrc) && 
      change.tgt.includes(selectedTgt) && 
      (change.comp.length === 0 || 
       selectedComp.length === 0 || 
       change.comp.some(c => selectedComp.includes(c)))
    );
    
    // Display results
    if (relevantChanges.length) {
      results.innerHTML = `
        <h4>Relevant Breaking Changes:</h4>
        <ul>${relevantChanges.map(change => 
          `<li><a href="${change.url}">${change.title}</a>: ${change.desc}</li>`
        ).join('')}</ul>
      `;
    } else {
      results.innerHTML = '<p>No specific breaking changes found for your selection.</p>';
    }
  };
  
  // Add event listeners for checkboxes
  checkboxes.forEach(el => el.addEventListener('change', updateResults));
  
  // Initialize results
  updateResults();
});
