---
layout: default
title: REST layer authorization
parent: Access control
nav_order: 80
---


# REST layer authorization

Authorization on the REST layer provides an added level of security for plugin and extension API requests by offering a mechanism for authorization checks on the REST layer. This level of security sits atop the transport layer and provides a complementary method of authorization without replacing, modifying, or in any way changing the same process on the transport layer. REST layer authorization was initially created to address the need for an authorization check for extensions, which do not communicate on the transport layer. However, the feature is also supported for existing plugins and will be available for future plugins created to operate with OpenSearch.

For users that work with REST layer authorization, the methods of assigning roles and mapping users and roles, and the general usage of plugins and extensions, remain the same: the only additional requirement being that users become familiar with a new permission structure. Developers, on the other hand, will need to understand the ideas behind `NamedRoute` and how the new route scheme is constructed. Fore more detailed information, see [Authorization at REST Layer for plugins](https://github.com/opensearch-project/security/blob/main/REST_AUTHZ_FOR_PLUGINS.md).


## NamedRoute

REST layer authorization provides cluster administrators with the ability to grant or revoke access to specific endpoints in a cluster. To achieve this, the route to the resource uses a unique name.

To facilitate REST layer authorization, OpenSearch introduces the idea of [`NamedRoute`](https://github.com/opensearch-project/OpenSearch/blob/main/server/src/main/java/org/opensearch/rest/NamedRoute.java) for route registration. For developers, this standard requires a new method for registering routes that includes a unique name. While transport actions typically consist of a method name, a part, and a corresponding transport action, this new implementation requires a method name, a part, and a unique name for the route. As the name suggests, it is essential that the name be unique among all plugins and extensions or, in other words, not registered for any other route.

For example, consider the following URL for an Anomaly Detection resource:

`POST _/detectors/<detectorId>/profile`

To create a NamedRoute from this, the `routeNamePrefix` value in the `settings.yml` file for the resource `ad` is added to the route to complete a unique name. The result is shown in the following example:

`ad:detectors/profile`

The route name can then be mapped to a role in the same way a traditional permission is mapped. This is demonstrated in the following example:

```yml
ad_role:
  reserved: true
  cluster_permissions:
    - 'ad:detectors/profile'
```


## The authorization process on transport and REST layers

OpenSearch supports both legacy authorization on the transport layer and authorization on the REST layer. This section describes how authorization is processed to support both conventions. 

When a user initiates a REST request, the user's roles are examined, and each permission associated with the user is evaluated to determine whether there is a match with the unique name assigned to the route or a match with any of the legacy actions defined during the route's registration. A user can be mapped to roles that contain permissions formatted for a unique name or a legacy action. Consider the following role for a fictional plugin "abc":

```yml
abcplugin_read_access:
  reserved: true
  cluster_permissions:
    - 'cluster:admin/opensearch/abcplugin/route/get'
    - 'cluster:admin/opensearch/abcplugin/route/put'
```






The Security plugin must be enabled to use authorization on the REST layer.
{: .note }

The remainder of this section discusses the basics between legacy permission patterns and the new scheme.   

redundancy and as a safety net. Legacy authentication is done on the transport layer.

Extensions  do not communicate on the transport layer and operate outside of core processes. Therefore, this gives rise to an implementation of authorization on the REST layer.  
This implementation will allow all incoming request to be authorized before they are handed over to ActionHandler. (This step was previously done at Transport Layer before action execution)

Permission patterns have changed to reflect mapping to a route rather than to the transport layer. use the route mapping to validate against permissions in roles. Instead of registering a transport level action to the security plugin, and then when a REST API call comes in it goes to ... When registering an endpoint, we also register a unique name assocaited with the endpoint, and for existing ones, we add a separate legacy action transport name

Instead of having a method name, part, and transport actions, the new route requires a method name, part, and unique name for the route. 

All new and existing routes are registered with a unique name.
The registered name is mapped to a role.
Permissions for REST layer access are evaluated by comparing the request route's action against the new actions in the role.

Current security model enforces authorization checks at Transport Layer. There is no authorization mechanism in place at REST Layer. Since Extensions will not communicate with the cluster at Transport Layer, it is essential to implement some form of authorization to apply security.

    As a user, using basic http auth, my requests to extensions are controlled based on my permissions
    As a developer I can define the roles/permissions required in order to access my extension and my extension's APIs.
    As an extension developer, I can check a user's permission for resources managed by my extension
    As a user, when I run an extension I do not have to worry about it accessing data and configurations on the cluster to which it should not have permissions.
    As a user, when I run an extension, it should not allow me to access data and configurations on the cluster which I do not have permissions for.


## Permissions for extensions

Introduced concept of NamedRoutes - unique name for each and every route

 introduce authorization in REST layer, a concept of `NamedRoute` was introduced in core. A NamedRoute provides cluster admins an ability to grant/revoke access to specific endpoints in a cluster. This is introduced as an optional feature for plugins, and a mandatory feature for extensions since they don't interact with the cluster at transport layer and so the only way to authorize these requests would be at REST layer. To enforce all routes to be NamedRoute, a change was made in SDK: opensearch-project/opensearch-sdk-java#827 to enforce declaring new routes as NamedRoute.

 Authorization will be performed at REST layer.

1. Before request is forwarded to ExtensionHandler, user is authorized against requested route. If user doesn't have access then a 403 is thrown and request is failed. If user has permissions, request then proceeds to extensions.

  The remaining steps are only applicable to extensions that interact with data in core OpenSearch.
  {: .note }

1. User's permissions are checked against the requested action. If it fails, send the failure response. (403)

1. If it succeeds, then extension's permissions will be authorized against requested action. If it fails, send the failure response. (403)

1. Once both authorizations are successful, we can then populate threadContext with a header that states that this request for User X and Extension Y is authorized to perform this action.


Comparison of permission structures
A fictional HelloWorld extension, legacy permissions look like this:

```yml
legacy_hw_greet:
  reserved: true
  cluser_permissions:
   - 'cluster:admin/opensearch/hw/greet'
```

and a role mapping to a fictitious user:

```yml
legacy_hw_greet:
  reserved: true
  users:
   - "new-user"
```
And the new permission pattern:

```yml
extension_hw_greet_with_name:
  reserved: true
  cluster_permissions:
   - 'hw:greet_with_name'
```
and the role mapping for this user:

```yml
extension_hw_greet_with_name:
  reserved: true
  users:
   - "new-user"
```

benefits:
Plugin developers will not need to build transport layer actions and get authorization on them to adhere to security procedures. Decreases the code-writing burden and time investment creating a single action. Instead they can create REST API actions and authorize them on the REST layer.
Transport layer actions will still be needed for node-to-node communications. However, most plugins are not built to run transport actions.
Extensions don't ever use transport actions.
