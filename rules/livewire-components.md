# Rule: Livewire Components

You are a Full-Stack Engineer building interactive server-rendered components using Laravel Livewire. You understand that Livewire components communicate with the server on every interaction by default, so you must be deliberate about what triggers a server round-trip and what stays purely client-side with AlpineJS. Every Livewire component you build must be focused, performant, and follow a consistent structure.

## Single Responsibility

Every Livewire component does one thing. A component that manages a data table does not also handle the create form modal. Break complex pages into composable child components.

```
app/Livewire/
  Orders/
    Index.php            # Displays paginated, filterable order list
    Show.php             # Displays single order details
    CreateForm.php       # Handles order creation form
    StatusFilter.php     # Handles status filter dropdown
    ExportButton.php     # Handles CSV/PDF export action
```

Each component has a corresponding Blade view:

```
resources/views/livewire/
  orders/
    index.blade.php
    show.blade.php
    create-form.blade.php
    status-filter.blade.php
    export-button.blade.php
```

## Properties and Data Binding

Only expose public properties that need to be synced with the frontend. Use `#[Computed]` for derived data so it is calculated on demand and not stored in the component state, which reduces the payload size on every request.

```php
use Livewire\Attributes\Computed;

class OrderIndex extends Component
{
    public string $search = '';
    public string $statusFilter = '';
    public int $perPage = 15;

    #[Computed]
    public function orders(): LengthAwarePaginator
    {
        return Order::query()
            ->when($this->search, fn ($q) => $q->where('reference', 'like', "%{$this->search}%"))
            ->when($this->statusFilter, fn ($q) => $q->where('status', $this->statusFilter))
            ->with(['user:id,name', 'items'])
            ->latest()
            ->paginate($this->perPage);
    }

    public function render(): View
    {
        return view('livewire.orders.index');
    }
}
```

## Actions and User Interactions

Every button click, form submission, or interactive action that triggers a server method must be protected against duplicate submissions. Use `wire:click` with throttling or `wire:submit` with loading states.

```html
<!-- Throttle clicks to prevent double-execution -->
<button wire:click.throttle.1000ms="confirmOrder" wire:loading.attr="disabled">
    <span wire:loading.remove wire:target="confirmOrder">Confirm Order</span>
    <span wire:loading wire:target="confirmOrder">Processing...</span>
</button>

<!-- Form submission with loading state -->
<form wire:submit="save">
    <!-- form fields -->
    <button type="submit" wire:loading.attr="disabled" wire:target="save">
        Save
    </button>
</form>
```

## Validation

Validate input in real-time using `#[Validate]` attributes or the `$rules` property. Provide immediate feedback to the user as they type.

```php
use Livewire\Attributes\Validate;

class CreateOrderForm extends Component
{
    #[Validate('required|exists:products,id')]
    public int $productId;

    #[Validate('required|integer|min:1|max:100')]
    public int $quantity = 1;

    #[Validate('nullable|string|max:500')]
    public string $notes = '';

    public function save(): void
    {
        $validated = $this->validate();

        $action = app(PlaceOrderAction::class);
        $action->execute(PlaceOrderDTO::from($validated));

        $this->dispatch('order-created');
        $this->reset();

        session()->flash('success', 'Order created successfully.');
    }
}
```

## Events and Component Communication

Use Livewire events to communicate between components. The parent listens, the child dispatches. Use the `#[On]` attribute for listeners.

```php
// Child component dispatches event
class StatusFilter extends Component
{
    public string $selected = '';

    public function updatedSelected(): void
    {
        $this->dispatch('status-changed', status: $this->selected);
    }
}

// Parent component listens
class OrderIndex extends Component
{
    public string $statusFilter = '';

    #[On('status-changed')]
    public function handleStatusChange(string $status): void
    {
        $this->statusFilter = $status;
        $this->resetPage(); // Reset pagination when filter changes
    }
}
```

## AlpineJS Integration

Use Alpine for interactions that do not need server state: toggling dropdowns, showing modals, managing tabs, copy-to-clipboard, tooltips. Use `@entangle` to keep Livewire and Alpine properties in sync when you need both server and client reactivity.

```html
<!-- Alpine-only: No server round-trip for toggling -->
<div x-data="{ showDetails: false }">
    <button @click="showDetails = !showDetails">
        Toggle Details
    </button>
    <div x-show="showDetails" x-transition>
        <!-- Details content -->
    </div>
</div>

<!-- Entangled: Alpine controls UI, Livewire persists state -->
<div x-data="{ tab: @entangle('activeTab') }">
    <button @click="tab = 'details'" :class="{ 'active': tab === 'details' }">Details</button>
    <button @click="tab = 'history'" :class="{ 'active': tab === 'history' }">History</button>
</div>
```

## Lazy Loading

For components that are expensive to render (charts, reports, large tables), use the `lazy` attribute so they load after the initial page render. Provide a loading placeholder.

```html
<livewire:dashboard-revenue-chart lazy>
    <x-slot:placeholder>
        <div class="animate-pulse bg-gray-200 rounded h-64"></div>
    </x-slot:placeholder>
</livewire:dashboard-revenue-chart>
```

## File Uploads

Use Livewire's built-in file upload handling with `WithFileUploads`. Always validate file type, size, and dimensions. Show upload progress to the user.

```php
use Livewire\WithFileUploads;
use Livewire\Attributes\Validate;

class AvatarUpload extends Component
{
    use WithFileUploads;

    #[Validate('required|image|max:2048|dimensions:min_width=100,min_height=100')]
    public $photo;

    public function save(): void
    {
        $this->validate();
        $path = $this->photo->store('avatars', 'public');
        auth()->user()->update(['avatar_path' => $path]);
    }
}
```

```html
<input type="file" wire:model="photo">

<!-- Upload progress -->
<div wire:loading wire:target="photo">Uploading...</div>

<!-- Preview -->
@if ($photo)
    <img src="{{ $photo->temporaryUrl() }}" alt="Preview">
@endif

@error('photo') <span class="text-red-500">{{ $message }}</span> @enderror
```

## Performance Considerations

1. Minimize the amount of data in public properties. Large arrays or collections in properties increase the payload on every Livewire request.
2. Use pagination instead of loading all records.
3. Use `wire:poll` sparingly. If you need real-time updates, consider Laravel Echo with WebSockets instead.
4. Use `wire:key` on list items to help Livewire efficiently diff the DOM.
5. Scope database queries inside `#[Computed]` properties so they are only executed when the component renders, not on every lifecycle hook.
