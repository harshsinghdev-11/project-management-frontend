# Architecture & Code Smells: Diagnosing Frontend AI Slop

This reference catalog details code-level and architectural anti-patterns common in AI-generated frontend applications, with corresponding refactoring patterns.

---

## 1. The Monolithic "Mega-Component"

### The Smell:
A single `.tsx` file that attempts to do everything:
- 500–1,200 lines long.
- Contains 15 separate `useState` hooks.
- Defines 3 inline modals inside the same JSX tree.
- Fetches data directly inside `useEffect` without an extracted API client.
- Inlines 200 lines of complex SVG markup directly inside the return statement.

```tsx
// ❌ AI SLOP PATTERN: Monolithic mega-component
export default function ProjectDashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModal1Open, setModal1] = useState(false);
  const [isModal2Open, setModal2] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  // ... 8 more useState declarations ...

  return (
    <div>
      {/* 400 lines of deeply nested JSX */}
      {isModal1Open && <div>{/* 100 lines inline modal */}</div>}
      {isModal2Open && <div>{/* 100 lines inline modal */}</div>}
    </div>
  );
}
```

### The Crafted Solution:
Decompose into single-responsibility modules:
- `<ProjectDashboard />` (Container coordinating layout and data)
- `<KanbanBoard />`, `<TaskCard />`, `<TaskDetailModal />` (Extracted into `components/tasks/`)
- Custom Hook `useProjectTasks(projectId)` managing fetch, mutations, and caching.
- Enforce component length < 250 lines.

---

## 2. `useEffect` State Synchronization Abuse

### The Smell:
Using `useEffect` to synchronize state that can be computed during render, creating unnecessary re-renders, race conditions, and out-of-sync states.

```tsx
// ❌ AI SLOP PATTERN: Redundant useEffect sync
const [tasks, setTasks] = useState<Task[]>([]);
const [filter, setFilter] = useState<string>("all");
const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

useEffect(() => {
  if (filter === "all") {
    setFilteredTasks(tasks);
  } else {
    setFilteredTasks(tasks.filter(t => t.status === filter));
  }
}, [tasks, filter]);
```

### The Crafted Solution:
Derive state synchronously with `useMemo` or plain variables:
```tsx
// ✅ CRAFTED: Synchronous derivation
const filteredTasks = useMemo(() => {
  return filter === "all" ? tasks : tasks.filter(t => t.status === filter);
}, [tasks, filter]);
```

---

## 3. Defensive Error Swallowing & Blind Logging

### The Smell:
Wrapping async operations in `try/catch` blocks that catch errors, print a useless `console.error("error:", err)`, and give the user zero feedback.

```tsx
// ❌ AI SLOP PATTERN: Silent error swallowing
const handleDelete = async (id: string) => {
  try {
    await api.delete(`/tasks/${id}`);
    // What if this succeeds? Did we update UI state?
  } catch (error) {
    console.error("Failed to delete task", error);
    // User sees nothing! Button sits there, state doesn't update, no alert!
  }
};
```

### The Crafted Solution:
Surface errors through typed UI notifications and update optimistic state:
```tsx
// ✅ CRAFTED: Complete error feedback & state update
const handleDelete = async (id: string) => {
  try {
    await api.delete(`/tasks/${id}`);
    toast.success("Task deleted successfully");
    onTaskDeleted(id);
  } catch (err: any) {
    toast.error("Failed to delete task", err?.message || "Please try again.");
  }
};
```

---

## 4. Echoing / No-Value Comments

### The Smell:
Comments that simply restate the syntax of the code without providing architectural rationale:

```tsx
// ❌ AI SLOP NOISE:
// Set loading to false
setLoading(false);

// Return the div element
return (
  // Header section
  <header>
    {/* Heading 1 text */}
    <h1>Project Camp</h1>
  </header>
);
```

### The Crafted Solution:
Remove redundant comments. Only write comments when explaining *why* (non-obvious workarounds, edge-case constraints, mathematical derivations):
```tsx
// ✅ CRAFTED:
// Offset index by 1 to prevent zero-indexed clipping in SVG polygon points
const polygonCoord = index + 1;
```

---

## 5. Mock Data Pollution in Production Files

### The Smell:
Hardcoding mock sample data (`const mockProjects = [...]`) inside production page or component files instead of wiring up real API endpoints or using typed fixtures in tests.

### The Crafted Solution:
- Production pages must consume verified API services (`api.get(...)` via typed models).
- Interactive landing page demos or Storybook previews must isolate mock data into explicit mock fixtures (`INITIAL_DEMO_TASKS`) clearly labeled for presentation.
