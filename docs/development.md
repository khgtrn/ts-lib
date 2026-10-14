# Development

## Library

```bash
pnpm install
pnpm run build   # builds dist/esm and dist/cjs
```

## Documentation

The docs are built with [MkDocs](https://www.mkdocs.org/) and the [Material](https://squidfunk.github.io/mkdocs-material/) theme, and deployed to GitHub Pages by [`.github/workflows/docs.yaml`](https://github.com/khgtrn/ts-lib/blob/main/.github/workflows/docs.yaml) on every push to `main` that touches `docs/`, `mkdocs.yaml` or `CHANGELOG.md`. The repository's Pages source must be set to **GitHub Actions** (Settings → Pages).

To preview locally:

```bash
pip install -r docs/requirements.txt
mkdocs serve           # http://127.0.0.1:8000
mkdocs build --strict  # same check as CI
```

The changelog page includes `CHANGELOG.md` directly, so it doesn't need to be copied.

### Why MkDocs is pinned below 2.0

`docs/requirements.txt` pins `mkdocs<2`. MkDocs 2.0 (a pre-release as of October 2026) is a rewrite that removes the plugin system, rewrites theming and switches the config to TOML with no migration path, so Material and the current `mkdocs.yaml` don't work with it. Material itself caps MkDocs below 2.0 since 9.7.5.

MkDocs 1.x is no longer actively updated. If a replacement becomes necessary, [Zensical](https://zensical.org/) (by the Material team) reads `mkdocs.yaml` and aims to be a drop-in replacement; this site only uses the built-in `search` plugin and standard Markdown extensions, so switching should mostly mean changing the build command.
