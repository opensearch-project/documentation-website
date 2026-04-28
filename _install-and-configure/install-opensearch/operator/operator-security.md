---
layout: default
title: User and role management
parent: OpenSearch Kubernetes Operator
grand_parent: Installing OpenSearch
nav_order: 60
---

# User and role management

User and role management is essential for controlling access to your OpenSearch cluster using the OpenSearch Security plugin. By default, the operator uses the included demo security configuration with default users. For production installations, replace this with your own configuration.

You can configure security in two ways:

- Defining your own security configuration
- Managing users and roles using Kubernetes resources

A combination of both approaches is not supported. After you start using CRDs, you cannot provide your own security configuration because they would overwrite each other.
{: .note}

## Defining your own security configuration

You can provide your own [security configuration]({{site.url}}{{site.baseurl}}/security/configuration/yaml/) with custom users and roles. Provide a secret containing all required security configuration YAML files.

Configure security using the following fields in the `OpenSearchCluster` custom resource:

```yaml
# ...
spec:
  security:
    config: # Everything related to the security configuration
      securityConfigSecret:
        name: # Name of the secret that contains the security configuration files
      adminSecret:
        name: # Name of a secret that contains the admin client certificate
      adminCredentialsSecret:
        name: # Name of a secret that contains username/password for admin access
# ...
```
{% include copy.html %}

Provide the name of the secret that contains your security configuration YAML files as `securityConfigSecret.name`. This secret acts as the authoritative configuration that you manage.

The operator creates its own runtime secret named `<cluster-name>-security-config-generated` and copies your files into it. If no secret is supplied, the operator uses the bundled defaults. The operator automatically updates the password hashes for the admin and OpenSearch Dashboards (`kibanaserver`) users before applying the configuration to the cluster.

You no longer need to provide password hashes for the `admin` or `kibanaserver` users in your security config secret. The operator automatically generates password hashes from the credentials secrets and overrides any hash values you provide in the security config secret for these users. This means you only need to manage passwords in one place (the credentials secrets), not in both the credentials secrets and the security config secret.
{: .important}

OpenSearch requires all the files to be applied when the cluster is first created. For the files that you do not provide in the security configuration secret, the operator uses the default files provided in the Security plugin.
{: .note}

To avoid using the default files, provide at least a minimum configuration for each file:

```yaml
tenants.yml: |-
  _meta:
    type: "tenants"
    config_version: 2
```
{% include copy.html %}

These minimum configuration files can later be removed from the secret so that you don't overwrite the resources created using the CRDs or the REST APIs when modifying other configuration files.

You can provide a secret as `adminCredentialsSecret.name` with fields `username` and `password` for a user that the operator uses for communicating with OpenSearch. The operator uses this user for retrieving cluster status, performing health checks, and coordinating node draining during cluster scaling operations.

If you omit this field, the operator automatically creates `<cluster-name>-admin-password` with the default `admin` username and a random password. The operator then generates the password hash and adds it to the generated security configuration.

If you provide your own secret, the operator reads the password from your secret, generates the hash, and adds it to the generated security configuration without modifying your source secret.

Similarly, for OpenSearch Dashboards, if you don't provide `dashboards.opensearchCredentialsSecret`, the operator automatically creates `<cluster-name>-dashboards-password` with a random password for the `kibanaserver` user and automatically generates the password hash and adds it to the generated security configuration.

You must also configure TLS for HTTP. You can either let the operator generate all needed certificates or supply them yourself. If you use your own certificates, you must also provide an admin certificate that the operator can use to apply the security configuration.

If you provide your own certificate for TLS over HTTP, you must also provide an admin client certificate (as a Kubernetes TLS secret with fields `ca.crt`, `tls.key`, and `tls.crt`) as `adminSecret.name`. The DN of the certificate must be listed under `security.tls.http.adminDn`.

The `adminDn` must be defined so that the admin certificate cannot be used or recognized as a node certificate. Otherwise, OpenSearch will reject any authentication request using the admin certificate.
{: .important}

To apply the security configuration to the OpenSearch cluster, the operator uses a separate Kubernetes job (named `<cluster-name>-securityconfig-update`). This job is run during the initial provisioning of the cluster. The operator also monitors the secret with the security configuration for any changes and then reruns the update job to apply the new config. Note that the operator only checks for changes in certain intervals, so it might take a minute or two for the changes to be applied. If the changes are not applied after a few minutes, use `kubectl` to check the logs of the pod of the `<cluster-name>-securityconfig-update` job. If you have an error in your configuration it will be reported there.

## Managing security configurations with Kubernetes resources

The operator provides custom Kubernetes resources that let you create, update, or manage security configuration resources such as users, roles, action groups, and tenants as Kubernetes objects.

### OpenSearch users

You can manage OpenSearch users in Kubernetes with the operator. The operator does not modify users that already exist. You can create an example user as follows:

```yaml
apiVersion: opensearch.org/v1
kind: OpensearchUser
metadata:
  name: sample-user
  namespace: default
spec:
  opensearchCluster:
    name: my-first-cluster
  passwordFrom:
    name: sample-user-password
    key: password
  backendRoles:
    - kibanauser
```
{% include copy.html %}

The namespace of the `OpenSearchUser` must be the namespace the OpenSearch cluster itself is deployed in.

