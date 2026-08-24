---
title: UI Style Guide
nav_order: 60
---

# UI Style Guide

This guide provides writing standards for OpenSearch Dashboards UI text contributors. For general brand identity, naming conventions, and documentation formatting rules, see the [Style Guide](STYLE_GUIDE.md).

## UI best practices

- Follow the OpenSearch Project [naming conventions, voice and tone, and brand personality traits](STYLE_GUIDE.md#naming-conventions-voice-and-tone-and-brand-personality-traits) guidelines.
- Be consistent with other elements on the page and on the rest of the site.
- Use sentence case in the UI, except for product names and other proper nouns.

## UI voice and tone

UI text follows the same voice and tone principles as all OpenSearch content. For more information, see [Voice and tone](STYLE_GUIDE.md#voice-and-tone) and [Brand personality traits](STYLE_GUIDE.md#brand-personality-traits).

## Writing guidelines

UI text is a critical component of a user interface. We help users complete tasks by explaining concepts and providing simple instructions that follow a logical flow. We strive to use language that is consistent, succinct, and clear.

### What's the purpose of UI text?

UI text includes all words, phrases, and sentences on a screen, and it has the following purposes:

- Describes a concept or defines a term
- Explains how to complete a task
- Describes the purpose of a page, section, table, graph, or dialog box
- Walks users through tutorials and first-run experiences
- Provides context and explanation for individual UI elements that might be unfamiliar to users
- Helps users make a choice or decide if settings are relevant or required for their particular deployment scenario or environment
- Explains an alert or error

### Basic guidelines

Follow these basic guidelines when writing UI text.

#### Style

- Keep it short. Users don't want to read dense text. Remember that UI text can expand by 30% when it's translated into other languages.
- Keep it simple. Try to use simple sentences (one subject, one verb, one main clause and idea) rather than compound or complex sentences.
- Prefer active voice over passive voice. For example, "You can attach up to 10 policies" is active voice, and "Up to 10 policies can be attached" is passive voice.
- Use device-agnostic language rather than mouse-specific language. For example, use _choose_ instead of _click_ (exception: use _select_ for checkboxes, _clear_ for deselecting checkboxes).

#### Tone

- Use everyday language that most users will understand.
- Use second person (you, your) when you address the user.
- Use _we_ if you need to refer to the OpenSearch Project as an organization; for example, "We recommend…."

#### Mechanics

- Use sentence case for all UI text. (Capitalize only the first word in a sentence or phrase as well as any proper nouns, such as service names. All other words are lowercase.)
- Use parallel construction (use phrases and sentences that are grammatically similar). For example, items in a list should start with either all verbs or all nouns.
    
     **Correct**:

     > Snapshots have two main uses:
     > * Recovering from failure
     > * Migrating from one cluster to another

     **Incorrect**:

     > Snapshots have two main uses:
     > * Failure recovery
     > * Migrating from one cluster to another

- Use the serial (Oxford) comma. For example, "issues, bug fixes, and features", not "issues, bug fixes and features".
- Don't use the ampersand (&) in UI labels or headings as a replacement for "and." This does not apply to code, URLs, or query parameters where `&` is syntactically required.
- Avoid Latinisms, such as _e.g._, _i.e._, or _etc._ Instead of _e.g._, use _for example_ or _such as_. Instead of _i.e._, use _that is_ or _specifically_. Generally speaking, _etc._ and its equivalents (such as _and more_ or _and so on_) aren't necessary.
