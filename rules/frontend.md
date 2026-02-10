# Rule: Frontend Integration

## 🎨 Asset Management
-   Use **Vite** for bundling.
-   Assets strictly live in `resources/js` and `resources/css`.
-   Do NOT commit built assets (`public/build`) to git (except for deployment branches if configured).

## 🧩 Component Structure
-   **Vue/React**: One component per file.
-   **Naming**: PascalCase (e.g., `UserProfile.vue`).
-   **Props**: Always define types for props.

## 📡 API Interaction
-   Use `axios` or a wrapper configured with CSRF tokens.
-   Handle loading states and errors for every request.
-   Do not hardcode URLs; use route names or config variables if possible, or a centralized API service file.

## 💅 Styling
-   Use **Tailwind CSS** utility classes.
-   Extract repeated patterns into `@apply` or dedicated components.
-   Do not write inline styles (`style="..."`) unless dynamic.
