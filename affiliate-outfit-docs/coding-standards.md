# Coding Standards

## TypeScript
- Use strict TypeScript.
- Avoid `any`.
- Use explicit types for service inputs/outputs.
- Use Zod for request validation.
- Keep constants in `src/constants`.

## Architecture
- Route handlers should be thin.
- Business logic must live in `src/server/*`.
- Database access should go through service/repository functions.
- Do not put complex logic directly in React components.
- Do not duplicate status strings or permission strings.

## Naming
- Use camelCase for variables/functions.
- Use PascalCase for types/components.
- Use UPPER_CASE for constant keys.
- Use kebab-case for route segments.

## Error Handling
- Return clear error messages.
- Do not expose internal errors to public users.
- Log useful server errors.

## Security
- Validate all input.
- Check permissions in manager actions.
- Do not expose internal product data publicly.
- Do not expose raw affiliate API payload publicly.

## Performance
- Avoid unnecessary client components.
- Use server components for SEO pages.
- Use pagination for manager tables.
- Optimize images.