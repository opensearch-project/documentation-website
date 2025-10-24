# Spec-insert plugin overview

This plugin facilitates the insertion of OpenAPI spec components into Markdown files. It provides a set of snippets that you can use to insert various components, such as API paths, path parameters, and query parameters. This document provides an overview of the plugin's codebase. The codebase is divided into the following sections:

- API parser: Parses the OpenAPI spec and extracts the relevant component information
- Component renderer: Renders the extracted component information into Markdown format
- Reports: Generates reports for this plugin

## API parser

The following section provides information about the components of the API parser.

### SpecHash

The [`SpecHash`](./lib/spec_hash.rb) class is responsible for ingesting the OpenAPI spec and dereferencing the `$ref` fields. Its `.load_file` method accepts the path to the OpenAPI spec file and sets up all API actions found in the spec. This is also where the `text_replacements` feature from the config file is managed.

### API::Operation

The [`API::Operation`](./lib/api/operation.rb) class represents an OpenAPI operation. Operations of the same group constitute an API.

### API::Action

The [`API::Action`](./lib/api/action.rb) class represents an API action, which comprises the URL path, query parameters, path parameters, request body, and response body. The components are represented by the following classes:

- [`API::Parameter`](./lib/api/parameter.rb)
- [`API::Body`](./lib/api/body.rb)

## Component renderer

Components are rendered into Markdown using `mustache` [templates](./lib/renderers/templates). Each spec-insert component is represented by a renderer class:

- [`BodyParameter`](./lib/renderers/body_parameters.rb): Renders the request and response body tables
- [`PathParameter`](./lib/renderers/path_parameters.rb): Renders the path parameters table
- [`QueryParameter`](./lib/renderers/query_parameters.rb): Renders the query parameters table
- [`Endpoint`](./lib/renderers/endpoints.rb): Renders a list of endpoints

Each of these components is rendered within a [`SpecInsert`](./lib/renderers/spec_insert.rb) class, which wraps the rendered component within `<!-- spec_insert_start -->` and `<!-- spec_insert_end -->` comments.

## Reports

The [reports](./lib/reports) folder contains code that generates utilization and dry-run reports. You can trigger these reports through the [`Rakefile`](Rakefile).
