---
title: Blog Style Guide
nav_order: 70
---

# Blog Style Guide

This guide extends the core OpenSearch editorial guides for blog post contributors. When writing a blog post, follow the [Style Guide](STYLE_GUIDE.md), [Writing Guide](WRITING_GUIDE.md), and [Text Formatting Guide](TEXT_FORMATTING_GUIDE.md). This guide describes only the guidelines unique to blog posts. For information about blog formatting, see the [Blog Guide](https://github.com/opensearch-project/project-website/blob/main/BLOG_GUIDE.md).

Blog posts provide an informal approach to educating or inspiring readers through the personal perspective of the authors. Brief posts generally accompany service or feature releases, and longer posts may note best practices or provide creative solutions. Each post must provide a clear community benefit.

## Blog post or documentation?

Before writing, determine whether the content belongs in a blog post or in the documentation. The key question is: will a user search for this content months from now to complete a task? If yes, it belongs in the documentation. If the content is primarily timely, narrative, or perspective-driven, it belongs in a blog post.

Write a blog post when the content is:

- An announcement of a new feature or release.
- A benchmark, case study, or experiment.
- A personal perspective or recommendation.
- A walkthrough of a solution to a specific problem.

Write documentation when the content is:

- A description of how a feature works.
- A how-to procedure or tutorial.
- A reference that users return to repeatedly.

If the content is both timely (blog) and reference-worthy (documentation), write both: a blog post that links to the documentation for more information.

## Voice and tone

Use a conversational and informal tone. Posts tend to be more personable, unlike technical documentation. Ask questions, include relevant anecdotes, add recommendations, and generally try to make the post as approachable as possible. However, be careful of slang, jargon, and phrases that a global audience might not understand.

Unlike documentation, blog posts can use past tense when describing what was built or discovered: "We tested three approaches and found that..." This is natural for narrative-style posts. Additionally, blog posts can use future tense in the introduction: "In this post, we'll..."

Use "you" when addressing the reader, for example, "_You_ can create focused agents." Don't use "engineers," "teams," or "developers." Use "users" only when referring to the end users of the search application that the reader is writing, for example, "To analyze the results that the _users_ select, configure User Behavior Insights."

Use "I" when writing in a personal narrative voice as a single author. Use "we" when the post represents the work or perspective of multiple contributors or a group.

## Blog title

Use sentence case for blog titles (capitalize only the first word and proper nouns). Make titles concise and descriptive—the title should tell the reader what the post is about. Include "OpenSearch" in the title when it isn't clear from context that the post is about OpenSearch.

## Word choice

- Use "blog post" and not "blog" when referring to specific blog articles.
- Use "OpenSearch platform" instead of "OpenSearch ecosystem" to refer to OpenSearch and its plugins.

## Writing principles

- Deep topics don't necessarily require long posts. Shorter, more focused posts are easier for readers to digest. Consider breaking a long post into a series, which can also encourage repeat visitors to the blog.

- Posts should add to the conversation. Instead of repeating content that is already available elsewhere, link to detail pages and technical documentation. Keep only the information that is specific to the post solution or recommendations.

## Blog post structure

Use the following guidelines when organizing the blog post into sections.

### Opening paragraph

You can open with an introductory framing sentence that describes the post's topic and goal, such as "In this blog post, we'll introduce..." or "In this blog post, you'll learn..."

Get to the reader's problem or the post's main point within the first two paragraphs. Background or history is acceptable as context but it should be brief and lead directly to the point. Don't open with product history that delays the reader from understanding what the post is about.

### Headings

Write descriptive headings so that readers can scan the post, understand what each section discusses, and decide which sections to read. Generic headings such as "Introduction," "Overview," or "How it works" don't convey enough information for that decision. For example, "How the memory plugin manages context windows" is more informative than "How it works."

### Transitions

Use clear transitions from one section to another. Before sections describing complex concepts or recommendations, add an orienting sentence that tells the reader what they're about to read and why it matters: "The following recommendations will help you implement agentic memory effectively in production environments." Unlike technical documentation, which can jump straight to content, blog posts require transitions that link sections together and maintain narrative flow.

### Call to action

All posts should contain one or more calls to action that invite readers to try the feature, read related resources, contribute to the project, or connect with other community members. Typically, a call to action is added as the last section ("Next steps," "What's next," or "What's coming next").

## Supplementary content

Showcase the feature you're describing by adding code examples, images, and videos.

### Code examples

Blog post code examples should be minimal and illustrative rather than production-ready. Use simplified examples that demonstrate the concept clearly without overwhelming the reader. If the same example appears in the documentation, use a different scenario to reinforce that the post adds new value. Note the OpenSearch version used in your examples so that readers know whether the code applies to their environment.

### Images and videos

Ensure that all text in images is legible without zooming. Diagrams should complement the surrounding text, not restate it: use visuals to show relationships, flows, or structures that are difficult to convey in prose.

Place each image or video immediately after the text that describes it, not at the beginning or end of the section. Introduce an image or video with a complete sentence that describes what is shown: "The following diagram shows..." or "...as shown in the following video."

## Metadata

Include metadata tags such as services, solutions, and learning levels so that the post is correctly categorized and discoverable by readers searching for related content.