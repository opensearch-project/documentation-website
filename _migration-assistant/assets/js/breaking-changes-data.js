/**
 * Breaking changes data for migration paths
 * 
 * Data structure:
 * - VERSIONS: Array of version strings derived from valid_migrations.yml
 * - VERSION_ORDER: Array of version strings in strict order (derived from VERSIONS)
 * - breakingChanges: Array of breaking change objects with:
 *   - title: Display name of the breaking change
 *   - url: Link to documentation
 *   - desc: Brief description
 *   - introducedIn: Version where the breaking change was introduced
 *   - affects: Object with minSource and maxTarget versions
 *   - comp: Array of components affected
 *   - transformation: Optional object with transformation information
 */

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
    console.warn('Migration data element not found or empty');
  }
}

// Initialize the migration data when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeMigrationData);

// Updated breaking changes data with full version names
const breakingChanges = [
  {
    title: "Amazon OpenSearch Service: Upgrade Guidance",
    url: "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/version-migration.html",
    desc: "",
    introducedIn: "OpenSearch 1.3",
    affects: {
      minSource: "Elasticsearch 5.6",
      maxTarget: "OpenSearch 2.19"
    },
    comp: []
  },
  {
    title: "Amazon OpenSearch Service: Rename - Summary of changes",
    url: "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html",
    desc: "",
    introducedIn: "OpenSearch 1.3",
    affects: {
      minSource: "Elasticsearch 5.6",
      maxTarget: "OpenSearch 2.19"
    },
    comp: []
  },
  {
    title: "OpenSearch 2.0: Remove mapping types parameter",
    url: "/docs/latest/breaking-changes/#remove-mapping-types-parameter",
    desc: "",
    introducedIn: "OpenSearch 2.19",
    affects: {
      minSource: "Elasticsearch 5.6",
      maxTarget: "OpenSearch 2.19"
    },
    comp: [],
    transformation: {
      title: "Type Mapping Deprecation",
      url: "/migration-assistant/migration-phases/planning-your-migration/handling-type-mapping-deprecation/"
    }
  },
  {
    title: "OpenSearch Notifications Plugins",
    url: "/breaking-changes/#add-opensearch-notifications-plugins",
    desc: "Integration of Alerting plugin with new Notifications plugins in OpenSearch 2.0",
    introducedIn: "OpenSearch 2.19",
    affects: {
      minSource: "Elasticsearch 5.6",
      maxTarget: "OpenSearch 2.19"
    },
    comp: []
  },
  {
    title: "OpenSearch 2.0: Client JDK 8 Support Dropped",
    url: "/docs/latest/breaking-changes/#drop-support-for-jdk-8",
    desc: "",
    introducedIn: "OpenSearch 2.19",
    affects: {
      minSource: "Elasticsearch 5.6",
      maxTarget: "OpenSearch 2.19"
    },
    comp: []
  },
  {
    title: "Removal of Types in Elasticsearch 7.x",
    url: "https://www.elastic.co/guide/en/elasticsearch/reference/7.10/removal-of-types.html",
    desc: "Removal of mapping types in Elasticsearch 7.x",
    introducedIn: "Elasticsearch 7.10",
    affects: {
      minSource: "Elasticsearch 5.6",
      maxTarget: "OpenSearch 2.19"
    },
    comp: [],
    transformation: {
      title: "Type Mapping Deprecation",
      url: "/migration-assistant/migration-phases/planning-your-migration/handling-type-mapping-deprecation/"
    }
  },
  {
    title: "Elasticsearch 6.0 Breaking Changes",
    url: "https://www.elastic.co/guide/en/elasticsearch/reference/6.8/breaking-changes-6.0.html",
    desc: "Breaking changes when upgrading from ES 5.x to ES 6.x",
    introducedIn: "Elasticsearch 6.8",
    affects: {
      minSource: "Elasticsearch 5.6",
      maxTarget: "OpenSearch 2.19"
    },
    comp: []
  },
  {
    title: "Elasticsearch 6.7 Breaking Changes",
    url: "https://www.elastic.co/guide/en/elasticsearch/reference/6.8/breaking-changes-6.7.html",
    desc: "Breaking changes when upgrading to ES 6.7",
    introducedIn: "Elasticsearch 6.8",
    affects: {
      minSource: "Elasticsearch 5.6",
      maxTarget: "OpenSearch 2.19"
    },
    comp: []
  },
  {
    title: "Kibana 6.0 Breaking Changes",
    url: "https://www.elastic.co/guide/en/kibana/6.8/breaking-changes-6.0.html",
    desc: "Breaking changes when upgrading from Kibana 5.x to 6.x",
    introducedIn: "Elasticsearch 6.8",
    affects: {
      minSource: "Elasticsearch 5.6",
      maxTarget: "OpenSearch 2.19"
    },
    comp: ["dashboards"]
  },
  {
    title: "Kibana 6.3 Breaking Changes",
    url: "https://www.elastic.co/guide/en/kibana/6.8/release-notes-6.3.0.html#breaking-6.3.0",
    desc: "Breaking changes in Kibana 6.3",
    introducedIn: "Elasticsearch 6.8",
    affects: {
      minSource: "Elasticsearch 5.6",
      maxTarget: "OpenSearch 2.19"
    },
    comp: ["dashboards"]
  },
  {
    title: "Kibana 6.4 Breaking Changes",
    url: "https://www.elastic.co/guide/en/kibana/6.8/release-notes-6.4.0.html#breaking-6.4.0",
    desc: "Breaking changes in Kibana 6.4",
    introducedIn: "Elasticsearch 6.8",
    affects: {
      minSource: "Elasticsearch 5.6",
      maxTarget: "OpenSearch 2.19"
    },
    comp: ["dashboards"]
  },
  {
    title: "Kibana 6.6 Breaking Changes",
    url: "https://www.elastic.co/guide/en/kibana/6.8/release-notes-6.6.0.html#breaking-6.6.0",
    desc: "Breaking changes in Kibana 6.6",
    introducedIn: "Elasticsearch 6.8",
    affects: {
      minSource: "Elasticsearch 5.6",
      maxTarget: "OpenSearch 2.19"
    },
    comp: ["dashboards"]
  },
  {
    title: "Kibana 6.7 Breaking Changes",
    url: "https://www.elastic.co/guide/en/kibana/6.8/release-notes-6.7.0.html#breaking-6.7.0",
    desc: "Breaking changes in Kibana 6.7",
    introducedIn: "Elasticsearch 6.8",
    affects: {
      minSource: "Elasticsearch 5.6",
      maxTarget: "OpenSearch 2.19"
    },
    comp: ["dashboards"]
  },
  {
    title: "Kibana 7.0 Breaking Changes",
    url: "https://www.elastic.co/guide/en/kibana/7.10/breaking-changes-7.0.html",
    desc: "Breaking changes in Kibana 7.0",
    introducedIn: "Elasticsearch 7.10",
    affects: {
      minSource: "Elasticsearch 6.8",
      maxTarget: "OpenSearch 2.19"
    },
    comp: ["dashboards"]
  }
];
