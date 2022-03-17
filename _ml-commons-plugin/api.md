---
layout: default
title: API
has_children: false
nav_order: 90
---

The Machine Learning (ML) commons API lets you create, train, and store machine learning algorithms both synchronously and asynchronously.  

In order to train tasks through the API, three inputs are required. 

- Algorithm name: Usually `FunctionaName`. This determines what algorithm the ML Engine runs.
- Model hyper parameters: Adjust these parameters to make the model train better.  You can also implement `MLAgoParamas` to build custom parameters for each model.
- Input data: The data input that teaches the ML model. To input data, query against your index or use data frame.

## Train model



