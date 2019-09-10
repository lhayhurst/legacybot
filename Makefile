NODE := $(shell which node || echo "node is missing")
NPM := $(shell which npm || echo "npm is missing")
BIN := ./node_modules/.bin
ESLINT ?= $(BIN)/eslint
DEPS := .deps
.PHONY: deps test run clean

.DEFAULT_GOAL := help
help: ## me!
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

run: $(DEPS) ## run
	$(NODE) index.js

test: $(DEPS) ## test
	NODE_ENV=test \
	LOG_ENABLED=true \
	LOG_LEVEL=info \
	$(NPM) test

clean: ## clean
	rm -rf node_modules
	rm .deps

deps: $(DEPS)
	$(NODE) index.js

lint: $(DEPS)
	 @$(ESLINT) .

$(DEPS): package.json
	$(NPM) install
	@touch $(DEPS)

