FROM ruby:3.2.4

WORKDIR /app

COPY Gemfile Gemfile.lock ./

RUN bundle install

# Expose the default Jekyll port
EXPOSE 4000

# Enable the link checker
ENV JEKYLL_LINK_CHECKER="internal"

CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4000", "--incremental", "--livereload", "--trace"]
