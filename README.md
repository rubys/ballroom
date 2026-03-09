# Ballroom

Ballroom is a test application for [Ruby2JS](https://github.com/ruby2js/ruby2js) and [Juntos](https://github.com/nicolo-ribaudo/ruby2js/tree/main/packages/juntos) — the same Ruby codebase runs as both a traditional Rails app and a JavaScript app via transpilation.  It is based on [showcase](https://github.com/rubys/showcase), which is a dance competition management system built with Rails 8. Manages events, studios, people, dances, heats, scoring, and results

## Getting Started

### Prerequisites

- Ruby 3.4+
- Node.js 20+
- SQLite3

### Setup

```bash
bundle install
bin/rails db:prepare
npx github:ruby2js/juntos init
```

### Running

**As a Rails app:**

```bash
bin/rails server
```

**As a JavaScript app (via Juntos):**

```bash
npx juntos dev
```

Both serve the same application at `http://localhost:3000`.

## Testing

**Rails tests (221 tests):**

```bash
bin/rails test
```

**Juntos tests (224 tests via Vitest):**

```bash
npx vitest run
```

**End-to-end tests (Playwright):**

```bash
npx juntos e2e
```

## Architecture

### Models (34)

Core domain: Event, Studio, Person, Dance, Heat, Entry, Score, Judge, Category, Level, Age, Package, Table, and supporting models. The Locale model provides dual-runtime date formatting using `Intl.DateTimeFormat` in JavaScript and manual formatting in Ruby.

### Controllers (29)

Standard RESTful controllers. EventsController has a `root` dashboard action. StudiosController has `unpair` for pair management. PeopleController has sortable columns and search.

### Stimulus Controllers

- **info_box** — Toggle info/help boxes
- **person** — Dynamic form field visibility based on type/role
- **people_search** — Client-side table filtering
- **studio_price_override** — Show/hide cost override fields

## Dual-Runtime Development

This app is designed to run identically as Rails and as transpiled JavaScript. Key patterns:

- **`defined?(Intl)` guards** — Runtime detection that transpiles to `typeof Intl !== 'undefined'`
- **`self.inheritance_column = nil`** — Disables STI for models with `type` columns
- **Standard Rails idioms** — The transpiler handles `params[:key]`, `before_action`, `respond_to`, strong params, etc.

For transpiler development details, see [SHOWCASE_INCREMENTAL_REBUILD.md](https://github.com/ruby2js/ruby2js/blob/master/plans/SHOWCASE_INCREMENTAL_REBUILD.md) in the ruby2js repo.
