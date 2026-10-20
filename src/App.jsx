import { useState, useEffect } from 'react';
import { Bug, Copy, Sparkles } from 'lucide-react';

/**
 * Vibecoding Project Tracker — starter scaffold.
 *
 * This file is intentionally almost empty. The boilerplate (Vite, React,
 * Tailwind) is configured for you, plus a few shared constants and a
 * localStorage helper. Everything visible on screen, you build.
 *
 * Where to start (build sequence in Phase 3):
 *   - M4  data-model    : render the four columns and the task cards below.
 *   - M5  crud-modal    : add the "+" button modal and the edit-on-click modal.
 *   - M6  tag-style     : feature vs. bug color coding (uses DESIGN.md §2 colors).
 *   - M7  task-owner    : assignee badge + "Hand off to..." dropdown.
 *   - M8  due-tint      : color cards by due date (uses DESIGN.md §2 due-state colors).
 *   - M9  context       : a curated Context briefing field on the modal.
 *   - M10 copy-prompt   : a "Copy as Prompt Context" button that serializes the task + context.
 *   - M11 anchors       : the Anchor Board above the Kanban.
 *   - M12 secret-sauce  : the one open-ended thing that makes your tracker yours.
 *
 * Search the file for `TODO M<n>` to find the right hook for each milestone.
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'feature'|'bug'} type
 * @property {'todo'|'in-progress'|'review'|'done'} status
 * @property {string} assignee
 * @property {string|null} dueDate     ISO 'YYYY-MM-DD'
 * @property {string} createdDate      ISO 'YYYY-MM-DD'
 * @property {string} context                curated briefing for the next AI / teammate
 * @property {string|null} contextTool       'Claude'|'ChatGPT'|'Cursor'|'Lovable'|'Replit'|'Other'
 * @property {string|null} contextUpdatedAt  ISO timestamp, set on save
 */

// The four columns of the board, in render order.
// Use these IDs everywhere — do not invent new ones.
export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

// Replace these placeholders with the three names from PRD §8 before M4.
// They become the only valid values for `Task.assignee`.
export const TEAM = ['Teammate A'];

// M4 data-model: shown on first load, before anything is in localStorage.
const SEED_TASKS = [
  {
    id: '1',
    title: 'Fill in PRD team TODOs',
    description: 'Names, handles and milestone owners in PRD §8–§9.',
    type: 'feature',
    status: 'done',
    assignee: TEAM[0],
    dueDate: '2026-10-20',
    createdDate: '2026-10-20',
  },
  {
    id: '2',
    title: 'Build the four-column board',
    description: 'Render STAGES as columns and filter tasks by status.',
    type: 'feature',
    status: 'in-progress',
    assignee: TEAM[0],
    dueDate: '2026-10-21',
    createdDate: '2026-10-20',
  },
  {
    id: '3',
    title: 'Placeholder text shows wrong milestone',
    description: 'README says M3 is the first build milestone; it is M4.',
    type: 'bug',
    status: 'review',
    assignee: TEAM[0],
    dueDate: '2026-10-22',
    createdDate: '2026-10-20',
  },
  {
    id: '4',
    title: 'Add / edit / delete modal',
    description: 'M5: "+" button and click-to-edit, persisted to localStorage.',
    type: 'feature',
    status: 'todo',
    assignee: TEAM[0],
    dueDate: '2026-10-23',
    createdDate: '2026-10-20',
  },
];

// M6 tag-style: one place for how each task type looks.
const TYPE_STYLE = {
  feature: { label: 'Feature', stripe: 'border-l-feature', icon: <Sparkles size={12} className="text-feature" /> },
  bug:     { label: 'Bug',     stripe: 'border-l-bug',     icon: <Bug size={12} className="text-bug" /> },
};

// M11 anchors: the four pinned deliverable slots (PRD §5).
const SEED_ANCHORS = [
  { id: 'presentation',  label: 'Presentation',  url: null },
  { id: 'demo',          label: 'Demo',          url: null },
  { id: 'report',        label: 'Report',        url: null },
  { id: 'documentation', label: 'Documentation', url: null },
];

// M8 due-tint: card background by how close the due date is.
const DUE_TINT = {
  safe: 'bg-due_safe/15',
  warning: 'bg-due_warning/20',
  overdue: 'bg-due_overdue/15',
  neutral: 'bg-due_neutral/15',
};

function dueState(task) {
  if (task.status === 'done') return 'neutral';
  if (!task.dueDate) return null;
  const today = new Date().toLocaleDateString('en-CA'); // local date as YYYY-MM-DD
  const daysLeft = (Date.parse(task.dueDate) - Date.parse(today)) / 86400000;
  if (daysLeft < 0) return 'overdue';
  if (daysLeft < 1) return 'warning';
  return 'safe';
}

