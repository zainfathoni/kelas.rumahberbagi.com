# Beads Prefix Duplication Issue

This document describes an issue where the beads issue prefix gets duplicated
(e.g., `rb-rb-` instead of `rb-`).

## Symptoms

- `bd list` shows issue IDs with doubled prefix: `rb-rb-xxx` instead of `rb-xxx`
- The JSONL file (`.beads/issues.jsonl`) contains correct IDs with single prefix
- The SQLite database (`.beads/beads.db`) contains incorrect doubled prefix

## Diagnosis

Check prefix in different locations:

```bash
# Check issue IDs in JSONL (source of truth)
jq -r '.id' .beads/issues.jsonl | head -5

# Check issue IDs in database
sqlite3 .beads/beads.db "SELECT id FROM issues LIMIT 5;"

# Check configured prefix
bd config get issue-prefix
```

If JSONL shows `rb-xxx` but database shows `rb-rb-xxx`, the prefix was
duplicated during a rename operation.

## Root Cause

This happened due to a prefix mismatch during `bd sync`:

1. `bd sync` detected a mismatch between database prefix
   (`kelas.rumahberbagi.com-`) and JSONL prefix (`rb-`)
2. Running `bd rename-prefix rb` to fix this made it worse
3. The rename operation prepended `rb-` to IDs that already had `rb-` prefix,
   resulting in `rb-rb-xxx`

The error message looked like:

```
Error: importing: import failed: exit status 1
Import failed: prefix mismatch detected: database uses 'kelas.rumahberbagi.com-'
but found issues with prefixes: [rb- (27 issues)]
(use --rename-on-import to automatically fix)
```

**Important**: When you see this error, do NOT use `bd rename-prefix`. Instead,
use `--rename-on-import` as suggested, or reset the database as shown below.

## Solution

Reset the database and reimport from the JSONL source of truth:

```bash
# Stop the daemon (if running)
bd daemon stop . 2>/dev/null || true

# Remove the corrupted database
rm .beads/beads.db .beads/beads.db-shm .beads/beads.db-wal 2>/dev/null

# Reinitialize with the correct prefix
bd init --prefix=rb

# Verify the fix
bd list --limit=5
```

## Prevention

1. **Set the prefix explicitly** in `.beads/config.yaml`:

   ```yaml
   # .beads/config.yaml
   issue-prefix: 'rb'
   ```

2. **On prefix mismatch errors**: When `bd sync` shows a prefix mismatch,
   either:
   - Use the suggested `--rename-on-import` flag
   - Or reset the database with `bd init --prefix=rb` (recommended)
   - Do NOT use `bd rename-prefix` as it may double the prefix

## Related

- Beads documentation: <https://github.com/steveyegge/beads>
