#!/usr/bin/env node
// skillify CLI 0.7.0. Generated from apps/cli; do not edit. Install: npm install -g github:ryanyogan/skillify-cli
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// ../../packages/core/src/ids.ts
var init_ids = __esm({
  "../../packages/core/src/ids.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/hash.ts
async function sha256Hex(data) {
  let bytes = typeof data == "string" ? encoder.encode(data) : data, digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function bundleHash(files2) {
  let lines2 = [...files2].sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0).map((file) => `${file.path}\0${file.sha256}
`).join("");
  return sha256Hex(lines2);
}
async function hashFiles(files2) {
  let hashed = await Promise.all(
    files2.map(async (file) => {
      let bytes = typeof file.content == "string" ? encoder.encode(file.content) : file.content;
      return { path: file.path, sha256: await sha256Hex(bytes), size: bytes.byteLength };
    })
  );
  return { hash: await bundleHash(hashed), files: hashed };
}
var encoder, init_hash = __esm({
  "../../packages/core/src/hash.ts"() {
    "use strict";
    encoder = new TextEncoder();
  }
});

// ../../packages/core/src/frontmatter.ts
var init_frontmatter = __esm({
  "../../packages/core/src/frontmatter.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/lint.ts
var LIMITS, SKILL_NAME, init_lint = __esm({
  "../../packages/core/src/lint.ts"() {
    "use strict";
    LIMITS = {
      nameLength: 64,
      descriptionLength: 1024,
      /** Descriptions sit in every session's context; short ones keep the per-repo budget small. */
      descriptionSoft: 400,
      skillMdLines: 500,
      fileBytes: 512 * 1024,
      bundleBytes: 4 * 1024 * 1024,
      files: 100
    }, SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  }
});

// ../../packages/core/src/categories.ts
var init_categories = __esm({
  "../../packages/core/src/categories.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/protocol.ts
var TARGET_DIRS, LEGACY_DIR, LEGACY_HOOK_COMMANDS, USAGE_AGENTS, init_protocol = __esm({
  "../../packages/core/src/protocol.ts"() {
    "use strict";
    TARGET_DIRS = {
      agents: ".agents/skills",
      claude: ".claude/skills"
    }, LEGACY_DIR = ".skillify", LEGACY_HOOK_COMMANDS = ["node .skillify/cli.mjs hook", 'node "$CLAUDE_PROJECT_DIR/.skillify/hook.mjs"'], USAGE_AGENTS = {
      "claude-code": { label: "Claude Code", estimated: !1 },
      "gemini-cli": { label: "Gemini CLI", estimated: !1 },
      opencode: { label: "OpenCode", estimated: !1 },
      devin: { label: "Devin", estimated: !1 },
      codex: { label: "Codex", estimated: !0 }
    };
  }
});

// ../../packages/core/src/state.ts
var init_state = __esm({
  "../../packages/core/src/state.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/render.ts
function mergeAgentsMd(existing, block) {
  if (!existing?.trim()) return `# Agent guide

${block}
`;
  let start = existing.indexOf(AGENTS_START), end = existing.indexOf(AGENTS_END);
  return start !== -1 && end > start ? existing.slice(0, start) + block + existing.slice(end + AGENTS_END.length) : `${existing.replace(/\s*$/, "")}

${block}
`;
}
var AGENTS_START, AGENTS_END, init_render = __esm({
  "../../packages/core/src/render.ts"() {
    "use strict";
    AGENTS_START = "<!-- skillify:start -->", AGENTS_END = "<!-- skillify:end -->";
  }
});

// ../../packages/core/src/tar.ts
var decoder, init_tar = __esm({
  "../../packages/core/src/tar.ts"() {
    "use strict";
    decoder = new TextDecoder();
  }
});

// ../../packages/core/src/github.ts
var init_github = __esm({
  "../../packages/core/src/github.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/diff.ts
var init_diff = __esm({
  "../../packages/core/src/diff.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/totp.ts
var init_totp = __esm({
  "../../packages/core/src/totp.ts"() {
    "use strict";
  }
});

// ../../packages/core/src/index.ts
var init_src = __esm({
  "../../packages/core/src/index.ts"() {
    "use strict";
    init_ids();
    init_hash();
    init_frontmatter();
    init_lint();
    init_categories();
    init_protocol();
    init_state();
    init_render();
    init_tar();
    init_github();
    init_diff();
    init_totp();
  }
});

// src/ui/errors.ts
var CliError, init_errors = __esm({
  "src/ui/errors.ts"() {
    "use strict";
    CliError = class extends Error {
      constructor(message2, code = 1, hint) {
        super(message2);
        this.code = code;
        this.hint = hint;
      }
      code;
      hint;
    };
  }
});

// src/args.ts
import { homedir } from "node:os";
import { sep } from "node:path";
function parseArgs(argv2, booleans = BOOLEAN_FLAGS) {
  let positionals = [], flags = {};
  for (let index = 0; index < argv2.length; index++) {
    let arg = SHORT[argv2[index]] ?? argv2[index];
    if (arg === "--") {
      positionals.push(...argv2.slice(index + 1));
      break;
    }
    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }
    let [name, inline] = arg.slice(2).split(/=(.*)/s);
    if (name.startsWith("no-")) flags[name.slice(3)] = !1;
    else if (inline !== void 0) flags[name] = inline;
    else if (booleans.includes(name)) flags[name] = !0;
    else {
      let value = argv2[index + 1];
      if (value === void 0 || value.startsWith("--")) throw new CliError(`--${name} needs a value.`, 2);
      flags[name] = value, index++;
    }
  }
  return { command: positionals.shift() ?? "", positionals, flags };
}
function str(flags, name) {
  let value = flags[name];
  return typeof value == "string" ? value : void 0;
}
function tildify(path) {
  let home = homedir();
  return home && (path === home || path.startsWith(home + sep)) ? "~" + path.slice(home.length) : path;
}
var VERSION, DEFAULT_SERVER, SHORT, BOOLEAN_FLAGS, CLI, init_args = __esm({
  "src/args.ts"() {
    "use strict";
    init_errors();
    VERSION = "0.7.0", DEFAULT_SERVER = "https://skillify.yogan.dev", SHORT = { "-h": "--help", "-q": "--quiet", "-y": "--yes", "-v": "--version" }, BOOLEAN_FLAGS = [
      "help",
      "version",
      "json",
      "quiet",
      "yes",
      "input",
      "color",
      "browser",
      "dry-run",
      "force",
      "check",
      "verbose",
      "with-token",
      "device",
      "hooks",
      "install",
      "remove"
    ];
    CLI = "skillify";
  }
});

// src/fsafe.ts
import { randomBytes } from "node:crypto";
import { lstatSync, mkdirSync, readFileSync, realpathSync, renameSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve, sep as sep2 } from "node:path";
function lstat(path) {
  try {
    return lstatSync(path);
  } catch {
    return null;
  }
}
function realOf(path) {
  let dir = path;
  for (; !lstat(dir) && dir !== dirname(dir); ) dir = dirname(dir);
  return join(realpathSync(dir), relative(dir, path));
}
function resolveInside(root, path, { followFinal = !0 } = {}) {
  let base = resolve(root), abs = resolve(base, path);
  if (!within(base, abs)) throw new UnsafePathError(path, root);
  let real, target;
  try {
    real = realOf(base), target = join(realOf(dirname(abs)), basename(abs));
  } catch {
    throw new UnsafePathError(path, root);
  }
  if (!within(real, target)) throw new UnsafePathError(path, root);
  if (lstat(target)?.isSymbolicLink() && followFinal) {
    let resolved;
    try {
      resolved = realpathSync(target);
    } catch {
      throw new UnsafePathError(path, root);
    }
    if (!within(real, resolved)) throw new UnsafePathError(path, root);
    return resolved;
  }
  return target;
}
function writeFileInside(root, path, content, options = {}) {
  let target = resolveInside(root, path);
  mkdirSync(dirname(target), { recursive: !0, mode: options.dirMode }), target = resolveInside(root, path);
  let temp = tempName(target);
  writeFileSync(temp, content, { flag: "wx", mode: options.mode ?? 420 });
  try {
    renameSync(temp, target);
  } catch (error) {
    throw rmSync(temp, { force: !0 }), error;
  }
}
function removeInside(root, path) {
  let target = resolveInside(root, path, { followFinal: !1 }), stats = lstat(target);
  stats && (stats.isSymbolicLink() || !stats.isDirectory() ? unlinkSync(target) : rmSync(target, { recursive: !0, force: !0 }));
}
function replaceDirInside(root, path, files2) {
  let target = resolveInside(root, path);
  mkdirSync(dirname(target), { recursive: !0 }), target = resolveInside(root, path);
  let staging = tempName(target);
  mkdirSync(staging);
  try {
    for (let file of files2) {
      let out = join(staging, ...file.path.split("/"));
      if (!within(staging, out) || out === staging) throw new UnsafePathError(file.path, staging);
      mkdirSync(dirname(out), { recursive: !0 }), writeFileSync(out, file.content, { flag: "wx" });
    }
    let old = lstat(target) ? tempName(target) : null;
    old && renameSync(target, old), renameSync(staging, target), old && rmSync(old, { recursive: !0, force: !0 });
  } catch (error) {
    throw rmSync(staging, { recursive: !0, force: !0 }), error;
  }
}
function readInside(root, path) {
  let target;
  try {
    target = resolveInside(root, path);
  } catch {
    return null;
  }
  try {
    return readFileSync(target, "utf8");
  } catch {
    return null;
  }
}
var UnsafePathError, within, tempName, toPosix, init_fsafe = __esm({
  "src/fsafe.ts"() {
    "use strict";
    UnsafePathError = class extends Error {
      constructor(path, root) {
        super(`Refusing to touch ${path}: it resolves outside ${root}.`);
        this.path = path;
        this.root = root;
      }
      path;
      root;
    };
    within = (root, path) => {
      let rel = relative(root, path);
      return rel === "" || !rel.startsWith("..") && !isAbsolute(rel);
    };
    tempName = (path) => join(dirname(path), `.${basename(path)}.skillify-${randomBytes(6).toString("hex")}.tmp`);
    toPosix = (path) => path.split(sep2).join("/");
  }
});

// src/settings.ts
import { readFileSync as readFileSync2 } from "node:fs";
import { homedir as homedir2 } from "node:os";
import { join as join2 } from "node:path";
function configDir(env = process.env) {
  return join2(env.XDG_CONFIG_HOME || join2(homedir2(), ".config"), "skillify");
}
function readSettings(env = process.env) {
  try {
    let parsed = JSON.parse(readFileSync2(settingsPath(env), "utf8"));
    return parsed && typeof parsed == "object" ? parsed : {};
  } catch {
    return {};
  }
}
function saveSettings(patch, env = process.env) {
  let dir = configDir(env), next = { ...readSettings(env), ...patch };
  writeFileInside(dir, settingsPath(env), JSON.stringify(next, null, 2) + `
`, { mode: 384, dirMode: 448 });
}
function normalizeServer(raw) {
  try {
    let url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
    return url.origin;
  } catch {
    throw new CliError(`"${raw}" isn't a Skillify address.`, 2, "Pass one like --server https://skillify.example.com");
  }
}
function resolveServerWithSource(flag, env = process.env) {
  if (flag) return { server: normalizeServer(flag), source: "--server" };
  if (env.SKILLIFY_SERVER) return { server: normalizeServer(env.SKILLIFY_SERVER), source: "SKILLIFY_SERVER" };
  let saved = readSettings(env).server;
  return saved ? { server: normalizeServer(saved), source: "settings" } : { server: normalizeServer(DEFAULT_SERVER), source: "default" };
}
var settingsPath, resolveServer, init_settings = __esm({
  "src/settings.ts"() {
    "use strict";
    init_args();
    init_fsafe();
    init_errors();
    settingsPath = (env = process.env) => join2(configDir(env), "settings.json");
    resolveServer = (flag, env = process.env) => resolveServerWithSource(flag, env).server;
  }
});

// src/credentials.ts
import { chmodSync, readFileSync as readFileSync3 } from "node:fs";
import { join as join3 } from "node:path";
function read() {
  try {
    let parsed = JSON.parse(readFileSync3(credentialsPath(), "utf8"));
    return parsed?.servers ? parsed : { servers: {} };
  } catch {
    return { servers: {} };
  }
}
function tokenFor(server) {
  let origin = key(server), envToken = process.env.SKILLIFY_TOKEN;
  if (envToken && origin === trustedEnvOrigin()) return { token: envToken, source: "SKILLIFY_TOKEN" };
  let saved = read().servers[origin];
  return saved ? { token: saved.token, source: credentialsPath(), email: saved.email } : null;
}
function envTokenIgnored(server) {
  return !process.env.SKILLIFY_TOKEN || key(server) === trustedEnvOrigin() ? null : `SKILLIFY_TOKEN is only sent to ${trustedEnvOrigin()}. This command is talking to ${key(server)}; set SKILLIFY_SERVER=${key(server)} if you trust it, or run \`${CLI} login\`.`;
}
function trustedEnvOrigin() {
  let configured = process.env.SKILLIFY_SERVER;
  try {
    return new URL(configured || DEFAULT_SERVER).origin;
  } catch {
    return DEFAULT_SERVER;
  }
}
function saveToken(server, token, email) {
  let creds = read();
  creds.servers[key(server)] = { token, email }, write(creds);
}
function savedToken(server) {
  return read().servers[key(server)] ?? null;
}
function removeToken(server) {
  let creds = read(), saved = creds.servers[key(server)];
  return saved ? (delete creds.servers[key(server)], write(creds), { email: saved.email }) : null;
}
function write(creds) {
  let path = credentialsPath();
  writeFileInside(configDir(), path, JSON.stringify(creds, null, 2) + `
`, { mode: 384, dirMode: 448 }), chmodSync(path, 384);
}
var credentialsPath, key, init_credentials = __esm({
  "src/credentials.ts"() {
    "use strict";
    init_args();
    init_fsafe();
    init_settings();
    credentialsPath = () => join3(configDir(), "credentials.json");
    key = (server) => new URL(server).origin;
  }
});

// src/git.ts
import { readFileSync as readFileSync4 } from "node:fs";
import { dirname as dirname2, isAbsolute as isAbsolute2, join as join4, resolve as resolve2 } from "node:path";
function findGitRoot(from) {
  for (let dir = resolve2(from), up = ""; dir !== up; up = dir, dir = dirname2(dir))
    if (lstat(join4(dir, ".git"))) return dir;
  return null;
}
function gitDir(root) {
  let dotGit = join4(root, ".git"), stats = lstat(dotGit);
  if (!stats) return null;
  if (stats.isDirectory()) return dotGit;
  let pointer = /^gitdir:\s*(.+?)\s*$/m.exec(read2(dotGit) ?? "")?.[1];
  return pointer ? resolve2(root, pointer) : null;
}
function commonDir(dir) {
  let common = read2(join4(dir, "commondir"))?.trim();
  return common ? isAbsolute2(common) ? common : resolve2(dir, common) : dir;
}
function originUrl(config) {
  let section2 = "";
  for (let raw of config.split(/\r?\n/)) {
    let line = raw.trim();
    if (!line || line.startsWith("#") || line.startsWith(";")) continue;
    let header = /^\[\s*([^\s\]"]+)(?:\s+"([^"]*)")?\s*\]$/.exec(line);
    if (header) {
      section2 = `${header[1].toLowerCase()}${header[2] !== void 0 ? ` ${header[2]}` : ""}`;
      continue;
    }
    if (section2 !== "remote origin") continue;
    let pair = /^url\s*=\s*(.*)$/i.exec(line);
    if (pair) return pair[1].replace(/^"(.*)"$/, "$1").trim();
  }
}
function parseGitHubRemote(url) {
  if (!url) return;
  let match = /^(?:https?|ssh|git|git\+ssh):\/\/(?:[^@/]+@)?(?:www\.)?github\.com(?::\d+)?\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/i.exec(url.trim()) ?? /^(?:[^@/]+@)?github\.com:\/?([^/]+)\/([^/]+?)(?:\.git)?\/?$/i.exec(url.trim());
  if (!match) return;
  let [owner, name] = [match[1], match[2]];
  if (!(!/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(name)))
    return `${owner}/${name}`.toLowerCase();
}
function remoteRepo(root) {
  let dir = gitDir(root);
  if (!dir) return;
  let config = read2(join4(commonDir(dir), "config")) ?? read2(join4(dir, "config"));
  return config ? parseGitHubRemote(originUrl(config)) : void 0;
}
function headInfo(root) {
  let dir = gitDir(root);
  if (!dir) return {};
  let head = read2(join4(dir, "HEAD"))?.trim();
  if (!head) return {};
  let ref = /^ref:\s*(\S+)$/.exec(head)?.[1];
  if (!ref) return /^[0-9a-f]{40,64}$/.test(head) ? { commit: head } : {};
  let branch = ref.replace(/^refs\/heads\//, ""), common = commonDir(dir), commit = read2(join4(dir, ref))?.trim() ?? read2(join4(common, ref))?.trim();
  return commit || (commit = (read2(join4(common, "packed-refs")) ?? "").split(`
`).find((line) => line.endsWith(` ${ref}`))?.split(" ")[0]), { branch, commit: commit && /^[0-9a-f]{40,64}$/.test(commit) ? commit : void 0 };
}
function detectRepo(root, given, env = process.env) {
  if (given) return given.toLowerCase();
  let remote = remoteRepo(root);
  if (remote) return remote;
  let ci = env.GITHUB_REPOSITORY;
  return ci && REPO.test(ci) ? ci.toLowerCase() : void 0;
}
var read2, findRoot, REPO, isRepoName, init_git = __esm({
  "src/git.ts"() {
    "use strict";
    init_fsafe();
    read2 = (path) => {
      try {
        return readFileSync4(path, "utf8");
      } catch {
        return null;
      }
    };
    findRoot = (cwd = process.cwd()) => findGitRoot(cwd) ?? resolve2(cwd);
    REPO = /^[\w.-]+\/[\w.-]+$/, isRepoName = (value) => REPO.test(value);
  }
});

// src/hook/detect.ts
function detectAgent(payload) {
  if ("cursor_version" in payload || Array.isArray(payload.workspace_roots)) return "cursor";
  if ("toolName" in payload || "toolArgs" in payload) return "copilot";
  if (payload.agent === "opencode" && typeof payload.skill == "string") return payload.agent;
  let tool = payload.tool_name;
  return tool === "Skill" ? "claude-code" : tool === "activate_skill" ? "gemini-cli" : tool === "skill" ? "devin" : "turn_id" in payload && (tool === "Bash" || payload.hook_event_name === "UserPromptSubmit") ? "codex" : null;
}
function cleanName(raw) {
  if (typeof raw != "string") return null;
  let name = raw.trim().replace(/^\//, "").split(/\s/)[0].toLowerCase();
  return name.length <= 64 && NAME.test(name) ? name : null;
}
function skillFromCommand(command) {
  let text = Array.isArray(command) ? command.filter((c) => typeof c == "string").join(" ") : str2(command);
  if (!text || text.length > 4e3 || !READS.test(text)) return null;
  let found = /* @__PURE__ */ new Map();
  for (let match of text.matchAll(SKILL_FILE)) found.set(match[2], { skill: match[2], path: match[1] });
  return found.size === 1 ? [...found.values()][0] : null;
}
function skillsFromPrompt(prompt) {
  let text = str2(prompt);
  if (!text) return [];
  let names = /* @__PURE__ */ new Set();
  for (let match of text.slice(0, 2e4).matchAll(/(?:^|[\s(])\$([a-z0-9]+(?:-[a-z0-9]+)*)(?=$|[\s.,;:!?)])/g)) names.add(match[1]);
  return [...names].slice(0, 10).map((skill) => ({ skill }));
}
function readUse(payload, flagAgent) {
  if (!payload || typeof payload != "object" || Array.isArray(payload)) return null;
  let p = payload, agent = detectAgent(p);
  if (!agent || !isCounted(agent) || flagAgent && flagAgent !== agent) return null;
  let input = p.tool_input && typeof p.tool_input == "object" ? p.tool_input : {}, cwd = str2(p.cwd), one = (raw) => {
    let skill = cleanName(raw);
    return skill ? [{ skill }] : [];
  }, candidates = [];
  switch (agent) {
    case "claude-code":
      candidates = one(input.skill ?? input.command ?? input.name);
      break;
    case "gemini-cli":
      candidates = one(input.name);
      break;
    case "devin":
      candidates = one(input.skill ?? input.name ?? input.id ?? input.skill_name);
      break;
    case "opencode":
      candidates = one(p.skill);
      break;
    case "codex": {
      let fromCommand = p.tool_name === "Bash" ? skillFromCommand(input.command) : null;
      candidates = fromCommand ? [fromCommand] : p.hook_event_name === "UserPromptSubmit" ? skillsFromPrompt(p.prompt) : [];
      break;
    }
  }
  return candidates.length ? { agent, candidates, cwd, turn: agent === "codex" ? `${str2(p.session_id) ?? ""}:${str2(p.turn_id) ?? ""}` : void 0 } : null;
}
var COUNTED, isCounted, NAME, str2, READS, SKILL_FILE, init_detect = __esm({
  "src/hook/detect.ts"() {
    "use strict";
    COUNTED = /* @__PURE__ */ new Set(["claude-code", "gemini-cli", "opencode", "devin", "codex"]), isCounted = (agent) => COUNTED.has(agent), NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/, str2 = (value) => typeof value == "string" ? value : void 0;
    READS = /(?:^|[\s;&|(`'"])(?:cat|sed|head|tail|less|more|bat|nl|awk|view|Get-Content|gc|type)\s/, SKILL_FILE = /(?:^|[\s'"=(:])((?:[^\s'"=(:;|&]*\/)?(?:\.agents|\.claude)\/skills\/([a-z0-9]+(?:-[a-z0-9]+)*)\/SKILL\.md)(?=$|[\s'";|&)`])/g;
  }
});

// src/hook/run.ts
var run_exports = {};
__export(run_exports, {
  HOOK_BUDGET_MS: () => HOOK_BUDGET_MS,
  existsInRepo: () => existsInRepo,
  prepareReport: () => prepareReport,
  runHook: () => runHook
});
import { mkdirSync as mkdirSync2, readFileSync as readFileSync5 } from "node:fs";
import { homedir as homedir3 } from "node:os";
import { join as join5, resolve as resolve3 } from "node:path";
function readStdin() {
  return new Promise((done) => {
    let input = process.stdin;
    if (input.isTTY) return done("");
    let chunks = [], size = 0;
    input.on("data", (chunk) => {
      if (size += chunk.length, size > STDIN_LIMIT)
        return input.destroy(), done("");
      chunks.push(chunk);
    }), input.on("end", () => done(Buffer.concat(chunks).toString("utf8"))), input.on("error", () => done(""));
  });
}
function existsInRepo(root, candidate, cwd) {
  for (let dir of Object.values(TARGET_DIRS)) {
    let file = `${dir}/${candidate.skill}/SKILL.md`;
    if (!(candidate.path && resolve3(cwd, candidate.path) !== resolve3(root, file)))
      try {
        if (lstat(resolveInside(root, file))?.isFile()) return !0;
      } catch {
      }
  }
  return !1;
}
function firstInTurn(use, skills, env) {
  if (!use.turn || use.turn === ":") return skills;
  let dir = join5(env.XDG_CACHE_HOME || join5(homedir3(), ".cache"), "skillify"), file = join5(dir, "hook-seen.json"), seen = [];
  try {
    let parsed = JSON.parse(readFileSync5(file, "utf8"));
    Array.isArray(parsed) && (seen = parsed.filter((s) => typeof s == "string"));
  } catch {
  }
  let fresh = skills.filter((skill) => !seen.includes(`${use.turn}:${skill}`));
  if (fresh.length)
    try {
      mkdirSync2(dir, { recursive: !0, mode: 448 }), writeFileInside(dir, file, JSON.stringify([...seen, ...fresh.map((s) => `${use.turn}:${s}`)].slice(-200)), { mode: 384 });
    } catch {
    }
  return fresh;
}
function prepareReport(payload, flagAgent, env = process.env, fallbackCwd = process.cwd()) {
  let use = readUse(payload, flagAgent);
  if (!use) return null;
  let cwd = use.cwd ?? env.DEVIN_PROJECT_DIR ?? env.GEMINI_PROJECT_DIR ?? env.CLAUDE_PROJECT_DIR ?? fallbackCwd, root = findGitRoot(cwd);
  if (!root) return null;
  let skills = [...new Set(use.candidates.filter((c) => existsInRepo(root, c, cwd)).map((c) => c.skill))];
  if (!skills.length) return null;
  let repo = detectRepo(root, void 0, env);
  if (!repo) return null;
  let server = resolveServer(void 0, env), token = tokenFor(server)?.token;
  if (!token || (skills = firstInTurn(use, skills, env), !skills.length)) return null;
  let at = (/* @__PURE__ */ new Date()).toISOString();
  return { report: { repo, events: skills.map((skill) => ({ skill, agent: use.agent, at })) }, server, token, use };
}
async function runHook(argv2) {
  setTimeout(() => process.exit(0), HOOK_BUDGET_MS).unref();
  try {
    let at = argv2.indexOf("--agent"), flag = at >= 0 ? argv2[at + 1] : argv2.find((a) => a.startsWith("--agent="))?.slice(8), text = await readStdin(), prepared = prepareReport(JSON.parse(text || "{}"), flag);
    if (!prepared) return;
    await (await fetch(new URL("/api/v1/usage", prepared.server), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${prepared.token}`, "User-Agent": `skillify-hook/${VERSION}` },
      body: JSON.stringify(prepared.report),
      signal: AbortSignal.timeout(HOOK_BUDGET_MS - 300)
    })).body?.cancel().catch(() => {
    });
  } catch {
  }
}
var HOOK_BUDGET_MS, STDIN_LIMIT, init_run = __esm({
  "src/hook/run.ts"() {
    "use strict";
    init_src();
    init_args();
    init_credentials();
    init_fsafe();
    init_git();
    init_settings();
    init_detect();
    HOOK_BUDGET_MS = 1500, STDIN_LIMIT = 1024 * 1024;
  }
});

// src/ui/term.ts
function supportsUnicode(env, platform) {
  return env.TERM === "dumb" ? !1 : platform !== "win32" ? env.TERM !== "linux" : !!(env.WT_SESSION || env.TERMINUS_SUBLIME || env.ConEmuTask === "{cmd::Cmder}" || env.TERM_PROGRAM === "vscode" || env.TERM === "xterm-256color" || env.TERM === "alacritty" || env.TERMINAL_EMULATOR === "JetBrains-JediTerm");
}
function depth(env) {
  return env.COLORTERM === "truecolor" || env.COLORTERM === "24bit" ? 24 : /256/.test(env.TERM ?? "") ? 8 : 4;
}
function createTerm(options = {}) {
  let env = options.env ?? process.env, out = options.out ?? process.stdout, err = options.err ?? process.stderr, input = options.input ?? process.stdin, platform = options.platform ?? process.platform, tty = !!out.isTTY, ci = !!env.CI && env.CI !== "false" && env.CI !== "0", dumb = env.TERM === "dumb", noColor = !!env.NO_COLOR || options.color === !1, forced = !!env.FORCE_COLOR && env.FORCE_COLOR !== "0", rich = tty && !ci && !dumb && !noColor;
  return {
    out,
    err,
    input,
    color: forced || rich,
    unicode: supportsUnicode(env, platform),
    rich,
    interactive: !!input.isTTY && tty && !options.noInput,
    colorDepth: depth(env),
    quiet: !!options.quiet || !!options.json,
    json: !!options.json,
    env,
    platform
  };
}
function term() {
  return current ??= createTerm();
}
function configureTerm(options = {}) {
  return current = createTerm(options), current;
}
function columns() {
  let c = term().out.columns;
  return c && c > 20 ? c : 80;
}
var current, init_term = __esm({
  "src/ui/term.ts"() {
    "use strict";
    current = null;
  }
});

// src/ui/style.ts
function accent(text) {
  let t = term();
  return t.color ? `\x1B[${t.colorDepth === 24 ? "38;2;139;108;255" : t.colorDepth === 8 ? "38;5;99" : "35"}m${text}\x1B[39m` : String(text);
}
function badge(text) {
  let t = term();
  return t.color ? `\x1B[${t.colorDepth === 24 ? "48;2;139;108;255" : t.colorDepth === 8 ? "48;5;99" : "45"};97;1m ${text} \x1B[0m` : text;
}
function truncate(text, size) {
  return width(text) <= size ? text : [...strip(text)].slice(0, Math.max(0, size - 1)).join("") + (term().unicode ? "\u2026" : ".");
}
var sgr, bold, dim, italic, underline, inverse, strike, red, green, yellow, blue, magenta, cyan, gray, ANSI, strip, width, pad, u, S, spinnerFrames, init_style = __esm({
  "src/ui/style.ts"() {
    "use strict";
    init_term();
    sgr = (open3, close) => (text) => term().color ? `\x1B[${open3}m${text}\x1B[${close}m` : String(text), bold = sgr("1", "22"), dim = sgr("2", "22"), italic = sgr("3", "23"), underline = sgr("4", "24"), inverse = sgr("7", "27"), strike = sgr("9", "29"), red = sgr("31", "39"), green = sgr("32", "39"), yellow = sgr("33", "39"), blue = sgr("34", "39"), magenta = sgr("35", "39"), cyan = sgr("36", "39"), gray = sgr("90", "39");
    ANSI = /\x1b\[[0-9;?]*[A-Za-z]/g, strip = (text) => text.replace(ANSI, ""), width = (text) => [...strip(text)].length, pad = (text, size) => text + " ".repeat(Math.max(0, size - width(text)));
    u = (unicode, ascii) => () => term().unicode ? unicode : ascii, S = {
      barStart: u("\u250C", "T"),
      bar: u("\u2502", "|"),
      barEnd: u("\u2514", "-"),
      barH: u("\u2500", "-"),
      connect: u("\u251C", "+"),
      cornerTR: u("\u256E", "+"),
      cornerBR: u("\u256F", "+"),
      cornerTL: u("\u256D", "+"),
      cornerBL: u("\u2570", "+"),
      active: u("\u25C6", "*"),
      submit: u("\u25C7", "o"),
      cancel: u("\u25A0", "x"),
      errorStep: u("\u25A0", "x"),
      warn: u("\u25B2", "!"),
      info: u("\u25CF", "*"),
      radioOn: u("\u25CF", ">"),
      radioOff: u("\u25CB", " "),
      checkOn: u("\u25FC", "[x]"),
      checkOff: u("\u25FB", "[ ]"),
      mask: u("\u25AA", "*"),
      tick: u("\u2713", "ok"),
      cross: u("\u2717", "x"),
      bullet: u("\u2022", "-"),
      arrow: u("\u2192", "->"),
      ellipsis: u("\u2026", "..."),
      dot: u("\xB7", "-"),
      minus: u("\u2212", "-")
    }, spinnerFrames = () => term().unicode ? ["\u25D2", "\u25D0", "\u25D3", "\u25D1"] : ["-", "\\", "|", "/"];
  }
});

// src/ui/log.ts
function write2(text) {
  term().out.write(text);
}
function writeLine(text = "") {
  term().out.write(text + `
`);
}
function body(lines2, symbol, color = (s) => s, gap = !0) {
  term().rich ? (gap && writeLine(dim(S.bar())), lines2.forEach((text, i) => writeLine(`${i === 0 ? color(symbol) : dim(S.bar())}  ${text}`))) : lines2.forEach((text, i) => writeLine(i === 0 ? `${symbol} ${text}` : `  ${text}`));
}
function intro(title2, detail) {
  if (!show()) return;
  term().rich ? (writeLine(), writeLine(`${dim(S.barStart())}  ${badge("skillify")}  ${bold(title2)}${detail ? `  ${dim(detail)}` : ""}`), open = !0) : writeLine(`skillify ${title2}${detail ? ` ${S.dot()} ${detail}` : ""}`);
}
function outro(message2) {
  show() && (term().rich ? (writeLine(dim(S.bar())), writeLine(`${dim(S.barEnd())}  ${message2}`), writeLine(), open = !1) : writeLine(message2));
}
function success(message2) {
  show() && body(split(message2), term().rich ? S.submit() : S.tick(), green);
}
function info(message2) {
  show() && body(split(message2), term().rich ? S.info() : S.bullet(), cyan);
}
function warn(message2) {
  let t = term();
  if (t.json) return void t.err.write(`warning: ${split(message2).join(`
  `)}
`);
  body(split(message2), S.warn(), yellow);
}
function spacer() {
  show() && term().rich && writeLine(dim(S.bar()));
}
function check(state, label, fix) {
  let t = term();
  if (t.quiet && (state === "ok" || state === "skip")) return;
  let symbol = state === "ok" ? green(t.rich ? S.submit() : S.tick()) : state === "warn" ? yellow(S.warn()) : state === "fail" ? red(t.rich ? S.errorStep() : S.cross()) : dim(S.dot()), lines2 = [state === "skip" ? dim(label) : label];
  fix && lines2.push(dim(fix)), body(lines2, symbol, (s) => s, !1);
}
function message(lines2, { gap = !1 } = {}) {
  if (!show()) return;
  let t = term();
  t.rich && gap && writeLine(dim(S.bar()));
  for (let text of split(lines2)) writeLine((t.rich ? `${dim(S.bar())}  ${text}` : `  ${text}`).trimEnd());
}
function section(title2, lines2) {
  if (!show()) return;
  term().rich ? (writeLine(dim(S.bar())), writeLine(`${accent(S.active())}  ${bold(title2)}`)) : writeLine(title2), message(lines2);
}
function note(title2, lines2) {
  if (!show()) return;
  if (!term().rich) {
    writeLine(`${title2}:`);
    for (let text of lines2) writeLine(`  ${text}`);
    return;
  }
  let room = columns() - 6, inner = Math.max(width(title2) + 1, ...lines2.map(width)) + 2, rule = (n) => S.barH().repeat(Math.max(0, n));
  if (writeLine(dim(S.bar())), inner > room) {
    writeLine(`${green(S.submit())}  ${bold(title2)} ${dim(rule(Math.max(4, room - width(title2) - 1)))}`);
    for (let text of lines2) writeLine(`${dim(S.bar())}  ${text}`.trimEnd());
    writeLine(dim(`${S.connect()}${rule(Math.max(4, room + 2))}`));
    return;
  }
  writeLine(`${green(S.submit())}  ${bold(title2)} ${dim(rule(inner - width(title2) - 1) + S.cornerTR())}`), writeLine(`${dim(S.bar())}${" ".repeat(inner + 2)}${dim(S.bar())}`);
  for (let text of lines2) writeLine(`${dim(S.bar())}  ${pad(text, inner)}${dim(S.bar())}`);
  writeLine(`${dim(S.bar())}${" ".repeat(inner + 2)}${dim(S.bar())}`), writeLine(dim(`${S.connect()}${rule(inner + 2)}${S.cornerBR()}`));
}
function fail(message2, hint) {
  let t = term(), lines2 = split(message2);
  gutterOpen() ? (t.err.write(`${dim(S.bar())}
`), lines2.forEach((text, i) => t.err.write(`${i === 0 ? red(S.barEnd()) : " "}  ${i === 0 ? red(text) : text}
`)), hint && t.err.write(`   ${dim(hint)}
`), t.err.write(`
`), open = !1) : (lines2.forEach((text, i) => t.err.write(`${i === 0 ? red(`${S.cross()} ${text}`) : `  ${text}`}
`)), hint && t.err.write(`  ${dim(hint)}
`));
}
function table(rows, { gap = 2 } = {}) {
  let widths = [];
  for (let row of rows) row.forEach((cell, i) => widths[i] = Math.max(widths[i] ?? 0, width(cell)));
  return rows.map(
    (row) => row.map((cell, i) => i === row.length - 1 ? cell : pad(cell, widths[i])).join(" ".repeat(gap)).trimEnd()
  );
}
function duration(ms) {
  return ms < 6e4 ? `${(ms / 1e3).toFixed(1)}s` : `${Math.floor(ms / 6e4)}m ${Math.round(ms % 6e4 / 1e3)}s`;
}
var open, gutterOpen, show, split, plural, init_log = __esm({
  "src/ui/log.ts"() {
    "use strict";
    init_style();
    init_term();
    open = !1, gutterOpen = () => open && term().rich;
    show = () => !term().quiet;
    split = (message2) => Array.isArray(message2) ? message2 : message2.split(`
`);
    plural = (n, word, many = `${word}s`) => `${n} ${n === 1 ? word : many}`;
  }
});

// src/ui/task.ts
function cancelActiveTask() {
  if (!active) return !1;
  let { title: title2 } = active;
  return active.stop(), active = null, write2(`${CLEAR_LINE}${red(S.cancel())}  ${dim(title2)}
`), !0;
}
async function task(title2, fn, options = {}) {
  let t = term(), started = Date.now(), message2 = title2, counter = "", handle = {
    update: (next) => {
      message2 = next;
    },
    progress: (done, total) => {
      counter = total > 0 ? `${done}/${total}` : "";
    }
  }, elapsed = () => Date.now() - started, finalLine = (text) => {
    let ms = elapsed();
    return options.timing ?? ms >= 300 ? `${text}  ${dim(duration(ms))}` : text;
  }, animate = t.rich && !t.quiet, timer = null;
  if (animate) {
    let frames = spinnerFrames(), frame = 0, draw = () => {
      let secs = elapsed() >= 1e3 ? `  ${dim(duration(elapsed()))}` : "", line = `${accent(frames[frame++ % frames.length])}  ${message2}${dim(S.ellipsis())}${counter ? `  ${dim(counter)}` : ""}${secs}`;
      write2(CLEAR_LINE + truncate(line, columns() - 1));
    };
    options.compact || writeLine(dim(S.bar())), write2(HIDE_CURSOR), draw(), timer = setInterval(draw, t.unicode ? 80 : 120), timer.unref?.(), active = { title: title2, stop: () => (clearInterval(timer), write2(SHOW_CURSOR)) };
  }
  let finish = (line) => {
    timer ? (clearInterval(timer), active = null, write2(`${CLEAR_LINE}${line}
${SHOW_CURSOR}`)) : t.quiet || writeLine(line);
  };
  try {
    let result = await fn(handle), text = typeof options.done == "function" ? options.done(result) : options.done ?? title2, warned = options.outcome?.(result) === "warn", mark = warned ? yellow(S.warn()) : t.rich ? green(S.submit()) : S.tick();
    return finish(finalLine(t.rich ? `${mark}  ${text}` : `${warned ? S.warn() : S.tick()} ${text}`)), result;
  } catch (error) {
    let text = typeof options.failed == "function" ? options.failed(error) : options.failed ?? title2;
    throw (timer || !t.quiet) && finish(t.rich ? `${red(S.errorStep())}  ${text}` : `${S.cross()} ${text}`), error;
  }
}
var HIDE_CURSOR, SHOW_CURSOR, CLEAR_LINE, active, init_task = __esm({
  "src/ui/task.ts"() {
    "use strict";
    init_log();
    init_style();
    init_term();
    HIDE_CURSOR = "\x1B[?25l", SHOW_CURSOR = "\x1B[?25h", CLEAR_LINE = "\r\x1B[2K", active = null;
  }
});

// src/ui/prompts.ts
import { emitKeypressEvents } from "node:readline";
import { createInterface } from "node:readline/promises";
function refuse(common) {
  throw new CliError(`Can't ask "${common.message}" because this isn't an interactive terminal. ${common.instead}`, 2);
}
function run(engine, message2) {
  let t = term(), input = t.input, state = engine.state, error, drawn = 0, frame = (status2) => {
    let symbol = { active: accent(S.active()), submit: green(S.submit()), cancel: red(S.cancel()), error: yellow(S.warn()) }[status2], lines2 = [dim(S.bar()), `${symbol}  ${bold(message2)}`], bar = status2 === "error" ? yellow(S.bar()) : status2 === "active" ? accent(S.bar()) : dim(S.bar());
    for (let line of engine.render(state, status2)) lines2.push(`${bar}  ${line}`);
    return status2 === "active" && lines2.push(accent(S.barEnd())), status2 === "error" && lines2.push(`${yellow(S.barEnd())}  ${yellow(error ?? "")}`), lines2;
  }, paint = (status2) => {
    let lines2 = frame(status2), out = drawn ? `\x1B[${drawn}A\r\x1B[J` : "";
    t.out.write(out + lines2.join(`
`) + `
`), drawn = lines2.length;
  };
  return new Promise((resolve4, reject) => {
    let finish = (status2) => {
      paint(status2), input.off("keypress", onKey), input.setRawMode?.(!1), input.pause(), t.out.write(SHOW_CURSOR), status2 === "cancel" ? reject(new CancelError()) : resolve4(engine.value(state));
    }, onKey = (str3, key2 = {}) => {
      if (key2.ctrl && key2.name === "c" || key2.name === "escape") return finish("cancel");
      let next = engine.key(state, str3, key2);
      if ("state" in next && (state = next.state), next.submit)
        return error = engine.validate?.(state), error ? paint("error") : finish("submit");
      error && (error = void 0), paint("active");
    };
    emitKeypressEvents(input), input.setRawMode?.(!0), input.resume(), input.on("keypress", onKey), t.out.write(HIDE_CURSOR), paint("active");
  });
}
async function ask(question) {
  let t = term(), rl = createInterface({ input: t.input, output: t.out, terminal: !1 }), closed = !1, cancelled = new Promise((_, reject) => rl.once("close", () => closed ? void 0 : reject(new CancelError())));
  try {
    return (await Promise.race([rl.question(question), cancelled])).trim();
  } finally {
    closed = !0, rl.close();
  }
}
function optionLabel(option, active2, labelWidth) {
  let room = columns() - 10, label = truncate(option.label, room), fits = option.hint && Math.max(labelWidth, width(label)) + width(option.hint) + 2 <= room, text = active2 ? label : dim(label);
  return fits ? `${pad(text, labelWidth)}  ${dim(option.hint)}` : text;
}
async function select(options) {
  let t = term();
  t.interactive || refuse(options);
  let list = options.options;
  if (list.length === 0) throw new CliError(`Nothing to choose from for "${options.message}".`);
  let start = Math.max(0, list.findIndex((o) => o.value === options.initial));
  if (!t.rich)
    for (writeLine(options.message), list.forEach((o, i) => writeLine(`  ${i + 1}) ${o.label}${o.hint ? ` (${o.hint})` : ""}`)); ; ) {
      let answer = await ask(`Enter a number [${start + 1}]: `), index = answer === "" ? start : Number(answer) - 1;
      if (Number.isInteger(index) && list[index]) return list[index].value;
      writeLine(`Enter a number from 1 to ${list.length}.`);
    }
  let size = Math.max(3, Math.min(8, (t.out.rows ?? 24) - 6));
  return run(
    {
      state: start,
      render(cursor, status2) {
        if (status2 === "submit") return [dim(list[cursor].label)];
        if (status2 === "cancel") return [strike(dim(list[cursor].label))];
        let [from, to] = visibleWindow(list.length, cursor, size), lines2 = list.slice(from, to).map((o, i) => {
          let on = from + i === cursor;
          return `${on ? green(S.radioOn()) : dim(S.radioOff())} ${optionLabel(o, on, widest(list))}`;
        });
        return from > 0 && lines2.unshift(dim(`  ${S.ellipsis()} ${from} more`)), to < list.length && lines2.push(dim(`  ${S.ellipsis()} ${list.length - to} more`)), lines2;
      },
      key(cursor, _str, key2) {
        return key2.name === "up" || key2.name === "k" ? { state: (cursor - 1 + list.length) % list.length } : key2.name === "down" || key2.name === "j" || key2.name === "tab" ? { state: (cursor + 1) % list.length } : key2.name === "return" || key2.name === "enter" ? { submit: !0 } : {};
      },
      value: (cursor) => list[cursor].value
    },
    options.message
  );
}
async function confirm(options) {
  let t = term();
  t.interactive || refuse(options);
  let yes = options.yes ?? "Yes", no = options.no ?? "No", initial = options.initial ?? !0;
  if (!t.rich)
    for (; ; ) {
      let answer = (await ask(`${options.message} ${initial ? "(Y/n)" : "(y/N)"} `)).toLowerCase();
      if (answer === "") return initial;
      if (["y", "yes"].includes(answer)) return !0;
      if (["n", "no"].includes(answer)) return !1;
    }
  return run(
    {
      state: initial,
      render(value, status2) {
        if (status2 === "submit") return [dim(value ? yes : no)];
        if (status2 === "cancel") return [strike(dim(value ? yes : no))];
        let pick2 = (on, label) => on ? `${green(S.radioOn())} ${label}` : `${dim(S.radioOff())} ${dim(label)}`;
        return [`${pick2(value, yes)} ${dim("/")} ${pick2(!value, no)}`];
      },
      key(value, str3, key2) {
        return ["left", "right", "up", "down", "tab", "h", "l"].includes(key2.name ?? "") ? { state: !value } : str3?.toLowerCase() === "y" ? { state: !0, submit: !0 } : str3?.toLowerCase() === "n" ? { state: !1, submit: !0 } : key2.name === "return" || key2.name === "enter" ? { submit: !0 } : {};
      },
      value: (value) => value
    },
    options.message
  );
}
var CancelError, visibleWindow, widest, init_prompts = __esm({
  "src/ui/prompts.ts"() {
    "use strict";
    init_errors();
    init_log();
    init_style();
    init_task();
    init_term();
    CancelError = class extends CliError {
      constructor() {
        super("Cancelled.", 130);
      }
    };
    visibleWindow = (count2, cursor, size) => {
      if (count2 <= size) return [0, count2];
      let start = Math.min(Math.max(0, cursor - Math.floor(size / 2)), count2 - size);
      return [start, start + size];
    };
    widest = (list) => Math.max(0, ...list.map((o) => width(o.label)));
  }
});

// src/ui/index.ts
var init_ui = __esm({
  "src/ui/index.ts"() {
    "use strict";
    init_errors();
    init_log();
    init_prompts();
    init_style();
    init_task();
    init_term();
  }
});

// src/migrate.ts
function removeHooks(settings, isOurs) {
  if (!isObject(settings.hooks)) return { next: settings, removed: 0 };
  let removed = 0, hooks2 = {};
  for (let [event, groups] of Object.entries(settings.hooks)) {
    if (!Array.isArray(groups)) {
      hooks2[event] = groups;
      continue;
    }
    let kept = [];
    for (let group of groups) {
      if (!isObject(group) || !Array.isArray(group.hooks)) {
        kept.push(group);
        continue;
      }
      let handlers = group.hooks.filter((hook) => !isOurs(hook));
      removed += group.hooks.length - handlers.length, handlers.length === group.hooks.length ? kept.push(group) : handlers.length && kept.push({ ...group, hooks: handlers });
    }
    (kept.length || groups.length === 0) && (hooks2[event] = kept);
  }
  let next = { ...settings, hooks: hooks2 };
  return Object.keys(hooks2).length === 0 && Object.keys(settings.hooks).length > 0 && delete next.hooks, { next, removed };
}
function planLegacy(root) {
  let plan = { dir: !!lstat(`${root}/${LEGACY_DIR}`) }, text = readInside(root, LEGACY_SETTINGS);
  if (text === null) return plan;
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return /skillify\/(?:cli|hook)\.mjs/.test(text) && (plan.settingsProblem = `${LEGACY_SETTINGS} isn't valid JSON, so its old Skillify hook wasn't removed. Remove it by hand.`), plan;
  }
  if (!isObject(parsed)) return plan;
  let { next, removed } = removeHooks(parsed, isLegacyHook);
  return removed === 0 || (plan.settings = Object.keys(next).length === 0 ? null : JSON.stringify(next, null, 2) + `
`), plan;
}
var LEGACY_SETTINGS, normalize, LEGACY, isLegacyHook, isObject, hasLegacy, init_migrate = __esm({
  "src/migrate.ts"() {
    "use strict";
    init_src();
    init_fsafe();
    LEGACY_SETTINGS = ".claude/settings.json", normalize = (command) => command.replace(/["']/g, "").replace(/\$\{?CLAUDE_PROJECT_DIR\}?\//g, "").replace(/\s+/g, " ").trim(), LEGACY = new Set(LEGACY_HOOK_COMMANDS.map(normalize)), isLegacyHook = (hook) => typeof hook?.command == "string" && LEGACY.has(normalize(hook.command)), isObject = (value) => typeof value == "object" && value !== null && !Array.isArray(value);
    hasLegacy = (plan) => plan.dir || plan.settings !== void 0;
  }
});

// src/agents.ts
import { statSync } from "node:fs";
import { homedir as homedir4 } from "node:os";
import { join as join6 } from "node:path";
function readJson(dir, file) {
  if (!lstat(file)) return { value: null };
  let text = readInside(dir, file);
  if (text === null) return { value: null, problem: "links outside its config folder" };
  if (!text.trim()) return { value: {} };
  try {
    let value = JSON.parse(text);
    return isObject2(value) ? value.hooks !== void 0 && !isObject2(value.hooks) ? { value: null, problem: `"hooks" isn't an object` } : { value } : { value: null, problem: "isn't a JSON object" };
  } catch (error) {
    return { value: null, problem: `isn't valid JSON (${error.message})` };
  }
}
function withOurHooks(config, entries) {
  let { next } = removeHooks(config, isOurHook), hooks2 = isObject2(next.hooks) ? { ...next.hooks } : {};
  for (let entry of entries) {
    let groups = Array.isArray(hooks2[entry.event]) ? [...hooks2[entry.event]] : [];
    groups.push({ ...entry.matcher !== void 0 ? { matcher: entry.matcher } : {}, hooks: [entry.handler] }), hooks2[entry.event] = groups;
  }
  return { ...next, hooks: hooks2 };
}
function hasOurHooks(config, entries) {
  let hooks2 = isObject2(config.hooks) ? config.hooks : {}, ours = Object.values(hooks2).flatMap((groups) => Array.isArray(groups) ? groups : []).flatMap((g) => isObject2(g) && Array.isArray(g.hooks) ? g.hooks : []).filter(isOurHook);
  return ours.length === 0 ? "missing" : entries.every((entry) => (Array.isArray(hooks2[entry.event]) ? hooks2[entry.event] : []).some((g) => isObject2(g) && g.matcher === entry.matcher && Array.isArray(g.hooks) && g.hooks.some((h) => isObject2(h) && h.command === entry.handler.command))) && ours.length === entries.length ? "installed" : "outdated";
}
function agentStatus(agent, env = process.env, home = homedir4()) {
  let dir = agent.dir(env, home), file = agent.file(env, home);
  if (!lstat(dir)) return { agent, state: "no-agent", file };
  if (agent.kind === "plugin") {
    let text = readInside(dir, file);
    return { agent, file, state: text === null ? "missing" : text === agent.source ? "installed" : "outdated" };
  }
  let { value, problem } = readJson(dir, file);
  return problem ? { agent, state: "invalid", file, problem } : { agent, file, state: value ? hasOurHooks(value, agent.entries) : "missing" };
}
function installHook(agent, env = process.env, home = homedir4()) {
  let status2 = agentStatus(agent, env, home);
  if (status2.state === "no-agent" || status2.state === "invalid" || status2.state === "installed") return status2;
  let dir = agent.dir(env, home);
  if (agent.kind === "plugin") writeFileInside(dir, status2.file, agent.source);
  else {
    let { value } = readJson(dir, status2.file);
    writeFileInside(dir, status2.file, JSON.stringify(withOurHooks(value ?? {}, agent.entries), null, 2) + `
`);
  }
  return { ...status2, state: "installed" };
}
function removeHook(agent, env = process.env, home = homedir4()) {
  let status2 = agentStatus(agent, env, home);
  if (status2.state === "no-agent" || status2.state === "invalid" || status2.state === "missing") return status2;
  let dir = agent.dir(env, home);
  if (agent.kind === "plugin") removeInside(dir, status2.file);
  else {
    let { value } = readJson(dir, status2.file), { next } = removeHooks(value ?? {}, isOurHook);
    writeFileInside(dir, status2.file, JSON.stringify(next, null, 2) + `
`);
  }
  return { ...status2, state: "missing" };
}
function onPath(env = process.env) {
  let names = process.platform === "win32" ? ["skillify.cmd", "skillify.exe", "skillify"] : ["skillify"];
  for (let dir of (env.PATH ?? "").split(process.platform === "win32" ? ";" : ":"))
    if (dir)
      for (let name of names)
        try {
          if (statSync(join6(dir, name)).isFile()) return !0;
        } catch {
        }
  return !1;
}
var hookCommand, OURS, isOurHook, xdg, OPENCODE_PLUGIN, AGENTS, NOT_COUNTED, isObject2, allStatuses, init_agents = __esm({
  "src/agents.ts"() {
    "use strict";
    init_src();
    init_fsafe();
    init_migrate();
    hookCommand = (agent) => `skillify hook --agent ${agent}`, OURS = /(?:^|[\s/\\"'])skillify(?:\.mjs)?["']?\s+hook(?:\s|$)/, isOurHook = (hook) => typeof hook?.command == "string" && OURS.test(hook.command), xdg = (env, home) => env.XDG_CONFIG_HOME || join6(home, ".config"), OPENCODE_PLUGIN = `// Skillify usage hook, written by \`skillify hooks --install\`; \`skillify hooks --remove\` deletes it.
// When OpenCode loads a skill, this tells Skillify the skill name, repository and agent (never
// prompts or code) by running \`skillify hook\`, which only reports skills in the repository.
import { spawn } from 'node:child_process'

function report(skill, cwd) {
  if (typeof skill !== 'string' || !skill) return
  try {
    let child = spawn('skillify', ['hook', '--agent', 'opencode'], { cwd, stdio: ['pipe', 'ignore', 'ignore'], detached: true, shell: process.platform === 'win32' })
    child.on('error', () => {})
    child.stdin.on('error', () => {})
    child.stdin.end(JSON.stringify({ agent: 'opencode', skill, cwd }))
    child.unref()
  } catch {}
}

export default {
  id: 'skillify-usage',
  async setup(ctx) {
    let cwd = ctx.location?.directory
    await ctx.tool.hook('execute.after', (event) => {
      if (event.tool === 'skill' && event.status !== 'error') report(event.input?.id ?? event.input?.name, cwd)
    })
  },
  async server(input) {
    let cwd = input?.directory
    return {
      'tool.execute.before': async (info, output) => {
        if (info?.tool === 'skill') report(output?.args?.id ?? output?.args?.name, cwd)
      },
    }
  },
}
`, AGENTS = [
      {
        id: "claude-code",
        label: USAGE_AGENTS["claude-code"].label,
        dir: (env, home) => env.CLAUDE_CONFIG_DIR || join6(home, ".claude"),
        file: (env, home) => join6(env.CLAUDE_CONFIG_DIR || join6(home, ".claude"), "settings.json"),
        kind: "json",
        entries: [{ event: "PostToolUse", matcher: "Skill", handler: { type: "command", command: hookCommand("claude-code"), timeout: 5 } }]
      },
      {
        id: "gemini-cli",
        label: USAGE_AGENTS["gemini-cli"].label,
        dir: (_env, home) => join6(home, ".gemini"),
        file: (_env, home) => join6(home, ".gemini", "settings.json"),
        kind: "json",
        // Gemini's timeout is in milliseconds.
        entries: [{ event: "AfterTool", matcher: "^activate_skill$", handler: { name: "skillify-usage", type: "command", command: hookCommand("gemini-cli"), timeout: 5e3 } }]
      },
      {
        id: "codex",
        label: USAGE_AGENTS.codex.label,
        dir: (env, home) => env.CODEX_HOME || join6(home, ".codex"),
        file: (env, home) => join6(env.CODEX_HOME || join6(home, ".codex"), "hooks.json"),
        kind: "json",
        entries: [
          { event: "PostToolUse", matcher: "^Bash$", handler: { type: "command", command: hookCommand("codex"), timeout: 5, async: !0 } },
          { event: "UserPromptSubmit", handler: { type: "command", command: hookCommand("codex"), timeout: 5, async: !0 } }
        ],
        note: "Codex runs new hooks only after you approve them: open /hooks in Codex and trust Skillify's. Codex has no skill event, so its counts are estimates."
      },
      {
        id: "devin",
        label: USAGE_AGENTS.devin.label,
        dir: (env, home) => process.platform === "win32" && env.APPDATA ? join6(env.APPDATA, "devin") : join6(xdg(env, home), "devin"),
        file: (env, home) => join6(process.platform === "win32" && env.APPDATA ? join6(env.APPDATA, "devin") : join6(xdg(env, home), "devin"), "config.json"),
        kind: "json",
        entries: [{ event: "PostToolUse", matcher: "^skill$", handler: { type: "command", command: hookCommand("devin"), timeout: 5 } }]
      },
      {
        id: "opencode",
        label: USAGE_AGENTS.opencode.label,
        dir: (env, home) => join6(xdg(env, home), "opencode"),
        file: (env, home) => join6(xdg(env, home), "opencode", "plugins", "skillify-usage.js"),
        kind: "plugin",
        source: OPENCODE_PLUGIN
      }
    ], NOT_COUNTED = [
      ["Amp", "its skill tool isn't documented yet"],
      ["Cursor", "its hooks have no skill event"],
      ["GitHub Copilot", "its hooks have no skill event"]
    ], isObject2 = (value) => typeof value == "object" && value !== null && !Array.isArray(value);
    allStatuses = (env = process.env, home = homedir4()) => AGENTS.map((agent) => agentStatus(agent, env, home));
  }
});

// src/http.ts
function headersFor(auth = {}, json2 = !1) {
  let headers = { Accept: "application/json", "User-Agent": `skillify-cli/${VERSION}` };
  return auth.token && (headers.Authorization = `Bearer ${auth.token}`), json2 && (headers["Content-Type"] = "application/json"), headers;
}
function urlFor(server, path) {
  return new URL(path.replace(/^\//, ""), server.endsWith("/") ? server : server + "/");
}
async function request(server, path, options = {}) {
  let url = urlFor(server, path), response;
  try {
    response = await fetch(url, {
      method: options.method ?? (options.body === void 0 ? "GET" : "POST"),
      headers: headersFor(options.auth, options.body !== void 0),
      body: options.body === void 0 ? void 0 : JSON.stringify(options.body),
      signal: AbortSignal.timeout(options.timeoutMs ?? 3e4)
    });
  } catch (error2) {
    let inner = error2.cause, cause = error2.name === "TimeoutError" ? "timed out" : inner?.message || inner?.code || error2.message;
    throw new CliError(`Couldn't reach ${url.origin} (${cause}).`, 1, "Check the server address and your connection, then try again.");
  }
  let text = await response.text(), data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
  }
  if (response.ok) return { ok: !0, status: response.status, data, error: null };
  let error = data && typeof data == "object" ? data : null;
  return { ok: !1, status: response.status, data: null, error: error ?? { message: `${response.status} ${response.statusText}`.trim() } };
}
async function api(server, path, options = {}) {
  let response = await request(server, path, options);
  if (!response.ok) {
    let message2 = response.error?.message ?? `${response.status}`;
    throw new ApiError(`${new URL(server).host} said: ${message2}`, response.status, response.error?.error);
  }
  return response.data;
}
var ApiError, init_http = __esm({
  "src/http.ts"() {
    "use strict";
    init_args();
    init_errors();
    ApiError = class extends CliError {
      constructor(message2, status2, errorCode) {
        super(message2);
        this.status = status2;
        this.errorCode = errorCode;
      }
      status;
      errorCode;
    };
  }
});

// src/events.ts
import { randomBytes as randomBytes2 } from "node:crypto";
function createEvents(command, options = {}) {
  let session = randomBytes2(9).toString("base64url"), doFetch = options.fetch ?? ((...args) => fetch(...args)), timeoutMs = options.timeoutMs ?? 1500, now = options.now ?? Date.now, disabled = process.env.SKILLIFY_EVENTS === "0", destination = null, queue = [], chain = Promise.resolve(), lastProgress = 0, send = (event) => {
    let target = destination;
    chain = chain.then(async () => {
      try {
        let [owner, name] = target.repo.split("/"), url = urlFor(target.server, `/api/v1/repos/${encodeURIComponent(owner ?? "")}/${encodeURIComponent(name ?? "")}/events`);
        await (await doFetch(url, {
          method: "POST",
          headers: headersFor(target.auth, !0),
          body: JSON.stringify(event),
          signal: AbortSignal.timeout(timeoutMs)
        })).body?.cancel().catch(() => {
        });
      } catch {
      }
    });
  };
  return {
    session,
    target(target) {
      try {
        if (disabled || !target.repo.includes("/") || Object.keys(target.auth).length === 0) return;
        destination = target;
        for (let event of queue.splice(0)) send(event);
      } catch {
      }
    },
    emit(phase, details = {}) {
      try {
        if (disabled) return;
        let event = { session, command, phase, ...details, cliVersion: VERSION, at: new Date(now()).toISOString() };
        if (details.progress && phase === "step") {
          if (!(details.progress.done >= details.progress.total) && now() - lastProgress < (options.progressEveryMs ?? 250)) return;
          lastProgress = now();
        }
        destination ? send(event) : queue.length < 50 && queue.push(event);
      } catch {
      }
    },
    async flush(capMs = 1e3) {
      let timer;
      try {
        await Promise.race([chain, new Promise((resolve4) => timer = setTimeout(resolve4, capMs))]);
      } catch {
      } finally {
        clearTimeout(timer);
      }
    }
  };
}
function startEvents(command, options) {
  return current2 = createEvents(command, options), current2.emit("start"), current2;
}
var current2, currentEvents, init_events = __esm({
  "src/events.ts"() {
    "use strict";
    init_args();
    init_http();
    current2 = null;
    currentEvents = () => current2;
  }
});

// src/commands/common.ts
function needToken(server) {
  let found = tokenFor(server);
  if (found) return found.token;
  let ignored = envTokenIgnored(server);
  throw ignored ? new CliError(ignored) : new CliError(`You're not signed in to ${hostOf(server)}.`, 1, `Run ${CLI} login, or set SKILLIFY_TOKEN.`);
}
function repoFrom(args, root) {
  let given = str(args.flags, "repo") ?? args.positionals[0];
  if (given && !isRepoName(given)) throw new CliError(`"${given}" isn't owner/name.`, 2);
  return detectRepo(root, given);
}
function requireRepo(args, root, command) {
  let repo = repoFrom(args, root);
  if (!repo) throw new CliError("Couldn't tell which repository this is (no GitHub remote named origin).", 2, `Pass it: ${CLI} ${command} --repo owner/name`);
  return repo;
}
var resolveServer2, hostOf, init_common = __esm({
  "src/commands/common.ts"() {
    "use strict";
    init_args();
    init_credentials();
    init_git();
    init_settings();
    init_ui();
    resolveServer2 = (flags) => resolveServer(str(flags, "server")), hostOf = (server) => new URL(server).host;
  }
});

// src/paths.ts
function isSafeRelative(path) {
  return !path || path.length > 512 || path.startsWith("/") || path.includes("\\") || path.includes("\0") || /^[a-zA-Z]:/.test(path) ? !1 : path.split("/").every((part) => part !== "" && part !== "." && part !== "..");
}
var init_paths = __esm({
  "src/paths.ts"() {
    "use strict";
  }
});

// src/skills.ts
import { readdir, readFile } from "node:fs/promises";
import { join as join7, relative as relative2 } from "node:path";
function skillPath(target, slug) {
  if (!Object.hasOwn(TARGET_DIRS, target)) throw new Error(`Unknown install target "${target}".`);
  if (!SKILL_NAME.test(slug) || slug.length > 64) throw new Error(`"${slug}" isn't a skill name.`);
  return `${TARGET_DIRS[target]}/${slug}`;
}
async function files(dir, base = dir) {
  let entries = await readdir(dir, { withFileTypes: !0 });
  return (await Promise.all(
    entries.map(async (entry) => {
      let full = join7(dir, entry.name);
      return entry.isDirectory() ? files(full, base) : entry.isFile() ? [{ path: toPosix(relative2(base, full)), content: await readFile(full) }] : [];
    })
  )).flat();
}
async function hashDir(dir) {
  return (await hashFiles(await files(dir))).hash;
}
async function scanSkills(root, targets = TARGETS) {
  let skipped = [], jobs = [];
  for (let target of targets) {
    let base = TARGET_DIRS[target], dir;
    try {
      dir = resolveInside(root, base);
    } catch {
      lstat(join7(root, base)) && skipped.push({ path: base, reason: "links outside the repository" });
      continue;
    }
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: !0 });
    } catch {
      continue;
    }
    for (let entry of entries) {
      if (!SKILL_NAME.test(entry.name) || entry.name.length > 64) continue;
      let path = `${base}/${entry.name}`;
      jobs.push(
        (async () => {
          let real;
          try {
            real = resolveInside(root, path);
          } catch (error) {
            return error instanceof UnsafePathError && skipped.push({ path, reason: "links outside the repository" }), null;
          }
          return lstat(real)?.isDirectory() ? { slug: entry.name, target, hash: await hashDir(real) } : null;
        })()
      );
    }
  }
  let skills = (await Promise.all(jobs)).filter((s) => s !== null);
  return skills.sort((a, b) => a.slug.localeCompare(b.slug) || a.target.localeCompare(b.target)), { skills, skipped };
}
var TARGETS, init_skills = __esm({
  "src/skills.ts"() {
    "use strict";
    init_src();
    init_fsafe();
    TARGETS = Object.keys(TARGET_DIRS);
  }
});

// src/plan.ts
function claudeMdWithImport(root) {
  if (!lstat(`${root}/CLAUDE.md`)) return;
  try {
    if (resolveInside(root, "CLAUDE.md") === resolveInside(root, "AGENTS.md")) return;
  } catch {
    return;
  }
  let text = readInside(root, "CLAUDE.md");
  if (text === null || IMPORT_LINE.test(text)) return;
  let body2 = text.replace(/\s*$/, "");
  return body2 ? `${body2}

@AGENTS.md
` : `@AGENTS.md
`;
}
function decide(state, force) {
  switch (state) {
    case "behind":
    case "missing":
      return "write";
    case "edited":
      return force ? "write" : "keep";
    case "removed":
      return "delete";
    default:
      return "none";
  }
}
function planSync(root, bundle, state, options = {}) {
  let bySlug = new Map(bundle?.skills.map((s) => [s.slug, s])), skills = state.skills.map((row) => {
    let planned = { ...row, action: decide(row.state, !!options.force) };
    if (planned.action === "write" && bundle) {
      let skill = bySlug.get(row.slug), problem = skill ? skill.files.some((f) => !isSafeRelative(f.path)) ? "Skillify sent a file path outside the skill folder" : void 0 : "Skillify didn't send its files";
      problem && Object.assign(planned, { action: "none", problem });
    }
    return planned;
  }), existing = readInside(root, "AGENTS.md"), merged = bundle ? mergeAgentsMd(existing, bundle.agentsBlock) : existing;
  return {
    repo: state.repo,
    targets: state.targets,
    skills: skills.sort((a, b) => a.slug.localeCompare(b.slug) || a.target.localeCompare(b.target)),
    agentsMd: merged === existing || merged === null ? void 0 : merged,
    claudeMd: claudeMdWithImport(root),
    legacy: planLegacy(root),
    skipped: options.skipped ?? []
  };
}
function changedPaths(plan) {
  let paths = /* @__PURE__ */ new Set();
  plan.agentsMd !== void 0 && paths.add("AGENTS.md"), plan.claudeMd !== void 0 && paths.add("CLAUDE.md");
  for (let s of plan.skills) (s.action === "write" || s.action === "delete") && paths.add(TARGET_DIRS[s.target]);
  return plan.legacy.dir && paths.add(LEGACY_DIR), plan.legacy.settings !== void 0 && paths.add(LEGACY_SETTINGS), [...paths];
}
function applyPlan(root, bundle, plan, onSkill) {
  let bySlug = new Map(bundle.skills.map((s) => [s.slug, s])), failed = [], work = plan.skills.filter((s) => s.action === "write" || s.action === "delete");
  return work.forEach((row, index) => {
    onSkill?.(index + 1, work.length, row.slug);
    let path = skillPath(row.target, row.slug);
    try {
      row.action === "delete" ? removeInside(root, path) : replaceDirInside(root, path, bySlug.get(row.slug).files);
    } catch (error) {
      failed.push({ path, reason: error.message });
    }
  }), plan.agentsMd !== void 0 && writeFileInside(root, "AGENTS.md", plan.agentsMd), plan.claudeMd !== void 0 && writeFileInside(root, "CLAUDE.md", plan.claudeMd), plan.legacy.settings === null ? removeInside(root, LEGACY_SETTINGS) : plan.legacy.settings !== void 0 && writeFileInside(root, LEGACY_SETTINGS, plan.legacy.settings), plan.legacy.dir && removeInside(root, LEGACY_DIR), { failed };
}
var IMPORT_LINE, hasChanges, init_plan = __esm({
  "src/plan.ts"() {
    "use strict";
    init_src();
    init_fsafe();
    init_migrate();
    init_paths();
    init_skills();
    IMPORT_LINE = /^\s*@AGENTS\.md\s*$/m;
    hasChanges = (plan) => changedPaths(plan).length > 0;
  }
});

// src/present.ts
function version(row) {
  if (!row.version) return "";
  let v = `v${row.version}`;
  return row.pinned && (v += row.latestVersion && row.latestVersion > row.version ? ` pinned, v${row.latestVersion} out` : " pinned"), v;
}
function lines(rows, mark) {
  let bySlug = /* @__PURE__ */ new Map();
  for (let row of rows) bySlug.set(row.slug, [...bySlug.get(row.slug) ?? [], row]);
  return table([...bySlug.entries()].map(([slug, group]) => [mark, slug, dim(version(group[0])), dim(where(group))]));
}
function counts(plan) {
  let count2 = (state) => plan.skills.filter((s) => s.state === state).length;
  return {
    current: count2("current"),
    behind: count2("behind"),
    missing: count2("missing"),
    edited: count2("edited"),
    removed: count2("removed"),
    unmanaged: count2("unmanaged")
  };
}
function printPlan(plan, mode, { verbose = !1 } = {}) {
  let shown = 0;
  for (let group of GROUPS) {
    let rows = plan.skills.filter(group.match);
    if (!rows.length) continue;
    let slugs = new Set(rows.map((r) => r.slug)).size, body2 = lines(rows, group.mark());
    if (group.key === "edited" && body2.push(dim(mode === "status" ? `${CLI} sync keeps them; propose the edit in Skillify, or pass --force to replace them.` : "Propose the edit in Skillify, or pass --force to replace them.")), group.key === "problem") for (let row of rows) body2.push(dim(`${row.slug}: ${row.problem}`));
    section(group.title(slugs, mode), body2), shown++;
  }
  let current3 = plan.skills.filter((s) => s.state === "current"), own = plan.skills.filter((s) => s.state === "unmanaged"), quiet = [];
  if (current3.length) {
    let n = new Set(current3.map((r) => r.slug)).size;
    verbose ? section(`${plural(n, "skill")} up to date`, lines(current3, green(S.tick()))) : quiet.push(`${S.tick()} ${plural(n, "skill")} up to date`);
  }
  if (own.length) {
    let n = new Set(own.map((r) => r.slug)).size;
    verbose ? section(`${plural(n, "skill")} of your own, left alone`, lines(own, dim(S.dot()))) : quiet.push(`${S.dot()} ${plural(n, "skill")} of your own, left alone`);
  }
  let files2 = fileChanges(plan, mode);
  files2.length && section(mode === "done" ? "Also changed" : mode === "preview" ? "Will also change" : "Out of date", files2), quiet.length ? section(shown || files2.length ? "Unchanged" : "Nothing to change", quiet.map((q) => dim(q))) : !shown && !files2.length && section("Nothing to change", [dim("No skills are assigned to this repository yet.")]), plan.skipped.length && section("Left alone", plan.skipped.map((s) => `${yellow(S.warn())} ${s.path} ${dim(`(${s.reason})`)}`)), plan.legacy.settingsProblem && section("Check by hand", [`${yellow(S.warn())} ${plan.legacy.settingsProblem}`]);
}
function fileChanges(plan, mode) {
  let verb = (done, will, status2) => mode === "done" ? done : mode === "preview" ? will : status2, out = [];
  if (plan.agentsMd !== void 0 && out.push(["AGENTS.md", verb("updated the skills block", "update the skills block", "skills block is out of date")]), plan.claudeMd !== void 0 && out.push(["CLAUDE.md", verb("added an @AGENTS.md line", "add an @AGENTS.md line", "no @AGENTS.md line yet")]), plan.legacy.dir && out.push([`${LEGACY_DIR}/`, verb("removed (no longer used)", "remove (no longer used)", "no longer used; sync removes it")]), plan.legacy.settings !== void 0) {
    let gone = plan.legacy.settings === null;
    out.push([LEGACY_SETTINGS, verb(gone ? "removed the old usage hook (file was otherwise empty)" : "removed the old usage hook", "remove the old usage hook", "has the old usage hook; sync removes it")]);
  }
  return table(out.map(([path, what]) => [path, dim(what)]));
}
function commitCommand(plan, message2 = "Update agent skills") {
  let paths = changedPaths(plan);
  return paths.length ? `git add -A ${paths.join(" ")} && git commit -m "${message2}"` : null;
}
var GROUPS, where, needsAttention, init_present = __esm({
  "src/present.ts"() {
    "use strict";
    init_src();
    init_args();
    init_migrate();
    init_plan();
    init_ui();
    GROUPS = [
      {
        key: "behind",
        title: (n, m) => m === "done" ? `Updated ${plural(n, "skill")}` : m === "preview" ? `Will update ${plural(n, "skill")}` : `${plural(n, "skill")} behind`,
        mark: () => cyan(S.arrow()),
        match: (s) => s.state === "behind" && s.action === "write"
      },
      {
        key: "missing",
        title: (n, m) => m === "done" ? `Added ${plural(n, "skill")}` : m === "preview" ? `Will add ${plural(n, "skill")}` : `${plural(n, "skill")} not here yet`,
        mark: () => green("+"),
        match: (s) => s.state === "missing" && s.action === "write"
      },
      {
        key: "forced",
        title: (n, m) => m === "done" ? `Replaced ${plural(n, "edited skill")}` : `Will replace ${plural(n, "edited skill")}`,
        mark: () => yellow("~"),
        match: (s) => s.state === "edited" && s.action === "write"
      },
      {
        key: "removed",
        title: (n, m) => m === "done" ? `Removed ${plural(n, "skill")}` : m === "preview" ? `Will remove ${plural(n, "skill")}` : `${plural(n, "skill")} no longer assigned`,
        mark: () => red(S.minus()),
        match: (s) => s.action === "delete"
      },
      {
        key: "edited",
        title: (n, m) => m === "status" ? `${plural(n, "skill")} edited here` : m === "preview" ? `Will keep ${plural(n, "skill")} edited here` : `Kept ${plural(n, "skill")} edited here`,
        mark: () => yellow(S.warn()),
        match: (s) => s.state === "edited" && s.action === "keep"
      },
      {
        key: "problem",
        title: (n) => `${plural(n, "skill")} couldn't be written`,
        mark: () => red(S.cross()),
        match: (s) => !!s.problem
      }
    ], where = (rows) => [...new Set(rows.map((r) => TARGET_DIRS[r.target]))].join(", ");
    needsAttention = (plan) => plan.skills.some((s) => s.state !== "current" && s.state !== "unmanaged");
  }
});

// src/remote.ts
function repoPath(repo, suffix = "") {
  let [owner = "", name = ""] = repo.split("/");
  return `/api/v1/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}${suffix}`;
}
function fetchState(server, token, repo, root, skills, record) {
  let body2 = {
    skills: skills.map(({ slug, target, hash }) => ({ slug, target, hash })),
    ...headInfo(root),
    cliVersion: VERSION,
    record
  };
  return api(server, repoPath(repo, "/state"), { auth: { token }, body: body2, timeoutMs: 2e4 });
}
var fetchBundle, init_remote = __esm({
  "src/remote.ts"() {
    "use strict";
    init_args();
    init_git();
    init_http();
    fetchBundle = (server, token, repo) => api(server, repoPath(repo, "/bundle"), { auth: { token } });
  }
});

// src/commands/hooks.ts
function pick(flags) {
  let wanted = str(flags, "agent");
  if (!wanted) return AGENTS;
  let ids = wanted.split(",").map((s) => s.trim()), unknown = ids.filter((id) => !AGENTS.some((a) => a.id === id));
  if (unknown.length) throw new CliError(`Unknown agent ${unknown.join(", ")}.`, 2, `Use one of: ${AGENTS.map((a) => a.id).join(", ")}`);
  return AGENTS.filter((a) => ids.includes(a.id));
}
function printStatuses(statuses) {
  section(
    "Usage hooks",
    table(
      statuses.map((s) => [
        s.agent.label,
        LABEL[s.state](),
        dim(s.state === "invalid" ? `${tildify(s.file)} ${s.problem}` : s.state === "no-agent" ? "" : tildify(s.file))
      ])
    )
  ), message(dim(`Not counted: ${NOT_COUNTED.map(([name, why]) => `${name} (${why})`).join(", ")}.`));
}
function reportInstalled(results) {
  for (let r of results)
    r.state === "installed" ? success(`${r.agent.label} ${dim(tildify(r.file))}`) : r.state === "invalid" && warn([`Left ${r.agent.label} alone: ${tildify(r.file)} ${r.problem}.`, dim("Fix the file, then run skillify hooks --install.")]);
  for (let r of results) r.state === "installed" && r.agent.note && info(r.agent.note);
  results.some((r) => r.state === "installed") && !onPath() && warn(["skillify isn't on your PATH, so agents can't run the hook.", dim("Install it globally: npm install -g github:ryanyogan/skillify-cli")]);
}
function installAll(agents = AGENTS) {
  return agents.map((agent) => installHook(agent));
}
async function hooks(args) {
  let { flags } = args, agents = pick(flags);
  if (flags.install && flags.remove) throw new CliError("Pass --install or --remove, not both.", 2);
  if (intro("hooks", flags.install ? "install" : flags.remove ? "remove" : void 0), flags.install) {
    let before = agents.map((a) => agentStatus(a)), todo = before.filter((s) => s.state === "missing" || s.state === "outdated").map((s) => s.agent), results = installAll(todo);
    return term().json ? json({ installed: results.filter((r) => r.state === "installed").map((r) => r.agent.id), statuses: allStatuses().map(plain) }) : (reportInstalled([...results, ...before.filter((s) => s.state === "invalid")]), todo.length || info(before.some((s) => s.state === "installed") ? "Every agent found already has the hook." : "No supported agents found on this computer."), message(dim(PRIVACY), { gap: !0 }), outro(todo.length ? `Installed ${plural(results.filter((r) => r.state === "installed").length, "hook")}` : "Nothing to do"));
  }
  if (flags.remove) {
    let had = new Set(agents.filter((a) => ["installed", "outdated"].includes(agentStatus(a).state)).map((a) => a.id)), results = agents.map((a) => removeHook(a)), removed = results.filter((r) => had.has(r.agent.id) && r.state === "missing");
    if (term().json) return json({ statuses: allStatuses().map(plain) });
    for (let r of results) r.state === "invalid" && warn(`Left ${r.agent.label} alone: ${tildify(r.file)} ${r.problem}.`);
    return printStatuses(results), outro(removed.length ? "Removed the usage hooks" : "Nothing to do");
  }
  let statuses = agents.map((a) => agentStatus(a));
  if (term().json) return json({ statuses: statuses.map(plain), notCounted: NOT_COUNTED.map(([name]) => name) });
  printStatuses(statuses);
  let installable = statuses.filter((s) => s.state === "missing" || s.state === "outdated");
  message(dim(PRIVACY), { gap: !0 }), outro(installable.length ? `Run ${CLI} hooks --install to count uses from ${installable.map((s) => s.agent.label).join(", ")}` : "Nothing to do");
}
async function offerHooks(flags) {
  if (flags.hooks === !1) return;
  let todo = allStatuses().filter((s) => s.state === "missing" || s.state === "outdated");
  if (!todo.length) return;
  let names = todo.map((s) => s.agent.label).join(", "), yes = flags.hooks === !0;
  if (!yes) {
    if (!term().interactive || flags.yes) {
      term().json || info([`Count skill uses from ${names}?`, dim(`Run ${CLI} hooks --install. ${PRIVACY}`)]);
      return;
    }
    message(["", `Skillify can count skill uses with a small hook in ${names}.`, dim(PRIVACY)]), yes = await confirm({ message: "Install the usage hooks?", instead: "Pass --hooks or --no-hooks." });
  }
  if (!yes) return info(`No hooks installed. Add them any time: ${CLI} hooks --install`);
  reportInstalled(installAll(todo.map((s) => s.agent)));
}
async function offerRemoveHooks(flags) {
  let present = allStatuses().filter((s) => s.state === "installed" || s.state === "outdated");
  if (!present.length || flags.hooks === !1) return;
  let yes = flags.yes === !0 || flags.hooks === !0;
  if (!yes) {
    if (!term().interactive) return info(`The usage hooks stay installed; they do nothing while you're signed out. Remove them with ${CLI} hooks --remove.`);
    yes = await confirm({ message: `Remove the usage hooks from ${present.map((s) => s.agent.label).join(", ")}?`, instead: "Pass --yes." });
  }
  if (yes)
    for (let s of present)
      removeHook(s.agent).state === "missing" && success(`Removed the hook from ${s.agent.label} ${dim(tildify(s.file))}`);
}
var PRIVACY, LABEL, plain, init_hooks = __esm({
  "src/commands/hooks.ts"() {
    "use strict";
    init_src();
    init_args();
    init_agents();
    init_ui();
    init_sync();
    PRIVACY = "Uses are counted per person: only the skill name, the repository and the agent are sent, never prompts or code.", LABEL = {
      installed: () => green("installed"),
      missing: () => dim("not installed"),
      outdated: () => yellow("needs an update"),
      "no-agent": () => dim("agent not found"),
      invalid: () => red("config can't be read")
    };
    plain = (s) => ({ agent: s.agent.id, label: s.agent.label, state: s.state, file: s.file, estimated: USAGE_AGENTS[s.agent.id].estimated, problem: s.problem });
  }
});

// src/browser.ts
import { spawn } from "node:child_process";
function browserUnavailable(env = process.env, platform = process.platform) {
  if (env.CI) return "running in CI";
  if (env.BROWSER === "none" || env.BROWSER === "false") return "BROWSER is set to none";
  let ssh = !!(env.SSH_CONNECTION || env.SSH_TTY || env.SSH_CLIENT);
  return platform === "darwin" || platform === "win32" ? ssh && !env.BROWSER ? "connected over SSH" : null : env.BROWSER ? null : !env.DISPLAY && !env.WAYLAND_DISPLAY ? ssh ? "connected over SSH" : "no display found" : null;
}
function safeUrl(raw, origin) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (origin !== void 0)
    try {
      if (url.origin !== new URL(origin).origin) return null;
    } catch {
      return null;
    }
  return url.href;
}
function openCommand(url, env = process.env, platform = process.platform) {
  return env.BROWSER ? [env.BROWSER, [url]] : platform === "darwin" ? ["open", [url]] : platform === "win32" ? ["rundll32", ["url.dll,FileProtocolHandler", url]] : ["xdg-open", [url]];
}
function openBrowser(raw, origin) {
  if (browserUnavailable()) return !1;
  let url = safeUrl(raw, origin);
  if (!url) return !1;
  try {
    let [command, args] = openCommand(url), child = spawn(command, args, { stdio: "ignore", detached: !0, windowsHide: !0 });
    return child.on("error", () => {
    }), child.unref(), !0;
  } catch {
    return !1;
  }
}
var init_browser = __esm({
  "src/browser.ts"() {
    "use strict";
  }
});

// src/device.ts
async function requestDeviceCode(server) {
  let response = await request(server, "/api/v1/auth/device", { body: { client: "skillify-cli", version: VERSION }, timeoutMs: 15e3 });
  if (!response.ok || !response.data?.deviceCode)
    throw response.status === 404 ? new CliError(`${new URL(server).host} doesn't support browser sign-in yet.`, 1, `Make a token in Skillify \u2192 Settings \u2192 API tokens and pass it: ${CLI} login --token sk_\u2026`) : new CliError(`Couldn't start sign-in: ${response.error?.message ?? response.status}.`);
  return response.data;
}
async function pollForToken(server, code, options = {}) {
  let { sleep = realSleep, now = Date.now } = options, interval = Math.max(1, code.interval || 5), deadline = now() + Math.max(1, code.expiresIn || 600) * 1e3, failures = 0;
  for (; ; ) {
    let secondsLeft = Math.max(0, Math.round((deadline - now()) / 1e3));
    if (secondsLeft <= 0) throw expired();
    if (options.onWait?.({ secondsLeft, interval }), await sleep(interval * 1e3), options.signal?.aborted) throw new CliError("Cancelled.", 130);
    if (now() >= deadline) throw expired();
    let response;
    try {
      response = await request(server, "/api/v1/auth/device/token", { body: { deviceCode: code.deviceCode }, timeoutMs: 15e3 }), failures = 0;
    } catch (error) {
      if (++failures >= 3) throw error;
      continue;
    }
    if (response.ok && response.data?.token) return response.data;
    switch (response.error?.error) {
      case "authorization_pending":
        continue;
      case "slow_down":
        interval += 5;
        continue;
      case "access_denied":
        throw new CliError("Sign-in was declined in the browser.", 1, "Run login again if that was a mistake.");
      case "expired_token":
        throw expired();
      default:
        throw new CliError(`Sign-in failed: ${response.error?.message ?? `HTTP ${response.status}`}.`);
    }
  }
}
var realSleep, expired, init_device = __esm({
  "src/device.ts"() {
    "use strict";
    init_args();
    init_http();
    init_errors();
    realSleep = (ms) => new Promise((resolve4) => setTimeout(resolve4, ms));
    expired = () => new CliError("The sign-in code expired before it was approved.", 1, "Run login again to get a new code.");
  }
});

// src/commands/login.ts
function readStdin2(input = term().input, waitMs) {
  return new Promise((resolve4, reject) => {
    let chunks = [], timer, cleanup = () => {
      clearTimeout(timer), input.off("data", onData), input.off("end", onEnd), input.off("error", onError), input.pause();
    }, onData = (chunk) => {
      clearTimeout(timer), chunks.push(String(chunk));
    }, onEnd = () => {
      cleanup(), resolve4(chunks.join("").trim());
    }, onError = (error) => {
      cleanup(), reject(error);
    };
    input.on("data", onData), input.on("end", onEnd), input.on("error", onError), waitMs !== void 0 && (timer = setTimeout(() => {
      cleanup(), input.destroy?.(), resolve4(null);
    }, waitMs)), input.resume();
  });
}
function codeBox(code) {
  let spaced = [...code].join(" ");
  if (!term().rich) return [`  ${code}`];
  let inner = spaced.length + 4;
  return [
    dim(`${S.cornerTL()}${S.barH().repeat(inner)}${S.cornerTR()}`),
    `${dim(S.bar())}  ${bold(accent(spaced))}  ${dim(S.bar())}`,
    dim(`${S.cornerBL()}${S.barH().repeat(inner)}${S.cornerBR()}`)
  ];
}
async function deviceLogin(server, { browser = !0 } = {}) {
  let code = await task(`Requesting a sign-in code from ${hostOf(server)}`, () => requestDeviceCode(server), { done: "Got a one-time code" }), complete = safeUrl(code.verificationUriComplete, server), plain2 = safeUrl(code.verificationUri, server);
  if (!complete || !plain2) throw new CliError(`${hostOf(server)} sent a sign-in page on another site, so it wasn't opened.`, 1);
  code = { ...code, verificationUriComplete: complete, verificationUri: plain2 };
  let blocked = browser ? browserUnavailable() : "you passed --no-browser", opened = !blocked && openBrowser(complete, server);
  term().rich ? section("Your one-time code", [
    "",
    ...codeBox(code.userCode).map((line) => `   ${line}`),
    "",
    opened ? `Opened ${underline(code.verificationUri)} in your browser.` : `Open ${underline(code.verificationUriComplete)}`,
    opened ? dim("Check the code matches, then approve. No browser? Open the link above on any device.") : dim(`and approve the code${blocked ? ` (didn't open a browser: ${blocked})` : ""}.`)
  ]) : (writeLine(`Your one-time code: ${code.userCode}`), writeLine(`${opened ? "Opened" : "Open"} ${code.verificationUriComplete}${opened ? " in your browser" : ""} and approve the code.`));
  let approved = await task(
    "Waiting for approval in the browser",
    (handle) => pollForToken(server, code, { onWait: ({ secondsLeft }) => handle.update(`Waiting for approval in the browser ${dim(`(code expires in ${clock(secondsLeft)})`)}`) }),
    { done: (r) => `Approved for ${r.user.email}`, failed: "Not approved", timing: !1 }
  );
  return saveToken(server, approved.token, approved.user.email), approved;
}
async function login({ flags }) {
  let server = resolveServer2(flags), host = hostOf(server), t = term(), direct = str(flags, "token"), explicit = flags["with-token"] === !0, pasted = !direct && (explicit || !t.input.isTTY && !flags.device);
  if (direct || pasted) {
    let token = direct ?? await readStdin2(t.input, explicit ? void 0 : STDIN_WAIT_MS);
    if (!token) {
      let cli = CLI;
      throw new CliError(
        explicit ? "No token on stdin." : "There's no terminal to sign in from, and no token arrived on stdin.",
        2,
        `Pipe a token in (echo sk_\u2026 | ${cli} login --with-token), set SKILLIFY_TOKEN, or sign in with the browser anyway: ${cli} login --device`
      );
    }
    if (!token.startsWith("sk_")) throw new CliError("That doesn't look like a Skillify token (they start with sk_).", 2);
    intro("login", host);
    let me = await task("Checking the token", () => api(server, "/api/v1/me", { auth: { token } }), { done: (r) => `Token belongs to ${r.user.email}` });
    saveToken(server, token, me.user.email), rememberServer(flags, server), await offerHooks(flags), outro(`Signed in as ${bold(me.user.name ?? me.user.email)} ${dim(`(${me.scope} token, saved to ${tildify(credentialsPath())})`)}`);
    return;
  }
  intro("login", host);
  let existing = tokenFor(server);
  existing?.email && info(`You're signed in as ${existing.email}. Signing in again replaces that token.`);
  let approved = await deviceLogin(server, { browser: flags.browser !== !1 });
  rememberServer(flags, server), await offerHooks(flags), !envTokenIgnored(server) && process.env.SKILLIFY_TOKEN && new URL(server).origin === trustedEnvOrigin() && warn("SKILLIFY_TOKEN is set, and it wins over the saved token. Unset it to use this sign-in."), outro(`Signed in as ${bold(approved.user.name ?? approved.user.email)} ${dim(`${approved.scope} access ${S.dot()} saved to ${tildify(credentialsPath())}`)}`);
}
function rememberServer(flags, server) {
  str(flags, "server") && saveSettings({ server });
}
async function revokeToken(server, token) {
  try {
    let response = await request(server, "/api/v1/auth/token", { method: "DELETE", auth: { token }, timeoutMs: 1e4 });
    return response.ok ? { outcome: "revoked" } : response.status === 401 ? { outcome: "already" } : { outcome: "failed", reason: response.error?.message ?? `HTTP ${response.status}` };
  } catch (error) {
    return { outcome: "failed", reason: error.message };
  }
}
async function logout({ flags }) {
  let server = resolveServer2(flags), host = hostOf(server);
  intro("logout", host);
  let saved = savedToken(server);
  if (saved) {
    let { outcome, reason } = await task("Revoking the token", () => revokeToken(server, saved.token), {
      done: (r) => r.outcome === "revoked" ? "Revoked the token" : r.outcome === "already" ? "The token had already stopped working" : "Couldn't revoke the token",
      outcome: (r) => r.outcome === "failed" ? "warn" : "ok",
      timing: !1
    });
    removeToken(server), success(`Removed the saved token${saved.email ? ` for ${saved.email}` : ""}`), outcome === "failed" && message([...reason ? [dim(reason)] : [], dim("It may still work until you revoke it in Skillify \u2192 Settings \u2192 API tokens.")]);
  } else info(`No saved token for ${host}.`);
  await offerRemoveHooks(flags), process.env.SKILLIFY_TOKEN && new URL(server).origin === trustedEnvOrigin() && warn("SKILLIFY_TOKEN is still set in your environment. Unset it to sign out completely."), outro(saved ? `Signed out of ${host}` : "Nothing to do");
}
async function whoami({ flags }) {
  let server = resolveServer2(flags), host = hostOf(server), found = tokenFor(server);
  if (!found) {
    let ignored = envTokenIgnored(server);
    throw new CliError(ignored ?? `You're not signed in to ${host}.`, 1, ignored ? void 0 : `Run ${CLI} login.`);
  }
  intro("whoami", host);
  let me = await task("Checking your token", () => api(server, "/api/v1/me", { auth: { token: found.token } }), { done: "Token is valid" });
  if (flags.json) return json({ user: me.user, scope: me.scope, server, source: found.source });
  section(me.user.name ? `${me.user.name} ${dim(me.user.email)}` : me.user.email, table([
    [dim("Access"), me.scope === "write" ? "read and write" : "read only"],
    ...me.user.role ? [[dim("Role"), me.user.role]] : [],
    [dim("Server"), server],
    [dim("Token"), tildify(found.source)]
  ])), outro(dim(`Sign out with ${CLI} logout`));
}
var STDIN_WAIT_MS, clock, init_login = __esm({
  "src/commands/login.ts"() {
    "use strict";
    init_args();
    init_browser();
    init_credentials();
    init_device();
    init_http();
    init_settings();
    init_ui();
    init_hooks();
    init_sync();
    init_common();
    STDIN_WAIT_MS = 2e3;
    clock = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  }
});

// src/commands/sync.ts
async function loadPlan(root, server, token, repo, options) {
  let [bundle, { state, skipped }] = await Promise.all([
    fetchBundle(server, token, repo),
    scanSkills(root).then(async ({ skills, skipped: skipped2 }) => ({ state: await fetchState(server, token, repo, root, skills, options.record), skipped: skipped2 }))
  ]);
  return { bundle, state, plan: planSync(root, bundle, state, { force: options.force, skipped }) };
}
function count(plan) {
  let slugs = (action) => new Set(plan.skills.filter((s) => s.action === action).map((s) => s.slug)).size;
  return { written: slugs("write"), removed: slugs("delete"), kept: slugs("keep") };
}
async function runSync(target, flags, command) {
  let { root, server, repo, token } = target, dryRun = !!flags["dry-run"], events = startEvents("sync");
  events.target({ server, repo, auth: { token } }), events.emit("step", { step: "connect", message: `Connecting to ${hostOf(server)}` });
  let { bundle, plan } = await task(`Comparing this checkout with ${repo}`, () => loadPlan(root, server, token, repo, { force: !!flags.force, record: !dryRun }), {
    done: (r) => `Compared with ${bold(r.bundle.repo)} ${dim(`${S.dot()} ${plural(r.bundle.skills.length, "skill")} assigned`)}`,
    failed: `Couldn't compare with ${repo}`
  });
  events.emit("step", { step: "bundle", message: `Fetched ${plural(bundle.skills.length, "skill")}`, progress: { done: 0, total: bundle.skills.length } }), hasLegacy(plan.legacy) && !term().json && info(["This repository was set up by an older Skillify CLI.", dim(`Sync removes .skillify/ and its hook: usage is now counted by hooks in your own agents (${CLI} hooks).`)]);
  let changes = hasChanges(plan), commit = commitCommand(plan);
  if (dryRun || !changes) {
    if (term().json) return json({ repo: plan.repo, server, dryRun, applied: !1, skills: plan.skills, commit });
    if (printPlan(plan, dryRun ? "preview" : "status", { verbose: !!flags.verbose }), events.emit("done", { message: dryRun ? "Dry run" : "Up to date" }), dryRun) return outro(changes ? `Dry run: nothing was written. Run ${cyan(`${CLI} ${command === "init" ? `init ${repo}` : "sync"}`)} to apply.` : "Dry run: nothing to change");
    let kept = count(plan).kept;
    return outro(kept ? `Nothing to write; kept ${plural(kept, "skill")} edited here` : `${bold(plan.repo)} is up to date`);
  }
  if (term().json || printPlan(plan, "preview", { verbose: !!flags.verbose }), term().interactive && !flags.yes && !target.confirmed && !await confirm({ message: "Make these changes?", instead: "Pass --yes." }))
    return outro("Nothing was changed");
  let { failed } = await task(
    "Writing skills",
    async (t) => applyPlan(root, bundle, plan, (done, total, slug) => {
      t.update(`Writing ${slug}`), t.progress(done, total), events.emit("step", { step: "write", message: `Writing ${slug}`, progress: { done, total } });
    }),
    {
      done: () => {
        let c = count(plan);
        return [c.written && `Wrote ${plural(c.written, "skill")}`, c.removed && `removed ${plural(c.removed, "skill")}`, !c.written && !c.removed && "Updated agent files"].filter(Boolean).join(", ");
      },
      failed: "Couldn't write the skills"
    }
  );
  events.emit("step", { step: "agents", message: plan.agentsMd !== void 0 ? "Updated AGENTS.md" : "AGENTS.md is up to date" }), hasLegacy(plan.legacy) && events.emit("step", { step: "hook", message: "Removed .skillify/ and its old usage hook" });
  for (let f of failed) warn([`Left ${f.path} alone`, dim(f.reason)]);
  let reported = await task(
    "Reporting this checkout to Skillify",
    async () => {
      try {
        let { skills } = await scanSkills(root);
        return await fetchState(server, token, repo, root, skills, !0), !0;
      } catch {
        return !1;
      }
    },
    { done: (ok) => ok ? "Reported this checkout to Skillify" : "Couldn't report to Skillify; the dashboard catches up next time", outcome: (ok) => ok ? "ok" : "warn", timing: !1 }
  );
  if (events.emit("step", { step: "report", message: reported ? "Reported to Skillify" : "Couldn't report", warning: !reported }), events.emit("done", { message: "Synced" }), term().json) return json({ repo: plan.repo, server, dryRun, applied: !0, skills: plan.skills, failed, reported, commit });
  commit && note("Next", ["Review the changes, then commit them so everyone gets the same skills:", "", cyan(commit)]), outro(`Synced ${bold(plan.repo)} in ${duration(Date.now() - target.started)}`);
}
async function sync(args) {
  let started = Date.now(), root = findRoot(), server = resolveServer2(args.flags), repo = requireRepo(args, root, "sync");
  intro(args.flags["dry-run"] ? "sync --dry-run" : "sync", repo), await runSync({ root, server, repo, token: needToken(server), started }, args.flags, "sync");
}
async function chooseRepo(args, root, server, token) {
  let given = args.flags.repo ?? args.positionals[0], detected = repoFrom(args, root);
  if (given && detected) return { repo: detected, confirmed: !1 };
  let again = `${CLI} init`;
  if (!detected && !term().interactive) throw new CliError("Which repository is this?", 2, `Pass it: ${again} owner/name`);
  if (detected && (args.flags.yes || !term().interactive))
    return !term().interactive && !term().json && info(`Using ${detected} from the git remote.`), { repo: detected, confirmed: !!args.flags.yes };
  let repos = await task("Loading repositories from Skillify", () => api(server, "/api/v1/repos", { auth: { token } }), {
    done: (r) => `Found ${plural(r.repos.length, "repository", "repositories")} in Skillify`
  }).then((r) => r.repos), names = new Set(repos.map((r) => r.fullName.toLowerCase()));
  if (detected && names.has(detected)) {
    if (await confirm({ message: `Set up ${detected}?`, instead: `Pass it: ${again} ${detected}` })) return { repo: detected, confirmed: !0 };
  } else detected && warn([`${detected} isn't in Skillify yet.`, dim(`Add it at ${server}/app/repos/new, or pick another repository.`)]);
  if (repos.length === 0) throw new CliError("There are no repositories in Skillify yet.", 1, `Add one at ${server}/app/repos/new, then run ${again} again.`);
  let options = repos.map((r) => ({
    value: r.fullName.toLowerCase(),
    label: r.fullName,
    hint: [r.skillCount != null ? plural(r.skillCount, "skill") : "", r.fullName.toLowerCase() === detected ? "this checkout" : ""].filter(Boolean).join(", ") || void 0
  }));
  return { repo: await select({ message: "Which repository is this?", options, initial: detected, instead: `Pass it: ${again} owner/name` }), confirmed: !0 };
}
async function init(args) {
  let { flags } = args, started = Date.now(), root = findRoot(), server = resolveServer2(flags);
  intro("init", hostOf(server));
  let token = tokenFor(server)?.token;
  if (!token) {
    let again = `${CLI} init`, ignored = envTokenIgnored(server);
    if (!term().interactive)
      throw new CliError(
        ignored ?? `You're not signed in to ${hostOf(server)}.`,
        1,
        ignored ? void 0 : `Set SKILLIFY_TOKEN to a personal token (Skillify \u2192 Settings \u2192 API tokens), or run ${again} in a terminal to sign in with the browser.`
      );
    if (ignored && warn(ignored), !(flags.yes === !0 || await confirm({ message: `Sign in to ${hostOf(server)} with your browser?`, instead: "Set SKILLIFY_TOKEN, or pass --yes." }))) throw new CliError("Setup needs a sign-in.", 1, `Run ${again} again and sign in, or set SKILLIFY_TOKEN.`);
    token = (await deviceLogin(server, { browser: flags.browser !== !1 })).token, await offerHooks(flags);
  }
  let { repo, confirmed } = await chooseRepo(args, root, server, token);
  await runSync({ root, server, repo, token, started, confirmed }, flags, "init");
}
var json, init_sync = __esm({
  "src/commands/sync.ts"() {
    "use strict";
    init_args();
    init_credentials();
    init_events();
    init_git();
    init_http();
    init_migrate();
    init_plan();
    init_present();
    init_remote();
    init_skills();
    init_ui();
    init_common();
    init_hooks();
    init_login();
    json = (value) => writeLine(JSON.stringify(value, null, 2));
  }
});

// src/commands/doctor.ts
async function doctor(args) {
  let { flags } = args, cli = CLI, checks = [], add = (state, label, fix) => {
    let s = state === !0 ? "ok" : state === !1 ? "fail" : state;
    checks.push({ state: s, label, fix: s === "ok" ? void 0 : fix }), check(s, label, s === "ok" ? void 0 : fix);
  }, { server, source } = resolveServerWithSource(str(flags, "server")), gitRoot = findGitRoot(process.cwd()), repo = gitRoot ? repoFrom(args, gitRoot) : void 0, token = tokenFor(server), events = startEvents("doctor");
  repo && token && events.target({ server, repo, auth: { token: token.token } }), intro("doctor", gitRoot ? tildify(gitRoot) : void 0), spacer();
  let [major] = process.versions.node.split(".").map(Number);
  if (add((major ?? 0) >= 20, `Node.js ${process.versions.node}`, "Skillify needs Node.js 20 or newer."), !gitRoot) add("warn", "Not inside a git repository", "Run sync and status from a checkout of the repository.");
  else {
    let remote = remoteRepo(gitRoot);
    add(repo ? "ok" : "warn", repo ? `Repository ${repo} ${dim(remote ? "from the git remote" : "given")}` : "No GitHub remote named origin", `Pass the repository: ${cli} sync --repo owner/name`);
    let targets = Object.values(TARGET_DIRS).filter((dir) => lstat(`${gitRoot}/${dir}`));
    add(targets.length ? "ok" : "warn", targets.length ? `Skills in ${targets.join(", ")}` : "No skill folders yet", `Run ${cli} sync.`);
    let legacy = planLegacy(gitRoot);
    (legacy.dir || legacy.settings !== void 0) && add("warn", `${LEGACY_DIR}/ from an older CLI is still here`, `Run ${cli} sync: it removes ${LEGACY_DIR}/ and its hook in .claude/settings.json. Then commit.`), legacy.settingsProblem && add("warn", legacy.settingsProblem);
  }
  let found = allStatuses().filter((s) => s.state !== "no-agent"), hooked = found.filter((s) => s.state === "installed");
  if (!found.length) add("ok", `Usage hooks ${dim("(no supported agents found)")}`);
  else if (hooked.length === found.length) add("ok", `Usage hooks in ${hooked.map((s) => s.agent.label).join(", ")}`);
  else {
    let missing = found.filter((s) => s.state !== "installed");
    add("warn", `No usage hook in ${missing.map((s) => s.agent.label).join(", ")}`, missing.some((s) => s.state === "invalid") ? `Fix ${missing.filter((s) => s.state === "invalid").map((s) => tildify(s.file)).join(", ")}, then run ${cli} hooks --install.` : `Run ${cli} hooks --install.`);
  }
  hooked.length && !onPath() && add("warn", "skillify is not on your PATH, so agents can't run the hook", "Install it globally: npm install -g github:ryanyogan/skillify-cli");
  let health = await task(`Reaching ${server}`, () => api(server, "/api/v1/health", { timeoutMs: 8e3 }), {
    done: `Server ${server} ${dim(SOURCE[source])}`,
    failed: `Can't reach ${server}`,
    compact: !0
  }).catch((error) => error);
  if (checks.push({ state: health instanceof Error ? "fail" : "ok", label: `Server ${server}`, fix: health instanceof Error ? health.message : void 0 }), health instanceof Error && message(dim(health.message)), !token) add("warn", "Not signed in", envTokenIgnored(server) ?? `Sign in so sync and status can talk to Skillify: ${cli} login`);
  else if (!(health instanceof Error)) {
    let me = await task("Checking your token", () => api(server, "/api/v1/me", { auth: { token: token.token }, timeoutMs: 8e3 }), {
      done: (m) => `Signed in as ${m.user.email} ${dim(`${m.scope} ${S.dot()} ${tildify(token.source)}`)}`,
      failed: `Token from ${tildify(token.source)} was refused`,
      compact: !0
    }).catch((error) => error);
    checks.push({ state: me instanceof Error ? "fail" : "ok", label: me instanceof Error ? `Token from ${token.source}` : `Signed in as ${me.user.email}`, fix: me instanceof Error ? `${me.message} Run ${cli} login.` : void 0 }), me instanceof Error && message(dim(`${me.message} Run ${cli} login.`));
  }
  let failed = checks.filter((c) => c.state === "fail").length, warned = checks.filter((c) => c.state === "warn").length;
  if (events.emit(failed ? "error" : "done", { message: failed ? `${plural(failed, "problem")} found` : warned ? `${plural(warned, "warning")}` : "All checks passed" }), flags.json ? json({ root: gitRoot, repo, server, ok: failed === 0, checks }) : failed ? outro(red(`${plural(failed, "problem")} to fix${warned ? `, ${plural(warned, "warning")}` : ""}`)) : warned ? outro(yellow(`${plural(warned, "warning")}, everything else looks fine`)) : outro(green("Everything looks fine")), failed) throw new CliError("", 1);
}
var SOURCE, init_doctor = __esm({
  "src/commands/doctor.ts"() {
    "use strict";
    init_src();
    init_args();
    init_agents();
    init_credentials();
    init_events();
    init_fsafe();
    init_git();
    init_http();
    init_migrate();
    init_settings();
    init_ui();
    init_common();
    init_sync();
    SOURCE = { "--server": "from --server", SKILLIFY_SERVER: "from SKILLIFY_SERVER", settings: "saved by login --server", default: "default" };
  }
});

// src/commands/open.ts
function repoUrl(server, repo) {
  let [owner, name] = repo.split("/");
  return `${server}/app/repos/${encodeURIComponent(owner ?? "")}/${encodeURIComponent(name ?? "")}`;
}
async function open2(args) {
  let { flags } = args, repo = repoFrom(args, findRoot());
  if (!repo) throw new CliError("Which repository?", 2, `Run ${CLI} open owner/name.`);
  let url = repoUrl(resolveServer2(flags), repo), t = term();
  if (!t.out.isTTY || flags.browser === !1 || t.json) return writeLine(t.json ? JSON.stringify({ url }) : url);
  let blocked = browserUnavailable();
  !blocked && openBrowser(url, url) ? success(`Opened ${underline(url)}`) : writeLine(`${url}${blocked ? `
(didn't open a browser: ${blocked})` : ""}`);
}
var init_open = __esm({
  "src/commands/open.ts"() {
    "use strict";
    init_args();
    init_browser();
    init_git();
    init_ui();
    init_common();
  }
});

// src/commands/status.ts
async function status(args) {
  let { flags } = args, root = findRoot(), server = resolveServer2(flags), repo = requireRepo(args, root, "status"), token = needToken(server);
  intro("status", `${repo} ${S.dot()} ${hostOf(server)}`);
  let { state, skipped } = await task(
    "Checking skills with Skillify",
    async () => {
      let { skills, skipped: skipped2 } = await scanSkills(root);
      return { state: await fetchState(server, token, repo, root, skills, !0), skipped: skipped2 };
    },
    { done: "Checked skills with Skillify", failed: "Couldn't check skills with Skillify" }
  ), plan = planSync(root, null, state, { skipped }), attention = needsAttention(plan);
  if (term().json) json({ repo: plan.repo, server, clean: !attention, counts: counts(plan), skills: plan.skills });
  else {
    printPlan(plan, "status", { verbose: !!flags.verbose });
    let edited = plan.skills.some((s) => s.state === "edited");
    attention ? outro(`Run ${cyan(`${CLI} sync`)} to update${edited ? dim(" (edits are kept unless you pass --force)") : ""}`) : outro(green("Everything is current"));
  }
  if (flags.check && attention) throw new CliError("", 1);
}
var init_status = __esm({
  "src/commands/status.ts"() {
    "use strict";
    init_args();
    init_git();
    init_plan();
    init_present();
    init_remote();
    init_skills();
    init_ui();
    init_common();
    init_sync();
  }
});

// src/commands/index.ts
function helpText() {
  let cli = CLI, out = [title(`${dim(VERSION)}  Agent skills for this repository, kept in sync.`), "", heading("Usage"), `  ${cli} <command> [options]`], groups = [...new Set(COMMANDS.map((c) => c.group))], nameWidth = Math.max(...COMMANDS.map((c) => c.name.length)) + 4;
  for (let group of groups) {
    out.push("", heading(group));
    for (let c of COMMANDS.filter((c2) => c2.group === group)) out.push(`  ${pad(accent(c.name), nameWidth)}${c.summary}`);
  }
  return out.push("", heading("Options"), ...indent(table(GLOBAL.map(([f, d]) => [f, dim(d)])))), out.push(
    "",
    heading("Environment"),
    ...indent(
      table([
        ["SKILLIFY_TOKEN", dim("Personal token, instead of login")],
        ["SKILLIFY_SERVER", dim("Skillify address; SKILLIFY_TOKEN is only sent there (or to the default)")],
        ["NO_COLOR, CI", dim("Plain output, no animation")]
      ])
    )
  ), out.push("", `Run ${accent(`${cli} help <command>`)} for options and examples.`), out.join(`
`);
}
function commandHelp(command) {
  let cli = CLI, out = [title(`${bold(command.name)}  ${command.summary}`), "", heading("Usage"), `  ${cli} ${command.usage}`];
  return command.about && out.push("", ...wrap(command.about, 78).map((line) => `  ${line}`)), command.options?.length && out.push("", heading("Options"), ...indent(table(command.options.map(([f, d]) => [f, dim(d)])))), command.examples?.length && (out.push("", heading("Examples")), out.push(...indent(table(command.examples.map(([line, what]) => [`${dim("$")} ${cli} ${line}`, what ? dim(`# ${what}`) : ""]))))), out.join(`
`);
}
function wrap(text, width2) {
  let lines2 = [], line = "";
  for (let word of text.split(/\s+/))
    line && line.length + word.length + 1 > width2 ? (lines2.push(line), line = word) : line = line ? `${line} ${word}` : word;
  return line && lines2.push(line), lines2;
}
function suggest(name) {
  let best;
  for (let { name: candidate } of COMMANDS) {
    let d = distance(name, candidate);
    d <= Math.max(2, Math.floor(candidate.length / 3)) && (!best || d < best[1]) && (best = [candidate, d]);
  }
  return best?.[0];
}
function distance(a, b) {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      let next = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = row[j], row[j] = next;
    }
  }
  return row[b.length];
}
var SERVER, REPO2, JSON_OUT, COMMANDS, GLOBAL, heading, indent, title, findCommand, init_commands = __esm({
  "src/commands/index.ts"() {
    "use strict";
    init_args();
    init_ui();
    init_doctor();
    init_hooks();
    init_login();
    init_open();
    init_status();
    init_sync();
    SERVER = ["--server <url>", "Which Skillify (default: SKILLIFY_SERVER, then the one you signed in to)"], REPO2 = ["--repo <owner/name>", "Which repository (default: the git remote origin)"], JSON_OUT = ["--json", "Machine-readable output"], COMMANDS = [
      {
        name: "login",
        group: "Get started",
        summary: "Sign in with your browser",
        usage: "login [--no-browser] [--device | --token sk_\u2026 | --with-token] [--hooks | --no-hooks] [--server <url>]",
        about: "Shows a one-time code and opens Skillify in your browser. Approve it there and the token is saved to ~/.config/skillify/credentials.json (readable only by you). Then it offers to add usage hooks to the agents on this computer. Without a terminal, pipe a token in with --with-token or set SKILLIFY_TOKEN.",
        options: [
          ["--no-browser", "Print the link instead of opening a browser"],
          ["--token <sk_\u2026>", "Save this personal token instead of signing in with the browser"],
          ["--with-token", "Read the token from stdin"],
          ["--device", "Use the browser sign-in even when stdin isn't a terminal"],
          ["--hooks, --no-hooks", "Install the usage hooks without asking, or skip them"],
          SERVER
        ],
        examples: [
          ["login", "Sign in with the browser"],
          ["login --no-browser", "Over SSH: open the link on any device"],
          ["login --with-token < token.txt", "In scripts"]
        ],
        run: login
      },
      {
        name: "init",
        group: "Get started",
        summary: "Set up this repository",
        usage: "init [owner/name] [--yes] [--dry-run] [--json] [--server <url>]",
        about: "Signs you in if needed, confirms the repository from the git remote (or lets you pick one in Skillify), then syncs. It writes only the skills, the managed block in AGENTS.md and, if you have a CLAUDE.md, an @AGENTS.md line in it. It never commits: it prints the git command for you.",
        options: [
          ["owner/name", "The repository in Skillify (default: the git remote)"],
          ["-y, --yes", "Don't ask: sign in if needed, use the git remote, write"],
          ["--no-browser", "Print the sign-in link instead of opening a browser"],
          ["--dry-run", "Show what would change, write nothing"],
          JSON_OUT,
          SERVER
        ],
        examples: [
          ["init", "Choose interactively"],
          ["init --yes", "Use the git remote without asking"],
          ["init acme/web --no-input", "Non-interactive (with SKILLIFY_TOKEN set)"]
        ],
        run: init
      },
      {
        name: "sync",
        group: "Everyday",
        summary: "Bring the skills up to date",
        usage: "sync [--dry-run] [--force] [--yes] [--verbose] [--json] [--repo <owner/name>] [--server <url>]",
        about: "Shows what will change, then writes it: adds and updates assigned skills, removes ones no longer assigned, and updates the AGENTS.md block. Skills edited here are kept unless you pass --force; your own skills are never touched. Nothing is committed: review, then run the git command it prints.",
        options: [
          ["--dry-run", "Show what would change, write nothing"],
          ["--force", "Replace skills that were edited here"],
          ["-y, --yes", "Don't ask before writing"],
          ["--verbose", "List unchanged skills too"],
          JSON_OUT,
          REPO2,
          SERVER
        ],
        examples: [
          ["sync", "Update everything"],
          ["sync --dry-run", "Preview first"]
        ],
        run: sync
      },
      {
        name: "status",
        group: "Everyday",
        summary: "Show what sync would change",
        usage: "status [--check] [--verbose] [--json] [--repo <owner/name>] [--server <url>]",
        about: "Hashes every skill folder and asks Skillify what each one is: current, behind, missing, edited here, no longer assigned, or your own. Skillify keeps the result, so the dashboard shows this checkout.",
        options: [["--check", "Exit with 1 unless everything is current (for CI)"], ["--verbose", "List current skills too"], JSON_OUT, REPO2, SERVER],
        examples: [
          ["status", "See what changed"],
          ["status --check", "In CI, with SKILLIFY_TOKEN set (a read token is enough)"]
        ],
        run: status
      },
      {
        name: "open",
        group: "Everyday",
        summary: "Open this repository in Skillify",
        usage: "open [owner/name] [--no-browser] [--json] [--server <url>]",
        options: [["--no-browser", "Print the URL instead"], ["--json", 'Print { "url": \u2026 }'], SERVER],
        examples: [["open", "Open the repository page"]],
        run: open2
      },
      {
        name: "hooks",
        group: "Account and setup",
        summary: "Show, install or remove the usage hooks",
        usage: "hooks [--install | --remove] [--agent <id,\u2026>] [--json]",
        about: "Usage hooks live in your agents' own settings on this computer (Claude Code, Gemini CLI, Codex, Devin, OpenCode), never in a repository. Uses are counted per person: only the skill name, the repository and the agent are sent, never prompts or code. Codex has no skill event, so its counts are estimates, and Codex asks you to approve new hooks in /hooks.",
        options: [
          ["--install", "Add the hook to every agent found here"],
          ["--remove", "Take the hooks out again"],
          ["--agent <id,\u2026>", "Only these: claude-code, gemini-cli, codex, devin, opencode"],
          JSON_OUT
        ],
        examples: [
          ["hooks", "See which agents count uses"],
          ["hooks --install", "Count uses from every agent here"],
          ["hooks --remove --agent codex", "Stop counting Codex"]
        ],
        run: hooks
      },
      {
        name: "whoami",
        group: "Account and setup",
        summary: "Show who you're signed in as",
        usage: "whoami [--json] [--server <url>]",
        options: [JSON_OUT, SERVER],
        examples: [["whoami", ""]],
        run: whoami
      },
      {
        name: "logout",
        group: "Account and setup",
        summary: "Sign out and revoke the saved token",
        usage: "logout [--yes] [--server <url>]",
        about: "Revokes the token saved for this server, so it stops working everywhere, then removes it from this computer, and offers to remove the usage hooks. If Skillify can't be reached, the token is still removed here; revoke it in Skillify \u2192 Settings \u2192 API tokens.",
        options: [["-y, --yes", "Also remove the usage hooks without asking"], SERVER],
        examples: [["logout", ""]],
        run: logout
      },
      {
        name: "doctor",
        group: "Account and setup",
        summary: "Check this checkout, the hooks, the server and your token",
        usage: "doctor [--json] [--server <url>]",
        about: "Checks each piece in turn and says how to fix what's wrong. Exits with 1 when something fails.",
        options: [JSON_OUT, SERVER],
        examples: [["doctor", ""]],
        run: doctor
      },
      {
        name: "hook",
        group: "Behind the scenes",
        summary: "The usage hook agents run (reads JSON on stdin)",
        usage: "hook [--agent <id>]",
        about: "Agents run this after using a skill. It reports the skill name, repository and agent to Skillify when the skill is in this repository, prints nothing, and always exits 0 within 1.5 seconds.",
        run: async () => {
        }
      }
    ], GLOBAL = [
      ["--json", "Machine-readable output (init, sync, status, hooks, open, whoami, doctor)"],
      ["-q, --quiet", "Only warnings and errors"],
      ["--no-input", "Never prompt; fail and name the flag to pass instead"],
      ["--no-color", "Plain output (also NO_COLOR=1)"],
      ["-h, --help", "Help for a command"],
      ["-v, --version", "Print the version"]
    ], heading = (text) => bold(text), indent = (lines2) => lines2.map((line) => `  ${line}`), title = (text) => term().color ? `${badge("skillify")} ${text}` : `skillify ${text}`;
    findCommand = (name) => COMMANDS.find((c) => c.name === name);
  }
});

// src/cli.ts
var cli_exports = {};
__export(cli_exports, {
  main: () => main
});
function onInterrupt() {
  interrupted && process.exit(130), interrupted = !0, cancelActiveTask(), term().out.isTTY && term().out.write(SHOW_CURSOR), fail("Cancelled.");
  let events = currentEvents();
  events || process.exit(130), events.emit("error", { message: "Cancelled" }), events.flush(300).finally(() => process.exit(130));
}
async function run2(argv2) {
  let args = parseArgs(argv2), { flags } = args;
  if (configureTerm({ color: flags.color === !1 ? !1 : void 0, noInput: flags.input === !1, quiet: !!flags.quiet, json: !!flags.json }), process.on("SIGINT", onInterrupt), flags.version || args.command === "version") return writeLine(VERSION);
  if (args.command === "help" || args.command === "") {
    let topic = args.positionals[0] && findCommand(args.positionals[0]);
    writeLine(topic ? commandHelp(topic) : helpText()), args.positionals[0] && !topic && (process.exitCode = 2);
    return;
  }
  let command = findCommand(args.command);
  if (!command) {
    let guess = suggest(args.command);
    throw new CliError(`Unknown command "${args.command}".`, 2, guess ? `Did you mean ${CLI} ${guess}?` : `Run ${CLI} help to see them all.`);
  }
  if (flags.help) return writeLine(commandHelp(command));
  await command.run(args);
}
function main(argv2) {
  return process.stdout.on("error", (error) => {
    throw error.code === "EPIPE" && process.exit(process.exitCode ?? 0), error;
  }), run2(argv2).catch((error) => {
    let events = currentEvents();
    if (error instanceof CancelError) {
      fail("Cancelled."), events?.emit("error", { message: "Cancelled" }), process.exitCode = 130;
      return;
    }
    if (error instanceof CliError) {
      error.message && fail(error.message, error.hint), error.message && events?.emit("error", { message: error.message }), process.exitCode = error.code;
      return;
    }
    let detail = error?.message ?? String(error);
    fail(`Something went wrong: ${detail}`, process.env.SKILLIFY_DEBUG ? error?.stack : "Run again with SKILLIFY_DEBUG=1 to see the details."), events?.emit("error", { message: detail }), process.exitCode = 1;
  }).finally(async () => {
    await currentEvents()?.flush(1e3);
  });
}
var interrupted, init_cli = __esm({
  "src/cli.ts"() {
    "use strict";
    init_args();
    init_commands();
    init_events();
    init_ui();
    interrupted = !1;
  }
});

// src/main.ts
var argv = process.argv.slice(2);
if (argv[0] === "hook") {
  let quit = () => process.exit(0);
  process.on("uncaughtException", quit), process.on("unhandledRejection", quit);
  let { runHook: runHook2 } = await Promise.resolve().then(() => (init_run(), run_exports));
  await runHook2(argv.slice(1)), quit();
} else {
  let { main: main2 } = await Promise.resolve().then(() => (init_cli(), cli_exports));
  await main2(argv);
}
