---
layout: default
title: REST layer authorization
parent: Access control
nav_order: 80
---

# REST layer authorization

Authorization on the REST layer provides an additional level of security on top of the transport layer for redundancy and as a safety net. This layer is additional to the original method of authorization on the transport layer.
Legacy authentication is done on the transport layer.  authorization checks in the REST layer.

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

and a role mapping to a ficticious user:

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