A secret called `sample-user-password` must exist in the `default` namespace with the base64-encoded password in the `password` key.
{: .note}

You can also store multiple user passwords in the same secret. To do this, create a secret in which each key equals a user name and the value is the user password. Otherwise, changes in the secret do not trigger user reconciliation.

### OpenSearch roles

You can manage OpenSearch roles in Kubernetes with the operator. The operator does not modify roles that already exist. You can create an example role as follows:

```yaml
apiVersion: opensearch.org/v1
kind: OpensearchRole
metadata:
  name: sample-role
  namespace: default
spec:
  opensearchCluster:
    name: my-first-cluster
  clusterPermissions:
    - cluster_composite_ops
    - cluster_monitor
  indexPermissions:
    - indexPatterns:
        - logs*
      allowedActions:
        - index
        - read
```
{% include copy.html %}

### Linking OpenSearch users and roles

The operator allows you to link any number of users, backend roles, and roles with an OpensearchUserRoleBinding. Each user in the binding is granted each role:

```yaml
apiVersion: opensearch.org/v1
kind: OpensearchUserRoleBinding
metadata:
  name: sample-urb
  namespace: default
spec:
  opensearchCluster:
    name: my-first-cluster
  users:
    - sample-user
  backendRoles:
    - sample-backend-role
  roles:
    - sample-role
```
{% include copy.html %}

### OpenSearch action groups

You can manage OpenSearch action groups in Kubernetes with the operator. The operator does not modify action groups that already exist. You can create an example action group as follows:

```yaml
apiVersion: opensearch.org/v1
kind: OpensearchActionGroup
metadata:
  name: sample-action-group
  namespace: default
spec:
  opensearchCluster:
    name: my-first-cluster
  allowedActions:
    - indices:admin/aliases/get
    - indices:admin/aliases/exists
  type: index
  description: Sample action group
```
{% include copy.html %}

### OpenSearch tenants

You can manage OpenSearch tenants in Kubernetes with the operator. The operator does not modify tenants that already exist. You can create an example tenant as follows:

```yaml
apiVersion: opensearch.org/v1
kind: OpensearchTenant
metadata:
  name: sample-tenant
  namespace: default
spec:
  opensearchCluster:
    name: my-first-cluster
  description: Sample tenant
```
{% include copy.html %}

## Custom admin user

To create your cluster with an admin user different from the default, provide your own admin credentials secret. The operator automatically generates the password hash and adds it to the security config, so you no longer need to manually generate and include the password hash in your security config secret.

First, create a secret with your admin user configuration (in this example `admin-credentials-secret`):

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: admin-credentials-secret
type: Opaque
data:
  # admin
  username: YWRtaW4=
  # admin123
  password: YWRtaW4xMjM=
```
{% include copy.html %}

> You do not need to include the password hash in your security config secret. The operator automatically:
> 1. Reads the password from your `adminCredentialsSecret`
> 2. Generates the `bcrypt` hash
> 3. Overrides the `admin` user's hash in the generated security config secret (`<cluster-name>-security-config-generated`)
{: .important}

If you provide your own security configuration secret, you can optionally include the admin user definition, but any hash you provide is automatically overridden by the operator:

```yaml
internal_users.yml: |-
  _meta:
    type: "internalusers"
    config_version: 2
  admin:
    # hash field is optional - operator will override it automatically
    reserved: true
    backend_roles:
    - "admin"
    description: "Demo admin user"
```
{% include copy.html %}

Add the security configuration to your cluster `spec`:

```yaml
security:
  config:
    adminCredentialsSecret:
      name: admin-credentials-secret # The secret with the admin credentials for the operator to use
    securityConfigSecret:
      name: securityconfig-secret # Optional: The secret containing your customized security configuration
  tls:
    transport:
      generate: true
    http:
      generate: true
```
{% include copy.html %}

### Changing the admin password

To change the admin password after the cluster has been created, update the password in your `admin-credentials-secret`. The operator automatically:

1. Detects the password change.
2. Generates a new password hash.
3. Updates the generated security config secret.
4. Triggers a security config update job to apply the changes to OpenSearch.

You no longer need to manually update the password hash in the security config secret.

## Custom OpenSearch Dashboards user

OpenSearch Dashboards requires an OpenSearch user (typically `kibanaserver`) to connect to the cluster.

If you don't provide a custom credentials secret, the operator automatically:
1. Creates a secret named `<cluster-name>-dashboards-password` with a random password for the `kibanaserver` user.
2. Generates the password hash and automatically adds it to the generated security config secret.
3. Configures OpenSearch Dashboards to use these credentials.

To use custom credentials, create a secret with keys `username` and `password` and supply it to the operator using the cluster `spec`:

```yaml
spec:
  dashboards:
    opensearchCredentialsSecret:
      name: dashboards-credentials # This is the name of your secret that contains the credentials for OpenSearch Dashboards to use
```
{% include copy.html %}

> Similarly to configuring the admin user, you do not need to include the password hash for the `kibanaserver` user in your security config secret. The operator automatically:
> 1. Reads the password from your `opensearchCredentialsSecret` (or uses the generated random password if not provided)
> 2. Generates the `bcrypt` hash
> 3. Overrides the `kibanaserver` user's hash in the generated security config secret
{: .important}
