---
layout: default
title: Network compression
nav_order: 135
---

# Network compression
**Introduced 1.0**
{: .label .label-purple }

OpenSearch Dashboards supports automatic compression of JavaScript and CSS bundles to reduce network transfer sizes. This feature is especially useful when deploying OpenSearch Dashboards behind a proxy, gateway, or load balancer that has response size limitations.

## Compression methods

OpenSearch Dashboards generates pre-compressed versions of all plugin bundles using the following compression algorithms:

- **Brotli (br)**: Modern compression algorithm providing the best compression ratio
- **Gzip (gz)**: Widely supported compression algorithm with good compatibility

When a client requests a bundle file, OpenSearch Dashboards automatically serves the compressed version if the client sends the appropriate `Accept-Encoding` header. If no compression encoding is specified, OpenSearch Dashboards serves the uncompressed file.

## Compression effectiveness

The following table shows typical compression ratios for large plugin bundles, using the observability plugin as an example:

| Compression method | File size | Compression ratio |
|:---|:---|:---|
| Brotli (br) | ~1.8 MB | ~86% reduction |
| Gzip (gz) | ~2.5 MB | ~80% reduction |
| Uncompressed | ~12.6 MB | Baseline |

The actual compression ratio varies depending on the plugin and its dependencies.

## Configuration

Compression is enabled by default. You can control compression behavior using the following settings in `opensearch_dashboards.yml`.

### `server.compression.enabled`

Enables or disables HTTP compression for all responses. When set to `false`, OpenSearch Dashboards serves only uncompressed content, regardless of client headers.

- **Type**: Boolean
- **Default**: `true`
- **Example**:

  ```yaml
  server:
    compression:
      enabled: true
  ```
  {% include copy.html %}

### `server.compression.referrerWhitelist`

Limits compression to requests from specific referrer hostnames. When this setting is configured, OpenSearch Dashboards only compresses responses for requests that come from the specified referrers. This setting is only valid when `server.compression.enabled` is `true`.

- **Type**: Array of strings
- **Default**: Not set (compression enabled for all referrers)
- **Example**:

  ```yaml
  server:
    compression:
      enabled: true
      referrerWhitelist:
        - trusted-proxy.example.com
        - api-gateway.example.com
  ```
  {% include copy.html %}

## Using compression with proxies

When deploying OpenSearch Dashboards behind a proxy, gateway, or load balancer, configure your proxy to request compressed content by including the `Accept-Encoding` header in upstream requests.

### Example: Requesting Brotli compression

```bash
curl -H 'Accept-Encoding: br' \
  https://your-dashboards-host/bundles/plugin/observabilityDashboards/observabilityDashboards.plugin.js
```
{% include copy.html %}

The response includes the `Content-Encoding: br` header, indicating that Brotli compression was applied:

```bash
HTTP/1.1 200 OK
content-type: application/javascript; charset=utf-8
cache-control: max-age=31536000
content-encoding: br
osd-name: dashboards-opensearch-dashboards-55cf49965-9bcwz
vary: accept-encoding
Date: Wed, 08 May 2024 00:01:14 GMT
Connection: keep-alive
Keep-Alive: timeout=120
Transfer-Encoding: chunked
```

### Example: Requesting Gzip compression

```bash
curl -H 'Accept-Encoding: gzip' \
  https://your-dashboards-host/bundles/plugin/observabilityDashboards/observabilityDashboards.plugin.js
```
{% include copy.html %}

The response includes the `Content-Encoding: gzip` header:

```bash
HTTP/1.1 200 OK
content-type: application/javascript; charset=utf-8
cache-control: max-age=31536000
content-encoding: gzip
osd-name: dashboards-opensearch-dashboards-55cf49965-9bcwz
vary: accept-encoding
Date: Wed, 08 May 2024 00:01:14 GMT
Connection: keep-alive
Keep-Alive: timeout=120
Transfer-Encoding: chunked
```

### Example: No compression

If you don't specify an `Accept-Encoding` header (or if compression is disabled), OpenSearch Dashboards serves the uncompressed file:

```bash
curl https://your-dashboards-host/bundles/plugin/observabilityDashboards/observabilityDashboards.plugin.js
```
{% include copy.html %}

### Proxy configuration examples

#### NGINX

Configure NGINX to request compressed content from OpenSearch Dashboards:

```json
location / {
    proxy_pass http://opensearch-dashboards:5601;
    proxy_set_header Accept-Encoding "br, gzip";
    proxy_set_header Host $host;
}
```
{% include copy.html %}

#### Apache

Configure Apache to request compressed content from OpenSearch Dashboards:

```xml
<Location />
    ProxyPass http://opensearch-dashboards:5601/
    ProxyPassReverse http://opensearch-dashboards:5601/
    RequestHeader set Accept-Encoding "br, gzip"
</Location>
```
{% include copy.html %}

## Proxy response size limits

If your proxy or gateway has response size limits (for example, 10 MB), follow these steps to address them:

1. Configure your proxy to request Brotli compression first (best compression ratio):
   ```
   Accept-Encoding: br, gzip
   ```
   {% include copy.html %}

2. Verify that the compressed bundle size is within your proxy's limits. Most OpenSearch Dashboards plugin bundles compress to less than 3 MB with Brotli.

3. If issues persist, consider increasing your proxy's response size limit or breaking large plugins into smaller components.

## Browser support

All modern browsers automatically include the `Accept-Encoding` header in their requests and transparently decompress responses. Compression is handled automatically without any configuration required on the browser side.

Browser support for compression methods:

- **Brotli**: Supported in all modern browsers (Chrome, Firefox, Safari, Edge)
- **Gzip**: Universally supported by all browsers
