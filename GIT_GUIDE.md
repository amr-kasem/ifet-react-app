# Git Guide — pushing changes and going back to old versions

A practical, step-by-step reference for this repository.

- **Repository:** https://github.com/amr-kasem/ifet-react-app
- **Branch:** `main`
- **Local folder:** `D:\Projects\My Projects\react send reiceve mqtt\mqtt`

Open a terminal in the project folder before running anything below. If you open a terminal somewhere else, move into the project first — the quotes are required because the path contains spaces:

```bash
cd "D:/Projects/My Projects/react send reiceve mqtt/mqtt"
```

---

## Table of contents

1. [One-time setup (already done)](#1-one-time-setup-already-done)
2. [Pushing a change — the 5 steps](#2-pushing-a-change--the-5-steps)
3. [Writing good commit messages](#3-writing-good-commit-messages)
4. [Naming a push with a tag (release names)](#4-naming-a-push-with-a-tag-release-names)
5. [Looking at your history](#5-looking-at-your-history)
6. [Going back to an old version](#6-going-back-to-an-old-version)
7. [Undoing mistakes](#7-undoing-mistakes)
8. [Quick reference card](#8-quick-reference-card)

---

## 1. One-time setup (already done)

These are recorded here so they can be repeated on another machine. **You do not need to run them again on this computer.**

```bash
git config --global --add safe.directory 'D:/Projects/My Projects/react send reiceve mqtt/mqtt'
```
Windows refuses to run git in a folder owned by a different user account. This registers an exception. Without it every git command fails with `fatal: detected dubious ownership`.

```bash
git config user.name "emadfisho"
```
```bash
git config user.email "emadfisho1997@gmail.com"
```
Sets the name and email stamped onto every commit you make. These are per-repository — add `--global` to apply them to all your repos.

```bash
git remote add origin https://github.com/amr-kasem/ifet-react-app.git
```
Tells the local repo where GitHub is. `origin` is just a nickname for that URL.

---

## 2. Pushing a change — the 5 steps

This is the loop you repeat every time you change code.

### Step 1 — See what you changed

```bash
git status
```

Shows three groups of files:

- **Changes not staged for commit** — files you edited but haven't selected yet
- **Untracked files** — brand-new files git has never seen
- **Changes to be committed** — files already selected (staged) and ready

To see the *actual line-by-line* changes rather than just filenames:

```bash
git diff
```

Press `q` to exit the viewer. **Always run these two first** — it stops you from accidentally committing a debug `console.log` or a half-finished experiment.

### Step 2 — Stage the files you want to include

Staging means "select this file for the next commit."

Stage everything that changed:
```bash
git add -A
```

Or stage one specific file:
```bash
git add src/componants/Mqtt1/Receiver.js
```

Files listed in [.gitignore](.gitignore) are skipped automatically — `node_modules/`, `build/`, `*.rar`, `*.zip`, `New folder (2)/`, `__pycache__/`, `uploads/`, `uploaded_images/`. This is what keeps 265 MB of backup archives out of the repository.

Confirm what got staged:
```bash
git status --short
```
`M` = modified, `A` = added, `D` = deleted. Everything listed here goes into the next commit.

### Step 3 — Commit (save a snapshot locally)

```bash
git commit -m "Fix sensor value rounding to 3 digits"
```

A commit is a permanent, named snapshot of your whole project. It lives **only on your computer** until you push. Each one gets a unique ID like `d36bdfa`.

See [section 3](#3-writing-good-commit-messages) for how to word the message.

### Step 4 — Push (upload to GitHub)

```bash
git push
```

Sends all your local commits to GitHub. If someone else pushed since your last update, this is rejected with `! [rejected] ... (fetch first)`. Fix it with:

```bash
git pull
```

then run `git push` again. `git pull` downloads their changes and merges them into yours.

### Step 5 — Verify

```bash
git status
```

You want to see:
```
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

That means everything is saved and uploaded. You can also open the repo on GitHub to see your commit at the top.

### The whole flow in one block

```bash
git status
```
```bash
git add -A
```
```bash
git commit -m "Describe what you changed"
```
```bash
git push
```

---

## 3. Writing good commit messages

The message is how you will recognise this version months from now. Bad messages make section 6 nearly impossible.

**Rules that work:**

- Say **what changed**, not "update" or "fix" or "changes"
- Write it in the present tense, like an instruction: "Add…", "Fix…", "Remove…"
- Keep the first line under ~70 characters
- One commit = one logical change. Don't bundle a bug fix with a new feature.

| Bad | Good |
|---|---|
| `update` | `Add flow sensor to device 3 config` |
| `fix bug` | `Fix valve 4 not releasing after cyclic test` |
| `changes` | `Show sensor readings with 3 decimal digits` |
| `new stuff` | `Add deflections page for trial results` |

**Longer message** when one line isn't enough — leave a blank line, then explain *why*:

```bash
git commit -m "Fix valve 4 not releasing after cyclic test" -m "The NEGATIVE_RELEASE role was not being matched because the role array comparison was case sensitive."
```

---

## 4. Naming a push with a tag (release names)

A commit message describes a change. A **tag** gives a specific version a permanent, memorable name — this is how you mark "this is the stable version that works on the rig."

This replaces what you were doing with the `.rar` snapshot files (`30-6-2026-add-new-sensors-3-digits.rar` and so on), but without the 250 MB.

### Create a tag on your latest commit

```bash
git tag -a v1.2-sensors-3-digits -m "Stable build with 3-digit sensor display"
```

- `-a` makes an annotated tag — it records who made it and when
- `v1.2-sensors-3-digits` is the name. **No spaces allowed** — use dashes.
- `-m` is the description

### Push the tag to GitHub

Tags are **not** sent by `git push`. You must push them explicitly:

```bash
git push origin v1.2-sensors-3-digits
```

Or push every tag you have at once:
```bash
git push --tags
```

Once pushed, the tag appears under **Releases / Tags** on GitHub and anyone can download that exact version as a zip.

### Naming schemes that work

| Style | Example | Good for |
|---|---|---|
| Version number | `v1.0`, `v1.1`, `v2.0` | Formal releases |
| Date | `2026-09-06-stable` | Snapshots taken on a day |
| Version + feature | `v1.2-sensors-3-digits` | Best of both — recommended |
| Milestone | `stable-before-specimens-feature` | "Last known good" markers |

### List your tags

```bash
git tag
```

### Delete a tag you named wrongly

Locally:
```bash
git tag -d v1.2-sensors-3-digits
```

And on GitHub:
```bash
git push origin --delete v1.2-sensors-3-digits
```

### Tag an older commit (not just the latest)

Find the commit ID from `git log --oneline`, then:
```bash
git tag -a v1.0-first-working -m "First working version" d36bdfa
```

---

## 5. Looking at your history

**Compact list of all commits** — one line each, newest first:
```bash
git log --oneline
```
Output looks like `d36bdfa Add IFET React MQTT device control app`. That short code is the commit ID you use everywhere else. Press `q` to exit.

**With dates, authors and tags:**
```bash
git log --oneline --graph --decorate -20
```
The `-20` limits it to the last 20 commits.

**History of one specific file:**
```bash
git log --oneline -- src/store/sensors-slice.js
```

**See exactly what a commit changed:**
```bash
git show d36bdfa
```

**See what changed between two versions:**
```bash
git diff v1.0 v1.2-sensors-3-digits
```

---

## 6. Going back to an old version

There are several ways, from safest to most drastic. **Read the whole section before running anything** — pick the one that matches what you actually want.

Every one of these needs a commit ID (from `git log --oneline`) or a tag name (from `git tag`).

---

### 6a. Just look at an old file — changes nothing

```bash
git show v1.0:src/store/sensors-slice.js
```

Prints that file as it was at version `v1.0`. Nothing on disk is touched.

Save it side by side for comparison:
```bash
git show v1.0:src/store/sensors-slice.js > old-sensors-slice.js
```

---

### 6b. Restore ONE file to an old version

You broke one file and want it back the way it was, keeping all your other work.

```bash
git checkout v1.0 -- src/store/sensors-slice.js
```

That file is now restored on disk **and already staged**. All your other files are untouched. Commit it:

```bash
git commit -m "Restore sensors-slice to the v1.0 version"
```
```bash
git push
```

---

### 6c. Look at the ENTIRE project as it was — temporary

You want to run the old version to test whether a bug existed back then.

**First make sure your current work is committed** (`git status` must say `working tree clean`), then:

```bash
git checkout v1.0
```

Your whole folder now looks exactly like version `v1.0`. Git prints a warning about **"detached HEAD"** — that's normal and expected here. It means "you are looking at history, not working on a branch."

Test it:
```bash
npm install && npm start
```

When you're finished, go back to the present:

```bash
git checkout main
```

> **Do not commit while in detached HEAD.** Commits made there are hard to find later. If you want to *work* from the old version, use 6d instead.

---

### 6d. Continue working FROM an old version

You want to go back to a working version and build forward from it, without destroying anything.

```bash
git checkout -b fix-from-v1.0 v1.0
```

This creates a new branch called `fix-from-v1.0` starting at version `v1.0`. Everything on `main` is still safe. Work normally — edit, `git add -A`, `git commit`.

Push the new branch the first time:
```bash
git push -u origin fix-from-v1.0
```

After that, plain `git push` works. Switch back to your main work anytime with `git checkout main`.

---

### 6e. Undo a bad commit — the safe way

Commit `abc1234` broke something and it's **already pushed**. You want to cancel it.

```bash
git revert abc1234
```

This creates a **new** commit that reverses the changes. Nothing is deleted, the history stays honest, and it is safe even though others may have pulled your code. Then:

```bash
git push
```

**This is the correct way to undo something that is already on GitHub.**

---

### 6f. Roll the whole project back to an old version — permanently

You want `main` itself to become version `v1.0` again, and you want that pushed.

The safe way, using `revert` so nothing is lost:

```bash
git revert --no-commit v1.0..HEAD
```
```bash
git commit -m "Roll back to v1.0 state"
```
```bash
git push
```

This undoes everything after `v1.0` by adding new commits on top. The old commits remain in history, so you can still go forward again later.

> There is also `git reset --hard`, which **erases** commits instead of reversing them. Avoid it on `main` after pushing — it destroys history and breaks the repo for anyone else who has pulled. Only use it for local commits you never pushed (see 7c).

---

## 7. Undoing mistakes

### 7a. I edited a file and want to throw the changes away (not committed yet)

```bash
git checkout -- src/App.js
```

**This permanently discards your unsaved edits to that file.** There is no undo. Make sure that's what you want.

Discard *all* uncommitted changes:
```bash
git reset --hard
```

### 7b. I staged a file by accident

```bash
git restore --staged src/App.js
```

Un-stages it. Your edits to the file are kept — it just won't be in the next commit.

### 7c. I committed but haven't pushed yet, and want to undo it

Undo the commit but **keep all your changes** as edited files:
```bash
git reset --soft HEAD~1
```

Undo the commit and **throw the changes away**:
```bash
git reset --hard HEAD~1
```

`HEAD~1` means "one commit before the latest." Use `HEAD~2` for two, and so on.

> Safe only if you have **not** pushed. If it's already on GitHub, use `git revert` (6e) instead.

### 7d. I typed the wrong commit message (not pushed yet)

```bash
git commit --amend -m "The correct message"
```

### 7e. I accidentally committed a huge file

Add it to [.gitignore](.gitignore) first, then remove it from git while keeping it on your disk:

```bash
git rm --cached "the-big-file.rar"
```
```bash
git commit -m "Remove accidentally committed archive"
```

> If it was already **pushed**, the file stays in the repo history and keeps the repo large. Cleaning that requires rewriting history — ask before attempting it.

---

## 8. Quick reference card

**Every day:**
```bash
git status
```
```bash
git add -A
```
```bash
git commit -m "What I changed"
```
```bash
git push
```

**Name this version:**
```bash
git tag -a v1.3-my-feature -m "Description"
```
```bash
git push origin v1.3-my-feature
```

**See history:**
```bash
git log --oneline --graph --decorate -20
```

**Get one old file back:**
```bash
git checkout v1.0 -- path/to/file.js
```

**Test an old version, then return:**
```bash
git checkout v1.0
```
```bash
git checkout main
```

**Undo something already pushed:**
```bash
git revert <commit-id>
```

---

## Habits worth keeping

1. **Run `git status` before and after everything.** It is read-only and tells you exactly where you stand.
2. **Commit small and often.** Ten small commits are far easier to search and undo than one giant one.
3. **Tag every version you install on a rig.** That replaces the `.rar` snapshots and takes no disk space.
4. **Push at the end of every working session.** Commits sitting only on your laptop are not backed up.
5. **`revert` on anything already pushed; `reset` only on local commits.**
6. **Never commit passwords, tokens, or API keys.** Once pushed, treat them as public — changing the file later does not remove them from history.
