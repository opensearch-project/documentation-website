<img src="https://opensearch.org/assets/img/opensearch-logo-themed.svg" height="64px">

# About the OpenSearch documentation repo

The documentation repository contains the documentation for OpenSearch, the highly scalable and extensible open-source software suite for search, analytics, observability, and other data-intensive applications. You can find the rendered documentation at [opensearch.org/docs](https://opensearch.org/docs).


## Contributing

Community contributions remain essential in keeping the documentation comprehensive, useful, well-organized, and up-to-date. If you are interested in submitting an issue or contributing content, see [CONTRIBUTING](CONTRIBUTING.md). 

See these important resources when you are considering contributing to the documentation:  

- [OpenSearch Project Style Guidelines](STYLE_GUIDE.md) - The style guide covers the style standards to be observed when creating OpenSearch content.
- [Terms](TERMS.md) - The terms list contains the key OpenSearch terms and tips on how and when to use them.  
- [API Style Guide](API_STYLE_GUIDE.md) - The API style guide provides the basic structure for creating OpenSearch API documentation.
- [Formatting Guide](FORMATTING_GUIDE.md) - The OpenSearch documentation uses a modified version of the [just-the-docs](https://github.com/pmarsceill/just-the-docs) Jekyll theme. Use the formatting guide for an overview of the commonly used formatted elements, including callouts, videos, and buttons.


## Style linting

To ensure that our documentation adheres to the [OpenSearch Project Style Guidelines](STYLE_GUIDE.md) we use the [Vale](https://github.com/errata-ai/vale) linter. To install Vale locally, follow these steps:

1. Run `brew install vale`.
2. Run `vale *` from the documentation site root directory to lint all Markdown files. To lint a specific file, run `vale /path/to/file`.

Optionally, you can install the [Vale VSCode](https://github.com/chrischinchilla/vale-vscode) extension that integrates Vale with Visual Studio Code. By default, only _errors_ and _warnings_ are underlined. To change the minimum alert level to include _suggestions_, go to **Vale VSCode** > **Extension Settings** and select **suggestion** in the **Vale > Vale CLI: Min Alert Level** dropdown list. 


## Points of contact

If you encounter problems or have questions when contributing to the documentation, these people can help:

- [cwillum](https://github.com/cwillum)
- [hdhalter](https://github.com/hdhalter)
- [kolchfa-aws](https://github.com/kolchfa-aws)
- [Naarcha-AWS](https://github.com/Naarcha-AWS)
- [vagimeli](https://github.com/vagimeli)


## Code of conduct

This project has adopted an [Open Source Code of Conduct](https://opensearch.org/codeofconduct.html).


## Security

If you discover a potential security issue in this project we ask that you notify AWS/Amazon Security using our [vulnerability reporting page](http://aws.amazon.com/security/vulnerability-reporting/). Please do **not** create a public GitHub issue.


## License

This project is licensed under the [Apache 2.0 License](LICENSE).


## Copyright

Copyright OpenSearch contributors.
