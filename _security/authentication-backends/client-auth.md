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
      skip_users:
    	    - "DC=de,L=test,O=users,OU=bridge,CN=dashboard"
    challenge: false
  authentication_backend:
    type: noop
```

## Assigning roles to a certificate's common name

You can now assign your certificate's common name (CN) to a role. This step requires you to identify the certificate's CN and the role you want to assign it to. To view a list of all predefined OpenSearch roles, see [Predefined roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/#predefined-roles). To get started, first [define a role]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/#defining-roles) and then map your certificate's CN to that role.

After determining which role to map to your certificate's CN, you can use [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/#mapping-users-to-roles), [`roles_mapping.yml`]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#roles_mappingyml), or the [REST API]({{site.url}}{{site.baseurl}}/security/access-control/api/#create-role-mapping) to map the role. The following example uses the `REST API` to map the CN `CLIENT1` to the role `readall`.

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

### (Advanced) Exclude certain users from client cert authentication

If you are using multiple authentication methods, it can make sense to exclude certain users from the client cert authentication.

Consider the following scenario for a typical OpenSearch Dashboards setup: OpenSearch Dashboard has basic auth setup and user login from browser. 

However, you also have an OpenSearch Dashboards server user. OpenSearch Dashboards uses this user to manage stored objects and perform monitoring and maintenance tasks. You do not want to use this user certificate to login for a user who submitted basic auth logic from a browser.

In this case, it makes sense to exclude the OpenSearch Dashboards server user from the client cert authentication so that user who enters login information in browser gets their login validated. You can use the `skip_users` configuration setting to define which users should be skipped. Wildcards and regular expressions are supported:

```yml

skip_users:
  - "DC=de,L=test,O=users,OU=bridge,CN=dashboard"

```

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
