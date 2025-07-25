---
layout: default
title: Ship events to OpenSearch
parent: Logstash
nav_order: 220
canonical_url: https://docs.opensearch.org/latest/tools/logstash/ship-to-opensearch/
---

# Ship events to OpenSearch

You can Ship Logstash events to an OpenSearch cluster and then visualize your events with OpenSearch Dashboards.

Make sure you have [Logstash]({{site.url}}{{site.baseurl}}/clients/logstash/index/#install-logstash), [OpenSearch]({{site.url}}{{site.baseurl}}/opensearch/install/index/), and [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/install/index/).
{: .note }

## OpenSearch output plugin

To run the OpenSearch output plugin, add the following configuration in your `pipeline.conf` file:

```yml
output {
  opensearch {
    hosts       => "https://localhost:9200"
    user        => "admin"
    password    => "admin"
    index       => "logstash-logs-%{+YYYY.MM.dd}"
    ssl_certificate_verification => false
  }
}
```


## Sample walkthrough

1.  Open the `config/pipeline.conf` file and add in the following configuration:

    ```yml
    input {
      stdin {
        codec => json
      }
    }

    output {
      opensearch {
        hosts       => "https://localhost:9200"
        user        => "admin"
        password    => "admin"
        index       => "logstash-logs-%{+YYYY.MM.dd}"
        ssl_certificate_verification => false
      }
    }
    ```

    This Logstash pipeline accepts JSON input through the terminal and ships the events to an OpenSearch cluster running locally. Logstash writes the events to an index with the `logstash-logs-%{+YYYY.MM.dd}` naming convention.

2. Start Logstash:

    ```bash
    $ bin/logstash -f config/pipeline.conf --config.reload.automatic
    ```

    `config/pipeline.conf` is a relative path to the `pipeline.conf` file. You can use an absolute path as well.

3. Add a JSON object in the terminal:

    ```json
    { "amount": 10, "quantity": 2}
    ```

4. Start OpenSearch Dashboards and choose **Dev Tools**:

    ```json
    GET _cat/indices?v

    health | status | index | uuid | pri | rep | docs.count | docs.deleted | store.size | pri.store.size
    green | open | logstash-logs-2021.07.01 | iuh648LYSnmQrkGf70pplA | 1 | 1 | 1 | 0 | 10.3kb | 5.1kb
    ```
