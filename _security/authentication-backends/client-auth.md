---
layout: default
title: Client certificate authentication
parent: Authentication backends
nav_order: 70
redirect_from:
  - /security/configuration/client-auth/
  - /security-plugin/configuration/client-auth/
---

# Client certificate authentication

After obtaining your own certificates either from a certificate authority (CA) or by [generating your own certificates using OpenSSL]({{site.url}}{{site.baseurl}}/security/configuration/generate-certificates), you can start configuring OpenSearch to authenticate a user using a client certificate.

Client certificate authentication offers more security advantages than just using basic authentication (username and password). Because client certificate authentication requires both a client certificate and its private key, which are often in the user's possession, it is less vulnerable to brute force attacks in which malicious individuals try to guess a user's password.

Another benefit of client certificate authentication is you can use it along with basic authentication, providing two layers of security.

## Enabling client certificate authentication

To enable client certificate authentication, you must first set `clientauth_mode` in `opensearch.yml` to either `OPTIONAL` or `REQUIRE`:

```yml
plugins.security.ssl.http.clientauth_mode: OPTIONAL
```

Next, enable client certificate authentication in the `client_auth_domain` section of `config.yml`.

```yml
clientcert_auth_domain:
  description: "Authenticate via SSL client certificates"
  http_enabled: true
  transport_enabled: true
  order: 1
  http_authenticator:
    type: clientcert
    config:
      username_attribute: cn #optional, if omitted DN becomes username
    challenge: false
  authentication_backend:
    type: noop
```

## Assigning roles to your common name

You can now assign your certificate's common name (CN) to a role. For this step, you must know your certificate's CN and the role you want to assign to. To get a list of all predefined roles in OpenSearch, refer to our [list of predefined roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/#predefined-roles). If you want to first create a role, refer to [how to create a role]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/#create-users), and then map your certificate's CN to that role.

After deciding which role you want to map your certificate's CN to, you can use [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/#map-users-to-roles), [`roles_mapping.yml`]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#roles_mappingyml), or the [REST API]({{site.url}}{{site.baseurl}}/security/access-control/api/#create-role-mapping) to map your certificate's CN to the role. The following example uses the `REST API` to map the common name `CLIENT1` to the role `readall`.

**Example request**

```json
PUT _plugins/_security/api/rolesmapping/readall
{
  "backend_roles" : ["sample_role" ],
  "hosts" : [ "example.host.com" ],
  "users" : [ "CLIENT1" ]
}
```

**Example response**

```json
{
  "status": "OK",
  "message": "'readall' updated."
}
```

After mapping a role to your client certificate's CN, you're ready to connect to your cluster using those credentials.

The code example below uses the Python `requests` library to connect to a local OpenSearch cluster and sends a GET request to the `movies` index.

```python
import requests
import json
base_url = 'https://localhost:9200/'
headers = {
  'Content-Type': 'application/json'
}
cert_file_path = "/full/path/to/client-cert.pem"
key_file_path = "/full/path/to/client-cert-key.pem"
root_ca_path = "/full/path/to/root-ca.pem"

# Send the request.
path = 'movies/_doc/3'
url = base_url + path
response = requests.get(url, cert = (cert_file_path, key_file_path), verify=root_ca_path)
print(response.text)
```

{% comment %}
## Configuring Beats

You can also configure your Beats so that it uses a client certificate for authentication with OpenSearch. Afterwards, it can start sending output to OpenSearch.

This output configuration specifies which settings you need for client certificate authentication:

```yml
output.opensearch:
  enabled: true
  # Array of hosts to connect to.
  hosts: ["localhost:9200"]
  # Protocol - either `http` (default) or `https`.
  protocol: "https"
  ssl.certificate_authorities: ["/full/path/to/CA.pem"]
  ssl.verification_mode: certificate
  ssl.certificate: "/full/path/to/client-cert.pem"
  ssl.key: "/full/path/to/to/client-cert-key.pem"
```
{% endcomment %}

## Using certificates with Docker

While we recommend using the [tarball]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/tar/) installation of ODFE to test client certificate authentication configurations, you can also use any of the other install types. For instructions on using Docker security, see [Configuring basic security settings]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#configuring-basic-security-settings).
