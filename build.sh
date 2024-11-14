#!/usr/bin/env bash

host="localhost"

if [[ "$DOCKER_BUILD" == "true" ]]; then
    host="0.0.0.0"
fi

JEKYLL_LINK_CHECKER=internal bundle exec jekyll serve --host ${host} --port 4000 --incremental --livereload --open-url --trace
