---
layout: default
title: SAML
parent: Authentication backends
nav_order: 55
redirect_from:
  - /security/configuration/saml/
  - /security-plugin/configuration/saml/
---

# SAML

The Security plugin supports user authentication through SAML single sign-on. The Security plugin implements the web browser SSO profile of the SAML 2.0 protocol.

This profile is meant for use with web browsers. It is not a general-purpose way of authenticating users against the Security plugin, so its primary use case is to support OpenSearch Dashboards single sign-on.


## Docker example

We provide a fully functional example that can help you understand how to use SAML with OpenSearch Dashboards.

1. Download [the example zip file]({{site.url}}{{site.baseurl}}/assets/examples/saml-example-custom.zip) to a preferred location in your directory and unzip it.
1. At the command line, specify the location of the files in your directory and run `docker-compose up`.
1. Review the files:

   * `customize-docker-compose.yml`: Defines two OpenSearch nodes, an OpenSearch Dashboards server, and a SAML server.  
   * `customize-opensearch_dashboards.yml`: Includes SAML settings for the default `opensearch_dashboards.yml` file.
   * `customize-config.yml`: Configures SAML for authentication.

   You can remove "customize" from the file names if you plan to modify and keep these files for production.
   {: .tip }  

1. In the `docker-compose.yml` file, specify your OpenSearch version number in the `image` field for nodes 1 and 2, and OpenSearch Dashboards server. For example, if you are running OpenSearch version 2.6, the `image` fields will resemble the following examples:
   
   ```yml
   opensearch-saml-node1:
    image: opensearchproject/opensearch:2.8.0
    ```
    ```yml
    opensearch-saml-node2:
    image: opensearchproject/opensearch:2.8.0
    ```
    ```yml
    opensearch-saml-dashboards:
    image: opensearchproject/opensearch-dashboards:2.8.0
    ```

