---
layout: default
title: JNI Library
nav_order: 5
parent: k-NN
has_children: false
---

# JNI Library
In order to integrate [nmslib's](https://github.com/nmslib/nmslib/) approximate k-NN functionality, which is implemented in C++, into the k-NN plugin, which is implemented in Java, we created a Java Native Interface library. Check out [this wiki](https://en.wikipedia.org/wiki/Java_Native_Interface) to learn more about JNI. This library allows the k-NN plugin to leverage nmslib's functionality. For more information about how we build the JNI library binary and how to get the most of it in your production environment, see [here](https://github.com/opensearch-project/k-NN#jni-library-artifacts).
