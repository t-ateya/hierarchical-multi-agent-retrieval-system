# Bad Prompt Example - Git Branch Cleaner

## The Vague Prompt

```
I need a git branch cleaner tool that helps manage old branches. It should show which branches are outdated and let users delete them safely.

Make it user-friendly with colors and maybe use Python since that's cross-platform. Add some interactive options so users can choose what to delete.

The tool should check if branches are merged and show how old they are. Also make sure it doesn't delete the current branch or important branches like main.

Can you add proper error handling and make it work even if there's no git repo? Would be nice if it had a good looking output with emojis or something.
```

## Why This Prompt Fails

### 1. **Ambiguous Requirements**
- "outdated" - What defines outdated? 30 days? 60 days?
- "user-friendly" - Subjective term with no specifics
- "some interactive options" - Which options exactly?
- "important branches" - Which branches are important?
- "good looking output" - No format specified

### 2. **Weak Action Words**
- "should show" instead of IMPLEMENT/DISPLAY
- "let users delete" instead of specific deletion flow
- "make sure" instead of ENSURE/VALIDATE
- "would be nice" - Optional? Required?

### 3. **Missing Critical Details**
- No function names or structure
- No specific output format
- No validation requirements
- No data structure definitions
- No specific git commands to use

### 4. **Uncertainty Markers**
- "maybe use Python"
- "or something"
- "Can you add"
- These create interpretation overhead

### 5. **No Validation Gates**
- No test commands
- No success criteria
- No way to verify implementation

## What the AI Must Guess

1. What time period defines "old"?
2. Should it use colorama, rich, or ANSI codes?
3. What's the exact menu structure?
4. Which emojis to use and where?
5. How to format the time display?
6. What interactive options to provide?
7. How to handle edge cases?
8. What constitutes "proper" error handling?

## Likely Result

The AI will produce working code but with:
- Inconsistent formatting choices
- Different interpretation of "old" branches
- Random emoji selection
- Unpredictable menu options
- Variable function organization
- Missing edge cases

This would require **multiple iterations** to match expectations, defeating the purpose of efficient AI-assisted development.

## The Lesson

Bad prompts create a **specification vacuum** that the AI fills with assumptions. Each assumption is a potential mismatch with your actual requirements, leading to revision cycles.

Compare this to the good prompt which leaves **zero room for interpretation** - every detail is specified, making first-pass success achievable.