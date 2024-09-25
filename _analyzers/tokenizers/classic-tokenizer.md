---
layout: default
title: Classic Tokenizer
parent: Tokenizers
nav_order: 20

---

# Classic tokenizer
The classic tokenizer is built to handle English text efficiently, applying grammatical rules to break the text into tokens. It includes specific logic to handle patterns such as:
- acronyms 
- email addresses
- domain names
- certain types of punctuation

This tokenizer works best with the English language, it may not produce optimal results for other languages, especially those with different grammatical structures.
{: .note}

The classic tokenizer splits words at most punctuation marks while removing the punctuation. Dots that aren't followed by spaces are treated as part of the token. It also breaks words at hyphens, except when a number is present, treating the entire sequence as a single token, like a product code. Additionally, it recognizes email addresses and hostnames as individual tokens to keep them intact.

## Example using the classic tokenizer
```
POST _analyze
{
  "tokenizer": "classic",
  "text": "Send an email to john.doe@example.com or call 555-1234!"
}
```
Summary of the outputted response text:
```
 "Send", "an", "email", "to", "john.doe", "example.com", "or", "call", "555-1234" 
```
The tokenizer keeps the email address `john.doe@example.com` and the phone number `555-1234` as single tokens, while splitting the rest of the sentence at punctuation marks.
