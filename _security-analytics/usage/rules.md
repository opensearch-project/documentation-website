---
layout: default
title: Working with rules
parent: Using Security Analytics
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/security-analytics/usage/rules/
---

# Working with rules

The Rules window lists all security rules and provides options for filtering the list and viewing details for each rule. Further options let you import rules and create new rules by first duplicating a Sigma rule then modifying it. This section covers navigation of the Rules page and description of the actions you can perform.
<img src="{{site.url}}{{site.baseurl}}/images/Security/Rules.png" alt="The Rules page">

## Viewing and filtering rules

When you open the Rules page, all rules are listed in the table. Use the search bar to search for specific rules by entering a full or partial name and pressing **Return/Enter** on your keyboard. The list is filtered and displays matching results.

Alternatively, you can use the **Rule type**, **Rule severity**, and **Source** dropdown menus to drill down in the list of alerts and filter for preferred results. You can use all three menus in combination to narrow results. Select only one option per menu.
<img src="{{site.url}}{{site.baseurl}}/images/Security/rule-menu.png" alt="Rule menus for filtering results">

To see rule details, select the rule in the Rule name column of the list. The rule details pane opens.

## Importing rules

At this time, Security Analytics supports the import of Sigma rules in YAML format. The following sample file shows the basic formatting of a rule in YAML.

```yml
title: RDP Sensitive Settings Changed
logsource:
  product: windows
  service: system
description: 'Detects changes to RDP terminal service sensitive settings'
detection:
  selection_reg:
  EventType: SetValue
  TargetObject|contains:
    - \services\TermService\Parameters\ServiceDll
    - \Control\Terminal Server\fSingleSessionPerUser
    - \Control\Terminal Server\fDenyTSConnections
    - \Policies\Microsoft\Windows NT\Terminal Services\Shadow
    - \Control\Terminal Server\WinStations\RDP-Tcp\InitialProgram
  condition: selection_reg
level: high
tags:
  - attack.defense_evasion
  - attack.t1112
references:
  - https://blog.menasec.net/2019/02/threat-hunting-rdp-hijacking-via.html
  - https://knowledge.insourcess.com/Supporting_Technologies/Wonderware/Tech_Notes/TN_WW213_How_to_shadow_an_established_RDP_Session_on_Windows_10_Pro
  - https://twitter.com/SagieSec/status/1469001618863624194?t=HRf0eA0W1YYzkTSHb-Ky1A&s=03
  - http://etutorials.org/Microsoft+Products/microsoft+windows+server+2003+terminal+services/Chapter+6+Registry/Registry+Keys+for+Terminal+Services/
falsepositives:
  - Unknown
author:
  - Samir Bousseaden 
  - David ANDRE
status: experimental
```

1. To begin, select the **Import rule** button in the upper-right corner of the page. The Import rule page opens.
1. Either drag a YAML-formatted Sigma rule into the window or browse for the file by selecting the link and opening it. The Import a rule window opens and the rule definition fields are automatically populated.
1. Verify or modify the information in the fields.
1. After you confirm the information for the rule is accurate, select the **Create** button in the lower-right corner of the window. A new rule is created, and it appears in the list of rules on the main page of the Rules window.

## Customizing rules

An alternative to importing a rule is duplicating a Sigma rule and then modifying it to create a custom rule. First search for or filter rules in the Rules list to locate the rule you want to duplicate.
<img src="{{site.url}}{{site.baseurl}}/images/Security/rules-dup1.png" alt="Selecting a rule in the Rules name list">

1. To begin, select the rule in the Rule name column. The rule details pane opens.
<img src="{{site.url}}{{site.baseurl}}/images/Security/rule-dup2.png" alt="Opening the rule details pane" width="400">
1. Select the **Duplicate** button in the upper-right corner of the pane. The Duplicate rule window opens and all of the fields are automatically populated with the rule's details.
<img src="{{site.url}}{{site.baseurl}}/images/Security/rule-dup3.png" alt="Selecting the duplicate button" width="400">
1. Modify any of the fields to customize the rule.
1. After performing any modifications to the rule, select the **Create** button in the lower-right corner of the window. A  new and customized rule is created, and it appears in the list of rules on the main page of the Rules window.
<img src="{{site.url}}{{site.baseurl}}/images/Security/custom-rule.png" alt="The custom rule now appears in the list of rules.">

You cannot modify the Sigma rule itself. The original Sigma rule always remains in the system. Its duplicate, after modification, becomes the custom rule that is added to the list of rules.
{: .note }

