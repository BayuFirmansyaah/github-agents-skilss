# Rule: Livewire Components & Frontend

## ⚡️ Livewire Best Practices

### 1. Single Responsibility Components
-   **Do**: Create small, focused components (e.g., `ProductCard`, `CartButton`).
-   **Don't**: Create monolithic "Page Components" that handle everything.
-   **Structure**:
    ```text
    app/Http/Livewire/
    ├── Products/
    │   ├── Show.php
    │   └── Index.php
    ├── Cart/
    │   └── UpdateButton.php
    ```

### 2. Properties & Data Binding
-   **Public Properties**: Only expose what needs to be synced with the frontend.
-   **Computed Properties**: Use `#[Computed]` for derived data to avoid re-calculating on every request.
-   **Models**: Use `public User $user` for automatic model binding, but be careful of security (locking).

### 3. Actions & Optimization
-   **Throttling**: Always throttle button clicks that trigger backend actions.
    ```html
    <button wire:click.throttle.1000ms="save">Save</button>
    ```
-   **Lazy Loading**: Use `lazy` for heavy components that don't need to load immediately.
    ```html
    <livewire:dashboard-chart lazy />
    ```

### 4. Events
-   **Dispatching**: Use `Isolate` or strictly defined event names.
-   **Listeners**: Use attributes `#[On('event-name')]` instead of the `$listeners` array.

### 5. AlpineJS Integration
-   **Entangle**: Use `@entangle` to sync Livewire and Alpine data smoothly.
    ```html
    <div x-data="{ open: @entangle('showModal') }">
    ```
-   **Pure JS**: Use Alpine for purely frontend interactions (toggling, dropdowns) to refrain from unnecessary server roundtrips.

## 🎨 Volt & Functional Components
-   If using **Livewire Volt**, functional API is preferred for simple UI components.
-   Keep logic inside the view only if it is trivial ( < 10 lines of PHP).
