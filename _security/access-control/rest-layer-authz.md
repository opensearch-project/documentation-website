---
layout: default
title: REST layer authorization
parent: Access control
nav_order: 80
---


# REST layer authorization

Authorization on the REST layer provides an added level of security for plugin and extension API requests by offering a mechanism for authorization checks on the REST layer. This level of security sits atop the transport layer and provides a complementary method of authorization without replacing, modifying, or in any way changing the same process on the transport layer. REST layer authorization was initially created to address the need for an authorization check for extensions, which do not communicate on the transport layer. However, the feature is also available to developers who wish to use it when creating future plugins for OpenSearch.

For users that work with REST layer authorization, the methods of assigning roles and mapping users and roles, and the general usage of plugins and extensions, remain the same---the only additional requirement being that users become familiar with a new scheme for permissions. 

Developers, on the other hand, will need to understand the ideas behind `NamedRoute` and how the new route scheme is constructed. For detailed information, see [Authorization at REST Layer for plugins](https://github.com/opensearch-project/security/blob/main/REST_AUTHZ_FOR_PLUGINS.md).

The benefits of using the REST layer for authorization include the ability to authorize requests at the REST layer and filter out unauthorized requests. As a result, this decreases the processing burden on the transport layer while allowing granular control over access to APIs.

You must have the Security plugin enabled to use REST layer authorization.
{: .note }


## NamedRoute

REST layer authorization provides cluster administrators with the ability to grant or revoke access to specific endpoints in a cluster. To achieve this, the route to the resource uses a unique name.

To facilitate REST layer authorization, the OpenSearch Project has introduced the idea of [`NamedRoute`](https://github.com/opensearch-project/OpenSearch/blob/main/server/src/main/java/org/opensearch/rest/NamedRoute.java) for route registration. For developers, this standard requires a new method of registering routes that uses a unique name. While transport actions typically consist of a method name, a part, and a corresponding transport action, this new implementation requires a method name, a part, and a unique name for the route. As the name suggests, it is essential that it be unique among all plugins and extensions or, in other words, not registered to any other route.

For example, consider the following route for an Anomaly Detection resource:

`_/detectors/<detectorId>/profile`

For extensions, you can create a `NamedRoute` from this by referencing the `routeNamePrefix` value in the `settings.yml` file for the resource (`ad` in this case) and adding it to the route to complete a unique name. The result is shown in the following example:

`ad:detectors/profile`

For plugins, you can use the plugin's name instead of the `routeNamePrefix` value.

The route name can then be mapped to a role in the same way a traditional permission is mapped. This is demonstrated in the following example:

```yml
ad_role:
  reserved: true
  cluster_permissions:
    - 'ad:detectors/profile'
```


## Mapping users and roles

There is no change to the way you map users and roles with `NamedRoute`. Also, the new format for the permission is compatible with existing configurations. This section provides an example of how user and role mappings appear for legacy and `NamedRoute` configurations and how they authorize registered routes for actions.

When a user initiates a REST request, the user's roles are examined, and each permission associated with the user is evaluated to determine whether there is a match with the unique name assigned to the route or a match with any of the legacy actions defined during the route's registration. A user can be mapped to roles that contain permissions formatted for a unique name or a legacy action. Consider the following role for a fictional plugin `abc`:

```yml
abcplugin_read_access:
   reserved: true
   cluster_permissions:
     - 'cluster:admin/opensearch/abcplugin/route/get'
```

Also consider the following role mapping:

```yml
abcplugin_read_access:
	 reserved: true
	 users:
		 - "user-A"
```

If `user-A` makes a REST API call to the route `/_plugins/_abcplugin/route/get`, the user is granted authorization for the action. However, for a different route, such as `/_plugins/_abcplugin/route/delete`, the request is denied.

The same logic holds true for roles and role mappings that use a unique name for the route and the concept of `NamedRoute`. Consider the following role for the same plugin `abc`:

```yml
abcplugin_read_access_nr:
   reserved: true
   cluster_permissions:
     - 'abcplugin:routeGet'
     - 'abcplugin:routePut'
     - 'abcplugin:routeDelete'
```

Also consider the following role mapping:

```yml
abcplugin_read_access_nr:
	 reserved: true
	 users:
		 - "user-B"
```

In this second case, if `user-B` makes a REST API call to any of the routes `/_plugins/_abcplugin/route/get`, `/_plugins/_abcplugin/route/put`, or `/_plugins/_abcplugin/route/delete`, the user is granted authorization for the action.

