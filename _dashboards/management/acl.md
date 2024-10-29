---
layout: default
title: ACL - permission control for saved objects
parent: Dashboards Management
nav_order: 10
---

It described the experience for users to manages the permissions to access the saved objects they own. Based on the workspace experience proposal, we proposes this saved objects access control design.
{: .important}

## Personas
There are following personas in *Workspace* use cases:
* **Dashboard admin**: the administrator of the OpenSearch Dashboards, who has complete access to all functions and data of OpenSearch Dashboards.
* **Workspace owner**: Workspace admin have complete access to workspace configurations and saved objects in the workspace. Workspace creator will become the workspace admin when a workspace is created. Workspace admin most time can be used exchangeably with and workspace owner. Workspace admin
* **Workspace content producer**: workspace operator has permission to view, create and update saved objects in the workspace.
* **Workspace viewer**: workspace operator only has permission to view the saved objects in the workspace

Please note that, the workspace admin, operator and viewer persona are specific to the workspace. e.g. one workspace operator in one workspace can be an admin in another workspace.