// M10 copy-prompt: the task + context as Markdown, ready to paste into an AI chat.
function toPromptContext(task) {
  const stage = STAGES.find((s) => s.id === task.status).label;
  const contextMeta = [
    task.contextTool && `from ${task.contextTool}`,
    task.contextUpdatedAt && `updated ${new Date(task.contextUpdatedAt).toLocaleString()}`,
  ].filter(Boolean).join(' · ');

  return [
    `Task: ${task.title}`,
    '',
    `Type: ${TYPE_STYLE[task.type].label}`,
    `Status: ${stage}`,
    `- Assignee: ${task.assignee}`,
    `- Due: ${task.dueDate ?? 'none'}`,
    `- Created: ${task.createdDate}`,
    '',
    'Description',
    task.description || 'No description.',
    '',
    'Context',
    ...(contextMeta ? [`${contextMeta}`, ''] : []),
    task.context || 'No context yet.',
    '',
    '---',
    'Continue this task from where it was left off.',
  ].join('\n');
}

/**
 * A tiny localStorage hook — survives reloads, no library needed.
 *
 * Usage:
 *   const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', []);
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private-mode error — silently ignore for hackathon */
    }
  }, [key, value]);

  return [value, setValue];
}

// M5 crud-modal: a blank task for the "New Task" button.
function newTask() {
  return {
    id: String(Date.now()),
    title: '',
    description: '',
    type: 'feature',
    status: 'todo',
    assignee: TEAM[0],
    dueDate: null,
    createdDate: new Date().toISOString().slice(0, 10),
    context: '',
    contextTool: null,
    contextUpdatedAt: null,
  };
}

const FIELD_CLASS =
  'mt-1 block w-full rounded-md border border-text_muted/30 bg-surface_page px-2 py-1 text-sm text-text_primary focus:outline-none focus:ring-2 focus:ring-brand_primary';

