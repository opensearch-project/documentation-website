---
layout: default
title: Multi-authentication sign-in
parent: Configuration
nav_order: 3
---

# Multi-authentication sign-in for Dashboards

You can configure the sign-in window for OpenSearch Dashboards to provide either a single option for authenticating users at login or multiple options. Currently, Dashboards supports basic authentication, OpenID Connect, and SAML as choices for multi-authentication.

## General steps for configuring Dashboards sign-in

1. Decide which types of authentication are to be used.
1. Configure each authentication method to be used, including an authentication domain for the IdP and essential settings that let the authentication type access OpenSearch Dashboards.

See the related steps for each authentication type in the Configuration section of the security documentation:
* For OpenID Connect: [OpenSearch Dashboards single sign-on]({{site.url}}{{site.baseurl}}/security-plugin/configuration/openid-connect/#opensearch-dashboards-single-sign-on)
* For SAML: [OpenSearch Dashboards configuration]({{site.url}}{{site.baseurl}}/security-plugin/configuration/saml/#opensearch-dashboards-configuration)
* For JSON web tokens: [Configure JSON web tokens]({{site.url}}{{site.baseurl}}/security-plugin/configuration/configuration/#configure-json-web-tokens).
* For Proxy authentication: [OpenSearch Dashboards proxy authentication]({{site.url}}{{site.baseurl}}/security-plugin/configuration/proxy/#opensearch-dashboards-proxy-authentication).
{: .note }

1. Configure sign-in settings in the `opensearch_dashboards.yml` file.

## Enabling multi-authentication

The setting that determines single- or multi-authentication is `opensearch_security.auth.type`. You can add this setting to the `opensearch_dashboards.yml` file. By default, Dashboards provides a single sign-in environment for basic authentication. To specify the authentication type, list a single type or multiple types. When more than one authentication type is added to the setting, the Dashboards sign-in window recognizes multi-authentication and adjusts to accommodate multiple sign-in options.

For single sign-on, the authentication type is specified by adding a single type to the setting.

```yml
opensearch_security.auth.type: "openid"
```

For multi-authentication, add values to the setting as an array separated by commas. As a reminder, Dashboards currently supports a combination of basic authentication, OpenID Connect, and SAML as a valid set of values. In the setting, these values are expressed as `'basicauth'`, `'openid'`, and `'saml'`.

```yml
opensearch_security.auth.type: ['basicauth','openid']
```

```yml
opensearch_security.auth.type: ['basicauth','saml','openid']
```

When setting up Dashboards for multi-authentication, basic authentication is always required as one of the values for the setting.
{: .note }

## Customizing the sign-in environment

In addition to the essential sign-in settings for each authentication type, you can configure additional settings in the `opensearch_dashboards.yml` file to customize the sign-in window so that it clearly represents the options that are available. For example, you can replace the label on the sign-in button with the name and icon of the identification provider. Use the settings below to change the look and feel of the different options.

### Basic authentication settings

Setting | Description | Default value 
:--- | :--- |:--- |:--- |
`opensearch_security.ui.basicauth.login.buttonname` |  Display name for the login button | Log in 
`opensearch_security.ui.basicauth.login.brandimage` |  Logo for the login button | null 
`opensearch_security.ui.basicauth.login.showbrandimage` |  Determines whether a logo for the login button is displayed or not. | true 
`opensearch_security.ui.basicauth.login.buttonstyle` |  Login button style (what are other options for this setting? Styled in what way?) | btn-login 

### OpenID Connect authentication settings

Setting | Description | Default value | Required
:--- | :--- |:--- |:--- |
`opensearch_security.ui.openid.login.buttonname` |  Display name for the login button | Log in with single sign-on | No
`opensearch_security.ui.openid.login.brandimage` |  Logo for the login button | null | No
`opensearch_security.ui.openid.login.showbrandimage` |  Determines whether a logo for the login button is displayed or not. | false | No
`opensearch_security.ui.openid.login.buttonstyle` |  Login button style (what are other options for this setting? Styled in what way?) | btn-login | No

### SAML authentication settings

Setting | Description | Default value
:--- | :--- |:--- |:--- |
`opensearch_security.ui.saml.login.buttonname` |  Display name for the login button | Log in
`opensearch_security.ui.saml.login.brandimage` |  Logo for the login button | null
`opensearch_security.ui.saml.login.showbrandimage` |  Determines whether a logo for the login button is displayed or not. | false
`opensearch_security.ui.saml.login.buttonstyle` |  Login button style (what are other options for this setting? Styled in what way?) | btn-login

