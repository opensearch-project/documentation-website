---
layout: default
title: Ship events to OpenSearch
parent: Logstash
nav_order: 220
redirect_from:
 - /clients/logstash/ship-to-opensearch/
---

# Ship events to OpenSearch

You can Ship Logstash events to an OpenSearch cluster and then visualize your events with OpenSearch Dashboards.

Make sure you have [Logstash]({{site.url}}{{site.baseurl}}/tools/logstash/index#install-logstash), [OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/), and [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/).
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

## Adding different Authentication mechanisms in the Output plugin

## auth_type to support different authentication mechanisms

In addition to the existing authentication mechanisms, if we want to add new authentication then we will be adding them in the configuration by using auth_type

Example Configuration for basic authentication:

```yml
output {    
    opensearch {        
          hosts  => ["https://hostname:port"]     
          auth_type => {            
              type => 'basic'           
              user => 'admin'           
              password => 'admin'           
          }             
          index => "logstash-logs-%{+YYYY.MM.dd}"       
   }            
}               
```
### Parameters inside auth_type

- type (string) - We should specify the type of authentication
- We should add credentials required for that authentication like 'user' and 'password' for 'basic' authentication
- We should also add other parameters required for that authentication mechanism like we added 'region' for 'aws_iam' authentication

## Configuration for AWS IAM Authentication

To run the Logstash Output Opensearch plugin using aws_iam authentication, simply add a configuration following the below documentation.

Example Configuration:

```yml
output {        
   opensearch {     
          hosts => ["https://hostname:port"]              
          auth_type => {    
              type => 'aws_iam'     
              aws_access_key_id => 'ACCESS_KEY'     
              aws_secret_access_key => 'SECRET_KEY'     
              region => 'us-west-2'    
              service_name => 'es'     
          }         
          index  => "logstash-logs-%{+YYYY.MM.dd}"      
   }            
}
```

### Required Parameters

- hosts (array of string) - AmazonOpensearchService domain endpoint : port number
- auth_type (Json object) - Which holds other parameters required for authentication
    - type (string) - "aws_iam"
    - aws_access_key_id (string) - AWS access key
    - aws_secret_access_key (string) - AWS secret access key
    - region (string, :default => "us-east-1") - region in which the domain is located
    - if we want to pass other optional parameters like profile, session_token,etc. They needs to be added in auth_type
- port (string) - AmazonOpensearchService listens on port 443 for HTTPS
- protocol (string) - The protocol used to connect to AmazonOpensearchService is 'https'

### Optional Parameters
- The credential resolution logic can be described as follows:
    - User passed aws_access_key_id and aws_secret_access_key in configuration
    - Environment variables - AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY (RECOMMENDED since they are recognized by all the AWS SDKs and CLI except for .NET), or AWS_ACCESS_KEY and AWS_SECRET_KEY (only recognized by Java SDK)
    - Credential profiles file at the default location (~/.aws/credentials) shared by all AWS SDKs and the AWS CLI
    - Instance profile credentials delivered through the Amazon EC2 metadata service
- template (path) - You can set the path to your own template here. If no template is specified, the plugin uses the default template.
- template_name (string, default => "logstash") - Defines how the template is named inside Opensearch
- service_name (string, default => "es") - Defines the service name to be used for `aws_iam` authentication.
- legacy_template (boolean, default => true) - Selects the OpenSearch template API. When `true`, uses legacy templates via the _template API. When `false`, uses composable templates via the _index_template API.
- default_server_major_version (number) - The OpenSearch server major version to use when it's not available from the OpenSearch root URL. If not set, the plugin throws an exception when the version can't be fetched.

## Data streams

The OpenSearch output plugin can store both time series datasets (such as logs, events, and metrics) and non-time series data in OpenSearch.
The data stream is recommended to index time series datasets (such as logs, metrics, and events) into OpenSearch.

To know more about data streams, refer to this [documentation](https://opensearch.org/docs/latest/opensearch/data-streams/).

We can ingest data into a data stream through logstash. We need to create the data stream and specify the name of data stream and the `op_type` of `create` in the output configuration. The sample configuration is shown below:

```yml
output {    
    opensearch {        
          hosts  => ["https://hostname:port"]     
          auth_type => {            
              type => 'basic'           
              user => 'admin'           
              password => 'admin'           
          }
          index => "my-data-stream"
          action => "create"
   }            
}               
```
