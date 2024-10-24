---
layout: default
title: ML ranking core concepts
nav_order: 10
parent: Learning to Rank
has_children: false
---

# ML ranking core concepts

This guide is intended for OpenSearch developers and data scientist who are interested in adding machine learning (ML) ranking capabilities to their OpenSearch system.

## What is LTR?

Learning to Rank (LTR) applies ML to search relevance ranking. This differs from other classic ML problems, such as the following: 

- **Regression:** The goal is to predict a variable, such as a stock price, as a function of known information, such as number of employees or revenue. The output is a direct prediction.
- **Classification:** The goal is to categorize an entity into predefined classes, for example, profitable or not profitable. The output is a category.

The objective of LTR is not to make a direct prediction but rather to learn a function (`f`) that can rank documents in an order that best matches your perception of relevance for a given query. The output `f` does not represent a literal value but rather a prediction of the document's relative usefulness. 

For comprehensive information about LTR, see [How is Search Different From Other Machine Learning Problems?](http://opensourceconnections.com/blog/2017/08/03/search-as-machine-learning-prob/) and [What is Learning to Rank?](http://opensourceconnections.com/blog/2017/02/24/what-is-learning-to-rank/).

## Defining the ideal ordering with judgment lists

Judgment lists, also known as golden sets, provide a way to grade individual search results for a keyword search. These lists express the ideal ordering of search results based on your expectations. 

For example, using the [demo on GitHub](http://github.com/opensearch-project/opensearch-learning-to-rank-base/tree/main/demo/), in a search for `Rambo`, the judgment list may appear similar to the following: 

```
grade,keywords,movie
4,Rambo,First Blood     # Exactly Relevant
4,Rambo,Rambo
3,Rambo,Rambo III       # Fairly Relevant
3,Rambo,Rambo First Blood Part II
2,Rambo,Rocky           # Tangentially Relevant
2,Rambo,Cobra
0,Rambo,Bambi           # Not even close...
0,Rambo,First Daughter
```

This judgment list establishes the ideal ordering of search results for the query `Rambo`. Metrics like [Normalized Discounted Cumulative Gain (NDCG)](https://en.wikipedia.org/wiki/Discounted_cumulative_gain) and [Expected Reciprocal Rank (ERR)](https://dl.acm.org/doi/abs/10.1145/1645953.1646033) can then be used to evaluate how closely the actual search results match this ideal ordering.

The ranking function `f` aims to generate results closely aligned with the judgment list, maximizing quality metrics across various training queries. This ensures maximally useful search results.

## Understanding features as building blocks of relevance

The ranking function `f` uses input variables to arrive at a predicted output. For example, in stock price forecasting, input variables may encompass company-specific data like employee count and revenue. Likewise, in search relevance, the predictive model must leverage features that characterize the document, the query, and their associations, such as the [term frequency–inverse document frequency (TF–IDF)](https://en.wikipedia.org/wiki/Tf%E2%80%93idf) score of the query keywords in a field. 

Similarly, in the context of searching for movies, the ranking function must use relevant features to determine the most relevant results. These features may include:

- Whether and to what degree the search keywords match the title field, such as `titleScore`.
- Whether and to what degree the search keywords match the description field, such as `descScore`.
- The movie's popularity, such as `popularity`.
- The movie's rating, such as `rating`.
- The number of keywords used during the search, such as `numKeywords*)`.

The ranking function would become `f(titleScore, descScore, popularity, rating, numKeywords)`. The goal is to use the features in a way that maximizes the likelihood of the search results being useful. 

For example, in the `Rambo` use case, it seems intuitive that `titleScore` would be important. However, for the top movie _First Blood_, the keyword `Rambo` is likely only mentioned in the description. In this case, the `descScore` would become relevant. Additionally, the `popularity` and `rating` features could help differentiate between sequels and originals. If the existing features do not work for this purpose, then a new feature `isSequel` could be introduced. This new feature could then be used to make better ranking decisions.

Selecting and experimenting with features is fundamental to LTR. Using features that fail to help predict patterns in the target variable can result in an unsatisfactory search experience, following the principle of "garbage in, garbage out" that applies to any ML problem.

## Completing the training set by logging features

When you have a set of defined features, the next step is to annotate the judgment list with each feature's values. These values are used when the training process begins. For example, consider the following judgment list: 

```
grade,keywords,movie
4,Rambo,First Blood
4,Rambo,Rambo
3,Rambo,Rambo III
...
```

To complete the training set, add the following features:

```
grade,keywords,movie,titleScore,descScore,popularity,...
4,Rambo,First Blood,0.0,21.5,100,...
4,Rambo,Rambo,42.5,21.5,95,...
3,Rambo,Rambo III,53.1,40.1,50,...
```

The `titleScore` represents the relevance score of the `Rambo` keyword in the title field of the document, and so on.

Many LTR models are familiar with a file format introduced by Support Vector Machine for Ranking (SVMRank), an early LTR method. In this format, queries are given IDs, and the actual document identifier can be removed from the training process. Features are labeled with ordinals starting at `1`. For the preceding example, the file format would be:

```
4   qid:1   1:0.0   2:21.5  3:100,...
4   qid:1   1:42.5  2:21.5  3:95,...
3   qid:1   1:53.1  2:40.1  3:50,...
...
```

In actual systems, you might log these values and then use them later to annotate a judgment list. In other cases, the judgment list might come from user analytics, so the feature values are logged as you interact with the search application. See [Logging features]({{site.url}}{{site.baseurl}}/search-plugins/ltr/logging-features/) for more information.

## Training a ranking function 

The following are key considerations for training a ranking function: 

- **Ranking models:** Several models, such as the following, are available for training, each with pros and cons:

  - **Tree-based models** (for example, LambdaMART, MART, Random Forests)
    - Generally the most accurate. 
    - Large and complex, making them expensive to train.
    - Tools such as [RankLib](https://sourceforge.net/p/lemur/wiki/RankLib/) and [XGBoost](https://github.com/dmlc/xgboost) focus on tree-based models. 
    
  - **SVM-based models (SVMRank)**
    - Less accurate but less expensive to train. 
    - See [Support Vector Machine for Ranking](https://www.cs.cornell.edu/people/tj/svm_light/svm_rank.html) for more information.
    
  - **Linear models**
    - Perform basic linear regression on the judgment list.
    - Tend to not be useful outside of the examples. 
    - See [Learning to Rank 101 — Linear Models](http://opensourceconnections.com/blog/2017/04/01/learning-to-rank-linear-models/) for more information.

- **Model selection:** The choice of model can depend not only on performance but also on your level of experience and familiarity with the different approaches.

## Testing: Is the model any good?  

When testing the quality of the ranking model, consider the following: 

- **Judgment list limitations:** A judgment list cannot include every possible query that a model may encounter in the real world. It is important to test the model on a variety of queries in order to assess its ability to generalize beyond the training data. 
- **Overfitting:** A model that is overfit to the training data does not perform well on new, unseen data. To avoid this, consider doing the following:
  - Preserving some judgment lists as a _test set_ that is not used during the training process.
  - Evaluating the model's performance on the test set, which reflects how it may perform in unfamiliar scenarios.
  - Monitoring the _test NDCG_ metric, which should remain high as the model is trained.
- **Temporal generalization:** Even after deploying the model, you should continue testing the model's performance using more recent judgment lists to ensure that it does not become overfit to seasonal or temporal situations. 

## Real-world concerns

The following are practical considerations for using the Learning to Rank plugin:

- **Accurate judgment lists:** How can you create judgment lists that reflect your users' perception of search quality?
- **Measuring search quality:** What metrics should you use to determine whether the search results are useful to your users?
- **Data collection infrastructure:** What kind of infrastructure do you need in order to collect and log user behavior and feature data?
- **Model retraining:** How will you know when your model needs to be retrained?
- **A/B testing:** How will you compare your new model to your current search solution? What key performance indicators (KPIs) will you use to determine the success of your search system?

See [How does the plugin fit in?]({{site.url}}{{site.baseurl}}/search-plugins/ltr/fits-in/) to learn more about how the Learning to Rank plugin's functionality fits into a complete LTR system.
