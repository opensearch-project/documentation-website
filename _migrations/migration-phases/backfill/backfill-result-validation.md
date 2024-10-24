


After the backfill has been completed and the fleet has been stopped 

## Refresh the target cluster

Before examining the contents of the target cluster, it is recommended to run a `_refresh` and `_flush` on the target cluster.  This will help ensure that the report and metrics of the cluster will be accurate portrayed.

## Validate documents on target cluster
You can check the contents of the Target Cluster after the migration using the Console CLI:

```
console clusters cat-indices --refresh
```
<b>Example cat-indices command output</b>

```shell
SOURCE CLUSTER
health status index                uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   my-index             -DqPQDrATw25hhe5Ss34bQ   1   0          3            0     12.7kb         12.7kb

TARGET CLUSTER
health status index                     uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   .opensearch-observability 8HOComzdSlSWCwqWIOGRbQ   1   1          0            0       416b           208b
green  open   .plugins-ml-config        9tld-PCJToSUsMiyDhlyhQ   5   1          1            0      9.5kb          4.7kb
green  open   my-index                  bGfGtYoeSU6U6p8leR5NAQ   1   0          3            0      5.5kb          5.5kb
green  open   .migrations_working_state lopd47ReQ9OEhw4ZuJGZOg   1   1          2            0     18.6kb          6.4kb
green  open   .kibana_1
```

This will display the number of documents on each of the indices on the Target Cluster.  It is further recommended to run some queries against the Target Cluster that mimic your production workflow and closely examine the results returned.

## Related Links

- [Refresh API](https://opensearch.org/docs/latest/api-reference/index-apis/refresh/) ↗
- [Flush API](https://opensearch.org/docs/latest/api-reference/index-apis/flush/) ↗
