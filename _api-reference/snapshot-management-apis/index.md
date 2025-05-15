---
layout: default
title: Snapshot management APIs
has_children: true
nav_order: 80
---

# Snapshot management APIs

**Introduced in 2.4**
{: .label .label-purple }

Snapshot management APIs let you automate the scheduling, creation, retention, and lifecycle of snapshots in OpenSearch. These APIs help safeguard data, reduce storage costs, and simplify administrative tasks by using policies instead of manual snapshot operations.

## What is snapshot management?

Snapshot management allows you to define policies that control when snapshots are created, how they're configured, and when they're deleted. Each policy includes creation rules and optional deletion criteria, and can be enabled or disabled as needed.

These policies are useful in environments with large or frequently updated data, where manual snapshotting is inefficient or error-prone. Snapshot management ensures consistent backup strategies, improves recoverability, and supports compliance requirements without manual effort.

## Use cases

Snapshot management supports the following operational goals:

- **Automated backups** – Regularly snapshot critical indexes or clusters using defined policies.
- **Data retention** – Delete outdated snapshots based on age or count.
- **Disaster recovery** – Maintain recoverable cluster states to protect against accidental data loss.
- **Compliance** – Meet audit and regulatory requirements with consistent snapshot intervals and retention periods.
- **Operational efficiency** – Minimize manual effort and reduce the risk of human error.

## Available APIs

Use the following APIs to manage snapshot policies:

- [Create policy API]({{site.url}}{{site.baseurl}}/api-reference/snapshot-management-apis/create-policy/) – Define a new snapshot policy.
- [Get policy API]({{site.url}}{{site.baseurl}}/api-reference/snapshot-management-apis/get-policy/) – Retrieve one or more snapshot policies.
- [Update policy API]({{site.url}}{{site.baseurl}}/api-reference/snapshot-management-apis/update-policy/) – Modify an existing snapshot policy.
- [Delete policy API]({{site.url}}{{site.baseurl}}/api-reference/snapshot-management-apis/delete-policy/) – Remove a snapshot policy.
- [Start policy API]({{site.url}}{{site.baseurl}}/api-reference/snapshot-management-apis/start-policy/) – Manually trigger a snapshot policy.
- [Explain policy API]({{site.url}}{{site.baseurl}}/api-reference/snapshot-management-apis/explain-policy/) – View a policy’s current state and execution history.

## Security considerations

Because snapshot policies can automate access to stored data:

- Use fine-grained permissions to control who can manage policies.
- Restrict start or modification actions to trusted users or roles.
- Audit policies regularly to ensure alignment with security and business requirements.

## Best practices

To optimize your use of snapshot management:

* **Start small** – Test policies on non-production data before applying them in production environments.
* **Align with SLAs** – Set snapshot frequency and retention to meet recovery and compliance requirements.
* **Monitor results** – Use the Explain API and logs to verify policy behavior.
* **Set timeouts** – Limit creation and deletion durations to prevent long-running jobs.
* **Review storage usage** – Periodically evaluate storage consumption and adjust retention rules as needed.
