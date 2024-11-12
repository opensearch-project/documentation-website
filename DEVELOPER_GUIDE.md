# Developer guide
 - [Introduction](#introduction)
 - [Starting the Jekyll server locally](#starting-the-jekyll-server-locally)
 - [Using the spec-insert Jekyll plugin](#using-the-spec-insert-jekyll-plugin)
   - [Inserting query parameters](#inserting-query-parameters)
   - [Inserting path parameters](#inserting-path-parameters)
   - [Inserting paths and HTTP methods](#inserting-paths-and-http-methods)
   - [Ignoring files and folders](#ignoring-files-and-folders)
   - [CI/CD](#cicd)

## Introduction

The `.md` documents in this repository are rendered into HTML pages using [Jekyll](https://jekyllrb.com/). These HTML pages are hosted on [opensearch.org](https://opensearch.org/docs/latest/).

## Starting the Jekyll server locally
You can run the Jekyll server locally to view the rendered HTML pages using the following steps:

1. Install [Ruby](https://www.ruby-lang.org/en/documentation/installation/) 3.1.0 or later for your operating system.
2. Install the required gems by running `bundle install`.
3. Run `bundle exec jekyll serve` to start the Jekyll server locally (this can take several minutes to complete).
4. Open your browser and navigate to `http://localhost:4000` to view the rendered HTML pages.

## Using the `spec-insert` Jekyll plugin
The `spec-insert` Jekyll plugin is used to insert API components into Markdown files. The plugin downloads the [latest OpenSearch specification](https://github.com/opensearch-project/opensearch-api-specification) and renders the API components from the spec. This aims to reduce the manual effort required to keep the documentation up to date.

To use this plugin, make sure that you have installed Ruby 3.1.0 or later and the required gems by running `bundle install`.

Edit your Markdown file and insert the following snippet where you want render an API component:

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

Then run the following Jekyll command to render the API components:
```shell
bundle exec jekyll spec-insert
```

If you are working on multiple Markdown files and do not want to keep running the `jekyll spec-insert` command, you can add the `--watch` (or `-W`) flag to the command to watch for changes in the Markdown files and automatically render the API components:

```shell
bundle exec jekyll spec-insert --watch
```

Depending on the text editor you are using, you may need to manually reload the file from disk to see the changes applied by the plugin if the editor does not automatically reload the file periodically.

The plugin will pull the newest OpenSearch API spec from its [repository](https://github.com/opensearch-project/opensearch-api-specification) if the spec file does not exist locally or if it is older than 24 hours. To tell the plugin to always pull the newest spec, you can add the `--refresh-spec` (or `-R`) flag to the command:

```shell
bundle exec jekyll spec-insert --refresh-spec
```

### Inserting query parameters

To insert the API query parameters table, use the following snippet:

```markdown
<!-- spec_insert_start
api: cat.indices
component: query_parameters
-->
<!-- spec_insert_end -->
```

This will insert the query parameters of the `cat.indices` API into the `.md` file with three default columns: `Parameter`, `Type`, and `Description`. There are five columns that can be inserted: `Parameter`, `Type`, `Description`, `Required`, and `Default`. When `Required`/`Default` is not chosen, the information will be written in the `Description` column.

You can customize the query parameters table with the following columns:

- `Parameter`
- `Type`
- `Description`
- `Required` 
- `Default`

 You can also customize this component with the following settings:
 
- `include_global` (Boolean; default is `false`): Includes global query parameters in the table.
- `include_deprecated` (Boolean; default is `true`): Includes deprecated parameters in the table.
- `pretty` (Boolean; default is `false`): Renders the table in the pretty format instead of the compact format.

The following snippet inserts the specified columns into the query parameters table:

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

### Inserting path parameters

To insert the `indices.create` API path parameters table, use the following snippet:

```markdown
<!-- spec_insert_start
api: indices.create
component: path_parameters
-->
<!-- spec_insert_end -->
```

This table behaves identically to the query parameters table except that it does not accept the `include_global` argument.

### Inserting paths and HTTP methods

To insert paths and HTTP methods for the `search` API, use the following snippet:

```markdown
<!-- spec_insert_start
api: search
component: paths_and_http_methods
-->
<!-- spec_insert_end -->
```

### Ignoring files and folders

The `spec-insert` plugin ignores all files and folders listed in the [./_config.yml#exclude](./_config.yml) list, which is also the list of files and folders that Jekyll ignores.

### CI/CD

The `spec-insert` plugin is run as part of the CI/CD pipeline to ensure that the API components are up to date in the documentation. This is performed through the [update-api-components.yml](.github/workflows/update-api-components.yml) GitHub Actions workflow, which creates a pull request containing the updated API components every Sunday.
