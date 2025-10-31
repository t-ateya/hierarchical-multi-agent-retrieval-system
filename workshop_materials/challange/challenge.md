# 🎯 Warm-up Challenge: Git Branch Cleaner

## The Challenge

Your task is to write a prompt that makes your AI coding assistant create a **Git Branch Cleaner** script. The goal is to practice writing clear, specific prompts that result in working code on the first try.

**Time Limit**: 10 minutes

## Requirements

The script should:

1. **List all local git branches** with their last commit dates
2. **Identify stale branches** (not touched in 30+ days)
3. **Identify merged branches** (already merged into main/master)
4. **Display a summary** with color-coded output
5. **Offer interactive deletion** with confirmation

## Expected Behavior

```bash
$ python git_branch_cleaner.py

🌿 Git Branch Cleanup Tool
════════════════════════════════════════════════

Current branch: main

📊 Branch Summary:
• Total branches: 12
• Stale branches (>30 days): 5
• Merged branches: 3
• Active branches: 4

🔍 Stale Branches (no commits in 30+ days):
  ❌ feature/old-login     (last commit: 45 days ago) [MERGED]
  ❌ bugfix/header-fix     (last commit: 67 days ago) [MERGED]
  ❌ feature/abandoned     (last commit: 92 days ago)
  ⚠️  experiment/test      (last commit: 31 days ago)
  ⚠️  feature/wip         (last commit: 33 days ago)

✅ Active Branches (recently updated):
  ✓ feature/stripe        (last commit: 2 hours ago)
  ✓ bugfix/api-timeout    (last commit: 1 day ago)
  ✓ feature/new-ui        (last commit: 3 days ago)
  ✓ develop               (last commit: 5 days ago)

Would you like to:
1. Delete all merged & stale branches
2. Delete only merged branches
3. Select branches to delete individually
4. Exit without changes

Your choice (1-4): 3

Select branches to delete (space-separated numbers):
1. feature/old-login [MERGED, 45 days old]
2. bugfix/header-fix [MERGED, 67 days old]
3. feature/abandoned [92 days old]
4. experiment/test [31 days old]
5. feature/wip [33 days old]

Enter numbers (e.g., 1 2 3): 1 2 3

⚠️  About to delete 3 branches:
  • feature/old-login
  • bugfix/header-fix
  • feature/abandoned

Confirm deletion? (yes/no): yes

🗑️  Deleting branches...
  ✓ Deleted: feature/old-login
  ✓ Deleted: bugfix/header-fix
  ✓ Deleted: feature/abandoned

✨ Cleanup complete! Removed 3 branches.
```

## Success Criteria

Your prompt succeeds if the generated script:

- ✅ Runs without errors on first execution
- ✅ Correctly identifies merged branches
- ✅ Accurately calculates days since last commit
- ✅ Provides clear, colored output (using ANSI colors or a library like `colorama`/`rich`)
- ✅ Handles edge cases (no git repo, no branches to delete, etc.)
- ✅ Includes safety checks (won't delete current branch, confirms before deletion)

## Bonus Points

- 🌟 Script works cross-platform (Windows/Mac/Linux)
- 🌟 Includes `--dry-run` flag to preview without deleting
- 🌟 Can filter by branch name pattern (e.g., only feature/* branches)
- 🌟 Saves a backup list of deleted branches with their last commit hash

## Hints for Your Prompt

Consider including in your prompt:
- Language preference (Python, Bash, Node.js, etc.)
- Output format requirements
- Error handling expectations
- Whether to use external libraries or stick to standard library
- The definition of "merged" (into main? master? current branch?)

## Testing Your Result

1. Create a test git repository with multiple branches:
```bash
# Setup test repo
mkdir test-repo && cd test-repo
git init
echo "test" > file.txt
git add . && git commit -m "Initial"

# Create test branches
git checkout -b feature/old
echo "old" > old.txt
git add . && git commit -m "Old feature"
git checkout main
git merge feature/old

git checkout -b feature/new
echo "new" > new.txt
git add . && git commit -m "New feature"

git checkout main
```

2. Run your generated script
3. Verify it correctly identifies and offers to clean branches

## Example Prompt Starters

**Too Vague (Don't do this):**
> "Make a git branch cleaner"

**Better (But still missing details):**
> "Create a Python script that cleans up old git branches"

**Good (Your goal):**
> "Create a Python script that... [your detailed requirements here]"

## Reflection Questions

After completing the challenge:

1. How many iterations did it take to get working code?
2. What details did you forget in your first prompt?
3. What would you add to your prompt next time?
4. Did the AI make any incorrect assumptions?

---

**Ready? Start writing your prompt!**

Remember: The goal isn't just to get working code, but to get it right on the first try through clear, comprehensive prompting.