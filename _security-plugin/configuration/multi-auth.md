---
layout: default
title: Multi-option sign-in
parent: Configuration
nav_order: 3
---

# Multi-option sign-in for Dashboards

You can configure the sign-in window for OpenSearch Dashboards to provide either a single option for authenticating users at login or multiple options. Currently, Dashboards supports basic authentication, OpenID Connect, and SAML as choices for multi-option authentication.

## General steps for configuring multi-option sign-in

1. Decide which types of authentication are to be made available at sign-in.
1. Configure each authentication type, including an authentication domain for the identification provider (IdP) and the essential settings that give each type sign-in access to OpenSearch Dashboards (see steps for each type in the Configuration section of the security documentation).
1. Add and configure multi-option authentication sign-in settings in the `opensearch_dashboards.yml` file.

## Enabling multi-option sign-in

The setting that determines single- or multi-option authentication is `opensearch_security.auth.type`. You can add this setting to the `opensearch_dashboards.yml` file. By default, Dashboards provides a single sign-in environment for basic authentication. To specify the authentication type, provide a single type or multiple types for the setting. When more than one authentication type is added to the setting, the Dashboards sign-in window recognizes multiple types and adjusts to accommodate the sign-in options.

For single sign-in, the authentication type is specified by adding a single type to the setting.

```yml
opensearch_security.auth.type: "openid"
```

For multi-option authentication, add values to the setting as an array separated by commas. As a reminder, Dashboards currently supports a combination of basic authentication, OpenID Connect, and SAML as a valid set of values. In the setting, these values are expressed as `"basicauth"`, `"openid"`, and `"saml"`.

```yml
opensearch_security.auth.type: ["basicauth","openid"]
```

```yml
opensearch_security.auth.type: ["basicauth","saml"]
```

```yml
opensearch_security.auth.type: ["basicauth","saml","openid"]
```

When setting up Dashboards for multi-option authentication, basic authentication is always required as one of the values for the setting.
{: .note }

## Customizing the multi-option sign-in environment

In addition to the essential sign-in settings for each authentication type, you can configure additional settings in the `opensearch_dashboards.yml` file to customize the sign-in window so that it clearly represents the options that are available. For example, you can replace the label on the sign-in button with the name and icon of the IdP. Use the settings below to change the look and feel of the different options.

<img src="{{site.url}}{{site.baseurl}}/images/Security/Multi-opt-auth.png" alt="Multi-option sign-in window" width="350">

### Basic authentication settings

The settings below are used to customize the basic username and password sign-in button.

Setting | Description | Default value 
:--- | :--- |:--- |:--- |
`opensearch_security.ui.basicauth.login.buttonname` |  Display name for the login button | Log in 
`opensearch_security.ui.basicauth.login.brandimage` |  Login button logo. Supported file types are SVG, PNG, and GIF. | null 
`opensearch_security.ui.basicauth.login.showbrandimage` |  Determines whether a logo for the login button is displayed or not. | true 
`opensearch_security.ui.basicauth.login.buttonstyle` |  Login button style (what are other options for this setting? Styled in what way?) | btn-login 

### OpenID Connect authentication settings

These settings allow you to customize the sign-in button associated with OpenID Connect authentication. For the essential settings required for single sign-in using OpenID Connect, see [OpenSearch Dashboards single sign-on]({{site.url}}{{site.baseurl}}/security-plugin/configuration/openid-connect/#opensearch-dashboards-single-sign-on).

Setting | Description | Default value
:--- | :--- |:--- |:--- |
`opensearch_security.ui.openid.login.buttonname` |  Display name for the login button | Log in with single sign-on
`opensearch_security.ui.openid.login.brandimage` |  Login button logo. Supported file types are SVG, PNG, and GIF. | null
`opensearch_security.ui.openid.login.showbrandimage` |  Determines whether a logo for the login button is displayed or not. | false
`opensearch_security.ui.openid.login.buttonstyle` |  Login button style (what are other options for this setting? Styled in what way?) | btn-login

### SAML authentication settings

These settings allow you to customize the sign-in button associated with SAML authentication. For the essential settings required for single sign-in using SAML, see [OpenSearch Dashboards configuration]({{site.url}}{{site.baseurl}}/security-plugin/configuration/saml/#opensearch-dashboards-configuration).

Setting | Description | Default value
:--- | :--- |:--- |:--- |
`opensearch_security.ui.saml.login.buttonname` |  Display name for the login button | Log in
`opensearch_security.ui.saml.login.brandimage` |  Login button logo. Supported file types are SVG, PNG, and GIF. | null
`opensearch_security.ui.saml.login.showbrandimage` |  Determines whether a logo for the login button is displayed or not. | false
`opensearch_security.ui.saml.login.buttonstyle` |  Login button style (what are other options for this setting? Styled in what way?) | btn-login

