<!-- spec_insert_start
component: example_code
rest: GET /_cat/health?pretty=true&human=false
include_client_setup: true
-->
{% capture step1_rest %}
GET /_cat/health?pretty=true&human=false
{% endcapture %}

{% capture step1_python %}

from opensearchpy import OpenSearch

host = 'localhost'
port = 9200
auth = ('admin', 'admin') # For testing only. Don't store credentials in code.
ca_certs_path = '/full/path/to/root-ca.pem' # Provide a CA bundle if you use intermediate CAs with your root CA.

# Create the client with SSL/TLS enabled, but hostname verification disabled.
client = OpenSearch(
    hosts = [{'host': host, 'port': port}],
    http_compress = True, # enables gzip compression for request bodies
    http_auth = auth,
    use_ssl = True,
    verify_certs = True,
    ssl_assert_hostname = False,
    ssl_show_warn = False,
    ca_certs = ca_certs_path
)


response = client.cat.health(
  params = { "pretty": "true", "human": "false" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

<!-- spec_insert_start
component: example_code
rest: GET /{index}/_search?analyzer=standard&expand_wildcards=all
-->
{% capture step1_rest %}
GET /{index}/_search?analyzer=standard&expand_wildcards=all
{% endcapture %}

{% capture step1_python %}


response = client.search(
  index = "{index}",
  params = { "analyzer": "standard", "expand_wildcards": "all" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

<!-- spec_insert_start
skip: true
component: example_code
rest: GET /{index}/_search?analyzer=standard&expand_wildcards=all
-->
<!-- spec_insert_end -->

<!-- spec_insert_start
component: example_code
rest: PUT /_settings?expand_wildcards=all
body: |
  {
    "index": {
      "number_of_replicas": 2
    }
  }
-->
{% capture step1_rest %}
PUT /_settings?expand_wildcards=all
{
  "index": {
    "number_of_replicas": 2
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_settings(
  params = { "expand_wildcards": "all" },
  body =   {
    "index": {
      "number_of_replicas": 2
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

<!-- spec_insert_start
component: example_code
rest: POST /_bulk?expand_wildcards=all
body: |
  {"index":{"_index":"test","_id":"1"}}
  {"field1":"value1"}
  {"delete":{"_index":"test","_id":"2"}}
include_client_setup: true
-->
{% capture step1_rest %}
POST /_bulk?expand_wildcards=all
  {"index":{"_index":"test","_id":"1"}}
  {"field1":"value1"}
  {"delete":{"_index":"test","_id":"2"}}
{% endcapture %}

{% capture step1_python %}

from opensearchpy import OpenSearch

host = 'localhost'
port = 9200
auth = ('admin', 'admin') # For testing only. Don't store credentials in code.
ca_certs_path = '/full/path/to/root-ca.pem' # Provide a CA bundle if you use intermediate CAs with your root CA.

# Create the client with SSL/TLS enabled, but hostname verification disabled.
client = OpenSearch(
    hosts = [{'host': host, 'port': port}],
    http_compress = True, # enables gzip compression for request bodies
    http_auth = auth,
    use_ssl = True,
    verify_certs = True,
    ssl_assert_hostname = False,
    ssl_show_warn = False,
    ca_certs = ca_certs_path
)


response = client.bulk(
  params = { "expand_wildcards": "all" },
  body = '''
  {"index":{"_index":"test","_id":"1"}}
  {"field1":"value1"}
  {"delete":{"_index":"test","_id":"2"}}
'''
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->
