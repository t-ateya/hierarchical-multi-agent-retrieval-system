# Update README File

**Purpose**: Update README file for public or private repository.

**Command**: `/update-readme` or ask: "Update README for [public/private] repo"

**For Public Repository**:
```bash
# 1. Update README-PUBLIC.md (architecture/research focus)
# 2. Copy to README.md
cp README-PUBLIC.md README.md

# 3. Verify content (no setup details)
# 4. Commit and push
git add README.md
git commit -m "docs(readme): update architecture overview"
git push origin main
```

**For Private Repository**:
```bash
# 1. Update README.md or SETUP.md (full setup details)
# 2. Commit and push
git add README.md SETUP.md
git commit -m "docs(readme): update setup instructions"
git push private main
```

**Content Guidelines**:
- Public README: Architecture, research, no setup
- Private README: Full setup, deployment, troubleshooting

