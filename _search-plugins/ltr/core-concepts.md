---
layout: default
title: Core concepts for machine learning ranking
nav_order: 10
parent: LTR search
has_children: false
---

# Core concepts for machine learning ranking

This guidebook is intended for OpenSearch developers and data scientist who are interested in adding machine learning ranking capabilities to their OpenSearch system.

## What is learning to rank?

Learning to Rank (LTR) applies machine learning (ML) to search relevance ranking. This differs from other classic ML problems, such as the following: 

- **Regression**: The goal is to predict a variable, for example, stock price, as a function of known information, for example, number of employees or revenue. The output is a direct prediction.
- **Classification**: The goal is to categorize an entity into predefined classes, for example, profitable or not profitable. The output is a category.

The LTR objective is not to make a direct prediction, but rather learn a function (`f`) that can rank documents in an order that best matches your perception of relevance for a given query. The output `f` does not represent a literal value, but rather a prediction of the document's relative usefulness. 

For comprehensive information about LTR, see the blog posts [How is Search Different From Other Machine Learning Problems?](http://opensourceconnections.com/blog/2017/08/03/search-as-machine-learning-prob/) and [What is Learning to Rank?](http://opensourceconnections.com/blog/2017/02/24/what-is-learning-to-rank/).

## Defining the ideal ordering with judgment lists

Judgment lists, also known as golden sets, provide a way to grade individual search results for a keyword search. These lists express the ideal ordering of search results based on your expectations. 

For example, using the [demo on GitHub](http://github.com/opensearch-project/opensearch-learning-to-rank-base/tree/main/demo/), in a search for `Rambo`, the judgment list may look like the following: 

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

The goal of the ranking function `f` is to produce results that align as closely as possible with the judgment list, maximizing quality metrics across a broad set of training queries. This helps ensure the search results are maximally useful to you.

## Understanding features as building blocks of relevance

In the preceding example of a stock market predictor, the ranking function `f` used variables such as the number of employees and revenue to arrive at a predicted stock price. These are considered features of the company. Similarly, in the context of search relevance, the ranking function must use features that describe the document, the query, or the relationship between the document and the query, such as the [term frequency/inverse document frequency (TF/IDF)](https://en.wikipedia.org/wiki/Tf%E2%80%93idf) score of the query keywords in a field.

For example, features for movies might include:

- Whether/how much the search keywords match the title field, such as `titleScore`
- Whether/how much the search keywords match the description field, such as `descScore`
- The popularity of the movie, such as `popularity`
- The rating of the movie, such as `rating`
- Number of keywords used during the search, such as `numKeywords`*)`

The ranking function would then become `f(titleScore, descScore, popularity, rating, numKeywords)`. The goal is to use the features in a way that maximizes the likelihood of the search results being useful. 

For example, in the `Rambo` use case, it seems intuitive that `titleScore` would be important. However, for the top movie _First Blood_", the keyword `Rambo` is likely only mentioned in the description. In this case, the `descScore`would become relevant. Additionally, the `popularity` and `rating` features could help differentiate between sequels and originals. If the existing features do not work for this purpose, then a new feature `isSequel` could be introduced. This new feature could then be used to make better ranking decisions.

Selecting and experimenting with features is fundamental to LTR. Using poor features that fail to help predict patterns in the target variable will result in an unsatisfactory search experience. This follows the principle of "garbage in, garbage out" that applies to any machine learning problem.

## Completing the training set by logging features

With a set of features defined, the next step is to annotate the judgment list with values of each feature. This data will be used once the training process begins. For example, consider the following judgment list: 

```
grade,keywords,movie
4,Rambo,First Blood
4,Rambo,Rambo
3,Rambo,Rambo III
...
```

To complete the training set, you add the following features:

```
grade,keywords,movie,titleScore,descScore,popularity,...
4,Rambo,First Blood,0.0,21.5,100,...
4,Rambo,Rambo,42.5,21.5,95,...
3,Rambo,Rambo III,53.1,40.1,50,...
```

The `titleScore` represents the relevance score of the `Rambo` keyword in the title field of the document, and so on.

Many LTR models are familiar with a file format introduced by SVM Rank, an early LTR method. In this format, queries are given IDs, and the actual document identifier can be removed for the training
process. Features are labeled with ordinals starting at `1`. For the preceding example, the file format would be:

```
4   qid:1   1:0.0   2:21.5  3:100,...
4   qid:1   1:42.5  2:21.5  3:95,...
3   qid:1   1:53.1  2:40.1  3:50,...
...
```

In actual systems, you might log these values after the fact, gathering them to annotate a judgment list. In other cases, the judgment list might come from user analytics, so the feature values may be logged as the you interact with the search application. To learn more, see [Logging features]({{site.url}}{{site.baseurl}}/search-plugins/ltr/logging-features/).

## Training a ranking function 

When training a ranking function, the key considerations are: 

- **Ranking models:** There are several models available for training, each with its pros and cons:
  - **Tree-based models** (for example, LambdaMART, MART, Random Forests)
    - These models tend to be the most accurate in general. 
    - They are large and complex, making them fairly expensive to train.
    - Tools such as [RankLib](https://sourceforge.net/p/lemur/wiki/RankLib/) and [xgboost](https://github.com/dmlc/xgboost)focus on tree-based models. 
    
  - **SVM based models (SVMRank)**
    - These models are less accurate but less expensive to train. 
    - See [SVM Rank](https://www.cs.cornell.edu/people/tj/svm_light/svm_rank.html) for more information.
    
  - **Linear models**
    - These models perform a basic linear regression over the judgment list.
    - They tend to not be useful outside of toy examples. 
    - See [Learning to Rank 101 — Linear Models](http://opensourceconnections.com/blog/2017/04/01/learning-to-rank-linear-models/) for more information.

- **Model selection:** The choice of model can depend not only on performance but also on the team's experience and familiarity with the different approaches.

## Testing: Is the model any good?  

When testing the quality of the ranking model, there are a few key considerations: 

- **Limitation of the judgment lists:** Judgement lists cannot cover every possible query that the model will encounter in the real world. It is important to test the model on a variety of queries in order to assess its ability to generalize beyond the training data. 
- **Overfitting:** A model that is overfit to the training data will not perform well on new, unseen data. To avoid this, consider the following:
  - Holding back some of your judgment lists as a _test set_ that is not used during the training process.
  - Evaluating the model's performance on the test set, which reflects how it will perform on scenarios it has not seen before.
  - Monitoring the _test NDCG_ (Normalized Discounted Cumulative Gain) metric, which should remain high as the model is trained.
- **Temporal generalization:** Even after deploying the model, you should continue testing the model's performance on more recent judgment lists to ensure it does not become overfit to seasonal or temporal situtations. 

## Real-world concerns

The following are practical considerations for using the Learning to Rank plugin:

- **Accurate judgment lists:** How can you create judgment that reflect your users' perception of search quality?
- **Measuring search quality:** What metrics should you use to determine if the search results are useful to your users?
- **Data collection infrastructure:** What kind of infrastructure do you need to collect and log user behavior and feature data?
- **Model retraining:** How will you know when your model needs to be retrained?
- **A/B testing:** How will you compare your new model to your current search solution? What key performance indicators (KPIs) will you use to determine success of your search system?

Learn more about how the Learning to Rank plugin's functionality fits into a complete LTR system the OpenSearch documentation by reading [How does the plugin fit in?]({{site.url}}{{site.baseurl}}/search-plugins/ltr/fits-in/)
