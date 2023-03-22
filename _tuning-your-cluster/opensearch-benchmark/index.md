---
layout: default
title: OpenSearch Benchmark
nav_order: 15
has_children: true
---

# OpenSearch Benchmark

OpenSearch Benchmark is a macrobenchmark utility that measures the performance of OpenSearch clusters. 

```
------------------------------------------------------
    _______             __   _____
   / ____(_)___  ____ _/ /  / ___/_________  ________
  / /_  / / __ \/ __ `/ /   \__ \/ ___/ __ \/ ___/ _ \
 / __/ / / / / / /_/ / /   ___/ / /__/ /_/ / /  /  __/
/_/   /_/_/ /_/\__,_/_/   /____/\___/\____/_/   \___/
------------------------------------------------------
            
|                                                         Metric |                           Task |       Value |    Unit |
|---------------------------------------------------------------:|-------------------------------:|------------:|--------:|
|                     Cumulative indexing time of primary shards |                                |  0.00633333 |     min |
|             Min cumulative indexing time across primary shards |                                |           0 |     min |
|          Median cumulative indexing time across primary shards |                                | 0.000266667 |     min |
|             Max cumulative indexing time across primary shards |                                |  0.00381667 |     min |
|            Cumulative indexing throttle time of primary shards |                                |           0 |     min |
|    Min cumulative indexing throttle time across primary shards |                                |           0 |     min |
| Median cumulative indexing throttle time across primary shards |                                |           0 |     min |
|    Max cumulative indexing throttle time across primary shards |                                |           0 |     min |
|                        Cumulative merge time of primary shards |                                |  0.00353333 |     min |
|                       Cumulative merge count of primary shards |                                |           5 |         |
|                Min cumulative merge time across primary shards |                                |           0 |     min |
|             Median cumulative merge time across primary shards |                                |           0 |     min |
|                Max cumulative merge time across primary shards |                                |  0.00353333 |     min |
|               Cumulative merge throttle time of primary shards |                                |           0 |     min |
|       Min cumulative merge throttle time across primary shards |                                |           0 |     min |
|    Median cumulative merge throttle time across primary shards |                                |           0 |     min |
|       Max cumulative merge throttle time across primary shards |                                |           0 |     min |
|                      Cumulative refresh time of primary shards |                                |      0.0322 |     min |
|                     Cumulative refresh count of primary shards |                                |         218 |         |
|              Min cumulative refresh time across primary shards |                                |           0 |     min |
|           Median cumulative refresh time across primary shards |                                |     0.00045 |     min |
|              Max cumulative refresh time across primary shards |                                |   0.0256333 |     min |
|                        Cumulative flush time of primary shards |                                | 0.000416667 |     min |
|                       Cumulative flush count of primary shards |                                |           4 |         |
|                Min cumulative flush time across primary shards |                                |           0 |     min |
|             Median cumulative flush time across primary shards |                                |           0 |     min |
|                Max cumulative flush time across primary shards |                                |     0.00025 |     min |
|                                        Total Young Gen GC time |                                |       0.027 |       s |
|                                       Total Young Gen GC count |                                |           6 |         |
|                                          Total Old Gen GC time |                                |           0 |       s |
|                                         Total Old Gen GC count |                                |           0 |         |
|                                                     Store size |                                |  0.00108313 |      GB |
|                                                  Translog size |                                | 5.33406e-05 |      GB |
|                                         Heap used for segments |                                |           0 |      MB |
|                                       Heap used for doc values |                                |           0 |      MB |
|                                            Heap used for terms |                                |           0 |      MB |
|                                            Heap used for norms |                                |           0 |      MB |
|                                           Heap used for points |                                |           0 |      MB |
|                                    Heap used for stored fields |                                |           0 |      MB |
|                                                  Segment count |                                |          26 |         |
|                                                 Min Throughput |                   index-append |     17224.5 |  docs/s |
|                                                Mean Throughput |                   index-append |     17224.5 |  docs/s |
|                                              Median Throughput |                   index-append |     17224.5 |  docs/s |
|                                                 Max Throughput |                   index-append |     17224.5 |  docs/s |
|                                        50th percentile latency |                   index-append |     42.0181 |      ms |
|                                       100th percentile latency |                   index-append |     52.7944 |      ms |
|                                   50th percentile service time |                   index-append |     42.0181 |      ms |
|                                  100th percentile service time |                   index-append |     52.7944 |      ms |
|                                                     error rate |                   index-append |           0 |       % |
|                                                 Min Throughput |       wait-until-merges-finish |       30.78 |   ops/s |
|                                                Mean Throughput |       wait-until-merges-finish |       30.78 |   ops/s |
|                                              Median Throughput |       wait-until-merges-finish |       30.78 |   ops/s |
|                                                 Max Throughput |       wait-until-merges-finish |       30.78 |   ops/s |
|                                       100th percentile latency |       wait-until-merges-finish |     17.4735 |      ms |
|                                  100th percentile service time |       wait-until-merges-finish |     17.4735 |      ms |
|                                                     error rate |       wait-until-merges-finish |           0 |       % |
|                                                 Min Throughput |                    index-stats |       29.66 |   ops/s |
|                                                Mean Throughput |                    index-stats |       29.66 |   ops/s |
|                                              Median Throughput |                    index-stats |       29.66 |   ops/s |
|                                                 Max Throughput |                    index-stats |       29.66 |   ops/s |
|                                       100th percentile latency |                    index-stats |     41.3136 |      ms |
|                                  100th percentile service time |                    index-stats |     5.97601 |      ms |
|                                                     error rate |                    index-stats |           0 |       % |
|                                                 Min Throughput |                     node-stats |       25.25 |   ops/s |
|                                                Mean Throughput |                     node-stats |       25.25 |   ops/s |
|                                              Median Throughput |                     node-stats |       25.25 |   ops/s |
|                                                 Max Throughput |                     node-stats |       25.25 |   ops/s |
|                                       100th percentile latency |                     node-stats |     50.8638 |      ms |
|                                  100th percentile service time |                     node-stats |     9.97437 |      ms |
|                                                     error rate |                     node-stats |           0 |       % |
|                                                 Min Throughput |                        default |        31.1 |   ops/s |
|                                                Mean Throughput |                        default |        31.1 |   ops/s |
|                                              Median Throughput |                        default |        31.1 |   ops/s |
|                                                 Max Throughput |                        default |        31.1 |   ops/s |
|                                       100th percentile latency |                        default |     42.6897 |      ms |
|                                  100th percentile service time |                        default |     10.1975 |      ms |
|                                                     error rate |                        default |           0 |       % |
|                                                 Min Throughput |                           term |       34.15 |   ops/s |
|                                                Mean Throughput |                           term |       34.15 |   ops/s |
|                                              Median Throughput |                           term |       34.15 |   ops/s |
|                                                 Max Throughput |                           term |       34.15 |   ops/s |
|                                       100th percentile latency |                           term |     35.8634 |      ms |
|                                  100th percentile service time |                           term |     6.25484 |      ms |
|                                                     error rate |                           term |           0 |       % |
|                                                 Min Throughput |                         phrase |       27.05 |   ops/s |
|                                                Mean Throughput |                         phrase |       27.05 |   ops/s |
|                                              Median Throughput |                         phrase |       27.05 |   ops/s |
|                                                 Max Throughput |                         phrase |       27.05 |   ops/s |
|                                       100th percentile latency |                         phrase |     44.9913 |      ms |
|                                  100th percentile service time |                         phrase |     7.66734 |      ms |
|                                                     error rate |                         phrase |           0 |       % |
|                                                 Min Throughput |           country_agg_uncached |       28.81 |   ops/s |
|                                                Mean Throughput |           country_agg_uncached |       28.81 |   ops/s |
|                                              Median Throughput |           country_agg_uncached |       28.81 |   ops/s |
|                                                 Max Throughput |           country_agg_uncached |       28.81 |   ops/s |
|                                       100th percentile latency |           country_agg_uncached |     42.9549 |      ms |
|                                  100th percentile service time |           country_agg_uncached |     7.92202 |      ms |
|                                                     error rate |           country_agg_uncached |           0 |       % |
|                                                 Min Throughput |             country_agg_cached |       27.17 |   ops/s |
|                                                Mean Throughput |             country_agg_cached |       27.17 |   ops/s |
|                                              Median Throughput |             country_agg_cached |       27.17 |   ops/s |
|                                                 Max Throughput |             country_agg_cached |       27.17 |   ops/s |
|                                       100th percentile latency |             country_agg_cached |     46.7688 |      ms |
|                                  100th percentile service time |             country_agg_cached |     9.44951 |      ms |
|                                                     error rate |             country_agg_cached |           0 |       % |
|                                                 Min Throughput |                         scroll |       30.87 | pages/s |
|                                                Mean Throughput |                         scroll |       30.87 | pages/s |
|                                              Median Throughput |                         scroll |       30.87 | pages/s |
|                                                 Max Throughput |                         scroll |       30.87 | pages/s |
|                                       100th percentile latency |                         scroll |     116.811 |      ms |
|                                  100th percentile service time |                         scroll |     51.1731 |      ms |
|                                                     error rate |                         scroll |           0 |       % |
|                                                 Min Throughput |                     expression |       29.51 |   ops/s |
|                                                Mean Throughput |                     expression |       29.51 |   ops/s |
|                                              Median Throughput |                     expression |       29.51 |   ops/s |
|                                                 Max Throughput |                     expression |       29.51 |   ops/s |
|                                       100th percentile latency |                     expression |      49.669 |      ms |
|                                  100th percentile service time |                     expression |     15.3729 |      ms |
|                                                     error rate |                     expression |           0 |       % |
|                                                 Min Throughput |                painless_static |        30.9 |   ops/s |
|                                                Mean Throughput |                painless_static |        30.9 |   ops/s |
|                                              Median Throughput |                painless_static |        30.9 |   ops/s |
|                                                 Max Throughput |                painless_static |        30.9 |   ops/s |
|                                       100th percentile latency |                painless_static |     42.7962 |      ms |
|                                  100th percentile service time |                painless_static |     10.0295 |      ms |
|                                                     error rate |                painless_static |           0 |       % |
|                                                 Min Throughput |               painless_dynamic |       26.64 |   ops/s |
|                                                Mean Throughput |               painless_dynamic |       26.64 |   ops/s |
|                                              Median Throughput |               painless_dynamic |       26.64 |   ops/s |
|                                                 Max Throughput |               painless_dynamic |       26.64 |   ops/s |
|                                       100th percentile latency |               painless_dynamic |     48.7802 |      ms |
|                                  100th percentile service time |               painless_dynamic |     10.9034 |      ms |
|                                                     error rate |               painless_dynamic |           0 |       % |
|                                                 Min Throughput | decay_geo_gauss_function_score |       29.07 |   ops/s |
|                                                Mean Throughput | decay_geo_gauss_function_score |       29.07 |   ops/s |
|                                              Median Throughput | decay_geo_gauss_function_score |       29.07 |   ops/s |
|                                                 Max Throughput | decay_geo_gauss_function_score |       29.07 |   ops/s |
|                                       100th percentile latency | decay_geo_gauss_function_score |      46.552 |      ms |
|                                  100th percentile service time | decay_geo_gauss_function_score |     11.8143 |      ms |
|                                                     error rate | decay_geo_gauss_function_score |           0 |       % |
|                                                 Min Throughput |   decay_geo_gauss_script_score |       28.38 |   ops/s |
|                                                Mean Throughput |   decay_geo_gauss_script_score |       28.38 |   ops/s |
|                                              Median Throughput |   decay_geo_gauss_script_score |       28.38 |   ops/s |
|                                                 Max Throughput |   decay_geo_gauss_script_score |       28.38 |   ops/s |
|                                       100th percentile latency |   decay_geo_gauss_script_score |     47.5075 |      ms |
|                                  100th percentile service time |   decay_geo_gauss_script_score |     11.9188 |      ms |
|                                                     error rate |   decay_geo_gauss_script_score |           0 |       % |
|                                                 Min Throughput |     field_value_function_score |       30.89 |   ops/s |
|                                                Mean Throughput |     field_value_function_score |       30.89 |   ops/s |
|                                              Median Throughput |     field_value_function_score |       30.89 |   ops/s |
|                                                 Max Throughput |     field_value_function_score |       30.89 |   ops/s |
|                                       100th percentile latency |     field_value_function_score |     39.6615 |      ms |
|                                  100th percentile service time |     field_value_function_score |      6.9539 |      ms |
|                                                     error rate |     field_value_function_score |           0 |       % |
|                                                 Min Throughput |       field_value_script_score |       32.38 |   ops/s |
|                                                Mean Throughput |       field_value_script_score |       32.38 |   ops/s |
|                                              Median Throughput |       field_value_script_score |       32.38 |   ops/s |
|                                                 Max Throughput |       field_value_script_score |       32.38 |   ops/s |
|                                       100th percentile latency |       field_value_script_score |     39.9424 |      ms |
|                                  100th percentile service time |       field_value_script_score |     8.69464 |      ms |
|                                                     error rate |       field_value_script_score |           0 |       % |
|                                                 Min Throughput |                    large_terms |        2.02 |   ops/s |
|                                                Mean Throughput |                    large_terms |        2.02 |   ops/s |
|                                              Median Throughput |                    large_terms |        2.02 |   ops/s |
|                                                 Max Throughput |                    large_terms |        2.02 |   ops/s |
|                                       100th percentile latency |                    large_terms |     854.175 |      ms |
|                                  100th percentile service time |                    large_terms |      351.08 |      ms |
|                                                     error rate |                    large_terms |           0 |       % |
|                                                 Min Throughput |           large_filtered_terms |         3.6 |   ops/s |
|                                                Mean Throughput |           large_filtered_terms |         3.6 |   ops/s |
|                                              Median Throughput |           large_filtered_terms |         3.6 |   ops/s |
|                                                 Max Throughput |           large_filtered_terms |         3.6 |   ops/s |
|                                       100th percentile latency |           large_filtered_terms |     529.669 |      ms |
|                                  100th percentile service time |           large_filtered_terms |     243.019 |      ms |
|                                                     error rate |           large_filtered_terms |           0 |       % |
|                                                 Min Throughput |         large_prohibited_terms |         2.8 |   ops/s |
|                                                Mean Throughput |         large_prohibited_terms |         2.8 |   ops/s |
|                                              Median Throughput |         large_prohibited_terms |         2.8 |   ops/s |
|                                                 Max Throughput |         large_prohibited_terms |         2.8 |   ops/s |
|                                       100th percentile latency |         large_prohibited_terms |     781.132 |      ms |
|                                  100th percentile service time |         large_prohibited_terms |     415.615 |      ms |
|                                                     error rate |         large_prohibited_terms |           0 |       % |
|                                                 Min Throughput |           desc_sort_population |       27.51 |   ops/s |
|                                                Mean Throughput |           desc_sort_population |       27.51 |   ops/s |
|                                              Median Throughput |           desc_sort_population |       27.51 |   ops/s |
|                                                 Max Throughput |           desc_sort_population |       27.51 |   ops/s |
|                                       100th percentile latency |           desc_sort_population |     54.7593 |      ms |
|                                  100th percentile service time |           desc_sort_population |     18.0455 |      ms |
|                                                     error rate |           desc_sort_population |           0 |       % |
|                                                 Min Throughput |            asc_sort_population |       28.91 |   ops/s |
|                                                Mean Throughput |            asc_sort_population |       28.91 |   ops/s |
|                                              Median Throughput |            asc_sort_population |       28.91 |   ops/s |
|                                                 Max Throughput |            asc_sort_population |       28.91 |   ops/s |
|                                       100th percentile latency |            asc_sort_population |     43.5406 |      ms |
|                                  100th percentile service time |            asc_sort_population |     8.50961 |      ms |
|                                                     error rate |            asc_sort_population |           0 |       % |
|                                                 Min Throughput | asc_sort_with_after_population |       30.99 |   ops/s |
|                                                Mean Throughput | asc_sort_with_after_population |       30.99 |   ops/s |
|                                              Median Throughput | asc_sort_with_after_population |       30.99 |   ops/s |
|                                                 Max Throughput | asc_sort_with_after_population |       30.99 |   ops/s |
|                                       100th percentile latency | asc_sort_with_after_population |     40.0733 |      ms |
|                                  100th percentile service time | asc_sort_with_after_population |     7.46031 |      ms |
|                                                     error rate | asc_sort_with_after_population |           0 |       % |
|                                                 Min Throughput |            desc_sort_geonameid |       28.05 |   ops/s |
|                                                Mean Throughput |            desc_sort_geonameid |       28.05 |   ops/s |
|                                              Median Throughput |            desc_sort_geonameid |       28.05 |   ops/s |
|                                                 Max Throughput |            desc_sort_geonameid |       28.05 |   ops/s |
|                                       100th percentile latency |            desc_sort_geonameid |     46.0632 |      ms |
|                                  100th percentile service time |            desc_sort_geonameid |     10.0588 |      ms |
|                                                     error rate |            desc_sort_geonameid |           0 |       % |
|                                                 Min Throughput | desc_sort_with_after_geonameid |       22.66 |   ops/s |
|                                                Mean Throughput | desc_sort_with_after_geonameid |       22.66 |   ops/s |
|                                              Median Throughput | desc_sort_with_after_geonameid |       22.66 |   ops/s |
|                                                 Max Throughput | desc_sort_with_after_geonameid |       22.66 |   ops/s |
|                                       100th percentile latency | desc_sort_with_after_geonameid |     56.4251 |      ms |
|                                  100th percentile service time | desc_sort_with_after_geonameid |     11.9212 |      ms |
|                                                     error rate | desc_sort_with_after_geonameid |           0 |       % |
|                                                 Min Throughput |             asc_sort_geonameid |       20.54 |   ops/s |
|                                                Mean Throughput |             asc_sort_geonameid |       20.54 |   ops/s |
|                                              Median Throughput |             asc_sort_geonameid |       20.54 |   ops/s |
|                                                 Max Throughput |             asc_sort_geonameid |       20.54 |   ops/s |
|                                       100th percentile latency |             asc_sort_geonameid |     62.2046 |      ms |
|                                  100th percentile service time |             asc_sort_geonameid |     13.1275 |      ms |
|                                                     error rate |             asc_sort_geonameid |           0 |       % |
|                                                 Min Throughput |  asc_sort_with_after_geonameid |       28.27 |   ops/s |
|                                                Mean Throughput |  asc_sort_with_after_geonameid |       28.27 |   ops/s |
|                                              Median Throughput |  asc_sort_with_after_geonameid |       28.27 |   ops/s |
|                                                 Max Throughput |  asc_sort_with_after_geonameid |       28.27 |   ops/s |
|                                       100th percentile latency |  asc_sort_with_after_geonameid |     49.6729 |      ms |
|                                  100th percentile service time |  asc_sort_with_after_geonameid |     13.9189 |      ms |
|                                                     error rate |  asc_sort_with_after_geonameid |           0 |       % |
```