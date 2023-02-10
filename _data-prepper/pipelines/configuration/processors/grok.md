---
layout: default
title: grok
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# grok

## Overview

Takes unstructured data and utilizes pattern matching to structure and extract important keys and make data more structured and queryable.

Option | Required | Type | Description
:--- | :--- | :--- | :---
match | No | Map | Specifies which keys to match specific patterns against. Default value is an empty body.
keep_empty_captures | No | Boolean | Enables preserving `null` captures. Default value is `false`.
named_captures_only | No | Boolean | enables whether to keep only named captures. Default value is `true`.
break_on_match | No | Boolean | Specifies whether to match all patterns or stop once the first successful match is found. Default value is `true`.
keys_to_overwrite | No | List | Specifies which existing keys are to be overwritten if there is a capture with the same key value. Default value is `[]`.
pattern_definitions | No | Map | Allows for custom pattern use inline. Default value is an empty body.
patterns_directories | No | List | Specifies the path of directories that contain customer pattern files. Default value is an empty list.
pattern_files_glob | No | String | Specifies which pattern files to use from the directories specified for `pattern_directories`. Default value is `*`.
target_key | No | String | Specifies a parent level key to store all captures. Default value is `null`.
timeout_millis | No | Integer | Maximum amount of time that should take place for the matching. Setting to `0` disables the timeout. Default value is `30,000`.

<!---## Configuration

Content will be added to this section.--->

## Metrics

Counter

* `grokProcessingMismatch`: records the number of Records that did not match any of the patterns specified in the match field
  

* `grokProcessingMatch`: records the number of Records that found at least one pattern match from the match field
  

* `grokProcessingErrors`: records the total number of processing errors for Records


* `grokProcessingTimeouts`: records the total number of Records that timed out while matching

Timer

* `grokProcessingTime`: the time each individual Record takes matching against patterns from `match`. The `avg` is the most useful metric for this Timer.