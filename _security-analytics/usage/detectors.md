---
layout: default
title: Working with detectors
parent: Using security analytics
nav_order: 30
---

# Working with detectors

After creating a detector, it appears on the Threat detector page along with others saved to the system. You can then perform a number of actions for each detector, from editing its details to changing its status. See the following sections for description of the available actions.
<img src="{{site.url}}{{site.baseurl}}/images/Security/threat-detector.png" alt="Threat detector page" width="600">

## Threat detector list

The list of threat detectors includes the search bar, the **Status** dropdown menu, and the **Log type** dropdown menu.
* Use the search bar to filter by detector name.
* Select the **Status** dropdown menu to filter detectors in the list by Active and Inactive status.
* Select the **Log type** dropdown menu to filter detectors by any log type that appears in the list (the options depend on the detectors present in the list and their log types).

### Editing a detector

To edit a detector, begin by selecting the detector in the Detector name column of the list. The detector's details window opens.
<img src="{{site.url}}{{site.baseurl}}/images/Security/detector-details.png" alt="detector details window for editig the detector" width="500">
* the details window shows the name and status of the detector (active or inactive)


## Detector actions

Threat detector actions allow you to stop and start detectors or delete a detector. To enable actions, first select one or more detectors in the list.
<img src="{{site.url}}{{site.baseurl}}/images/Security/detector-action.png" alt="Threat detector actions" width="500">

#### Changing detector status
1.  Select the detector or detectors in the list whose status you would like to change. The **Actions** dropdown menu becomes enabled.
1.  Depending on whether the detector is currently active or inactive, select either **Stop detector** or **Start detector**. After a moment, the change in status of the detector appears in the detector list as either Inactive or Active.

#### Deleting a detector
1. Select the detector or detectors in the list that you would like to delete. The **Actions** dropdown menu becomes enabled.
1. Select **Delete** in the dropdown menu. The Delete detector popup window opens and asks you to verify that you want to delete the detector or detectors.
1. Select **Cancel** to decline the action. Select **Delete detector** to delete the detector or detectors permanently from the list.

