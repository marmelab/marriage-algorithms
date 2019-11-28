
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

start:
	npm start

install:
	npm install

build:
	npm run build

test:
	npm test

lint: ## lint the code and check coding conventions
	@echo "Running linter..."
	npm run -s lint
