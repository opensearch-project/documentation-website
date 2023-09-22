---
layout: default
title: Top hits
parent: Metric aggregations
grand_parent: Aggregations
nav_order: 130
redirect_from:
  - /query-dsl/aggregations/metric/top-hits/
---

# Top hits aggregations

The `top_hits` metric is a multi-value metric aggregation that ranks the matching documents based on a relevance score for the field that's being aggregated.

You can specify the following options:

- `from`: The starting position of the hit.
- `size`: The maximum size of hits to return. The default value is 3.
- `sort`: How the matching hits are sorted. By default, the hits are sorted by the relevance score of the aggregation query.

The following example returns the top 5 products in your eCommerce data:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "top_hits_products": {
      "top_hits": {
        "size": 5
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
...
"aggregations" : {
  "top_hits_products" : {
    "hits" : {
      "total" : {
        "value" : 4675,
        "relation" : "eq"
      },
      "max_score" : 1.0,
      "hits" : [
        {
          "_index" : "opensearch_dashboards_sample_data_ecommerce",
          "_type" : "_doc",
          "_id" : "glMlwXcBQVLeQPrkHPtI",
          "_score" : 1.0,
          "_source" : {
            "category" : [
              "Women's Accessories",
              "Women's Clothing"
            ],
            "currency" : "EUR",
            "customer_first_name" : "rania",
            "customer_full_name" : "rania Evans",
            "customer_gender" : "FEMALE",
            "customer_id" : 24,
            "customer_last_name" : "Evans",
            "customer_phone" : "",
            "day_of_week" : "Sunday",
            "day_of_week_i" : 6,
            "email" : "rania@evans-family.zzz",
            "manufacturer" : [
              "Tigress Enterprises"
            ],
            "order_date" : "2021-02-28T14:16:48+00:00",
            "order_id" : 583581,
            "products" : [
              {
                "base_price" : 10.99,
                "discount_percentage" : 0,
                "quantity" : 1,
                "manufacturer" : "Tigress Enterprises",
                "tax_amount" : 0,
                "product_id" : 19024,
                "category" : "Women's Accessories",
                "sku" : "ZO0082400824",
                "taxless_price" : 10.99,
                "unit_discount_amount" : 0,
                "min_price" : 5.17,
                "_id" : "sold_product_583581_19024",
                "discount_amount" : 0,
                "created_on" : "2016-12-25T14:16:48+00:00",
                "product_name" : "Snood - white/grey/peach",
                "price" : 10.99,
                "taxful_price" : 10.99,
                "base_unit_price" : 10.99
              },
              {
                "base_price" : 32.99,
                "discount_percentage" : 0,
                "quantity" : 1,
                "manufacturer" : "Tigress Enterprises",
                "tax_amount" : 0,
                "product_id" : 19260,
                "category" : "Women's Clothing",
                "sku" : "ZO0071900719",
                "taxless_price" : 32.99,
                "unit_discount_amount" : 0,
                "min_price" : 17.15,
                "_id" : "sold_product_583581_19260",
                "discount_amount" : 0,
                "created_on" : "2016-12-25T14:16:48+00:00",
                "product_name" : "Cardigan - grey",
                "price" : 32.99,
                "taxful_price" : 32.99,
                "base_unit_price" : 32.99
              }
            ],
            "sku" : [
              "ZO0082400824",
              "ZO0071900719"
            ],
            "taxful_total_price" : 43.98,
            "taxless_total_price" : 43.98,
            "total_quantity" : 2,
            "total_unique_products" : 2,
            "type" : "order",
            "user" : "rani",
            "geoip" : {
              "country_iso_code" : "EG",
              "location" : {
                "lon" : 31.3,
                "lat" : 30.1
              },
              "region_name" : "Cairo Governorate",
              "continent_name" : "Africa",
              "city_name" : "Cairo"
            },
            "event" : {
              "dataset" : "sample_ecommerce"
            }
          }
          ...
        }
      ]
    }
  }
 }
}
```