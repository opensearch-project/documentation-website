---
layout: default
title: Workspace initial - New home page
parent: Workspace
nav_order: 0
---

## Onboard opensearch dashboard with workspace

### New home page
The opensearch dashboard has an amazing new home page where you can clearly see all workspaces.

<img src="{{site.url}}{{site.baseurl}}/images/workspace/workspace-initial/home-page.png" alt="new home page" width="900" />

The new home page provides some functions that can improve user experience.
1. For [OSD admin]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace-acl/#config-dashboard-admin), you can click the `Create workspace` button to navigate to [create workspace page]({{site.url}}{{site.baseurl}}/dashboards/workspace/create-workspace).
2. Check the access time of the workspace, or click the workspace to navigate to the overview page.
> <img src="{{site.url}}{{site.baseurl}}/images/workspace/workspace-initial/home-has-workspace.png" alt="home with workspace" width="900" />
3. Click the use case information icon will show the use case details.
> <img src="{{site.url}}{{site.baseurl}}/images/workspace/workspace-initial/use-case-information.png" alt="use case information" width="900" />
4. Click the `View all workspaces` button will navigate to the [workspace list page]({{site.url}}{{site.baseurl}}/dashboards/workspace/manage-workspace/#manage-workspaces-from-workspaces-list)
5. Click the `Learn more from documentation` link will navigate to the latest opensearch documentation page.
6. Click the `Explore live demo environment at playground.opensearch.org` link will navigate to the dashboard playground page.


### Navigation logic
When the user logs in to opensearch dashboard, it will jump to a different page according to the following logic.

 - If user has a default workspace configured, navigate to overview page of the workspace.
 - If user has only one workspace, navigate to overview page of the workspace.
 - If user has more than one workspace, navigate to the new homepage.
 - If user has no workspaces, navigate to the new home page.