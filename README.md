# Agent Skills & Rules for Modular Laravel Applications

A comprehensive, opinionated documentation framework that guides AI coding agents (and human developers) to produce consistent, high-quality code in large-scale, modular Laravel projects.

## What is this?

This repository contains a structured knowledge base designed to be consumed by AI coding agents (such as GitHub Copilot, Cursor, Gemini, or any LLM-powered assistant). It tells the agent **how** to write code, **what patterns** to follow, and **what rules** to enforce — acting as a virtual senior engineer that never forgets the standards.

It is equally useful as a human-readable engineering handbook for onboarding new developers.

## Repository Structure

```
.
├── AGENTS.md                          # Root entry point for agents
├── README.md                          # This file (usage guide)
├── skills/                            # Practical "how-to" guides
│   ├── laravel-modules.md             # DDD, Aggregates, Sagas, Value Objects
│   ├── eloquent-performance.md        # N+1, Caching, Locking, Indexing
│   ├── api-development.md             # REST, Versioning, Idempotency
│   ├── testing-phpunit.md             # Unit, Feature, Architecture Tests
│   ├── git-workflow.md                # Branching, Commits, PRs
│   └── code-style.md                  # Strict types, Naming, Static Analysis
└── rules/                             # Strict governance mandates
    ├── modular-architecture.md         # Module boundaries, ACL, Sync/Async
    ├── services.md                     # DTOs, Actions, Dependency Injection
    ├── security-best-practices.md      # Validation, Auth, Audit Logging
    ├── database-migrations.md          # Safe migrations, Down methods
    ├── new-feature.md                  # Step-by-step feature workflow
    ├── frontend.md                     # Blade, Tailwind, Alpine
    ├── livewire-components.md          # Livewire best practices
    └── code-review-checklist.md        # Pre-PR verification checklist
```

## How to Use

### 1. Copy into your project

Clone or copy this repository into the root of your Laravel project:

```bash
# Option A: Clone as a subdirectory
git clone https://github.com/BayuFirmansyaah/github-agents-skilss.git .agents

# Option B: Copy files directly into your project root
cp -r github-agents-skilss/AGENTS.md .
cp -r github-agents-skilss/skills/ .
cp -r github-agents-skilss/rules/ .
```

### 2. Point your agent to AGENTS.md

Most AI coding tools look for a root-level `AGENTS.md` (or equivalent) as the entry point. Once the file is in your project root, the agent will automatically discover it.

For tools that require explicit configuration, add the path to your agent's context:

```
# Example: Cursor rules
Include: AGENTS.md, skills/*, rules/*
```

### 3. Customize for your project

These files are templates. You should customize them to match your project's specific:
- Module names and structure
- Technology choices (e.g., Vue vs Livewire, MySQL vs PostgreSQL)
- Team conventions (e.g., specific branch naming, ticket systems)
- Security requirements (e.g., compliance standards)

## Example Prompts

Copy-paste these prompts directly to your AI agent. Each prompt explicitly references the relevant skill or rule file so the agent knows which guide to follow.

### Skills-Based Prompts

**Referencing `skills/laravel-modules.md`:**
```
Create a new module called "Invoice" following the DDD structure defined in
skills/laravel-modules.md. Include the Application, Domain, Infrastructure,
and Interfaces layers. Set up the ServiceProvider with proper bindings.
```

**Referencing `skills/eloquent-performance.md`:**
```
Refactor the OrderController@index method. Follow skills/eloquent-performance.md
to fix the N+1 queries, add eager loading, select only the required columns,
and implement cursor pagination for the API response.
```

**Referencing `skills/api-development.md`:**
```
Build a RESTful API for the Product module following skills/api-development.md.
Include list (with filtering via spatie/laravel-query-builder), show, create,
update, and delete endpoints. Use API Resources for all responses and implement
idempotency on the create endpoint.
```

**Referencing `skills/testing-phpunit.md`:**
```
Write tests for the PlaceOrderAction following skills/testing-phpunit.md.
Include unit tests for the domain logic, feature tests for the API endpoint
(happy path, validation errors, unauthorized access, out-of-stock edge case),
and an architecture test to verify module boundaries are respected.
```

**Referencing `skills/git-workflow.md`:**
```
I'm about to make a PR. Review my branch name and commit messages against
skills/git-workflow.md. Suggest fixes if they don't follow Conventional Commits.
```

**Referencing `skills/code-style.md`:**
```
Audit this file for code style violations based on skills/code-style.md.
Check for missing strict_types, untyped parameters, non-final classes,
and methods exceeding 20 lines. Refactor any violations.
```

### Rules-Based Prompts

**Referencing `rules/modular-architecture.md`:**
```
The Order module currently imports User::class directly from the User module.
Refactor this following rules/modular-architecture.md. Create a UserLookupInterface
contract, implement it in the User module, and consume it via dependency injection
in the Order module.
```

**Referencing `rules/services.md`:**
```
The checkout logic is currently inside CheckoutController with 80 lines of
business logic. Refactor it following rules/services.md. Extract a PlaceOrderAction
with a PlaceOrderDTO, inject all dependencies through the constructor, and wrap
the multi-step process in a DB::transaction.
```

**Referencing `rules/security-best-practices.md`:**
```
Audit the UserController for security issues following rules/security-best-practices.md.
Check for: missing FormRequest validation, missing authorization (Policy/Gate),
any use of $request->all(), raw SQL without bindings, and missing audit logging
on write operations.
```

**Referencing `rules/database-migrations.md`:**
```
I need to rename the column 'fullname' to 'full_name' on the users table.
Follow rules/database-migrations.md to do this safely without downtime.
Do NOT rename the column directly.
```

