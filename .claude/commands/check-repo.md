# Check Repository Context

**Purpose**: Verify which repository you're working with before any git operation.

**Command**: `/check-repo` or ask: "What repository am I working with?"

**Action**:

```bash
git remote -v
```

**Interpretation**:

- If `origin` points to `hierarchical-multi-agent-retrieval-system` → Public repository (docs only)
- If `private` points to `hierarchical-multi-agent-retrieval-system-impl` → Private repository (full code)

**Next Steps**:

- Public: Only push documentation, architecture, research
- Private: Can push implementations, tests, configs
