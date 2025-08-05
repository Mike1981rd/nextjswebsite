# Initialize Project Session Command

Load all project context and provide comprehensive session summary: $ARGUMENTS

## Load Context Files
First, let me load all the essential project files:

1. Read CLAUDE.md for workflow rules and project constraints
2. Read all blueprint files (blueprint1.md, blueprint2.md, blueprint3.md)
3. Read PROJECT-PROGRESS.md for current status
4. Check for any other relevant context files

## Session Summary Generation

### 1. Project Overview
- Extract project name, tech stack, and main objectives
- Identify current development phase
- Show project repository and key dates

### 2. Progress Analysis
- Count total tasks across all phases
- Calculate completed tasks percentage
- Break down progress by phase/module
- Identify critical path items

### 3. Recent Activity
- Show last 3-5 completed tasks with timestamps
- Display current in-progress tasks
- List any blockers or issues noted

### 4. Next Steps
- Identify next logical task based on dependencies
- Check for any prerequisite tasks
- Recommend immediate action items

### 5. Pending Approvals
- Check git status for uncommitted changes
- Look for pending database migrations
- Identify any awaiting permissions

### 6. Environment Status
- Verify database connection details
- Check API configuration
- Confirm frontend setup status

## Output Format
Present findings in this structure:
```
🚀 PROJECT SESSION INITIALIZED

📊 Project: [Name]
Tech Stack: [Stack details]
Phase: [Current phase] ([X]% complete)

✅ Recent Completions:
- [Task 1] (timestamp)
- [Task 2] (timestamp)

🔄 Currently Active:
- [In-progress task]

📋 Next Recommended Task:
[Task details with rationale]

⚠️ Pending Actions:
- [Any uncommitted changes]
- [Any pending migrations]

🔗 Key Files Loaded:
- CLAUDE.md ✓
- blueprintX.md ✓
- PROJECT-PROGRESS.md ✓

Context loaded. Ready to continue project work.
```

## Error Handling
- If files are missing, note which ones and suggest recovery
- If progress tracker is corrupted, offer to rebuild from git history
- Handle file reading errors gracefully with clear messages