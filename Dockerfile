FROM ruby:3.2

WORKDIR /app

# Odd we don't version Gemfile.lock and therefore have it here to copy in!
COPY Gemfile ./

RUN bundle install

# Expose the default Jekyll port
EXPOSE 4000

ENV JEKYLL_LINK_CHECKER="internal"

CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0","--port", "4000", "--incremental", "--livereload", "--trace"]
