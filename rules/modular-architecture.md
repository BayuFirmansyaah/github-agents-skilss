# Rule: Modular Architecture (Advanced)

## 🚫 STRICT BOUNDARIES & COMMUNICATION

### 1. Anti-Corruption Layer (ACL)
When integrating with Legacy Code or Messy Modules, DO NOT leak their bad design into your clean module.
-   **Method**: Create an `Adapter` or `Translator` class.
-   **Example**: `LegacyUserAdapter` implements `UserInterface`.

### 2. Sync vs Async Communication
-   **Synchronous (Direct Call)**: Use ONLY for reads or when immediate consistency is required (e.g., checking balance before payment).
    -   *Pattern*: `Inter-Module Interfaces`.
-   **Asynchronous (Event-Driven)**: Use for everything else (side effects, notifications, heavy processing).
    -   *Pattern*: `Domain Events` + `Queued Listeners`.

### 3. Database Independence
-   **Rule**: A module NEVER joins tables from another module.
-   **Solution**: Fetch IDs from Module A, then query Module B by those IDs (Application-Side Join).
    -   *Yes, it's 2 queries. It scales better than a distributed monolith join.*

### 4. Shared Kernel (Core)
-   Contains **Value Objects** (Money, Email, Address) used everywhere.
-   Contains **Base Classes** (BaseController, BaseRepository).
-   **NO BUSINESS LOGIC** in Shared Kernel.
