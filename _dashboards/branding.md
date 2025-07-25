---
layout: default
title: Custom branding
nav_order: 200
canonical_url: https://docs.opensearch.org/latest/dashboards/branding/
---

# OpenSearch Dashboards custom branding
Introduced 1.2
{: .label .label-purple }

By default, OpenSearch Dashboards uses the OpenSearch logo, but if you want to use custom branding elements such as the favicon or main Dashboards logo, you can do so by editing `opensearch_dashboards.yml` or by including a custom `opensearch_dashboards.yml` file when you start your OpenSearch cluster.

For example, if you're using Docker to start your OpenSearch cluster, include the following lines in the `opensearch-dashboards` section of your `docker-compose.yml` file:

```
volumes:
  - ./opensearch_dashboards.yml:/usr/share/opensearch-dashboards/config/opensearch_dashboards.yml
```

Doing so replaces the Docker image's default `opensearch_dashboards.yml` with your custom `opensearch_dashboards.yml` file, so be sure to include your desired settings as well. For example, if you want to configure TLS for OpenSearch Dashboards, see [Configure TLS for OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/install/tls).

Re-launch OpenSearch Dashboards, and OpenSearch Dashboards now uses your custom elements.

## Branding elements

The following elements in OpenSearch Dashboards are customizable:

![OpenSearch customizable branding elements]({{site.url}}{{site.baseurl}}/images/dashboards-branding-labels.png)

Setting | Corresponding branding element
:--- | :---
logo | Header logo. See #1 in the image.
mark | OpenSearch Dashboards mark. See #2 in the image.
loadingLogo | Loading logo used when OpenSearch Dashboards is starting. See #3 in the image.
faviconUrl | Website icon. Loads next to the application title. See #4 in the image.
applicationTitle | The application's title. See #5 in the image.

To start using your own branding elements in OpenSearch Dashboards, first uncomment this section of `opensearch_dashboards.yml`:

```yml
# opensearchDashboards.branding:
  # logo:
    # defaultUrl: ""
    # darkModeUrl: ""
  # mark:
    # defaultUrl: ""
    # darkModeUrl: ""
  # loadingLogo:
    # defaultUrl: ""
    # darkModeUrl: ""
  # faviconUrl: ""
  # applicationTitle: ""
```

Add the URLs you want to use as branding elements to the appropriate setting. Valid image types are `SVG`, `PNG`, and `GIF`.

Customization of dark mode Dashboards is also available, but you first must supply a valid link to `defaultUrl`, and then link to your preferred image with `darkModeUrl`. You are not required to customize all branding elements, so if you wanted to, it's perfectly valid to change just the logo. Leave unchanged elements as commented.

The following example demonstrates how to use `SVG` files as logos but leaves the other elements as defaults.

```yml
logo:
  defaultUrl: "https://example.com/validUrl.svg"
  darkModeUrl: "https://example.com/validDarkModeUrl.svg"
# mark:
#   defaultUrl: ""
#   darkModeUrl: ""
# loadingLogo:
#   defaultUrl: ""
#   darkModeUrl: ""
# faviconUrl: ""
applicationTitle: "My custom application"
```

We recommend linking to images that are hosted on a web server, but if you really want to use locally hosted images, save your images inside `src/core/server/core_app/assets`, and then configure `opensearch_dashboards.yml`. You can access locally stored images through the `ui` folder.

The following example assumes the default port of 5601 that Dashboards uses and demonstrates how to link to locally stored images.

```yml
logo:
  defaultUrl: "https://localhost:5601/ui/my-own-image.svg"
  darkModeUrl: "https://localhost:5601/ui/my-own-image.svg"
mark:
  defaultUrl: "https://localhost:5601/ui/my-own-image2.svg"
  darkModeUrl: "https://localhost:5601/ui/my-own-image2.svg"
# loadingLogo:
#   defaultUrl: ""
#   darkModeUrl: ""
# faviconUrl: ""
applicationTitle: "My custom application"
```

We don't recommend this workaround because new versions of Dashboards would revert all customized elements back to default branding elements, and you would have to re-upload your assets to access them again.

## Sample configuration

The following configuration enables the security plugin within OpenSearch Dashboards and uses custom branding elements to replace the OpenSearch logo and application title.

```yml
server.host: "0"
opensearch.hosts: ["https://localhost:9200"]
opensearch.ssl.verificationMode: none
opensearch.username: "kibanaserver"
opensearch.password: "kibanaserver"
opensearch.requestHeadersWhitelist: [ authorization,securitytenant ]

opensearch_security.multitenancy.enabled: true
opensearch_security.multitenancy.tenants.preferred: ["Private", "Global"]
opensearch_security.readonly_mode.roles: ["kibana_read_only"]
# Use this setting if you are running opensearch-dashboards without https
opensearch_security.cookie.secure: false

opensearchDashboards.branding:
  logo:
    defaultUrl: "https://example.com/sample.svg"
    darkModeUrl: "https://example.com/sample.svg"
  # mark:
  #   defaultUrl: ""
  #   darkModeUrl: ""
  # loadingLogo:
  #   defaultUrl: ""
  #   darkModeUrl: ""
  # faviconUrl: ""
  applicationTitle: "Just some testing"
```
