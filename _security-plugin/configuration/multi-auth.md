---
layout: default
title: Multi-option sign-in
parent: Configuration
nav_order: 3
---

# Multi-option sign-in for Dashboards

You can configure the sign-in window for OpenSearch Dashboards to provide either a single option for authenticating users at login or multiple options. Currently, Dashboards supports basic authentication, OpenID Connect, and SAML as choices for multi-option authentication.

## General steps for configuring multi-option sign-in

1. Decide which types of authentication to make available at sign-in.
1. Configure each authentication type, including an authentication domain for the identification provider (IdP) and the essential settings that give each type sign-in access to OpenSearch Dashboards (see steps for each authentication type in the Configuration section of the security documentation).
1. Add, enable, and configure multi-option authentication sign-in settings in the `opensearch_dashboards.yml` file.

## Enabling multi-option sign-in

By default, Dashboards provides a single sign-in environment for basic authentication. To enable multiple options for authentication at sign-in, begin by adding `opensearch_security.auth.multiple_auth_enabled` to the `opensearch_dashboards.yml` file and setting it to `true`.

To specify the authentication types for multi-option sign-in, add the `opensearch_security.auth.type` setting to the `opensearch_dashboards.yml` file and enter multiple types as values. When more than one authentication type is added to the setting, the Dashboards sign-in window recognizes multiple types and adjusts to accommodate the sign-in options.

For single sign-in, the authentication type is specified by adding a single type to the setting.

```yml
opensearch_security.auth.type: "openid"
```

For multi-option authentication, add values to the setting as an array separated by commas. As a reminder, Dashboards currently supports a combination of basic authentication, OpenID Connect, and SAML as a valid set of values. In the setting, these values are expressed as `"basicauth"`, `"openid"`, and `"saml"`.

```yml
opensearch_security.auth.type: ["basicauth","openid"]
opensearch_security.auth.multiple_auth_enabled: true
```

```yml
opensearch_security.auth.type: ["basicauth","saml"]
opensearch_security.auth.multiple_auth_enabled: true
```

```yml
opensearch_security.auth.type: ["basicauth","saml","openid"]
opensearch_security.auth.multiple_auth_enabled: true
```

When the `opensearch_security.auth.type` setting contains `basicauth` and one other authentication type, the sign-in window appears as in the example below.

<img src="{{site.url}}{{site.baseurl}}/images/Security/OneOptionWithoutLogo.png" alt="Basic authentication and one other type in the sign-in window" width="350">

With all three valid authentication types specified, the sign-in window appears as in the following example:

<img src="{{site.url}}{{site.baseurl}}/images/Security/TwoOptionWithoutLogo.png" alt="All three authentication types specified in the sign-in window" width="350">

When setting up Dashboards for multi-option authentication, basic authentication is always required as one of the values for the setting.
{: .note }

## Customizing the multi-option sign-in environment

In addition to the essential sign-in settings for each authentication type, you can configure additional settings in the `opensearch_dashboards.yml` file to customize the sign-in window so that it clearly represents the options that are available. For example, you can replace the label on the sign-in button with the name and icon of the IdP. Use the settings below to change the look and feel of the different options.

<img src="{{site.url}}{{site.baseurl}}/images/Security/TwoOptionWithLogo.png" alt="Multi-option sign-in window with with some customization" width="350">

### Basic authentication settings

The settings below are used to customize the basic username and password sign-in button.

Setting | Description
:--- | :--- |:--- |:--- |
`opensearch_security.ui.basicauth.login.buttonname` |  Display name for the login button. "Log in" by default.
`opensearch_security.ui.basicauth.login.brandimage` |  Login button logo. Supported file types are SVG, PNG, and GIF.
`opensearch_security.ui.basicauth.login.showbrandimage` |  Determines whether a logo for the login button is displayed or not. Default is `true`. 

### OpenID Connect authentication settings

These settings allow you to customize the sign-in button associated with OpenID Connect authentication. For the essential settings required for single sign-in using OpenID Connect, see [OpenSearch Dashboards single sign-on]({{site.url}}{{site.baseurl}}/security-plugin/configuration/openid-connect/#opensearch-dashboards-single-sign-on).

Setting | Description
:--- | :--- |:--- |:--- |
`opensearch_security.ui.openid.login.buttonname` |  Display name for the login button. "Log in with single sign-on" by default.
`opensearch_security.ui.openid.login.brandimage` |  Login button logo. Supported file types are SVG, PNG, and GIF.
`opensearch_security.ui.openid.login.showbrandimage` |  Determines whether a logo for the login button is displayed or not. Default is `false`.

### SAML authentication settings

These settings allow you to customize the sign-in button associated with SAML authentication. For the essential settings required for single sign-in using SAML, see [OpenSearch Dashboards configuration]({{site.url}}{{site.baseurl}}/security-plugin/configuration/saml/#opensearch-dashboards-configuration).

Setting | Description
:--- | :--- |:--- |:--- |
`opensearch_security.ui.saml.login.buttonname` |  Display name for the login button. "Log in with single sign-on" by default.
`opensearch_security.ui.saml.login.brandimage` |  Login button logo. Supported file types are SVG, PNG, and GIF.
`opensearch_security.ui.saml.login.showbrandimage` |  Determines whether a logo for the login button is displayed or not. Default is `false`.

## Sample setup
The following example shows basic settings in the `opensearch_dashboards.yml` file  when configured for two options at sign-in.

```yml
server.host: 0.0.0.0
server.port: 5601
opensearch.hosts: ["https://localhost:9200"]
opensearch.ssl.verificationMode: none
opensearch.username: <preferred username>
opensearch.password: <preferred password>
opensearch.requestHeadersAllowlist: ["securitytenant","Authorization"]
opensearch_security.multitenancy.enabled: true
opensearch_security.multitenancy.tenants.preferred: ["Private", "Global"]
opensearch_security.readonly_mode.roles: ["<role_for_read_only>"]

# Settings that enable multi-option authentication in sign-in window
opensearch_security.auth.multiple_auth_enabled: true
opensearch_security.auth.type: ["basicauth","openid"]

# Basic authentication customization #
opensearch_security.ui.basicauth.login.buttonname: Log in
opensearch_security.ui.basicauth.login.brandimage: <path/to/OSlogo.png>
opensearch_security.ui.basicauth.login.showbrandimage: true

# OIDC auth customization and start #
opensearch_security.ui.openid.login.buttonname: Log in with <IdP name or other> 
opensearch_security.ui.openid.login.brandimage: <path/to/brand-logo.png>
opensearch_security.ui.openid.login.showbrandimage: true

opensearch_security.openid.base_redirect_url: <"OIDC redirect URL">
opensearch_security.openid.verify_hostnames: false
opensearch_security.openid.refresh_tokens: false
opensearch_security.openid.logout_url: <"OIDC logout URL">

opensearch_security.openid.connect_url: "<OIDC connect URL>"
opensearch_security.openid.client_id: <Client ID>
opensearch_security.openid.client_secret: <Client secret>
```
