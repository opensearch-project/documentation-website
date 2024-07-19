FROM ruby:3.2.4

WORKDIR /app

COPY Gemfile Gemfile.lock ./

RUN bundle install

# Expose the default Jekyll port
EXPOSE 4000

# Enable the link checker
ENV JEKYLL_LINK_CHECKER="internal"
ENV JEKYLL_ENV=development
ENV HOST=127.0.0.1

CMD ["bundle", "exec", "jekyll", "serve", "--host", "$HOST", "--port", "4000", "--incremental", "--livereload", "--trace", "--config", "_config.yml,_config_docker.yml"]
