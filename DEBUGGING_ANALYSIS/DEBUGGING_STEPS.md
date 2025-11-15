 # Debugging Breakpoints Documentation

---

## 1. `if (!getUsername("username")) { ... }`

### Location
Inside the conditional that checks whether the username cookie exists.

### What This Breakpoint Does
Pauses execution whenever the condition `!getUsername("username")` is true, meaning no username cookie was found.

### Why It’s Useful
- Confirms whether the username cookie is being retrieved properly.
- Helps troubleshoot login/session initialization.
- Useful for detecting cases where user identity is missing or not stored.

---

## 2. `document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";`

### Location
Inside the event listener for the "New Player" button, where the username cookie is cleared.

### What This Breakpoint Does
Stops execution when the app attempts to delete the username cookie.

### Why It’s Useful
- Verifies when and why the cookie is being removed.
- Helps track logout-like behavior or forced session resets.
- Allows inspection of cookie state right before it is cleared.

---

## 3. `displayScores();` (Line 149)

### Location
Immediately before loading a new set of trivia for the next player.

### What This Breakpoint Does
Pauses execution at the moment scores are about to be rendered to the scoreboard.

### Why It’s Useful
- Allows you to inspect the score list or data structure before it updates the UI.
- Helps ensure scores aren’t leaking between sessions.
- Assists in debugging display or rendering issues with the scoreboard.
