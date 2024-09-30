---
layout: default
title: Keyword Tokenizer
parent: Tokenizers
nav_order: 50
---

# Keyword tokenizer
The keyword tokenizer is a straightforward tokenizer that takes in text and outputs it exactly as a single, unaltered token. This makes it particularly useful when dealing with structured data like names, product codes, or email addresses, where you want the input to remain intact. 

The keyword tokenizer can be paired with token filters to modify or clean up the text, such as normalizing the data or removing unnecessary characters.

## Example usage
```
POST _analyze
{
  "tokenizer": "keyword",
  "text": "OpenSearch Example"
}
```
Response output:
```
OpenSearch Example 
```

## Combining the `keyword` tokenizwer with token filters
To enhance the functionality of the keyword tokenizer, you can combine it with token filters. Token filters can apply transformations to the text, such as converting it to lowercase, removing unwanted characters, or handling other text manipulations.

### Example using the `pattern_replace` filter and `keyword` tokenizer

In this example, the `pattern_replace` filter uses a regular expression to replace all non-alphanumeric characters with an empty string.

```
POST _analyze
{
  "tokenizer": "keyword",
  "filter": [
    {
      "type": "pattern_replace",
      "pattern": "[^a-zA-Z0-9]",
      "replacement": ""
    }
  ],
  "text": "Product#1234-XYZ"
}
```
The pattern_replace filter strips out any characters that aren’t letters or numbers, resulting in:
```
Product1234XYZ
```
## Configuration
`buffer_size`: Determines the character buffer size. Default is 256. Usually, there’s no need to change this setting.

The keyword tokenizer is ideal for cases where you need to preserve entire blocks of text, such as email addresses, product IDs, or names. When combined with token filters like `pattern_replace` or `lowercase`, it becomes a versatile tool for normalizing and cleaning data while maintaining the integrity of the input.
