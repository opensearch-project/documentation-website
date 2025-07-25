---
layout: default
title: JNI library
nav_order: 6
parent: k-NN
has_children: false
canonical_url: https://docs.opensearch.org/latest/search-plugins/knn/jni-libraries/
---

# JNI library

To integrate [nmslib's](https://github.com/nmslib/nmslib/) approximate k-NN functionality (implemented in C++) into the k-NN plugin (implemented in Java), we created a Java Native Interface library, which lets the k-NN plugin leverage nmslib's functionality. To see how we build the JNI library binary and learn how to get the most of it in your production environment, see [JNI Library Artifacts](https://github.com/opensearch-project/k-NN#jni-library-artifacts).

For more information about JNI, see [Java Native Interface](https://en.wikipedia.org/wiki/Java_Native_Interface) on Wikipedia.
