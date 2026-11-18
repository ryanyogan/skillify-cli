// skillify GitHub Action 0.8.0. Generated from apps/cli/action; do not edit.

// action/main.ts
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// action/pr.ts
import { spawn, spawnSync } from "node:child_process";
import { appendFileSync, existsSync } from "node:fs";
import { join } from "node:path";
var PERMISSION_HINT = `GitHub Actions is not allowed to open pull requests in this repository. Enable it in Settings \u2192 Actions \u2192 General \u2192 Workflow permissions \u2192 "Allow GitHub Actions to create and approve pull requests" (for an organization, the same setting may need enabling under the organization's Actions settings first).`, ActionError = class extends Error {
};
function readInputs(env, here) {
  let need = (name, what) => {
    let value = env[name]?.trim();
    if (!value) throw new ActionError(what);
    return value;
  }, repo = need("GITHUB_REPOSITORY", "GITHUB_REPOSITORY is not set. Run this as a step in a GitHub Actions workflow."), serverUrl = (env.GITHUB_SERVER_URL || "https://github.com").replace(/\/+$/, ""), runId = env.GITHUB_RUN_ID;
  return {
    token: need("SKILLIFY_TOKEN", "The token input is empty. Add a Skillify token as the repository secret SKILLIFY_TOKEN and pass it: with: { token: ${{ secrets.SKILLIFY_TOKEN }} }"),
    server: (env.SKILLIFY_SERVER || "https://skillify.yogan.dev").replace(/\/+$/, ""),
    branch: env.SKILLIFY_BRANCH?.trim() || "skillify/sync",
    title: env.SKILLIFY_TITLE?.trim() || "Update agent skills",
    base: env.SKILLIFY_BASE?.trim() ?? "",
    githubToken: need("GITHUB_TOKEN", "No GitHub token. The github-token input defaults to the workflow token; check the workflow has permissions: { contents: write, pull-requests: write }."),
    defaultGithubToken: env.SKILLIFY_DEFAULT_GITHUB_TOKEN !== "false",
    repo,
    apiUrl: (env.GITHUB_API_URL || "https://api.github.com").replace(/\/+$/, ""),
    serverUrl,
    runUrl: runId ? `${serverUrl}/${repo}/actions/runs/${runId}` : null,
    workspace: env.GITHUB_WORKSPACE || process.cwd(),
    cli: env.SKILLIFY_CLI || join(here, "..", "skillify.mjs"),
    summaryFile: env.GITHUB_STEP_SUMMARY || null,
    outputFile: env.GITHUB_OUTPUT || null
  };
}
var TARGET_DIRS = { agents: ".agents/skills", claude: ".claude/skills" };
function kindOf(rows) {
  return rows.some((r) => r.problem) ? "problem" : rows.some((r) => r.action === "keep") ? "kept" : rows.some((r) => r.action === "write" && r.state === "edited") ? "replaced" : rows.some((r) => r.action === "write" && r.state === "behind") ? "updated" : rows.some((r) => r.action === "write") ? "added" : rows.length && rows.every((r) => r.action === "delete") ? "removed" : null;
}
function versionOf(row) {
  if (!row.version) return "";
  let v = `v${row.version}`;
  return row.pinned && (v += row.latestVersion && row.latestVersion > row.version ? ` (pinned; v${row.latestVersion} is out)` : " (pinned)"), v;
}
function groupSkills(skills) {
  let bySlug = /* @__PURE__ */ new Map();
  for (let s of skills) bySlug.set(s.slug, [...bySlug.get(s.slug) ?? [], s]);
  let groups = { added: [], updated: [], replaced: [], removed: [], kept: [], problem: [] };
  for (let [slug, rows] of [...bySlug].sort(([a], [b]) => a.localeCompare(b))) {
    let kind = kindOf(rows);
    if (!kind) continue;
    let touched = rows.filter((r) => r.action !== "none" || r.problem);
    groups[kind].push({ slug, version: versionOf(rows.find((r) => r.version) ?? rows[0]), where: [...new Set(touched.map((r) => TARGET_DIRS[r.target] ?? r.target))].join(", ") });
  }
  return groups;
}
var code = (text) => `\`${text.replace(/`/g, "'")}\``;
function table(rows, withVersion = !0) {
  return [...withVersion ? ["| Skill | Version | Where |", "| --- | --- | --- |"] : ["| Skill | Where |", "| --- | --- |"], ...rows.map((r) => withVersion ? `| ${code(r.slug)} | ${r.version || "\u2014"} | ${r.where} |` : `| ${code(r.slug)} | ${r.where} |`)];
}
function repoPage(server, repo) {
  let [owner = "", name = ""] = repo.split("/");
  return `${server}/app/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
}
function pullRequestBody(result, context) {
  let groups = groupSkills(result.skills), page = repoPage(context.server, context.repo), out = ["Skillify has changes for this repository's agent skills. Review them and merge to give every agent the same skills."], section = (title, lines) => out.push("", `### ${title}`, "", ...lines);
  if (groups.added.length && section("Added", table(groups.added)), groups.updated.length && section("Updated", table(groups.updated)), groups.replaced.length && section("Replaced (edited here)", table(groups.replaced)), groups.removed.length && section("Removed", [...table(groups.removed, !1), "", "No longer assigned to this repository in Skillify. Only copies Skillify wrote are removed."]), groups.kept.length && section("Kept as edited here", [
    ...table(groups.kept),
    "",
    `These were changed by hand in this repository, so sync left them as they are. To share an edit, propose it on the skill in [Skillify](${page}); to take Skillify's version instead, run \`skillify sync --force\` and commit.`
  ]), groups.problem.length) {
    let reasons = new Map(result.skills.filter((s) => s.problem).map((s) => [s.slug, s.problem]));
    section("Couldn't be written", groups.problem.map((r) => `- ${code(r.slug)}: ${reasons.get(r.slug)}`));
  }
  let files = [];
  result.files.agentsMd && files.push("- `AGENTS.md`: updated the skills block between `<!-- skillify:start -->` and `<!-- skillify:end -->`"), result.files.claudeMd && files.push("- `CLAUDE.md`: added an `@AGENTS.md` line so Claude Code reads the same instructions"), result.files.legacyDir && files.push("- `.skillify/`: removed. Older CLIs committed it; skill use is now counted by hooks in each person's own agents"), result.files.legacySettings === "removed" && files.push("- `.claude/settings.json`: removed (it held only the old Skillify usage hook)"), result.files.legacySettings === "updated" && files.push("- `.claude/settings.json`: removed the old Skillify usage hook; other settings are unchanged"), files.length && section("Also changed", files);
  let notes = [];
  result.files.legacyProblem && notes.push(`- ${result.files.legacyProblem}`);
  for (let s of result.skipped) notes.push(`- ${code(s.path)} was left alone: ${s.reason}`);
  for (let f of result.failed ?? []) notes.push(`- ${code(f.path)} couldn't be written: ${f.reason}`);
  notes.length && section("Check by hand", notes), out.push("", `[Open ${context.repo} in Skillify](${page})`, "", "---", "");
  let footer = [`Opened by this repository's own [workflow](${context.runUrl ?? `https://github.com/${context.repo}/actions`}) with skillify ${result.cliVersion}. Skillify has no write access to GitHub; it only served the skills.`];
  return context.defaultGithubToken && footer.push('Checks on this pull request wait for approval because it was opened with the workflow\'s GITHUB_TOKEN: select "Approve workflows to run" below. To run them automatically, give the Action a GitHub App or personal token (the `github-token` input).'), out.push(footer.map((line) => `<sub>${line}</sub>`).join(`

`)), out.join(`
`) + `
`;
}
var defaultIo = { log: (line) => process.stdout.write(`${line}
`), fetch: (...args) => fetch(...args) };
function git(cwd, args, options = {}) {
  let r = spawnSync("git", args, { cwd, env: { ...process.env, GIT_TERMINAL_PROMPT: "0", ...options.env }, encoding: "utf8" }), ok = r.status === 0;
  if (!ok && !options.allowFail) throw new ActionError(`git ${args[0]} failed: ${(r.stderr || r.stdout || String(r.error ?? "")).trim()}`);
  return { ok, stdout: (r.stdout ?? "").trim(), stderr: (r.stderr ?? "").trim() };
}
function gitAuthEnv(serverUrl, token) {
  let key = `http.${serverUrl}/.extraheader`, basic = Buffer.from(`x-access-token:${token}`).toString("base64");
  return { GIT_CONFIG_COUNT: "2", GIT_CONFIG_KEY_0: key, GIT_CONFIG_VALUE_0: "", GIT_CONFIG_KEY_1: key, GIT_CONFIG_VALUE_1: `AUTHORIZATION: basic ${basic}` };
}
var GitHub = class {
  constructor(inputs, io) {
    this.inputs = inputs;
    this.io = io;
  }
  inputs;
  io;
  async request(method, path, body) {
    let response = await this.io.fetch(`${this.inputs.apiUrl}${path}`, {
      method,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${this.inputs.githubToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "skillify-action",
        ...body ? { "Content-Type": "application/json" } : {}
      },
      body: body ? JSON.stringify(body) : void 0
    }), text = await response.text(), data = text ? JSON.parse(text) : null;
    if (!response.ok) {
      let message = data?.message ?? response.statusText;
      if (/not permitted to create or approve pull requests/i.test(message)) throw new ActionError(PERMISSION_HINT);
      let hint = response.status === 403 || response.status === 404 ? " Check the workflow has permissions: { contents: write, pull-requests: write }." : "";
      throw new ActionError(`GitHub said ${response.status} to ${method} ${path}: ${message}.${hint}`);
    }
    return data;
  }
  get repoPath() {
    let [owner = "", name = ""] = this.inputs.repo.split("/");
    return `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
  }
  async defaultBranch() {
    return (await this.request("GET", this.repoPath)).default_branch;
  }
  async openPullRequest(branch) {
    let owner = this.inputs.repo.split("/")[0];
    return (await this.request("GET", `${this.repoPath}/pulls?state=open&per_page=1&head=${encodeURIComponent(`${owner}:${branch}`)}`))[0] ?? null;
  }
  create(fields) {
    return this.request("POST", `${this.repoPath}/pulls`, { ...fields, maintainer_can_modify: !0 });
  }
  update(number, fields) {
    return this.request("PATCH", `${this.repoPath}/pulls/${number}`, fields);
  }
};
function writeOutputs(inputs, outputs) {
  inputs.outputFile && appendFileSync(inputs.outputFile, Object.entries(outputs).map(([k, v]) => `${k}=${v.replace(/[\r\n]/g, " ")}
`).join(""));
}
function summary(inputs, markdown) {
  inputs.summaryFile && appendFileSync(inputs.summaryFile, markdown.endsWith(`
`) ? markdown : `${markdown}
`);
}
async function runSync(inputs) {
  if (!existsSync(inputs.cli)) throw new ActionError(`The bundled CLI is missing at ${inputs.cli}.`);
  let child = spawn(process.execPath, [inputs.cli, "sync", "--yes", "--json", "--no-input", "--repo", inputs.repo], {
    cwd: inputs.workspace,
    env: { ...process.env, SKILLIFY_TOKEN: inputs.token, SKILLIFY_SERVER: inputs.server },
    stdio: ["ignore", "pipe", "inherit"]
  }), chunks = [];
  child.stdout.on("data", (chunk) => chunks.push(chunk));
  let code2 = await new Promise((resolve, reject) => {
    child.on("error", reject), child.on("close", (status, signal) => resolve(status ?? signal));
  });
  if (code2 !== 0) throw new ActionError(`skillify sync failed (exit ${code2}). Its message is above.`);
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new ActionError("skillify sync didn't print JSON. Is the Action's bundled CLI intact?");
  }
}
async function run(inputs, io = defaultIo) {
  io.log(`::add-mask::${inputs.token}`), io.log(`::add-mask::${inputs.githubToken}`);
  let auth = gitAuthEnv(inputs.serverUrl, inputs.githubToken);
  io.log(`::add-mask::${auth.GIT_CONFIG_VALUE_1.slice(21)}`);
  let cwd = inputs.workspace, gh = new GitHub(inputs, io);
  if (!git(cwd, ["check-ref-format", "--branch", inputs.branch], { allowFail: !0 }).ok) throw new ActionError(`"${inputs.branch}" isn't a valid branch name.`);
  let base = inputs.base || git(cwd, ["symbolic-ref", "--quiet", "--short", "HEAD"], { allowFail: !0 }).stdout || await gh.defaultBranch();
  if (!git(cwd, ["check-ref-format", "--branch", base], { allowFail: !0 }).ok) throw new ActionError(`"${base}" isn't a valid branch name.`);
  if (base === inputs.branch) throw new ActionError(`The workflow ran on ${inputs.branch}, the branch this Action opens pull requests from. Run it on your default branch, or set the base input.`);
  io.log(`Starting ${inputs.branch} from ${base}`), git(cwd, ["fetch", "--no-tags", "--depth=1", "origin", `refs/heads/${base}`], { env: auth }), git(cwd, ["checkout", "--quiet", "-B", inputs.branch, "FETCH_HEAD"]), io.log(`Syncing ${inputs.repo} with ${inputs.server}`);
  let result = await runSync(inputs), paths = result.paths.filter((p) => existsSync(join(cwd, p)) || git(cwd, ["ls-files", "--", p]).stdout !== "");
  paths.length && git(cwd, ["add", "-A", "--", ...paths]);
  let changed = result.applied && !git(cwd, ["diff", "--cached", "--quiet"], { allowFail: !0 }).ok, page = repoPage(inputs.server, inputs.repo);
  if (!changed) {
    let stale = await gh.openPullRequest(inputs.branch), lines = ["### Skills are up to date", "", `${base} already has every skill Skillify assigns to ${inputs.repo}. Nothing to commit. [Open in Skillify](${page})`], kept = groupSkills(result.skills).kept;
    return kept.length && lines.push("", `Kept ${kept.length === 1 ? "1 skill" : `${kept.length} skills`} edited here: ${kept.map((k) => code(k.slug)).join(", ")}.`), stale && lines.push("", `An older pull request is still open: ${stale.html_url}. ${base} now matches Skillify without it, so you can close it.`), summary(inputs, lines.join(`
`)), writeOutputs(inputs, { changed: "false", "pull-request-url": stale?.html_url ?? "" }), io.log(stale ? `Skills are up to date. An older pull request is still open: ${stale.html_url}` : "Skills are up to date"), { changed: !1, url: null, result };
  }
  let body = pullRequestBody(result, { server: inputs.server, repo: inputs.repo, runUrl: inputs.runUrl, defaultGithubToken: inputs.defaultGithubToken });
  git(cwd, [...["-c", "user.name=github-actions[bot]", "-c", "user.email=41898282+github-actions[bot]@users.noreply.github.com"], "commit", "--quiet", "--no-verify", "-m", inputs.title, "-m", `Synced from Skillify: ${page}`]);
  let remote = git(cwd, ["ls-remote", "--heads", "origin", `refs/heads/${inputs.branch}`], { env: auth }).stdout.split(/\s/)[0], same = !1;
  remote && (git(cwd, ["fetch", "--no-tags", "--depth=1", "origin", `refs/heads/${inputs.branch}`], { env: auth }), same = git(cwd, ["rev-parse", "FETCH_HEAD^{tree}"]).stdout === git(cwd, ["rev-parse", "HEAD^{tree}"]).stdout), same ? io.log(`${inputs.branch} already has these changes`) : (io.log(`Pushing ${inputs.branch}`), git(cwd, ["push", "--force", "--quiet", "origin", `HEAD:refs/heads/${inputs.branch}`], { env: auth }));
  let open = await gh.openPullRequest(inputs.branch), pr = open ? await gh.update(open.number, { title: inputs.title, body, base }) : await gh.create({ title: inputs.title, body, head: inputs.branch, base });
  return io.log(`${open ? "Updated" : "Opened"} ${pr.html_url}`), summary(inputs, [`### ${open ? "Updated" : "Opened"} [${inputs.title}](${pr.html_url})`, "", body].join(`
`)), writeOutputs(inputs, { changed: "true", "pull-request-url": pr.html_url }), { changed: !0, url: pr.html_url, result };
}

// action/main.ts
try {
  await run(readInputs(process.env, dirname(fileURLToPath(import.meta.url))));
} catch (error) {
  let message = error instanceof ActionError ? error.message : `Unexpected error: ${error?.stack ?? String(error)}`;
  process.stdout.write(`::error title=Skillify::${message.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A")}
`), process.exitCode = 1;
}
