.PHONY: dev
dev: install
	npm run dev

.PHONY: install
install:
	npm i --legacy-peer-deps

.PHONY: build
build: install
	npm run build

.PHONY: preview
preview: install
	npm run preview
