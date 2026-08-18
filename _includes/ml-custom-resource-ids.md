### Custom ID requirements

Custom IDs must meet the following requirements:

| Requirement | Description |
| :--- | :--- |
| **Optional** | If you omit the custom ID field, OpenSearch auto-generates an ID. This is the default behavior. |
| **Allowed characters** | Letters (`a`–`z`, `A`–`Z`), digits (`0`–`9`), underscores (`_`), and hyphens (`-`). |
| **First character** | Must be a letter or digit. IDs must not start with `_` or `-`. |
| **Maximum length** | 512 bytes (UTF-8 encoded). |
| **Uniqueness** | Must be unique within the resource type in the cluster. |

Valid custom ID examples: `my_gpt_connector`, `text-embedding-v1`, `customerServiceAgent1`.

Invalid custom ID examples:

| ID | Reason |
| :--- | :--- |
| `_reserved_id` | Must not start with `_`. |
| `-my-id` | Must not start with `-`. |
| `my id` | Spaces are not allowed. |
| `my@connector` | Special characters such as `@` are not allowed. |
| *(blank or whitespace only)* | Blank IDs are not allowed. |

### Error responses

The following table describes common errors related to custom IDs.

| HTTP status | Condition | Example error message |
| :--- | :--- | :--- |
| `400` | The custom ID is blank or contains invalid characters. | `model id is invalid` |
| `400` | The custom ID starts with `_`. | `connector id must not start with '_'` |
| `400` | The custom ID starts with `-`. | `agent id must not start with '-'` |
| `400` | The custom ID exceeds the maximum length. | `model group id is too long, max length is 512` |
| `400` | The custom ID contains disallowed characters. | `memory container id must contain only letters, digits, underscores, and hyphens, and must start with a letter or digit` |
| `409` | A resource with the same custom ID already exists. | `connector id 'my_gpt_connector' already exists` |

The exact resource label in error messages matches the resource type (for example, `model id`, `model group id`, `connector id`, `agent id`, or `memory container id`).
