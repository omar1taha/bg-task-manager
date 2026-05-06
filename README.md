# DataPipeline — Background Task Manager

A single-page Angular application for configuring and monitoring background data collection tasks with real-time progress tracking and full pause/resume control.

## Technology Stack

- **Framework:** Angular 21 (standalone components, signals, zoneless change detection)
- **Language:** TypeScript (strict mode)
- **UI Library:** PrimeNG 21
- **Reactive Layer:** RxJS 7.8
- **Styling:** SCSS
- **Forms:** Reactive Forms

## Data Source

**Photos** — `https://jsonplaceholder.typicode.com/photos/{id}` (IDs 1–5000)

I chose the Photos endpoint because it returns structured records with a title, URL, and thumbnail — which makes the Data Viewer panel more visually interesting than plain text from Posts or Users. The large ID range (5000) also avoids cycling issues when running multiple tasks concurrently.

## How to Run

```bash
npm install
npm start
```

The app serves on `http://localhost:4200`.

## Features

- **Task Creation** — configure name, data type, record count (5–80), and fetch interval (0.5s–5s) via reactive form with slider inputs
- **Background Execution** — tasks fetch one record at a time at the configured interval, with live progress updates
- **Pause / Resume** — per-task and global (Pause All / Resume All) controls with proper RxJS subscription cancellation
- **Data Viewer** — inspect a running task's collected records, progress, and metadata in real time
- **Activity Log** — timestamped event history tracking the full task lifecycle (queued, started, each fetch, paused, resumed, completed)
- **Statistics Bar** — live counts for total, running, paused, completed, and failed tasks

## Architecture Decisions

- **Centralized state via `TaskService`** — all task state lives in a single Angular signal (`tasks`). Components read from this signal and dispatch actions through the service. The service also exposes a `logEvent$` observable stream for activity log events emitted during execution.

- **Standalone components with `OnPush`** — each component is self-contained with its own imports and uses `OnPush` change detection where appropriate for performance.

- **RxJS-based execution engine** — each task runs on an `interval()` pipeline with `concatMap` for sequential HTTP fetches. Pausing unsubscribes from the interval (true cancellation), and resuming creates a fresh subscription that continues from the current collected count.

- **No memory leaks** — subscriptions are cleaned up via `takeUntil` on service destroy, `takeUntilDestroyed` in components, and manual unsubscription when tasks are paused or removed.

- **Signal-driven UI** — Angular signals power the reactive data flow from service to components, with `computed` signals for derived state like the currently viewed task and task statistics.
