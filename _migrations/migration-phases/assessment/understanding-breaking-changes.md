


Before performing any upgrade or migration, you should review any documentation of breaking changes.  Even if the cluster is migrated there might be changes required for clients to connect to the new cluster

## Upgrade and breaking changes guides

For migrations paths between Elasticsearch 6.8 and OpenSearch 2.x users should be familiar with documentation in the links below that apply to their specific case:

* [Upgrading Amazon Service Domains](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/version-migration.html) ↗

* [Changes from Elasticsearch to OpenSearch fork](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html) ↗

* [OpenSearch Breaking Changes](https://opensearch.org/docs/latest/breaking-changes/) ↗

The next step is to set up a proper test bed to verify that your applications will work as expected on the target version.