**Referencing `rules/new-feature.md`:**
```
I need to implement a coupon/discount system. Follow the full workflow in
rules/new-feature.md: start with schema design, then domain layer (Value Objects,
Aggregates), then application layer (Actions, DTOs), then interface layer
(Controllers, Requests, Resources), and finally write tests.
```

**Referencing `rules/frontend.md`:**
```
Create a reusable Blade component system for form inputs (text, select, textarea,
checkbox) following rules/frontend.md. Each component must accept props for
validation errors, labels, and Alpine.js integration.
```

**Referencing `rules/livewire-components.md`:**
```
Build a Livewire data table for the Users module following rules/livewire-components.md.
Include search, status filter (as a separate child component communicating via events),
pagination, and a lazy-loaded export button. Use #[Computed] for the query and
@entangle for Alpine interactions.
```

**Referencing `rules/code-review-checklist.md`:**
```
Run the full code review checklist from rules/code-review-checklist.md against
my latest changes. Check every category: functionality, architecture, code quality,
performance, security, testing, and static analysis. Report any violations.
```

### Combining Multiple References

You can reference multiple files in a single prompt for complex tasks:

```
Create a "Subscription" module. Follow:
- skills/laravel-modules.md for the DDD directory structure
- rules/services.md for the Action classes and DTOs
- rules/modular-architecture.md for cross-module communication with the User module
- rules/database-migrations.md for the schema
- skills/testing-phpunit.md for comprehensive tests
- rules/code-review-checklist.md to self-review before finishing
```

---

## Usage Examples

### Example 1: Agent creates a new feature

When you ask your agent: *"Create an endpoint to list user orders with filtering and pagination"*

The agent reads `AGENTS.md`, discovers the relevant skills and rules, and produces code that:

1. Creates a `StoreOrderRequest` with validation rules (from `rules/security-best-practices.md`)
2. Builds a thin controller that delegates to an Action class (from `rules/services.md`)
3. Uses a DTO to pass data from controller to action (from `rules/services.md`)
4. Uses `spatie/laravel-query-builder` for filtering (from `skills/api-development.md`)
5. Returns a paginated response via API Resource (from `skills/api-development.md`)
6. Eager loads relationships to prevent N+1 (from `skills/eloquent-performance.md`)
7. Writes Feature tests for happy path and edge cases (from `skills/testing-phpunit.md`)

**Without the agent docs**, the same request might produce a fat controller with raw queries and no tests.

### Example 2: Agent fixes a performance issue

When you ask: *"The orders page is slow, fix it"*

The agent reads `skills/eloquent-performance.md` and applies:

```php
// Before (discovered by agent as problematic)
$orders = Order::all();
foreach ($orders as $order) {
    echo $order->user->name;       // N+1 queries
    echo $order->items->count();   // N+1 queries
}

// After (agent applies eager loading, pagination, and select)
$orders = Order::with(['user:id,name', 'items'])
    ->select(['id', 'user_id', 'status', 'total', 'created_at'])
    ->latest()
    ->paginate(15);
```

### Example 3: Agent creates a Livewire component

When you ask: *"Create a Livewire component for managing product inventory"*

The agent reads `rules/livewire-components.md` and produces:

```php
// app/Livewire/Products/InventoryManager.php
class InventoryManager extends Component
{
    use WithPagination;

    public string $search = '';

    #[Computed]
    public function products(): LengthAwarePaginator
    {
        return Product::query()
            ->when($this->search, fn ($q) => $q->where('name', 'like', "%{$this->search}%"))
            ->with('category:id,name')
            ->paginate(20);
    }

    public function updateStock(int $productId, int $quantity): void
    {
        $this->authorize('update', Product::find($productId));

        app(UpdateStockAction::class)->execute(
            new UpdateStockDTO(productId: $productId, quantity: $quantity)
        );

        session()->flash('success', 'Stock updated.');
    }

    public function render(): View
    {
        return view('livewire.products.inventory-manager');
    }
}
```

Notice how the agent:
- Uses `#[Computed]` for data (from `rules/livewire-components.md`)
- Delegates to an Action class (from `rules/services.md`)
- Uses authorization (from `rules/security-best-practices.md`)
- Eager loads relationships (from `skills/eloquent-performance.md`)

### Example 4: Agent writes a migration

When you ask: *"Add a `tracking_number` column to the orders table"*

The agent reads `rules/database-migrations.md` and produces:

```php
// Safe: nullable column, proper down method, index included
public function up(): void
{
    Schema::table('orders', function (Blueprint $table) {
        $table->string('tracking_number')->nullable()->after('status');
        $table->index('tracking_number');
    });
}

public function down(): void
{
    Schema::table('orders', function (Blueprint $table) {
        $table->dropIndex(['tracking_number']);
        $table->dropColumn('tracking_number');
    });
}
```

## Extending This Framework

### Adding a new skill

Create a new `.md` file in `skills/` following the persona format:

```markdown
# Skill: [Topic Name]

You are a [Role] responsible for [what you do]. You understand that [key principle].
[Continue with detailed instructions, examples, and code blocks...]
```

Then add a reference in `AGENTS.md` under the Skills section.

### Adding a new rule

Create a new `.md` file in `rules/` following the same format. Rules should use stronger language ("You MUST", "NEVER", "FORBIDDEN") since they are mandates, not suggestions.

Then add a reference in `AGENTS.md` under the Rules section.

## License

This project is open-source. Use it, fork it, adapt it to your team's needs.
