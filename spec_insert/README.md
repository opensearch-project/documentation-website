# README: Spec Insert
 - [What is this?](#what-is-this)
 - [Installation](#Installation)
 - [How to use](#how-to-use)
   - [Insert Query Parameters](#insert-query-parameters)
   - [Insert Path Parameters](#insert-path-parameters)
   - [Insert Paths and HTTP Methods](#insert-paths-and-http-methods)
 - [Ignored files and folders](#ignored-files-and-folders) 

## What is this?
This program allows you to insert API components generated from the OpenSearch Specification into this repository's markdown files. It's still underdevelopment, and many features are not yet implemented. This document will be updated as the program evolves.

## Installation
1. Clone this repository.
2. Change to the `spec_insert` directory.
3. Install Ruby 3.1.0 or later.
4. Install the required gems by running `bundle install`.

## How to use
Edit your markdown file and insert the following snippet where you want the API components to be inserted:
```markdown
<!-- spec_insert_start 
api: <API_NAME>
component: <COMPONENT_NAME>
other_param: <OTHER_PARAM>
-->

This is where the API component will be inserted.
Everything between the `spec_insert_start` and `spec_insert_end` tags will be overwritten.

<!-- spec_insert_end -->
```

Then run the following Rake commands to download the latest OpenSearch Specification and insert the API components into the markdown files:
```shell
rake download_spec
rake insert_spec
```

### Insert Query Parameters
To insert query parameters table of the `cat.indices` API, use the following snippet:
```markdown
<!-- spec_insert_start
api: cat.indices
component: query_parameters
-->
<!-- spec_insert_end -->
```

- This will insert the query parameters of the `cat.indices` API into the markdown file 3 default columns: `Parameter`, `Type`, and `Description`. There are 5 columns that can be inserted: `Parameter`, `Type`, `Description`, `Required`, and `Default`. When `Required`/`Default` is not chosen, the info will be written in the `Description` column.
- This component accepts `include_global` (boolean, default to `false`) argument to include global query parameters in the table.
- This component accepts `include_deprecated` (boolean, default to `true`) argument to include deprecated parameters in the table.
- This component accepts `pretty` (boolean, default to `false`) argument to render the table in the pretty format instead of the compact format.

```markdown
<!-- spec_insert_start
api: cat.indices
component: query_parameters
include_global: true
include_deprecated: false
pretty: true
-->
<!-- spec_insert_end -->
```

### Insert Path Parameters

To insert path parameters table of the `indices.create` API, use the following snippet:
```markdown
<!-- spec_insert_start
api: indices.create
component: path_parameters
-->
<!-- spec_insert_end -->
```

This table behaves the same as the query parameters table except that it does not accept the `include_global` argument.

### Insert Paths and HTTP Methods

To insert paths and HTTP methods of the `search` API, use the following snippet:
```markdown
<!-- spec_insert_start
api: search
component: paths_and_http_methods
-->
<!-- spec_insert_end -->
```

### Ignored files and folders
The program will ignore all markdown files whose names are in ALL CAPS. On top of that, you can also add files and folders you want to the [ignored.txt](./ignored.txt) file. Each line in the file should be the name of a file or folder you want to ignore.
