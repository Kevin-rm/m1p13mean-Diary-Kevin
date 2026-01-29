---
name: commit
description: Generate and execute Conventional Commit messages from Git changes.
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git branch:*), Bash(git add:*), Bash(git commit:*), Bash(git reset HEAD:*), AskUserQuestion
---

# Git Commit

## Triggers

This skill is invoked when the user uses phrases such as:

- `commit`
- `git commit`
- `commit this`
- `commit changes`
- `make a commit`
- `save my changes`
- `quick commit`
- `commit preview`

## Features

- Automatic or selective staging of files
- Conventional Commit message generation
- Preview / dry-run mode without committing
- Scope inference based on file paths
- User intent overrides via `$ARGUMENTS`
- Rollback support if user cancels after staging

## Execution Flow

1. **Check working tree**
   - Run `git status --porcelain`
   - Abort if the working tree is clean

2. **Resolve target files**
   - From `$ARGUMENTS` (file, directory, `-p`, `preview`)
   - Otherwise from modified or untracked files

3. **Handle staging**
   - Auto-stage, selective stage, or ask confirmation (see Staging Rules)
   - Track whether files were staged by this skill (for potential rollback)

4. **Collect diff**
   - `git diff --cached --stat`
   - `git diff --cached` (limit to 200 lines)
   - If truncated, warn: `[Diff truncated — showing first 200 lines of N total]`

5. **Generate commit message**
   - Follow Conventional Commits format
   - Apply scope detection and user hints

6. **Preview or commit**
   - Preview → display message only
   - Commit → execute `git commit`

7. **Handle cancellation**
   - If user cancels after staging → offer to unstage with `git reset HEAD`

## Staging Rules

### Default behavior

If no files are staged:

- Auto-stage all resolved files

### Confirmation required only if:

- More than **20 files**, or
- **Sensitive files detected**

Sensitive patterns:

```
.env*
*.pem
*.key
*.secret
id_rsa
*.pfx
*.p12
config/
secrets/
credentials/
docker-compose*.yml (with environment variables)
```

When confirmation is required:

1. List files (highlight sensitive ones)
2. Ask the user:
   - Stage all
   - Select files
   - Cancel

## Selective / Partial Commits

Supported forms:

- `commit src/`
- `commit file.ts`
- `commit -p`
- `commit partial`

Interactive selection:

1. List modified and untracked files with indices
2. User selects (`1,3,5`, `1-3`, `all`)
3. Stage selected files only
4. Continue execution flow

## Preview Mode

Triggered by:

- `commit preview`
- `commit --dry-run`

Behavior:

1. Run full analysis and message generation
2. Display the generated commit message
3. Do **not** execute the commit
4. Ask: `Commit with this message? (yes / edit / cancel)`

## Conventional Commits

### Format

```
<type>(<scope>): <subject>

[optional body]
```

### Types

| Type     | Usage                        |
| -------- | ---------------------------- |
| feat     | New feature                  |
| fix      | Bug fix                      |
| docs     | Documentation                |
| style    | Formatting only              |
| refactor | Code restructuring           |
| perf     | Performance improvement      |
| test     | Tests                        |
| build    | Build system or dependencies |
| ci       | CI configuration             |
| chore    | Maintenance tasks            |

## Scope Detection

Infer scope from the **lowest common directory** or dominant module:

| Path pattern               | Scope                      |
| -------------------------- | -------------------------- |
| `src/api/*`                | `api`                      |
| `src/components/Button/*`  | `button`                   |
| `src/components/*` (mixed) | `components`               |
| `src/utils/auth.ts`        | `auth`                     |
| `tests/*`                  | `test`                     |
| `docs/*`                   | `docs`                     |
| `lib/<name>/*`             | `<name>`                   |
| `packages/<name>/*`        | `<name>` (monorepo)        |
| Single file                | filename without extension |
| Multiple unrelated paths   | omit scope                 |

### Scope priority

1. User-provided scope in `$ARGUMENTS` (highest)
2. Monorepo package name if applicable
3. Deepest common meaningful directory
4. Omit if ambiguous

## Message Rules

### Subject

- Imperative mood
- Lowercase
- No trailing period
- Maximum 50 characters
- Be specific (avoid "update files", "fix bug")

### Body

- Include only when subject alone is insufficient
- Maximum 3 lines
- Explain **what** changed and **why** (not how)
- Wrap at 72 characters
- Leave blank line between subject and body

### Examples

Good:

```
feat(auth): add OAuth2 refresh token support

Tokens now auto-refresh 5 minutes before expiry.
Reduces session interruptions for long-running tasks.
```

Bad:

```
feat(auth): add OAuth2 refresh token support

This commit adds support for OAuth2 refresh tokens by implementing
a new TokenRefreshService class that monitors token expiry times
and automatically requests new tokens from the authentication
server when needed. The implementation uses a background timer...
```

## $ARGUMENTS Overrides

User hints take precedence over auto-detection:

- `commit fix auth` → `fix(auth): ...`
- `commit docs readme` → `docs(readme): ...`
- `commit "add login page"` → subject used as-is
- `commit src/api/` → limit commit scope
- `commit -p` → interactive selection
- `commit feat(payments)` → type and scope preserved exactly

## Output

On success, output only:

- Commit message (first line)
- Short commit SHA

Example:

```
feat(auth): add OAuth2 refresh token support
[a1b2c3d]
```

## Global Rules

- Never add `Co-Authored-By`
- Never mention AI or automation
- Never commit with a clean working tree
- Ask for clarification only if the diff is ambiguous
- Always offer rollback if user cancels post-staging
