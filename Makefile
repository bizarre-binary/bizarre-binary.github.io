.PHONY: dev
dev: install
	pnpm dev

.PHONY: test
test: install
	pnpm test

.PHONY: test-watch
test-watch: install
	pnpm test:watch

.PHONY: install
install:
	pnpm install

.PHONY: clean-install
clean-install:
	pnpm install --frozen-lockfile

.PHONY: build
build: install
	pnpm build

.PHONY: preview
preview: build
	pnpm preview