1. Access OpenSearch Dashboards at [http://localhost:5601](http://localhost:5601){:target='\_blank'}. Note that OpenSearch Dashboards immediately redirects you to the SAML login page.

1. Log in as `admin` with a password of `admin`.

1. After logging in, note that your user in the upper-right is `SAMLAdmin`, as defined in `/var/www/simplesamlphp/config/authsources.php` of the SAML server.

1. If you want to examine the SAML server, run `docker ps` to find its container ID and then `docker exec -it <container-id> /bin/bash`.

   In particular, you might find it helpful to review the contents of the `/var/www/simplesamlphp/config/` and `/var/www/simplesamlphp/metadata/` directories.


## Activating SAML

To use SAML for authentication, you need to configure a respective authentication domain in the `authc` section of `config/opensearch-security/config.yml`. Because SAML works solely on the HTTP layer, you do not need any `authentication_backend` and can set it to `noop`. Place all SAML-specific configuration options in this chapter in the `config` section of the SAML HTTP authenticator:

```yml
authc:
  saml_auth_domain:
    http_enabled: true
    transport_enabled: false
    order: 1
    http_authenticator:
      type: saml
      challenge: true
      config:
        idp:
          metadata_file: okta.xml
          ...
    authentication_backend:
      type: noop
```

After you have configured SAML in `config.yml`, you must also [activate it in OpenSearch Dashboards](#opensearch-dashboards-configuration).


## Running multiple authentication domains

We recommend adding at least one other authentication domain, such as LDAP or the internal user database, to support API access to OpenSearch without SAML. For OpenSearch Dashboards and the internal OpenSearch Dashboards server user, you also must add another authentication domain that supports basic authentication. This authentication domain should be placed first in the chain, and the `challenge` flag must be set to `false`:

```yml
authc:
  basic_internal_auth_domain:
    http_enabled: true
    transport_enabled: true
    order: 0
    http_authenticator:
      type: basic
      challenge: false
    authentication_backend:
      type: internal
  saml_auth_domain:
    http_enabled: true
    transport_enabled: false
    order: 1
    http_authenticator:
      type: saml
      challenge: true
      config:
        ...
    authentication_backend:
      type: noop
```


## Identity provider metadata

A SAML identity provider (IdP) provides a SAML 2.0 metadata file describing the IdP's capabilities and configuration. The Security plugin can read IdP metadata either from a URL or a file. The choice that you make depends on your IdP and your preferences. The SAML 2.0 metadata file is required.

Name | Description
:--- | :---
`idp.metadata_file` | The path to the SAML 2.0 metadata file of your IdP. Place the metadata file in the `config` directory of OpenSearch. The path has to be specified relative to the `config` directory. Required if `idp.metadata_url` is not set.
`idp.metadata_url` | The SAML 2.0 metadata URL of your IdP. Required if `idp.metadata_file` is not set.


## IdP and service provider entity ID

An entity ID is a globally unique name for a SAML entity, either an IdP or a service provider (SP). The IdP entity ID is usually provided by your IdP. The SP entity ID is the name of the configured application or client in your IdP. We recommend adding a new application for OpenSearch Dashboards and using the URL of your OpenSearch Dashboards installation as the SP entity ID.

Name | Description
:--- | :---
`idp.entity_id` | The entity ID of your IdP. Required.
`sp.entity_id` | The entity ID of the service provider. Required.

## Time disparity compensation for JWT validation

Occasionally you may find that the clock times between the authentication server and the OpenSearch node are not perfectly synchronized. When this is the case, even by a few seconds, the system that either issues or receives a JSON Web Token (JWT) may try to validate `nbf` (not before) and `exp` (expiration) claims and fail to authenticate the user due to the time disparity.

By default, OpenSearch Security allows for a window of 30 seconds to compensate for possible misalignment between server clock times. To set a custom value for this feature and override the default, you can add the `jwt_clock_skew_tolerance_seconds` setting to the `config.yml`.

```yml
http_authenticator:
  type: saml
  challenge: true
  config:
    idp:
      metadata_file: okta.xml
    jwt_clock_skew_tolerance_seconds: 20
```

## OpenSearch Dashboards settings

The web browser SSO profile exchanges information through HTTP GET or POST. For example, after you log in to your IdP, it sends an HTTP POST back to OpenSearch Dashboards containing the SAML response. You must configure the base URL of your OpenSearch Dashboards installation where the HTTP requests are being sent to.

Name | Description
:--- | :---
`kibana_url` | The OpenSearch Dashboards base URL. Required.


## Username and Role attributes

Subjects (for example, user names) are usually stored in the `NameID` element of a SAML response:

```
<saml2:Subject>
  <saml2:NameID>admin</saml2:NameID>
  ...
</saml2:Subject>
```

If your IdP is compliant with the SAML 2.0 specification, you do not need to set anything special. If your IdP uses a different element name, you can also specify its name explicitly.

Role attributes are optional. However, most IdPs can be configured to add roles in the SAML assertions as well. If present, you can use these roles in your [role mappings]({{site.url}}{{site.baseurl}}/security/access-control/index/#concepts):

```
<saml2:Attribute Name='Role'>
  <saml2:AttributeValue >Everyone</saml2:AttributeValue>
  <saml2:AttributeValue >Admins</saml2:AttributeValue>
</saml2:Attribute>
```

If you want to extract roles from the SAML response, you need to specify the element name that contains the roles.

Name | Description
:--- | :---
`subject_key` | The attribute in the SAML response where the subject is stored. Optional. If not configured, the `NameID` attribute is used.
`roles_key` | The attribute in the SAML response where the roles are stored. Optional. If not configured, no roles are used.


## Request signing

Requests from the Security plugin to the IdP can optionally be signed. Use the following settings to configure request signing.

Name | Description
:--- | :---
`sp.signature_private_key` | The private key used to sign the requests or to decode encrypted assertions. Optional. Cannot be used when `private_key_filepath` is set.
`sp.signature_private_key_password` | The password of the private key, if any.
`sp.signature_private_key_filepath` | Path to the private key. The file must be placed under the OpenSearch `config` directory, and the path must be specified relative to that same directory.
`sp.signature_algorithm` | The algorithm used to sign the requests. See the next table for possible values.

The private key must be in PKCS#8 format. If you want to use an encrypted key, it must be encrypted with a PKCS#12-compatible algorithm (3DES).

The Security plugin supports the following signature algorithms.

Algorithm | Value
:--- | :---
DSA_SHA1 | http://www.w3.org/2000/09/xmldsig#dsa-sha1;
RSA_SHA1 | http://www.w3.org/2000/09/xmldsig#rsa-sha1;
RSA_SHA256 | http://www.w3.org/2001/04/xmldsig-more#rsa-sha256;
RSA_SHA384 | http://www.w3.org/2001/04/xmldsig-more#rsa-sha384;
RSA_SHA512 | http://www.w3.org/2001/04/xmldsig-more#rsa-sha512;


## Logout

Usually, IdPs provide information about their individual logout URL in their SAML 2.0 metadata. If this is the case, the Security plugin uses them to render the correct logout link in OpenSearch Dashboards. If your IdP does not support an explicit logout, you can force a re-login when the user visits OpenSearch Dashboards again.

Name | Description
:--- | :---
`sp.forceAuthn` | Force a re-login even if the user has an active session with the IdP.

Currently, the Security plugin supports only the `HTTP-Redirect` logout binding. Make sure this is configured correctly in your IdP.


## Exchange key settings

SAML, unlike other protocols, is not meant to be used for exchanging user credentials with each request. The Security plugin trades the SAML response for a lightweight JWT that stores the validated user attributes. This token is signed by an exchange key of your choice. Note that when you change this key, all tokens signed with it become invalid immediately.

Name | Description
:--- | :---
`exchange_key` | The key to sign the token. The algorithm is HMAC256, so it should have at least 32 characters.


## TLS settings

If you are loading the IdP metadata from a URL, we recommend that you use SSL/TLS. If you use an external IdP like Okta or Auth0 that uses a trusted certificate, you usually do not need to configure anything. If you host the IdP yourself and use your own root CA, you can customize the TLS settings as follows. These settings are used only for loading SAML metadata over HTTPS.

Name | Description
:--- | :---
`idp.enable_ssl` | Whether to enable the custom TLS configuration. Default is false (JDK settings are used).
`idp.verify_hostnames` | Whether to verify the hostnames of the server's TLS certificate.

Example:

```yml
authc:
  saml_auth_domain:
    http_enabled: true
    transport_enabled: false
    order: 1
    http_authenticator:
      type: saml
      challenge: true
      config:
        idp:
          enable_ssl: true
          verify_hostnames: true
          ...
    authentication_backend:
      type: noop
```


### Certificate validation

Configure the root CA used for validating the IdP TLS certificate by setting **one** of the following configuration options:

```yml
config:
  idp:
    pemtrustedcas_filepath: path/to/trusted_cas.pem
```

```yml
config:
  idp:
    pemtrustedcas_content: |-
      MIID/jCCAuagAwIBAgIBATANBgkqhkiG9w0BAQUFADCBjzETMBEGCgmSJomT8ixk
      ARkWA2NvbTEXMBUGCgmSJomT8ixkARkWB2V4YW1wbGUxGTAXBgNVBAoMEEV4YW1w
      bGUgQ29tIEluYy4xITAfBgNVBAsMGEV4YW1wbGUgQ29tIEluYy4gUm9vdCBDQTEh
      ...
```

Name | Description
:--- | :---
`idp.pemtrustedcas_filepath` | Path to the PEM file containing the root CAs of your IdP. The files must be placed under the OpenSearch `config` directory, and you must specify the path relative to that same directory.
`idp.pemtrustedcas_content` | The root CA content of your IdP server. Cannot be used when `pemtrustedcas_filepath` is set.


### Client authentication

The Security plugin can use TLS client authentication when fetching the IdP metadata. If enabled, the Security plugin sends a TLS client certificate to the IdP for each metadata request. Use the following keys to configure client authentication.

Name | Description
:--- | :---
`idp.enable_ssl_client_auth` | Whether to send a client certificate to the IdP server. Default is false.
`idp.pemcert_filepath` | Path to the PEM file containing the client certificate. The file must be placed under the OpenSearch `config` directory, and the path must be specified relative to the `config` directory.
`idp.pemcert_content` | The content of the client certificate. Cannot be used when `pemcert_filepath` is set.
`idp.pemkey_filepath` | Path to the private key of the client certificate. The file must be placed under the OpenSearch `config` directory, and the path must be specified relative to the `config` directory.
`idp.pemkey_content` | The content of the private key of your certificate. Cannot be used when `pemkey_filepath` is set.
`idp.pemkey_password` | The password of your private key, if any.


### Enabled ciphers and protocols

You can limit the allowed ciphers and TLS protocols for the IdP connection. For example, you can only enable strong ciphers and limit the TLS versions to the most recent ones.

Name | Description
:--- | :---
`idp.enabled_ssl_ciphers` | Array of enabled TLS ciphers. Only the Java format is supported.
`idp.enabled_ssl_protocols` | Array of enabled TLS protocols. Only the Java format is supported.


## Minimal configuration example
The following example shows the minimal configuration:

```yml
authc:
  saml_auth_domain:
    http_enabled: true
    transport_enabled: false
    order: 1
    http_authenticator:
      type: saml
      challenge: true
      config:
        idp:
          metadata_file: metadata.xml
          entity_id: http://idp.example.com/
        sp:
          entity_id: https://opensearch-dashboards.example.com
        kibana_url: https://opensearch-dashboards.example.com:5601/
        roles_key: Role
        exchange_key: 'peuvgOLrjzuhXf ...'
    authentication_backend:
      type: noop
```

## OpenSearch Dashboards configuration

Because most of the SAML-specific configuration is done in the Security plugin, just activate SAML in your `opensearch_dashboards.yml` by adding the following:

```yml
opensearch_security.auth.type: "saml"
```

In addition, you must add the OpenSearch Dashboards endpoint for validating the SAML assertions to your allow list:

```yml
server.xsrf.allowlist: ["/_opendistro/_security/saml/acs"]
```

If you use the logout POST binding, you also need to ad the logout endpoint to your allow list:

```yml
server.xsrf.allowlist: ["/_opendistro/_security/saml/acs", "/_opendistro/_security/saml/logout"]
```

To include SAML with other authentication types in the Dashboards sign-in window, see [Configuring sign-in options]({{site.url}}{{site.baseurl}}/security/configuration/multi-auth/).
{: .note }

#### Session management with additional cookies

To improve session management---especially for users who have multiple roles assigned to them---Dashboards provides an option to split cookie payloads into multiple cookies and then recombine the payloads when receiving them. This can help prevent larger SAML assertions from exceeding size limits for each cookie. The two settings in the following example allow you to set a prefix name for additional cookies and specify the number of them. They are added to the `opensearch_dashboards.yml` file. The default number of additional cookies is three:

```yml
opensearch_security.saml.extra_storage.cookie_prefix: security_authentication_saml
opensearch_security.saml.extra_storage.additional_cookies: 3
```

Note that reducing the number of additional cookies can cause some of the cookies that were in use before the change to stop working. We recommend establishing a fixed number of additional cookies and not changing the configuration after that.

If the ID token from the IdP is especially large, OpenSearch may throw a server log authentication error indicating that the HTTP header is too large. In this case, you can increase the value for the `http.max_header_size` setting in the `opensearch.yml` file.
{: .tip }

### IdP-initiated SSO

To use IdP-initiated SSO, set the Assertion Consumer Service endpoint of your IdP to this:

```
/_opendistro/_security/saml/acs/idpinitiated
```

Then add this endpoint to `server.xsrf.allowlist` in `opensearch_dashboards.yml`:

```yml
server.xsrf.allowlist: ["/_opendistro/_security/saml/acs/idpinitiated", "/_opendistro/_security/saml/acs", "/_opendistro/_security/saml/logout"]
```