// M5 crud-modal: one modal for add and edit. onDelete is only passed when editing.
function TaskModal({ task, onSave, onDelete, onClose }) {
  const [draft, setDraft] = useState(task);
  const set = (field) => (e) => setDraft({ ...draft, [field]: e.target.value });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-text_primary/40">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const contextChanged =
            (draft.context ?? '') !== (task.context ?? '') || (draft.contextTool ?? null) !== (task.contextTool ?? null);
          onSave(contextChanged ? { ...draft, contextUpdatedAt: new Date().toISOString() } : draft);
        }}
        className="w-full max-w-md space-y-3 rounded-lg bg-surface_card p-6"
      >
        <h2 className="text-lg font-semibold text-text_primary">{onDelete ? 'Edit task' : 'New task'}</h2>

        <label className="block text-sm text-text_muted">
          Title
          <input required value={draft.title} onChange={set('title')} className={FIELD_CLASS} />
        </label>

        <label className="block text-sm text-text_muted">
          Description
          <textarea rows={3} value={draft.description} onChange={set('description')} className={FIELD_CLASS} />
        </label>

        <label className="block text-sm text-text_muted">
          Context
          <textarea
            rows={5}
            value={draft.context ?? ''}
            onChange={set('context')}
            placeholder="Briefing for the next AI or teammate: the goal, what's done, the prompt that worked, what's left."
            className={FIELD_CLASS}
          />
        </label>

        <div className="flex items-end justify-between gap-3">
          <label className="block flex-1 text-sm text-text_muted">
            Context tool
            <select
              value={draft.contextTool ?? ''}
              onChange={(e) => setDraft({ ...draft, contextTool: e.target.value || null })}
              className={FIELD_CLASS}
            >
              <option value="">—</option>
              {['Claude', 'ChatGPT', 'Cursor', 'Lovable', 'Replit', 'Other'].map((tool) => (
                <option key={tool} value={tool}>{tool}</option>
              ))}
            </select>
          </label>
          {draft.contextUpdatedAt && (
            <p className="pb-1 text-xs text-text_muted">
              Context updated {new Date(draft.contextUpdatedAt).toLocaleString()}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm text-text_muted">
            Type
            <select value={draft.type} onChange={set('type')} className={FIELD_CLASS}>
              <option value="feature">Feature</option>
              <option value="bug">Bug</option>
            </select>
          </label>

          <label className="block text-sm text-text_muted">
            Status
            <select value={draft.status} onChange={set('status')} className={FIELD_CLASS}>
              {STAGES.map((stage) => (
                <option key={stage.id} value={stage.id}>{stage.label}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-text_muted">
            Assignee
            <select value={draft.assignee} onChange={set('assignee')} className={FIELD_CLASS}>
              {TEAM.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-text_muted">
            Due date
            <input
              type="date"
              value={draft.dueDate ?? ''}
              onChange={(e) => setDraft({ ...draft, dueDate: e.target.value || null })}
              className={FIELD_CLASS}
            />
          </label>
        </div>

        <p className="text-xs text-text_muted">Created {draft.createdDate}</p>

        <div className="flex items-center justify-between pt-2">
          {onDelete ? (
            <button type="button" onClick={() => onDelete(draft.id)} className="text-sm text-due_overdue">
              Delete
            </button>
          ) : (
            <span />
          )}
          <div className="space-x-2">
            <button type="button" onClick={onClose} className="rounded-md border border-brand_primary px-4 py-2 text-sm text-brand_primary">
              Cancel
            </button>
            <button type="submit" className="rounded-md bg-brand_primary px-4 py-2 text-sm text-surface_card hover:bg-brand_accent">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', SEED_TASKS);
  //
  const [editing, setEditing] = useState(null);

  function saveTask(task) {
    setTasks((prev) =>
      prev.some((t) => t.id === task.id)
        ? prev.map((t) => (t.id === task.id ? task : t))
        : [...prev, task]
    );
    setEditing(null);
  }

  function deleteTask(id) {
    if (!window.confirm('Are you sure you want to delete?')) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setEditing(null);
  }

  // M7 task-owner: reassign from the card and show a short toast.
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  function handOff(id, name) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, assignee: name } : t)));
    setToast(`Handed to ${name}, goodluck to them.`);
  }

  // M10 copy-prompt
  function copyPrompt(task) {
    navigator.clipboard
      .writeText(toPromptContext(task))
      .then(() => setToast('Copied and ready for AI'))
      .catch(() => setToast("Couldn't copy, try again."));
  }
  //
  const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', SEED_ANCHORS);

  function editAnchor(anchor) {
    const url = window.prompt(`Paste the link for ${anchor.label}`, anchor.url ?? '');
    if (url === null) return; // cancelled
    setAnchors((prev) => prev.map((a) => (a.id === anchor.id ? { ...a, url: url.trim() || null } : a)));
  }

  return (
    <div className="min-h-screen bg-surface_page p-6">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Vibecoding Project Tracker
          </h1>
          <p className="text-sm text-slate-500">
            C2406921
            Cosy Coder's
          </p>
        </div>
        <button
          onClick={() => setEditing(newTask())}
          className="rounded-md bg-brand_primary px-4 py-2 text-sm font-medium text-surface_card hover:bg-brand_accent"
        >
          + New Task
        </button>
      </header>

      <section className="mb-6 grid grid-cols-4 gap-4">
        {anchors.map((anchor) => (
          <div
            key={anchor.id}
            className={`rounded-lg p-3 ${anchor.url ? 'border border-brand_primary/30 bg-surface_card' : 'border border-dashed border-due_neutral'}`}
          >
            <h2 className="text-xs font-semibold uppercase text-text_muted">{anchor.label}</h2>
            {anchor.url ? (
              <a href={anchor.url} target="_blank" rel="noreferrer" className="block truncate text-sm text-brand_accent underline">
                {anchor.url}
              </a>
            ) : (
              <p className="text-sm text-text_muted">No link yet</p>
            )}
            <button onClick={() => editAnchor(anchor)} className="mt-1 text-xs text-brand_primary hover:text-brand_accent">
              {anchor.url ? 'Edit link' : 'Add link'}
            </button>
          </div>
        ))}
      </section>

      <main className="grid grid-cols-4 gap-4">
        {STAGES.map((stage) => {
          const stageTasks = tasks.filter((task) => task.status === stage.id);
          return (
            <section key={stage.id} className="rounded-lg border border-text_muted/20 p-3">
              <h2 className="mb-3 text-base font-semibold uppercase text-text_primary">
                {stage.label} <span className="text-text_muted">({stageTasks.length})</span>
              </h2>
              <div className="space-y-2">
                {stageTasks.map((task) => (
                  <article
                    key={task.id}
                    onClick={() => setEditing(task)}
                    className={`cursor-pointer rounded-lg border border-l-4 border-text_muted/20 ${TYPE_STYLE[task.type].stripe} ${DUE_TINT[dueState(task)] ?? 'bg-surface_card'} p-3`}
                  >
                    <span className="mb-1 inline-flex items-center gap-1 text-xs text-text_muted">
                      {TYPE_STYLE[task.type].icon}
                      {TYPE_STYLE[task.type].label}
                    </span>
                    <h3 className="text-sm font-medium text-text_primary">{task.title}</h3>
                    {task.dueDate && <p className="text-xs text-text_muted">due {task.dueDate}</p>}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-xs text-text_primary">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand_primary text-[10px] font-semibold text-surface_card">
                          {task.assignee.split(' ').map((word) => word[0]).join('')}
                        </span>
                        {task.assignee}
                      </span>
                      <select
                        value=""
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handOff(task.id, e.target.value)}
                        className="rounded border border-text_muted/30 bg-surface_page text-xs text-text_muted"
                      >
                        <option value="" disabled>Hand off to…</option>
                        {TEAM.filter((name) => name !== task.assignee).map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyPrompt(task);
                      }}
                      className="mt-2 flex w-full items-center justify-center gap-1 rounded-md border border-brand_primary py-1 text-xs font-medium text-brand_primary hover:bg-brand_primary hover:text-surface_card"
                    >
                      <Copy size={12} />
                      Copy as Prompt Context
                    </button>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {editing && (
        <TaskModal
          task={editing}
          onSave={saveTask}
          onDelete={tasks.some((t) => t.id === editing.id) ? deleteTask : undefined}
          onClose={() => setEditing(null)}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-md bg-text_primary px-4 py-2 text-sm text-surface_card">
          {toast}
        </div>
      )}
    </div>
  );
}
