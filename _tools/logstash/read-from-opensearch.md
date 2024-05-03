---
layout: default
title: Read from OpenSearch
parent: Logstash
nav_order: 220
redirect_from:
 - /clients/logstash/ship-to-opensearch/
---

# Read from OpenSearch

As we ship Logstash events to an OpenSearch cluster using the [OpenSearch output plugin](https://github.com/opensearch-project/logstash-output-opensearch), we can also perform read operations on an OpenSearch cluster and load data into Logstash using the [OpenSearch input plugin](https://github.com/opensearch-project/logstash-input-opensearch).

The OpenSearch input plugin reads the search query results performed on an OpenSearch cluster and loads them into Logstash. This lets you replay test logs, reindex, and perform other operations based on the loaded data. You can schedule ingestions to run periodically by using 
[cron expressions](https://opensearch.org/docs/latest/monitoring-plugins/alerting/cron/), or manually load data into Logstash by running the query once.



## OpenSearch input plugin

To run the OpenSearch input plugin, add the configuration to the `pipeline.conf` file within your Logstash's `config` folder. The example below runs the `match_all` query filter and loads in data once.

```yml
input {
  opensearch {
    hosts       => "https://hostname:port"
    user        => "admin"
    password    => "admin"
    index       => "logstash-logs-%{+YYYY.MM.dd}"
    query       => '{ "query": { "match_all": {}} }'
  }
}

filter {
}

output {
}
```

To ingest data according to a schedule, use a cron expression that specifies the schedule you want. For example, to load in data every minute, add `schedule => "* * * * *"` to the input section of your `pipeline.conf` file.

Like the output plugin, after adding your configuration to the `pipeline.conf` file, start Logstash by providing the path to this file:

 ```bash
 $ bin/logstash -f config/pipeline.conf --config.reload.automatic
 ```

`config/pipeline.conf` is a relative path to the `pipeline.conf` file. You can use an absolute path as well.

Adding `stdout{}` to the `output{}` section of your `pipeline.conf` file prints the query results to the console. 

To reindex the data into an OpenSearch domain, add the destination domain configuration in the `output{}` section like shown [here](https://opensearch.org/docs/latest/tools/logstash/index/).
