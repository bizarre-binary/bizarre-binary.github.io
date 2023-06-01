.PHONY: dev
dev: install
	npm run dev

.PHONY: test
test: install
	npm test

.PHONY: test-watch
test-watch: install
	npm run test:watch

.PHONY: install
install:
	npm i

.PHONY: clean-install
clean-install:
	npm ci

.PHONY: build
build: install
	npm run build

.PHONY: preview
preview: build
	npm run preview
