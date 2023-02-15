.PHONY: dev
dev: install
	npm run dev

.PHONY: install
install:
	npm i

.PHONY: build
build: install
	npm run build

.PHONY: preview
preview: install
	npm run preview
