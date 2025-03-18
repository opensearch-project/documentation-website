/**
 * Breaking changes data for migration paths
 * 
 * Data structure:
 * - VERSIONS: Array of version objects with type and value
 * - COMPONENTS: Array of component types (add new component types here)
 * - breakingChanges: Array of breaking change objects with:
 *   - title: Display name of the breaking change
 *   - url: Link to documentation
 *   - desc: Brief description
 *   - src: Array of source versions affected (format: "type:value")
 *   - tgt: Array of target versions affected (format: "type:value")
 *   - comp: Array of components affected (empty array means all components)
 */

// Configuration - unified version list
const VERSIONS = [
  { type: "ES", value: "5.x" },
  { type: "ES", value: "6.x" },
  { type: "ES", value: "7.x" },
  { type: "OS", value: "1.x" },
  { type: "OS", value: "2.x" }
];

// Define valid migration paths (source version -> valid target versions)
// Format: "sourceType:sourceValue" -> ["targetType:targetValue", ...]
const VALID_MIGRATIONS = {
  "ES:5.x": ["ES:6.x", "ES:7.x", "OS:1.x", "OS:2.x"],
  "ES:6.x": ["ES:7.x", "OS:1.x", "OS:2.x"],
  "ES:7.x": ["OS:1.x", "OS:2.x"],
  "OS:1.x": ["OS:2.x"],
  "OS:2.x": ["OS:2.x"]
};

// Function to generate the reverse mapping (target -> sources)
function generateReverseMigrationMap(forwardMap) {
  const reverseMap = {};
  
  // Iterate through each source and its targets
  Object.entries(forwardMap).forEach(([source, targets]) => {
    // For each target, add the source to its list of sources
    targets.forEach(target => {
      if (!reverseMap[target]) {
        reverseMap[target] = [];
      }
      reverseMap[target].push(source);
    });
  });
  
  return reverseMap;
}

// Create bidirectional migration map
const MIGRATION_MAP = {
  sourceToTargets: VALID_MIGRATIONS,
  targetToSources: generateReverseMigrationMap(VALID_MIGRATIONS)
};
const COMPONENTS = ["data", "dashboards"];

