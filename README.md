# skillify

The command line for [Skillify](https://skillify.yogan.dev): it keeps a repository's agent skills in
sync with your team's library, checks them in CI, and counts which skills your agents actually use.
One file, no dependencies, Node.js 20 or newer. MIT licensed.

Full documentation: https://skillify.yogan.dev/docs/cli

## Install

```sh
npm install -g --allow-git=root github:ryanyogan/skillify-cli
skillify --version
```

To upgrade, run the install command again.

## Sign in

```sh
skillify login
```

This shows a one-time code and opens Skillify in your browser. Approve the code there and the token
is saved to `~/.config/skillify/credentials.json` (readable only by you). Without a browser, run
`skillify login --no-browser` and open the link on any device. In scripts and CI, set
`SKILLIFY_TOKEN` to a personal token from Skillify → Settings → API tokens.

Settings live on your computer in `~/.config/skillify` (or `$XDG_CONFIG_HOME/skillify`), never in a
repository. The server is `--server`, else `SKILLIFY_SERVER`, else the one you last signed in to with
`login --server`, else https://skillify.yogan.dev.

## Set up a repository

From a checkout:

```sh
skillify init
```

`init` confirms the repository from the git remote `origin` (or lets you pick one), then syncs.

## Keep it current

```sh
skillify status          # what's current, behind, missing, edited here or no longer assigned
skillify sync --dry-run  # what sync would change
skillify sync            # show the changes, then make them
```

Skillify never changes your repository by itself, and the CLI changes only:

- skill folders under `.agents/skills` and `.claude/skills`,
- the managed block in `AGENTS.md` (between `<!-- skillify:start -->` and `<!-- skillify:end -->`),
- one `@AGENTS.md` line in `CLAUDE.md`, only if you already have a `CLAUDE.md`.

It never commits or pushes. After a sync it prints the command to commit, for you to review and run:

```sh
git add -A AGENTS.md .agents/skills .claude/skills && git commit -m "Update agent skills"
```

Skills are identified by hash: each folder is compared with what Skillify rendered for this
repository. Skills edited here are kept unless you pass `--force`, and skills Skillify never wrote
(your own) are never touched. Every write is symlink-safe: nothing is written or deleted through a
link that leaves the repository.

The repository is the git remote `origin`; pass `--repo owner/name` to override it. In GitHub
Actions without a remote, `GITHUB_REPOSITORY` is used.

## Check in CI

```sh
npx -y --allow-git=root github:ryanyogan/skillify-cli status --check
```

Exits with 1 when any skill is behind, missing, edited or no longer assigned. Set `SKILLIFY_TOKEN`
(a read token is enough).

## Automatic pull requests

This repository is also a GitHub Action. It runs `skillify sync` in your repository's own CI and
opens one pull request when Skillify has new or changed skills. The push and the pull request use
your workflow's own token: Skillify itself never gets write access to GitHub.

1. In Skillify, create a personal token (Settings → API tokens). A read token is enough.
2. Add it to the repository as a secret named `SKILLIFY_TOKEN` (Settings → Secrets and variables → Actions).
3. Allow workflows to open pull requests: Settings → Actions → General → Workflow permissions →
   "Allow GitHub Actions to create and approve pull requests". In an organization, the organization
   may need to allow it first.
4. Commit `.github/workflows/skillify.yml`:

```yaml
name: Skillify
on:
  schedule: [{ cron: '0 7 * * 1-5' }]
  workflow_dispatch: {}
permissions: { contents: write, pull-requests: write }
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ryanyogan/skillify-cli@v0
        with: { token: '${{ secrets.SKILLIFY_TOKEN }}' }
```

Each run starts the `skillify/sync` branch from your default branch, syncs, and when anything
changed commits as `github-actions[bot]`, force-pushes the branch and opens the pull request (or
updates the one already open). The body lists the skills added, updated and removed with their
versions, skills edited in the repository that were kept, and any old `.skillify/` cleanup. When
nothing changed, the job summary says the skills are up to date. Hand-edited skills are never
overwritten.

The sync is reported to Skillify as the token's owner, so it shows under that person's name in the
repository's activity.

Pull requests opened with the workflow's `GITHUB_TOKEN` don't start your other workflows
straight away: GitHub holds their checks until someone with write access selects "Approve workflows
to run" on the pull request. To have checks start on their own, pass a GitHub App installation token
or a fine-grained personal token (Contents and Pull requests: read and write) as `github-token`.

| Input | Default | |
| --- | --- | --- |
| `token` | (required) | Skillify personal token |
| `server` | `https://skillify.yogan.dev` | Skillify server |
| `branch` | `skillify/sync` | Branch the pull request comes from; reset on every run |
| `title` | `Update agent skills` | Pull request title and commit message |
| `base` | the checked-out branch | Branch to sync and target |
| `github-token` | `${{ github.token }}` | Token for the push and the pull request |

Outputs: `changed` (`true` or `false`) and `pull-request-url`. The Action needs `git` and Node.js 20 or
newer, both preinstalled on GitHub-hosted runners.

## Usage hooks

After you sign in, `skillify login` offers to add a small usage hook to the agents it finds on this
computer, in each agent's own user settings (never in a repository):

| Agent | Where | Event |
| --- | --- | --- |
| Claude Code | `~/.claude/settings.json` (or `$CLAUDE_CONFIG_DIR`) | `PostToolUse`, matcher `Skill` |
| Gemini CLI | `~/.gemini/settings.json` | `AfterTool`, matcher `^activate_skill$` |
| Codex | `~/.codex/hooks.json` (or `$CODEX_HOME`) | `PostToolUse`, matcher `^Bash$`, and `UserPromptSubmit` |
| Devin (and Windsurf, now Devin Local) | `~/.config/devin/config.json` | `PostToolUse`, matcher `^skill$` |
| OpenCode | `~/.config/opencode/plugins/skillify-usage.js` | plugin on the `skill` tool |

Each runs `skillify hook --agent <id>`, which reports a use only when the skill's folder is in the
repository you're working in. Uses are counted per person: only the skill name, the repository and
the agent are sent, never prompts or code. The hook prints nothing, never fails the agent and gives
up after 1.5 seconds.

Codex has no skill event, so its uses are estimated (a shell command reading a skill's `SKILL.md`,
or `$name` in your prompt), and Codex asks you to approve new hooks in `/hooks`. Amp, Cursor and
GitHub Copilot aren't counted: their hooks have no documented skill event.

```sh
skillify hooks            # which agents count uses
skillify hooks --install  # add the hooks (--agent codex,devin for some)
skillify hooks --remove   # take them out; skillify logout offers this too
```

## Repositories set up before 0.7

Older CLIs committed a `.skillify/` folder and a hook in the repository's `.claude/settings.json`.
The next `skillify sync` deletes `.skillify/` and removes only that hook entry (other settings and
hooks stay), and includes both in the commit command.

## Commands

```
skillify login [--no-browser] [--hooks | --no-hooks]
skillify init [owner/name] [--yes] [--dry-run]
skillify sync [--dry-run] [--force] [--yes] [--verbose] [--repo owner/name]
skillify status [--check] [--verbose] [--repo owner/name]
skillify hooks [--install | --remove] [--agent id,…]
skillify open | whoami | logout | doctor
skillify help <command>
```

Most commands take `--json` and `--server <url>`.

## License

MIT
