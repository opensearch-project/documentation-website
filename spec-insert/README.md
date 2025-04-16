# An Overview of the Spec-Insert Plugin

This plugin is designed to facilitate the insertion of OpenAPI spec components into Markdown files. It provides a set of snippets that can be used to insert various components such as API paths, path parameters, and query parameters. This document provides and overview of the code base of the plugin. The codebase can be divided into the following sections:

- API parser: parses the OpenAPI spec and extracts the relevant component information.
- Component renderer: renders the extracted component information into Markdown format.
- Reporters: generates reports for this plugin.

## API Parser
### SpecHash
The [SpecHash](./lib/spec_hash.rb) class is responsible for ingesting the OpenAPI spec and dereferencing the `$ref` fields. Its `.load_file` method accepts the path to the OpenAPI spec file and setups all API actions found in the spec. This is also where the `text_replacements` feature from the config file is handled.
### API::Operation
The [API::Operation ](./lib/api/operation.rb)class represents an OpenAPI operation. Operations of the same group constitute an API.
### API::Action
The [API::Action](./lib/api/action.rb) class represents an API action, which comprises the URL path, query parameters, path parameters, request body, and response body. The components are represented by the following classes:
- [API::Parameter](./lib/api/parameter.rb)
- [API::Body](./lib/api/body.rb)

## Component Renderer

Components are rendered into markdown using `mustache` [templates](./lib/renderers/templates). Each spec-insert component is represented by a render class which are:
- [BodyParameter](./lib/renderers/body_parameters.rb): renders the request and response body tables.
- [PathParameter](./lib/renderers/path_parameters.rb): renders the path parameters table.
- [QueryParameter](./lib/renderers/query_parameters.rb): renders the query parameters table.
- [Endpoint](./lib/renderers/endpoints.rb): renders list of endpoints.

Each of these component is rendered within a [SpecInsert](./lib/renderers/spec_insert.rb) class, which wrapped the rendered component within a `<!-- spec_insert_start -->` and `<!-- spec_insert_end -->` comment.

## Reporters

The [reports](./lib/reports) folder contain code that generates the utilization and dry-run reports. They can be triggered through the [Rakefile](Rakefile).