const breakingChanges = [
  {
    title: "Upgrading Amazon Service Domains",
    url: "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/version-migration.html",
    desc: "Guide for upgrading Amazon OpenSearch Service domains",
    src: ["ES:5.x", "ES:6.x", "ES:7.x"],
    tgt: ["OS:1.x", "OS:2.x"],
    comp: ["data"]
  },
  {
    title: "Changes from Elasticsearch to OpenSearch fork",
    url: "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html",
    desc: "Documentation of changes from Elasticsearch to OpenSearch fork",
    src: ["ES:5.x", "ES:6.x", "ES:7.x"],
    tgt: ["OS:1.x", "OS:2.x"],
    comp: ["data"]
  },
  {
    title: "Mapping Types Removal",
    url: "/breaking-changes/#remove-mapping-types-parameter",
    desc: "Removal of mapping types parameter in OpenSearch 2.0",
    src: ["ES:5.x", "ES:6.x", "ES:7.x"],
    tgt: ["OS:2.x"],
    comp: ["data"]
  },
  {
    title: "OpenSearch Notifications Plugins",
    url: "/breaking-changes/#add-opensearch-notifications-plugins",
    desc: "Integration of Alerting plugin with new Notifications plugins in OpenSearch 2.0",
    src: ["ES:5.x", "ES:6.x", "ES:7.x"],
    tgt: ["OS:2.x"],
    comp: ["data"]
  },
  {
    title: "JDK 8 Support Dropped",
    url: "/breaking-changes/#drop-support-for-jdk-8",
    desc: "OpenSearch 2.0 dropped support for JDK 8",
    src: ["ES:5.x", "ES:6.x", "ES:7.x"],
    tgt: ["OS:2.x"],
    comp: ["data"]
  },
  {
    title: "Removal of Types in Elasticsearch 7.x",
    url: "https://www.elastic.co/guide/en/elasticsearch/reference/7.10/removal-of-types.html",
    desc: "Removal of mapping types in Elasticsearch 7.x",
    src: ["ES:5.x", "ES:6.x"],
    tgt: ["ES:7.x", "OS:1.x", "OS:2.x"],
    comp: ["data"]
  },
  {
    title: "Elasticsearch 6.0 Breaking Changes",
    url: "https://www.elastic.co/guide/en/elasticsearch/reference/6.8/breaking-changes-6.0.html",
    desc: "Breaking changes when upgrading from ES 5.x to ES 6.x",
    src: ["ES:5.x"],
    tgt: ["ES:6.x", "ES:7.x", "OS:1.x", "OS:2.x"],
    comp: ["data"]
  },
  {
    title: "Elasticsearch 6.7 Breaking Changes",
    url: "https://www.elastic.co/guide/en/elasticsearch/reference/6.8/breaking-changes-6.7.html",
    desc: "Breaking changes when upgrading to ES 6.7",
    src: ["ES:5.x", "ES:6.x"],
    tgt: ["ES:6.x", "ES:7.x", "OS:1.x", "OS:2.x"],
    comp: ["data"]
  },
  {
    title: "Kibana 6.0 Breaking Changes",
    url: "https://www.elastic.co/guide/en/kibana/6.8/breaking-changes-6.0.html",
    desc: "Breaking changes when upgrading from Kibana 5.x to 6.x",
    src: ["ES:5.x"],
    tgt: ["ES:6.x", "ES:7.x", "OS:1.x", "OS:2.x"],
    comp: ["dashboards"]
  },
  {
    title: "Kibana 6.3 Breaking Changes",
    url: "https://www.elastic.co/guide/en/kibana/6.8/release-notes-6.3.0.html#breaking-6.3.0",
    desc: "Breaking changes in Kibana 6.3",
    src: ["ES:5.x", "ES:6.x"],
    tgt: ["ES:6.x", "ES:7.x", "OS:1.x", "OS:2.x"],
    comp: ["dashboards"]
  },
  {
    title: "Kibana 6.4 Breaking Changes",
    url: "https://www.elastic.co/guide/en/kibana/6.8/release-notes-6.4.0.html#breaking-6.4.0",
    desc: "Breaking changes in Kibana 6.4",
    src: ["ES:5.x", "ES:6.x"],
    tgt: ["ES:6.x", "ES:7.x", "OS:1.x", "OS:2.x"],
    comp: ["dashboards"]
  },
  {
    title: "Kibana 6.6 Breaking Changes",
    url: "https://www.elastic.co/guide/en/kibana/6.8/release-notes-6.6.0.html#breaking-6.6.0",
    desc: "Breaking changes in Kibana 6.6",
    src: ["ES:5.x", "ES:6.x"],
    tgt: ["ES:6.x", "ES:7.x", "OS:1.x", "OS:2.x"],
    comp: ["dashboards"]
  },
  {
    title: "Kibana 6.7 Breaking Changes",
    url: "https://www.elastic.co/guide/en/kibana/6.8/release-notes-6.7.0.html#breaking-6.7.0",
    desc: "Breaking changes in Kibana 6.7",
    src: ["ES:5.x", "ES:6.x"],
    tgt: ["ES:6.x", "ES:7.x", "OS:1.x", "OS:2.x"],
    comp: ["dashboards"]
  },
  {
    title: "Kibana 7.0 Breaking Changes",
    url: "https://www.elastic.co/guide/en/kibana/7.10/breaking-changes-7.0.html",
    desc: "Breaking changes in Kibana 7.0",
    src: ["ES:6.x"],
    tgt: ["ES:7.x", "OS:1.x", "OS:2.x"],
    comp: ["dashboards"]
  }
];
