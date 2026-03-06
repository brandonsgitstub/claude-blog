# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] - 2026-03-06

### Fixed
- **install.sh**: Move `TEMP_DIR` declaration to global scope so the `EXIT` trap can access it after `main()` returns (fixes "unbound variable" error with `set -u` when installing via `curl | bash`) — thanks [@twdnhfr](https://github.com/twdnhfr)

## [1.2.0] - 2026-02-18

### Changed
- **Readability layer upgrade** with research-backed thresholds (120+ sources):
  - Flesch target: 45-60 → 60-70 (aligns with Yoast, GEO, WCAG, Raptive data)
  - Paragraph hard limit: 100 → 150 words (200 = Yoast red)
  - Ideal paragraph range: 40-55 → 40-80 words
  - H2 heading frequency: 150-200 → 200-300 words
  - Content Quality redistribution: Depth 8→7, Readability 6→7
- New automated checks in `analyze_blog.py`: passive voice estimation, transition word percentage, AI trigger word detection (26 words), sentence length distribution
- New reference sections in `google-landscape-2026.md` and `geo-optimization.md` for readability signals
- 16 files updated across references, script, skills, agents, and docs

### Added
- YouTube demo video link in README
- Header image and demo GIFs (`assets/`)

### Removed
- Placeholder `screenshots/` directory

## [1.1.0] - 2026-02-18

### Added
- **Built-in SVG chart generation** (`blog-chart` sub-skill) — eliminates external `/svg` dependency
  - Supports 7 chart types: horizontal bar, grouped bar, donut, line, lollipop, area, radar
  - Dark-mode compatible, accessible (WCAG), platform-aware (HTML/JSX auto-detection)
- **Image URL verification** in researcher agent — validates HTTP 200 before embedding
- **Mid-writing readability check** in writer agent — self-checks Flesch targets before returning
- **Image density guidelines** by content type in visual-media.md

### Changed
- claude-blog is now fully self-contained — no external skill dependencies required
- Integration section updated to list companion skills as optional
- Installer scripts updated for 13 sub-skills

### Removed
- External `/svg` / `/svg-chart` skill dependency

## [1.0.0] - 2026-02-18

### Added
- **12 slash commands**: write, rewrite, analyze, brief, calendar, strategy, outline, seo-check, schema, repurpose, geo, audit
- **12 reference documents** loaded on-demand (RAG pattern):
  - google-landscape-2026, geo-optimization, content-rules, visual-media, quality-scoring
  - eeat-signals, content-templates, ai-crawler-guide, schema-stack, platform-guides, distribution-playbook, internal-linking
- **12 content type templates**: how-to, listicle, case study, comparison, pillar page, product review, thought leadership, roundup, tutorial, news analysis, data research, FAQ/knowledge base
- **4 specialized subagents**: blog-researcher, blog-writer, blog-seo, blog-reviewer
- **Python quality analysis script** (`analyze_blog.py`):
  - 5-category, 100-point scoring system (Content 30, SEO 25, E-E-A-T 15, Technical 15, AI Citation 15)
  - Readability analysis via textstat (Flesch, Gunning Fog, SMOG, Coleman-Liau)
  - AI content detection signals (burstiness, known AI phrases, vocabulary diversity)
  - Schema detection via BeautifulSoup
  - Batch mode with directory scanning
  - Multiple output formats (JSON, markdown, table)
  - Graceful degradation without optional dependencies
- **Unix + Windows installers** (install.sh, install.ps1) with one-command curl install
- **Uninstaller** (uninstall.sh) for clean removal
- **Full documentation suite** (docs/): Installation, Commands, Architecture, Templates, Troubleshooting, MCP Integration

### Architecture
- Main orchestrator: `blog/SKILL.md` (routes all 12 commands)
- 12 sub-skills in `skills/blog-*/SKILL.md`
- 4 subagents in `agents/blog-*.md`
- 12 reference docs in `blog/references/` (loaded on-demand)
- 12 content templates in `blog/templates/`

### Fixed
- Corrected phantom "January 2026 Authenticity Update" references to verified **December 2025 Core Update** (Dec 11-29, 2025)
