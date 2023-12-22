---
layout: default
title: Pipeline options
parent: Pipelines
nav_order: 11
---

# Pipeline options

This page provides information about pipeline configuration options in Data Prepper. 

## General pipeline options

Option | Required | Type | Description
:--- | :--- | :--- | :---
workers | No | Integer | Essentially the number of application threads. As a starting point for your use case, try setting this value to the number of CPU cores on the machine. Default is 1.
delay | No | Integer | Amount of time in milliseconds workers wait between buffer read attempts. Default is `3000`.

