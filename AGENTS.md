# Working instructions

Work as one agent. Do not spawn subagents.

Use TASK.md as the acceptance specification.
Make routine implementation decisions yourself.

Implement, test, inspect failures, and repair within this project.

Testing:
- Exercise the real interface with Playwright.
- Test persistence using real localStorage.
- For browser-restart persistence, close and relaunch Chromium
  with the same temporary persistent profile.
- Keep tests isolated from the user's normal browser profile.
- Use assertions on visible outcomes.
- Do not skip tests or weaken assertions just to obtain a pass.
- After the final code change, run npm test and npm run build.

Stopping:
- Finish when the acceptance criteria are verified.
- After three unsuccessful repair cycles for the same failure,
  stop and report the cause, attempts, and next action needed.
- If an environment problem prevents a check, mark it unverified.

Final report:
- What was implemented.
- Acceptance criterion → test mapping.
- Actual commands run and their results.
- Remaining limitations.

Keep TASK.md and these instructions unchanged.
