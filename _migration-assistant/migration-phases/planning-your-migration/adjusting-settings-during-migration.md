---
layout: default
title: Adjusting settings during migration
nav_order: 60
parent: Planning your migration
grand_parent: Migration phases
redirect_from:
  - /migration-assistant/migration-phases/adjusting-settings-during-migration/
---

# Adjusting settings during migration

During a migration there is an opportunity change names and paths of index and data structures that are not modifiable after they are declared.  This page provides a cookbook of different scenarios and templates that can be used to make these adjustments.

### Rename an index

> [!NOTE]  
> We recommend creating an alias to an index instead of renaming them, if an alias is created on the source cluster the migration process will copy the alias over as well. See create an alias [documentation](https://opensearch.org/docs/latest/api-reference/index-apis/update-alias/).

#### Migration with a snapshot

1. Navigate to the bootstrap box and open the `cdk.context.json` with vim
2. Add/Update the key `reindexFromSnapshotExtraArgs` to include `--doc-transformer-config-file /shared-logs-output/rfs-transform.json`
3. Redeploy the Migration Assistant 
4. Navigate on to the Migration Assistant console
5. Create a file with `vim /shared-logs-output/rfs-transform.json`
6. Add the following to the file:
```json
[
  {
    "JsonConditionalTransformerProvider": [
      {
        "JsonJMESPathPredicateProvider": {
          "script": "index._index == '{{INDEX_ORIGINAL_NAME}}'"
        }
      },
      [
        {
          "JsonJoltTransformerProvider": {
            "script": {
              "operation": "modify-overwrite-beta",
              "spec": {
                "index": {
                  "\\_index": "{{INDEX_NEW_NAME}}"
                }
              }
            }
          }
        }
      ]
    ]
  }
]
```
7. Replace both `{{INDEX_ORIGINAL_NAME}}` and `{{INDEX_NEW_NAME}}`
8. Create a file with `vim /shared-logs-output/metadata-transform.json`
9. Add the following to the file:
```json
[
  {
    "JsonConditionalTransformerProvider": [
      {
        "JsonJMESPathPredicateProvider": {
          "script": "name == '{{INDEX_ORIGINAL_NAME}}'"
        }
      },
      [
        {
          "JsonJoltTransformerProvider": {
            "script": {
              "operation": "modify-overwrite-beta",
              "spec": {
                "name": "{{INDEX_NEW_NAME}}"
              }
            }
          }
        }
      ]
    ]
  }
]
```
10. Replace both `{{INDEX_ORIGINAL_NAME}}` and `{{INDEX_NEW_NAME}}`
11. Run metadata migration with the additional parameter `console metadata migrate --doc-transformer-config-file /shared-logs-output/rfs-transform.json`
12. Run backfill as normal