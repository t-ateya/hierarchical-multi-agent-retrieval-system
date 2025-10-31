#!/usr/bin/env python3
"""
Workshop Prompts Copy Script

Copies PRP commands and templates from the workshop materials to your project.

Usage:
    python copy_workshop_prompts.py [target_directory]

Example:
    python copy_workshop_prompts.py ~/my-project
    python copy_workshop_prompts.py  # Uses project root (parent of workshop_materials)
"""

import os
import sys
import shutil
from pathlib import Path
from typing import List, Tuple


def copy_files_safe(source_dir: Path, target_dir: Path, files: List[str]) -> Tuple[int, int]:
    """
    Copy specified files from source to target directory without overwriting.

    Args:
        source_dir: Source directory path
        target_dir: Target directory path
        files: List of file names to copy

    Returns:
        Tuple of (files copied successfully, files skipped because they exist)
    """
    copied_count = 0
    skipped_count = 0

    # Create target directory if it doesn't exist
    target_dir.mkdir(parents=True, exist_ok=True)

    for file_name in files:
        source_file = source_dir / file_name
        target_file = target_dir / file_name

        if source_file.exists():
            if target_file.exists():
                print(f"  ⊝ {file_name} (already exists, skipping)")
                skipped_count += 1
            else:
                try:
                    shutil.copy2(source_file, target_file)
                    print(f"  ✓ {file_name}")
                    copied_count += 1
                except Exception as e:
                    print(f"  ✗ {file_name} - Error: {e}")
        else:
            print(f"  ⚠ {file_name} - Not found in source")

    return copied_count, skipped_count


def main():
    """Main function for copying workshop prompts."""

    # Parse arguments
    if len(sys.argv) > 2:
        print("Usage: python copy_workshop_prompts.py [target_directory]")
        sys.exit(1)

    # Get workshop materials directory (where this script is located)
    script_dir = Path(__file__).parent

    # Get target directory (default to parent of workshop_materials)
    if len(sys.argv) == 2:
        target_root = Path(sys.argv[1]).expanduser().resolve()
    else:
        # Default to the parent directory (ai-coding-workshop root)
        target_root = script_dir.parent

    print(f"📂 Workshop Prompts Copier")
    print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"Source: {script_dir}")
    print(f"Target: {target_root}")
    print()

    # Check if target directory exists
    if not target_root.exists():
        print(f"Creating target directory: {target_root}")
        target_root.mkdir(parents=True, exist_ok=True)

    # Define source and target paths (maintaining subdirectory structure)
    commands_source = script_dir / ".claude" / "commands" / "prp-commands"
    commands_target = target_root / ".claude" / "commands" / "prp-commands"

    templates_source = script_dir / "PRPs" / "templates"
    templates_target = target_root / "PRPs" / "templates"

    # Track total operations
    total_copied = 0
    total_skipped = 0

    # Copy PRP commands
    print("📋 Copying PRP Commands:")
    print(f"   From: {commands_source}")
    print(f"   To:   {commands_target}")

    if commands_source.exists():
        # Get all .md files in prp-commands directory
        command_files = [f.name for f in commands_source.glob("*.md")]

        if command_files:
            files_copied, files_skipped = copy_files_safe(commands_source, commands_target, command_files)
            total_copied += files_copied
            total_skipped += files_skipped
            print(f"   Copied: {files_copied}, Skipped: {files_skipped}, Total: {len(command_files)}\n")
        else:
            print("   ⚠ No command files found\n")
    else:
        print(f"   ❌ Source directory not found: {commands_source}\n")

    # Copy PRP templates
    print("📁 Copying PRP Templates:")
    print(f"   From: {templates_source}")
    print(f"   To:   {templates_target}")

    if templates_source.exists():
        # Get all .md files in templates directory
        template_files = [f.name for f in templates_source.glob("*.md")]

        if template_files:
            files_copied, files_skipped = copy_files_safe(templates_source, templates_target, template_files)
            total_copied += files_copied
            total_skipped += files_skipped
            print(f"   Copied: {files_copied}, Skipped: {files_skipped}, Total: {len(template_files)}\n")
        else:
            print("   ⚠ No template files found\n")
    else:
        print(f"   ❌ Source directory not found: {templates_source}\n")

    # Print summary
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━")

    if total_copied > 0 or total_skipped > 0:
        print(f"✅ Operation complete!")
        print(f"   Files copied: {total_copied}")
        if total_skipped > 0:
            print(f"   Files skipped (already exist): {total_skipped}")
        print(f"""
📋 Next Steps:

1. Navigate to your project:
   cd {target_root}

2. Use the PRP commands in your AI assistant:
   Commands are in: .claude/commands/prp-commands/
   Templates are in: PRPs/templates/

3. Example usage:
   /generate-stripe-prp PRPs/initial.md
   /execute-stripe-prp PRPs/stripe.md

Happy coding! 🚀
""")
    else:
        print("❌ No files were copied. Please check the paths and try again.")
        print(f"""
Troubleshooting:
- Make sure you're running this script from: workshop_materials/
- Check that these directories exist:
  - {commands_source}
  - {templates_source}
""")


if __name__ == "__main__":
    main()