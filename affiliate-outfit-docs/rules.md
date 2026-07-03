# AI Working Rules

## Core Rules
- Only modify files required by the current task.
- Do not refactor unrelated code.
- Do not rename functions, types, routes, constants, or database fields unless explicitly requested.
- Do not change existing behavior unless the task requires it.
- Do not remove comments, validations, logs, or tests unless explicitly requested.
- Do not introduce new libraries without approval.
- Do not change database schema without approval.
- Do not change public routes without approval.
- Do not change tracking or redirect behavior without approval.

## Before Coding
AI must:
1. Read the task.
2. Read related docs.
3. Inspect related source files.
4. Explain current flow.
5. List files to modify.
6. Explain potential risk.
7. Wait for approval if the task touches shared code.

## During Coding
AI must:
- Keep changes small.
- Reuse existing services/constants/types.
- Avoid duplicate logic.
- Add validation.
- Preserve old behavior.

## After Coding
AI must report:
- Files changed.
- What was added.
- What was not changed.
- Tests/checks to run.
- Possible risk.