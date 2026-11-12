var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../.npm/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir4, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env3) {
    return 1;
  }
  hasColors(count4, env3) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process3 extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process3.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd3) {
    this.#cwd = cwd3;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../.npm/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// src/index.js
import { Writable as Writable2 } from "node:stream";
import { EventEmitter as EventEmitter2 } from "node:events";
import { Writable as Writable22 } from "node:stream";
import { EventEmitter as EventEmitter22 } from "node:events";
import appJs from "./67418f081be6af55d8312cd6e9aba92aacde7cc1-8ae13545f674fa8fb18970c943bacacde0041584-89fac8bc140eb285d48305849b513def116a592f-app.txt";
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
// @__NO_SIDE_EFFECTS__
function createNotImplementedError2(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError2, "createNotImplementedError");
__name2(createNotImplementedError2, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented2(name) {
  const fn = /* @__PURE__ */ __name2(() => {
    throw /* @__PURE__ */ createNotImplementedError2(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented2, "notImplemented");
__name2(notImplemented2, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass2(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass2, "notImplementedClass");
__name2(notImplementedClass2, "notImplementedClass");
var _timeOrigin2 = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow2 = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin2;
var nodeTiming2 = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry2 = class {
  static {
    __name(this, "PerformanceEntry");
  }
  static {
    __name2(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow2();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow2() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark3 = class PerformanceMark22 extends PerformanceEntry2 {
  static {
    __name(this, "PerformanceMark2");
  }
  static {
    __name2(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure2 = class extends PerformanceEntry2 {
  static {
    __name(this, "PerformanceMeasure");
  }
  static {
    __name2(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming2 = class extends PerformanceEntry2 {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  static {
    __name2(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList2 = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  static {
    __name2(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance2 = class {
  static {
    __name(this, "Performance");
  }
  static {
    __name2(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin2;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming2;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming2("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin2) {
      return _performanceNow2();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark3(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure2(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw /* @__PURE__ */ createNotImplementedError2("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver2 = class {
  static {
    __name(this, "PerformanceObserver");
  }
  static {
    __name2(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError2("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw /* @__PURE__ */ createNotImplementedError2("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance2 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance2();
if (!("__unenv__" in performance2)) {
  const proto = Performance2.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance2)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance2, key, desc);
      }
    }
  }
}
globalThis.performance = performance2;
globalThis.Performance = Performance2;
globalThis.PerformanceEntry = PerformanceEntry2;
globalThis.PerformanceMark = PerformanceMark3;
globalThis.PerformanceMeasure = PerformanceMeasure2;
globalThis.PerformanceObserver = PerformanceObserver2;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList2;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming2;
var noop_default2 = Object.assign(() => {
}, { __unenv__: true });
var _console2 = globalThis.console;
var _ignoreErrors2 = true;
var _stderr2 = new Writable2();
var _stdout2 = new Writable2();
var log3 = _console2?.log ?? noop_default2;
var info3 = _console2?.info ?? log3;
var trace3 = _console2?.trace ?? info3;
var debug3 = _console2?.debug ?? log3;
var table3 = _console2?.table ?? log3;
var error3 = _console2?.error ?? log3;
var warn3 = _console2?.warn ?? error3;
var createTask3 = _console2?.createTask ?? /* @__PURE__ */ notImplemented2("console.createTask");
var clear3 = _console2?.clear ?? noop_default2;
var count3 = _console2?.count ?? noop_default2;
var countReset3 = _console2?.countReset ?? noop_default2;
var dir3 = _console2?.dir ?? noop_default2;
var dirxml3 = _console2?.dirxml ?? noop_default2;
var group3 = _console2?.group ?? noop_default2;
var groupEnd3 = _console2?.groupEnd ?? noop_default2;
var groupCollapsed3 = _console2?.groupCollapsed ?? noop_default2;
var profile3 = _console2?.profile ?? noop_default2;
var profileEnd3 = _console2?.profileEnd ?? noop_default2;
var time3 = _console2?.time ?? noop_default2;
var timeEnd3 = _console2?.timeEnd ?? noop_default2;
var timeLog3 = _console2?.timeLog ?? noop_default2;
var timeStamp3 = _console2?.timeStamp ?? noop_default2;
var Console2 = _console2?.Console ?? /* @__PURE__ */ notImplementedClass2("console.Console");
var _times2 = /* @__PURE__ */ new Map();
var _stdoutErrorHandler2 = noop_default2;
var _stderrErrorHandler2 = noop_default2;
var workerdConsole2 = globalThis["console"];
var {
  assert: assert3,
  clear: clear22,
  // @ts-expect-error undocumented public API
  context: context2,
  count: count22,
  countReset: countReset22,
  // @ts-expect-error undocumented public API
  createTask: createTask22,
  debug: debug22,
  dir: dir22,
  dirxml: dirxml22,
  error: error22,
  group: group22,
  groupCollapsed: groupCollapsed22,
  groupEnd: groupEnd22,
  info: info22,
  log: log22,
  profile: profile22,
  profileEnd: profileEnd22,
  table: table22,
  time: time22,
  timeEnd: timeEnd22,
  timeLog: timeLog22,
  timeStamp: timeStamp22,
  trace: trace22,
  warn: warn22
} = workerdConsole2;
Object.assign(workerdConsole2, {
  Console: Console2,
  _ignoreErrors: _ignoreErrors2,
  _stderr: _stderr2,
  _stderrErrorHandler: _stderrErrorHandler2,
  _stdout: _stdout2,
  _stdoutErrorHandler: _stdoutErrorHandler2,
  _times: _times2
});
var console_default2 = workerdConsole2;
globalThis.console = console_default2;
var hrtime4 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function hrtime22(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime2"), "hrtime"), { bigint: /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function bigint2() {
  return BigInt(Date.now() * 1e6);
}, "bigint"), "bigint") });
var ReadStream2 = class {
  static {
    __name(this, "ReadStream");
  }
  static {
    __name2(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};
var WriteStream2 = class {
  static {
    __name(this, "WriteStream");
  }
  static {
    __name2(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir4, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env3) {
    return 1;
  }
  hasColors(count4, env3) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};
var NODE_VERSION2 = "22.14.0";
var Process2 = class _Process2 extends EventEmitter2 {
  static {
    __name(this, "_Process2");
  }
  static {
    __name2(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process2.prototype), ...Object.getOwnPropertyNames(EventEmitter2.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream2(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream2(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream2(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd3) {
    this.#cwd = cwd3;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION2}`;
  }
  get versions() {
    return { node: NODE_VERSION2 };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw /* @__PURE__ */ createNotImplementedError2("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw /* @__PURE__ */ createNotImplementedError2("process.getActiveResourcesInfo");
  }
  exit() {
    throw /* @__PURE__ */ createNotImplementedError2("process.exit");
  }
  reallyExit() {
    throw /* @__PURE__ */ createNotImplementedError2("process.reallyExit");
  }
  kill() {
    throw /* @__PURE__ */ createNotImplementedError2("process.kill");
  }
  abort() {
    throw /* @__PURE__ */ createNotImplementedError2("process.abort");
  }
  dlopen() {
    throw /* @__PURE__ */ createNotImplementedError2("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw /* @__PURE__ */ createNotImplementedError2("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw /* @__PURE__ */ createNotImplementedError2("process.loadEnvFile");
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError2("process.disconnect");
  }
  cpuUsage() {
    throw /* @__PURE__ */ createNotImplementedError2("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError2("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError2("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw /* @__PURE__ */ createNotImplementedError2("process.initgroups");
  }
  openStdin() {
    throw /* @__PURE__ */ createNotImplementedError2("process.openStdin");
  }
  assert() {
    throw /* @__PURE__ */ createNotImplementedError2("process.assert");
  }
  binding() {
    throw /* @__PURE__ */ createNotImplementedError2("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented2("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented2("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented2("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented2("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented2("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented2("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name2(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
var globalProcess2 = globalThis["process"];
var getBuiltinModule2 = globalProcess2.getBuiltinModule;
var workerdProcess2 = getBuiltinModule2("node:process");
var unenvProcess2 = new Process2({
  env: globalProcess2.env,
  hrtime: hrtime4,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess2.nextTick
});
var { exit: exit2, features: features2, platform: platform2 } = workerdProcess2;
var {
  _channel: _channel2,
  _debugEnd: _debugEnd2,
  _debugProcess: _debugProcess2,
  _disconnect: _disconnect2,
  _events: _events2,
  _eventsCount: _eventsCount2,
  _exiting: _exiting2,
  _fatalException: _fatalException2,
  _getActiveHandles: _getActiveHandles2,
  _getActiveRequests: _getActiveRequests2,
  _handleQueue: _handleQueue2,
  _kill: _kill2,
  _linkedBinding: _linkedBinding2,
  _maxListeners: _maxListeners2,
  _pendingMessage: _pendingMessage2,
  _preload_modules: _preload_modules2,
  _rawDebug: _rawDebug2,
  _send: _send2,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
  _tickCallback: _tickCallback2,
  abort: abort2,
  addListener: addListener2,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
  arch: arch2,
  argv: argv2,
  argv0: argv02,
  assert: assert22,
  availableMemory: availableMemory2,
  binding: binding2,
  channel: channel2,
  chdir: chdir2,
  config: config2,
  connected: connected2,
  constrainedMemory: constrainedMemory2,
  cpuUsage: cpuUsage2,
  cwd: cwd2,
  debugPort: debugPort2,
  disconnect: disconnect2,
  dlopen: dlopen2,
  domain: domain2,
  emit: emit2,
  emitWarning: emitWarning2,
  env: env2,
  eventNames: eventNames2,
  execArgv: execArgv2,
  execPath: execPath2,
  exitCode: exitCode2,
  finalization: finalization2,
  getActiveResourcesInfo: getActiveResourcesInfo2,
  getegid: getegid2,
  geteuid: geteuid2,
  getgid: getgid2,
  getgroups: getgroups2,
  getMaxListeners: getMaxListeners2,
  getuid: getuid2,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
  hrtime: hrtime32,
  initgroups: initgroups2,
  kill: kill2,
  listenerCount: listenerCount2,
  listeners: listeners2,
  loadEnvFile: loadEnvFile2,
  mainModule: mainModule2,
  memoryUsage: memoryUsage2,
  moduleLoadList: moduleLoadList2,
  nextTick: nextTick2,
  off: off2,
  on: on2,
  once: once2,
  openStdin: openStdin2,
  permission: permission2,
  pid: pid2,
  ppid: ppid2,
  prependListener: prependListener2,
  prependOnceListener: prependOnceListener2,
  rawListeners: rawListeners2,
  reallyExit: reallyExit2,
  ref: ref2,
  release: release2,
  removeAllListeners: removeAllListeners2,
  removeListener: removeListener2,
  report: report2,
  resourceUsage: resourceUsage2,
  send: send2,
  setegid: setegid2,
  seteuid: seteuid2,
  setgid: setgid2,
  setgroups: setgroups2,
  setMaxListeners: setMaxListeners2,
  setSourceMapsEnabled: setSourceMapsEnabled2,
  setuid: setuid2,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
  sourceMapsEnabled: sourceMapsEnabled2,
  stderr: stderr2,
  stdin: stdin2,
  stdout: stdout2,
  throwDeprecation: throwDeprecation2,
  title: title2,
  traceDeprecation: traceDeprecation2,
  umask: umask2,
  unref: unref2,
  uptime: uptime2,
  version: version2,
  versions: versions2
} = unenvProcess2;
var _process2 = {
  abort: abort2,
  addListener: addListener2,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags2,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback2,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback2,
  loadEnvFile: loadEnvFile2,
  sourceMapsEnabled: sourceMapsEnabled2,
  arch: arch2,
  argv: argv2,
  argv0: argv02,
  chdir: chdir2,
  config: config2,
  connected: connected2,
  constrainedMemory: constrainedMemory2,
  availableMemory: availableMemory2,
  cpuUsage: cpuUsage2,
  cwd: cwd2,
  debugPort: debugPort2,
  dlopen: dlopen2,
  disconnect: disconnect2,
  emit: emit2,
  emitWarning: emitWarning2,
  env: env2,
  eventNames: eventNames2,
  execArgv: execArgv2,
  execPath: execPath2,
  exit: exit2,
  finalization: finalization2,
  features: features2,
  getBuiltinModule: getBuiltinModule2,
  getActiveResourcesInfo: getActiveResourcesInfo2,
  getMaxListeners: getMaxListeners2,
  hrtime: hrtime32,
  kill: kill2,
  listeners: listeners2,
  listenerCount: listenerCount2,
  memoryUsage: memoryUsage2,
  nextTick: nextTick2,
  on: on2,
  off: off2,
  once: once2,
  pid: pid2,
  platform: platform2,
  ppid: ppid2,
  prependListener: prependListener2,
  prependOnceListener: prependOnceListener2,
  rawListeners: rawListeners2,
  release: release2,
  removeAllListeners: removeAllListeners2,
  removeListener: removeListener2,
  report: report2,
  resourceUsage: resourceUsage2,
  setMaxListeners: setMaxListeners2,
  setSourceMapsEnabled: setSourceMapsEnabled2,
  stderr: stderr2,
  stdin: stdin2,
  stdout: stdout2,
  title: title2,
  throwDeprecation: throwDeprecation2,
  traceDeprecation: traceDeprecation2,
  umask: umask2,
  uptime: uptime2,
  version: version2,
  versions: versions2,
  // @ts-expect-error old API
  domain: domain2,
  initgroups: initgroups2,
  moduleLoadList: moduleLoadList2,
  reallyExit: reallyExit2,
  openStdin: openStdin2,
  assert: assert22,
  binding: binding2,
  send: send2,
  exitCode: exitCode2,
  channel: channel2,
  getegid: getegid2,
  geteuid: geteuid2,
  getgid: getgid2,
  getgroups: getgroups2,
  getuid: getuid2,
  setegid: setegid2,
  seteuid: seteuid2,
  setgid: setgid2,
  setgroups: setgroups2,
  setuid: setuid2,
  permission: permission2,
  mainModule: mainModule2,
  _events: _events2,
  _eventsCount: _eventsCount2,
  _exiting: _exiting2,
  _maxListeners: _maxListeners2,
  _debugEnd: _debugEnd2,
  _debugProcess: _debugProcess2,
  _fatalException: _fatalException2,
  _getActiveHandles: _getActiveHandles2,
  _getActiveRequests: _getActiveRequests2,
  _kill: _kill2,
  _preload_modules: _preload_modules2,
  _rawDebug: _rawDebug2,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier2,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier2,
  _tickCallback: _tickCallback2,
  _disconnect: _disconnect2,
  _handleQueue: _handleQueue2,
  _pendingMessage: _pendingMessage2,
  _channel: _channel2,
  _send: _send2,
  _linkedBinding: _linkedBinding2
};
var process_default2 = _process2;
globalThis.process = process_default2;
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2((target, value) => __defProp22(target, "name", { value, configurable: true }), "__name");
// @__NO_SIDE_EFFECTS__
function createNotImplementedError22(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError22, "createNotImplementedError2");
__name2(createNotImplementedError22, "createNotImplementedError");
__name22(createNotImplementedError22, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented22(name) {
  const fn = /* @__PURE__ */ __name22(() => {
    throw /* @__PURE__ */ createNotImplementedError22(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented22, "notImplemented2");
__name2(notImplemented22, "notImplemented");
__name22(notImplemented22, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass22(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass22, "notImplementedClass2");
__name2(notImplementedClass22, "notImplementedClass");
__name22(notImplementedClass22, "notImplementedClass");
var _timeOrigin22 = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow22 = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin22;
var nodeTiming22 = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry22 = class {
  static {
    __name(this, "PerformanceEntry2");
  }
  static {
    __name2(this, "PerformanceEntry");
  }
  static {
    __name22(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow22();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow22() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark32 = class PerformanceMark222 extends PerformanceEntry22 {
  static {
    __name(this, "PerformanceMark22");
  }
  static {
    __name2(this, "PerformanceMark2");
  }
  static {
    __name22(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure22 = class extends PerformanceEntry22 {
  static {
    __name(this, "PerformanceMeasure2");
  }
  static {
    __name2(this, "PerformanceMeasure");
  }
  static {
    __name22(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming22 = class extends PerformanceEntry22 {
  static {
    __name(this, "PerformanceResourceTiming2");
  }
  static {
    __name2(this, "PerformanceResourceTiming");
  }
  static {
    __name22(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList22 = class {
  static {
    __name(this, "PerformanceObserverEntryList2");
  }
  static {
    __name2(this, "PerformanceObserverEntryList");
  }
  static {
    __name22(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance22 = class {
  static {
    __name(this, "Performance2");
  }
  static {
    __name2(this, "Performance");
  }
  static {
    __name22(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin22;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw /* @__PURE__ */ createNotImplementedError22("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming22;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming22("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin22) {
      return _performanceNow22();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark32(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure22(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError22("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw /* @__PURE__ */ createNotImplementedError22("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw /* @__PURE__ */ createNotImplementedError22("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver22 = class {
  static {
    __name(this, "PerformanceObserver2");
  }
  static {
    __name2(this, "PerformanceObserver");
  }
  static {
    __name22(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError22("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw /* @__PURE__ */ createNotImplementedError22("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance22 = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance22();
if (!("__unenv__" in performance22)) {
  const proto = Performance22.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance22)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance22, key, desc);
      }
    }
  }
}
globalThis.performance = performance22;
globalThis.Performance = Performance22;
globalThis.PerformanceEntry = PerformanceEntry22;
globalThis.PerformanceMark = PerformanceMark32;
globalThis.PerformanceMeasure = PerformanceMeasure22;
globalThis.PerformanceObserver = PerformanceObserver22;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList22;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming22;
var noop_default22 = Object.assign(() => {
}, { __unenv__: true });
var _console22 = globalThis.console;
var _ignoreErrors22 = true;
var _stderr22 = new Writable22();
var _stdout22 = new Writable22();
var log32 = _console22?.log ?? noop_default22;
var info32 = _console22?.info ?? log32;
var trace32 = _console22?.trace ?? info32;
var debug32 = _console22?.debug ?? log32;
var table32 = _console22?.table ?? log32;
var error32 = _console22?.error ?? log32;
var warn32 = _console22?.warn ?? error32;
var createTask32 = _console22?.createTask ?? /* @__PURE__ */ notImplemented22("console.createTask");
var clear32 = _console22?.clear ?? noop_default22;
var count32 = _console22?.count ?? noop_default22;
var countReset32 = _console22?.countReset ?? noop_default22;
var dir32 = _console22?.dir ?? noop_default22;
var dirxml32 = _console22?.dirxml ?? noop_default22;
var group32 = _console22?.group ?? noop_default22;
var groupEnd32 = _console22?.groupEnd ?? noop_default22;
var groupCollapsed32 = _console22?.groupCollapsed ?? noop_default22;
var profile32 = _console22?.profile ?? noop_default22;
var profileEnd32 = _console22?.profileEnd ?? noop_default22;
var time32 = _console22?.time ?? noop_default22;
var timeEnd32 = _console22?.timeEnd ?? noop_default22;
var timeLog32 = _console22?.timeLog ?? noop_default22;
var timeStamp32 = _console22?.timeStamp ?? noop_default22;
var Console22 = _console22?.Console ?? /* @__PURE__ */ notImplementedClass22("console.Console");
var _times22 = /* @__PURE__ */ new Map();
var _stdoutErrorHandler22 = noop_default22;
var _stderrErrorHandler22 = noop_default22;
var workerdConsole22 = globalThis["console"];
var {
  assert: assert32,
  clear: clear222,
  // @ts-expect-error undocumented public API
  context: context22,
  count: count222,
  countReset: countReset222,
  // @ts-expect-error undocumented public API
  createTask: createTask222,
  debug: debug222,
  dir: dir222,
  dirxml: dirxml222,
  error: error222,
  group: group222,
  groupCollapsed: groupCollapsed222,
  groupEnd: groupEnd222,
  info: info222,
  log: log222,
  profile: profile222,
  profileEnd: profileEnd222,
  table: table222,
  time: time222,
  timeEnd: timeEnd222,
  timeLog: timeLog222,
  timeStamp: timeStamp222,
  trace: trace222,
  warn: warn222
} = workerdConsole22;
Object.assign(workerdConsole22, {
  Console: Console22,
  _ignoreErrors: _ignoreErrors22,
  _stderr: _stderr22,
  _stderrErrorHandler: _stderrErrorHandler22,
  _stdout: _stdout22,
  _stdoutErrorHandler: _stdoutErrorHandler22,
  _times: _times22
});
var console_default22 = workerdConsole22;
globalThis.console = console_default22;
var hrtime42 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name22(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function hrtime222(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime22"), "hrtime2"), "hrtime"), { bigint: /* @__PURE__ */ __name22(/* @__PURE__ */ __name2(/* @__PURE__ */ __name(function bigint22() {
  return BigInt(Date.now() * 1e6);
}, "bigint2"), "bigint"), "bigint") });
var ReadStream22 = class {
  static {
    __name(this, "ReadStream2");
  }
  static {
    __name2(this, "ReadStream");
  }
  static {
    __name22(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};
var WriteStream22 = class {
  static {
    __name(this, "WriteStream2");
  }
  static {
    __name2(this, "WriteStream");
  }
  static {
    __name22(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir322, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env222) {
    return 1;
  }
  hasColors(count322, env222) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};
var NODE_VERSION22 = "22.14.0";
var Process22 = class _Process extends EventEmitter22 {
  static {
    __name(this, "_Process");
  }
  static {
    __name2(this, "_Process");
  }
  static {
    __name22(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter22.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream22(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream22(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream22(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd222) {
    this.#cwd = cwd222;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION22}`;
  }
  get versions() {
    return { node: NODE_VERSION22 };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw /* @__PURE__ */ createNotImplementedError22("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw /* @__PURE__ */ createNotImplementedError22("process.getActiveResourcesInfo");
  }
  exit() {
    throw /* @__PURE__ */ createNotImplementedError22("process.exit");
  }
  reallyExit() {
    throw /* @__PURE__ */ createNotImplementedError22("process.reallyExit");
  }
  kill() {
    throw /* @__PURE__ */ createNotImplementedError22("process.kill");
  }
  abort() {
    throw /* @__PURE__ */ createNotImplementedError22("process.abort");
  }
  dlopen() {
    throw /* @__PURE__ */ createNotImplementedError22("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw /* @__PURE__ */ createNotImplementedError22("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw /* @__PURE__ */ createNotImplementedError22("process.loadEnvFile");
  }
  disconnect() {
    throw /* @__PURE__ */ createNotImplementedError22("process.disconnect");
  }
  cpuUsage() {
    throw /* @__PURE__ */ createNotImplementedError22("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError22("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw /* @__PURE__ */ createNotImplementedError22("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw /* @__PURE__ */ createNotImplementedError22("process.initgroups");
  }
  openStdin() {
    throw /* @__PURE__ */ createNotImplementedError22("process.openStdin");
  }
  assert() {
    throw /* @__PURE__ */ createNotImplementedError22("process.assert");
  }
  binding() {
    throw /* @__PURE__ */ createNotImplementedError22("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented22("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented22("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented22("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented22("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented22("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented22("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name22(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
var globalProcess22 = globalThis["process"];
var getBuiltinModule22 = globalProcess22.getBuiltinModule;
var workerdProcess22 = getBuiltinModule22("node:process");
var unenvProcess22 = new Process22({
  env: globalProcess22.env,
  hrtime: hrtime42,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess22.nextTick
});
var { exit: exit22, features: features22, platform: platform22 } = workerdProcess22;
var {
  _channel: _channel22,
  _debugEnd: _debugEnd22,
  _debugProcess: _debugProcess22,
  _disconnect: _disconnect22,
  _events: _events22,
  _eventsCount: _eventsCount22,
  _exiting: _exiting22,
  _fatalException: _fatalException22,
  _getActiveHandles: _getActiveHandles22,
  _getActiveRequests: _getActiveRequests22,
  _handleQueue: _handleQueue22,
  _kill: _kill22,
  _linkedBinding: _linkedBinding22,
  _maxListeners: _maxListeners22,
  _pendingMessage: _pendingMessage22,
  _preload_modules: _preload_modules22,
  _rawDebug: _rawDebug22,
  _send: _send22,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier22,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier22,
  _tickCallback: _tickCallback22,
  abort: abort22,
  addListener: addListener22,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags22,
  arch: arch22,
  argv: argv22,
  argv0: argv022,
  assert: assert222,
  availableMemory: availableMemory22,
  binding: binding22,
  channel: channel22,
  chdir: chdir22,
  config: config22,
  connected: connected22,
  constrainedMemory: constrainedMemory22,
  cpuUsage: cpuUsage22,
  cwd: cwd22,
  debugPort: debugPort22,
  disconnect: disconnect22,
  dlopen: dlopen22,
  domain: domain22,
  emit: emit22,
  emitWarning: emitWarning22,
  env: env22,
  eventNames: eventNames22,
  execArgv: execArgv22,
  execPath: execPath22,
  exitCode: exitCode22,
  finalization: finalization22,
  getActiveResourcesInfo: getActiveResourcesInfo22,
  getegid: getegid22,
  geteuid: geteuid22,
  getgid: getgid22,
  getgroups: getgroups22,
  getMaxListeners: getMaxListeners22,
  getuid: getuid22,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback22,
  hrtime: hrtime322,
  initgroups: initgroups22,
  kill: kill22,
  listenerCount: listenerCount22,
  listeners: listeners22,
  loadEnvFile: loadEnvFile22,
  mainModule: mainModule22,
  memoryUsage: memoryUsage22,
  moduleLoadList: moduleLoadList22,
  nextTick: nextTick22,
  off: off22,
  on: on22,
  once: once22,
  openStdin: openStdin22,
  permission: permission22,
  pid: pid22,
  ppid: ppid22,
  prependListener: prependListener22,
  prependOnceListener: prependOnceListener22,
  rawListeners: rawListeners22,
  reallyExit: reallyExit22,
  ref: ref22,
  release: release22,
  removeAllListeners: removeAllListeners22,
  removeListener: removeListener22,
  report: report22,
  resourceUsage: resourceUsage22,
  send: send22,
  setegid: setegid22,
  seteuid: seteuid22,
  setgid: setgid22,
  setgroups: setgroups22,
  setMaxListeners: setMaxListeners22,
  setSourceMapsEnabled: setSourceMapsEnabled22,
  setuid: setuid22,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback22,
  sourceMapsEnabled: sourceMapsEnabled22,
  stderr: stderr22,
  stdin: stdin22,
  stdout: stdout22,
  throwDeprecation: throwDeprecation22,
  title: title22,
  traceDeprecation: traceDeprecation22,
  umask: umask22,
  unref: unref22,
  uptime: uptime22,
  version: version22,
  versions: versions22
} = unenvProcess22;
var _process22 = {
  abort: abort22,
  addListener: addListener22,
  allowedNodeEnvironmentFlags: allowedNodeEnvironmentFlags22,
  hasUncaughtExceptionCaptureCallback: hasUncaughtExceptionCaptureCallback22,
  setUncaughtExceptionCaptureCallback: setUncaughtExceptionCaptureCallback22,
  loadEnvFile: loadEnvFile22,
  sourceMapsEnabled: sourceMapsEnabled22,
  arch: arch22,
  argv: argv22,
  argv0: argv022,
  chdir: chdir22,
  config: config22,
  connected: connected22,
  constrainedMemory: constrainedMemory22,
  availableMemory: availableMemory22,
  cpuUsage: cpuUsage22,
  cwd: cwd22,
  debugPort: debugPort22,
  dlopen: dlopen22,
  disconnect: disconnect22,
  emit: emit22,
  emitWarning: emitWarning22,
  env: env22,
  eventNames: eventNames22,
  execArgv: execArgv22,
  execPath: execPath22,
  exit: exit22,
  finalization: finalization22,
  features: features22,
  getBuiltinModule: getBuiltinModule22,
  getActiveResourcesInfo: getActiveResourcesInfo22,
  getMaxListeners: getMaxListeners22,
  hrtime: hrtime322,
  kill: kill22,
  listeners: listeners22,
  listenerCount: listenerCount22,
  memoryUsage: memoryUsage22,
  nextTick: nextTick22,
  on: on22,
  off: off22,
  once: once22,
  pid: pid22,
  platform: platform22,
  ppid: ppid22,
  prependListener: prependListener22,
  prependOnceListener: prependOnceListener22,
  rawListeners: rawListeners22,
  release: release22,
  removeAllListeners: removeAllListeners22,
  removeListener: removeListener22,
  report: report22,
  resourceUsage: resourceUsage22,
  setMaxListeners: setMaxListeners22,
  setSourceMapsEnabled: setSourceMapsEnabled22,
  stderr: stderr22,
  stdin: stdin22,
  stdout: stdout22,
  title: title22,
  throwDeprecation: throwDeprecation22,
  traceDeprecation: traceDeprecation22,
  umask: umask22,
  uptime: uptime22,
  version: version22,
  versions: versions22,
  // @ts-expect-error old API
  domain: domain22,
  initgroups: initgroups22,
  moduleLoadList: moduleLoadList22,
  reallyExit: reallyExit22,
  openStdin: openStdin22,
  assert: assert222,
  binding: binding22,
  send: send22,
  exitCode: exitCode22,
  channel: channel22,
  getegid: getegid22,
  geteuid: geteuid22,
  getgid: getgid22,
  getgroups: getgroups22,
  getuid: getuid22,
  setegid: setegid22,
  seteuid: seteuid22,
  setgid: setgid22,
  setgroups: setgroups22,
  setuid: setuid22,
  permission: permission22,
  mainModule: mainModule22,
  _events: _events22,
  _eventsCount: _eventsCount22,
  _exiting: _exiting22,
  _maxListeners: _maxListeners22,
  _debugEnd: _debugEnd22,
  _debugProcess: _debugProcess22,
  _fatalException: _fatalException22,
  _getActiveHandles: _getActiveHandles22,
  _getActiveRequests: _getActiveRequests22,
  _kill: _kill22,
  _preload_modules: _preload_modules22,
  _rawDebug: _rawDebug22,
  _startProfilerIdleNotifier: _startProfilerIdleNotifier22,
  _stopProfilerIdleNotifier: _stopProfilerIdleNotifier22,
  _tickCallback: _tickCallback22,
  _disconnect: _disconnect22,
  _handleQueue: _handleQueue22,
  _pendingMessage: _pendingMessage22,
  _channel: _channel22,
  _send: _send22,
  _linkedBinding: _linkedBinding22
};
var process_default22 = _process22;
globalThis.process = process_default22;
var KDSRoom = class {
  static {
    __name(this, "KDSRoom");
  }
  static {
    __name2(this, "KDSRoom");
  }
  static {
    __name22(this, "KDSRoom");
  }
  constructor(state, env222) {
    this.state = state;
    this.env = env222;
  }
  async fetch(request) {
    const url = new URL(request.url);
    if (request.headers.get("Upgrade") === "websocket") {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      this.state.acceptWebSocket(server);
      return new Response(null, { status: 101, webSocket: client });
    }
    if (request.method === "POST" && url.pathname.endsWith("/broadcast")) {
      const data = await request.json();
      this.#broadcast(data);
      return new Response("ok", { status: 200 });
    }
    return new Response("Not found", { status: 404 });
  }
  webSocketMessage(ws, message) {
    try {
      const msg = JSON.parse(message);
      if (msg.type === "ping") ws.send(JSON.stringify({ type: "pong" }));
    } catch {
    }
  }
  webSocketClose(ws, code, reason) {
    ws.close(code, reason);
  }
  webSocketError(ws, error322) {
    console.error("WebSocket error:", error322);
    ws.close(1011, "Internal error");
  }
  #broadcast(data) {
    const msg = JSON.stringify(data);
    for (const ws of this.state.getWebSockets()) {
      try {
        ws.send(msg);
      } catch (_) {
      }
    }
  }
};
function getHTML() {
  return `<!DOCTYPE html>
<html lang="de" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KDS Monitor</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg:    #0d0d0d; --sur:  #161618; --sur2: #1f1f22;
    --brd:   #2a2a2f; --brd2: #3a3a42; --txt:  #ffffff;
    --muted: #d0d0d8; --amber:#f59e0b; --adim: #7a4f05;
    --blue:  #3b82f6; --green:#10b981; --red:  #ef4444;
    --font:  'Barlow Condensed', sans-serif; --mono: 'Space Mono', monospace; --hh: 56px;
    --card-scale: 1;
  }
  [data-theme="light"] {
    --bg:#f5f5f5; --sur:#ffffff; --sur2:#ececec;
    --brd:#d0d0d0; --brd2:#b0b0b0; --txt:#000000; --muted:#1a1a1a;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{width:100%;height:100dvh;min-height:100vh;overflow:hidden;touch-action:pan-y;overscroll-behavior:contain;padding-top:env(safe-area-inset-top);padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)}
  body{font-family:var(--font);background:var(--bg);color:var(--txt);font-size:16px;transition:background .2s,color .2s}

  #app{width:100vw;height:100dvh;min-height:100vh;display:grid;grid-template-rows:var(--hh) 1fr;overflow:hidden}

  header{
    background:var(--sur);border-bottom:1px solid var(--brd);
    display:flex;align-items:center;padding:0 14px;gap:11px;height:var(--hh);flex-shrink:0
  }
  .logo-img{height:34px;width:auto;object-fit:contain;flex-shrink:0}
  [data-theme="dark"]  .logo-img{filter:brightness(0) invert(1)}
  [data-theme="light"] .logo-img{filter:none}
  .div{width:1px;height:28px;background:var(--brd);flex-shrink:0}

  .mon-info{display:flex;flex-direction:column;line-height:1.25}
  .mon-host{font-size:13px;font-weight:700;color:var(--amber);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}
  .mon-ip{font-family:var(--mono);font-size:11px;color:var(--muted)}

  .rot-grp{display:flex;gap:3px}
  .rot-btn{background:transparent;border:1px solid var(--brd);color:var(--muted);padding:5px 9px;border-radius:5px;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center}
  .rot-btn:hover{border-color:var(--brd2);color:var(--txt)}
  .rot-btn.active{border-color:var(--amber);color:var(--amber);background:rgba(245,158,11,.12)}

  .theme-wrap{display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer}
  .theme-track{width:42px;height:22px;background:var(--sur2);border:1px solid var(--brd);border-radius:11px;position:relative;transition:background .2s}
  .theme-thumb{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:var(--amber);transition:transform .2s}
  [data-theme="light"] .theme-thumb{transform:translateX(20px)}
  .theme-lbl{font-size:10px;color:var(--muted);letter-spacing:.5px;font-weight:700;text-transform:uppercase}
  .reload-wrap{display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;user-select:none;-webkit-user-select:none}
  .reload-btn{width:42px;height:22px;background:var(--sur2);border:1px solid var(--brd);border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--amber);font-weight:700;transition:all .15s}
  .reload-wrap:active .reload-btn{transform:scale(.92);background:var(--amber);color:#000}
  .reload-wrap.reloading .reload-btn{animation:spinReload .8s linear infinite}
  @keyframes spinReload{from{transform:rotate(0)}to{transform:rotate(360deg)}}

  .tabs{display:flex;gap:4px;margin-left:auto}
  .tab{background:transparent;border:1px solid var(--brd);color:var(--muted);font-family:var(--font);font-size:13px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;padding:6px 16px;border-radius:5px;cursor:pointer;transition:all .15s}
  .tab.active{background:var(--amber);border-color:var(--amber);color:#000}
  .tab:not(.active):hover{border-color:var(--brd2);color:var(--txt)}

  .ws-dot{width:9px;height:9px;border-radius:50%;background:var(--muted);flex-shrink:0;transition:background .3s}
  .ws-dot.ok{background:var(--green);box-shadow:0 0 7px var(--green)}
  .ws-dot.err{background:var(--red)}

  #main{display:grid;grid-template-columns:230px 1fr;overflow:hidden;min-height:0;height:100%}
  .ta{overflow-y:auto;padding:14px}

  aside{background:var(--sur);border-right:1px solid var(--brd);display:flex;flex-direction:column;overflow:hidden}

  .sb-head{padding:12px 16px 8px;border-bottom:1px solid var(--brd);font-size:11px;font-weight:700;letter-spacing:2px;color:var(--muted);text-transform:uppercase;flex-shrink:0}

  .totals-list{flex:1;overflow-y:auto;padding:6px 0}

  .tot-row{display:flex;justify-content:space-between;align-items:center;padding:9px 16px;border-bottom:1px solid var(--brd);transition:background .2s}
  .tot-row:hover{background:var(--sur2)}

  .tot-name{font-size:16px;font-weight:600;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:150px}
  .tot-num{font-family:var(--mono);font-size:22px;font-weight:700;color:var(--amber);min-width:36px;text-align:right}

  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  .tot-num.up{animation:pulse .5s ease}

  .sb-foot{padding:10px 16px;border-top:1px solid var(--brd);font-size:13px;color:var(--muted);display:flex;justify-content:space-between;flex-shrink:0}
  .sb-foot strong{font-family:var(--mono);color:var(--txt)}

  .ta{overflow-y:auto;padding:14px;order:1}
  #tickets{overflow-y:auto;overflow-x:hidden;height:100%;min-height:0;-webkit-overflow-scrolling:touch;touch-action:pan-y;overscroll-behavior:contain}

  @keyframes sIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  .og{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px;align-content:start}

  .tc{background:var(--sur);border:1px solid var(--brd);border-radius:10px;overflow:hidden;display:flex;flex-direction:column;transition:border-color .2s;animation:sIn .25s ease}
  .tc:hover{border-color:var(--brd2)} .tc.printing{border-color:var(--blue)}

  .tc-head{padding:10px 14px;background:var(--sur2);display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--brd)}
  .tc-num{font-family:var(--mono);font-size:13px;font-weight:700;color:var(--amber)}
  .tc-tbl{font-size:34px;font-weight:700;color:var(--txt)}
  .tc-wait{font-size:13px;font-weight:600;padding:3px 9px;border-radius:5px;background:var(--bg);border:1px solid var(--brd);color:var(--muted)}
  .tc-wait.urg{color:var(--red);border-color:var(--red)} .tc-wait.wrn{color:var(--amber);border-color:var(--adim)}

  .tc-items{flex:1;padding:10px 14px;display:flex;flex-direction:column;gap:7px}
  .t-item{display:flex;gap:10px;align-items:flex-start}
  .t-qty{font-family:var(--mono);font-size:17px;font-weight:700;color:var(--amber);min-width:24px}
  .t-name{font-size:17px;font-weight:500;color:var(--txt)}
  .t-extras{margin-top:3px;display:flex;flex-wrap:wrap;gap:4px}
  .t-extra{font-size:12px;font-weight:500;padding:2px 7px;border-radius:4px;background:var(--sur2);border:1px solid var(--brd);color:var(--muted)}

  .tc-foot{padding:9px 14px;border-top:1px solid var(--brd);display:flex;gap:7px}
  .btn-p{flex:1;background:var(--amber);color:#000;border:none;font-family:var(--font);font-size:14px;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:9px;border-radius:6px;cursor:pointer;transition:all .15s}
  .btn-p:hover:not(:disabled){background:#fbbf24} .btn-p:disabled{opacity:.35;cursor:default}
  .btn-d{background:transparent;border:1px solid var(--brd);color:var(--muted);font-family:var(--font);font-size:13px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;padding:9px 14px;border-radius:6px;cursor:pointer;transition:all .15s}
  .btn-d:hover{border-color:var(--green);color:var(--green)}
  .t-item{cursor:pointer;border-radius:5px;padding:3px 5px;margin:-3px -5px;transition:background .15s;user-select:none}
  .t-item:hover{background:var(--sur2)}
  .t-item.sel{background:rgba(245,158,11,.15);border:1px solid rgba(245,158,11,.4)}
  .t-item.done{opacity:.4;cursor:not-allowed;text-decoration:line-through;pointer-events:none}
  .t-item .sel-badge{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;border-radius:11px;background:var(--amber);color:#000;font-size:12px;font-weight:800;margin-left:6px;flex-shrink:0}
  .btn-partial{flex:1;background:transparent;color:var(--amber);border:2px solid var(--amber);font-family:var(--font);font-size:13px;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:9px;border-radius:6px;cursor:pointer;transition:all .15s}
  .btn-partial:hover:not(:disabled){background:rgba(245,158,11,.12)}
  .btn-partial:disabled{opacity:.25;cursor:default;border-color:var(--brd);color:var(--muted)}

  /* \u2500\u2500 Produkt-Ansicht \u2500\u2500 */
  .pv-wrap{display:flex;flex-direction:column;gap:0;height:100%}
  .pv-header{padding:14px 16px 10px;border-bottom:2px solid var(--amber);display:flex;align-items:center;gap:10px;flex-shrink:0;justify-content:space-between}
  .pv-bons-num{font-family:var(--mono);font-size:42px;font-weight:700;color:var(--amber);line-height:1}
  .pv-bons-lbl{font-size:15px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--txt)}
  .pv{display:grid;grid-template-columns:repeat(auto-fill,minmax(calc(var(--card-scale)*300px),1fr));gap:calc(var(--card-scale)*20px);padding:20px;align-content:start;overflow-y:auto;flex:1}
  .pg{background:var(--sur);border:1px solid var(--brd);border-radius:10px;overflow:hidden;animation:sIn .25s ease;display:flex;flex-direction:column}
  .pgh{padding:14px 16px 14px 16px;background:var(--sur2);display:flex;justify-content:space-between;align-items:flex-start;gap:8px;border-radius:10px;position:relative;min-height:calc(var(--card-scale)*100px)}
  .pgn{font-size:calc(var(--card-scale)*24px);font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--txt);flex:1;line-height:1.3;word-break:break-word;padding-right:80px;padding-top:4px}
  .pgt{font-family:var(--mono);font-size:calc(var(--card-scale)*64px);font-weight:700;color:var(--amber);line-height:1;position:absolute;top:10px;right:12px}
  .scale-ctrl{display:flex;align-items:center;gap:6px;background:rgba(0,0,0,.2);border-radius:8px;padding:4px 10px;flex-shrink:0}
  .scale-ctrl button{background:none;border:1px solid rgba(255,255,255,.25);color:var(--txt);font-size:18px;font-weight:700;width:30px;height:30px;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;transition:background .15s;font-family:var(--font)}
  .scale-ctrl button:hover{background:rgba(255,255,255,.12)}
  .scale-ctrl .sc-val{font-family:var(--mono);font-size:13px;color:var(--muted);min-width:40px;text-align:center}
  [data-theme=light] .scale-ctrl{background:rgba(0,0,0,.08)}
  [data-theme=light] .scale-ctrl button{border-color:rgba(0,0,0,.2);color:#333}
  .test-mode-btn{background:none;border:1px solid rgba(255,255,255,.25);color:var(--muted);font-size:11px;font-weight:600;padding:4px 10px;border-radius:6px;cursor:pointer;letter-spacing:.5px;transition:background .15s,color .15s,border-color .15s;white-space:nowrap}
  .test-mode-btn:hover{background:rgba(255,255,255,.1)}
  .test-mode-btn.active{background:rgba(245,158,11,.2);border-color:var(--amber);color:var(--amber)}
  [data-theme=light] .test-mode-btn{border-color:rgba(0,0,0,.2);color:#666}
  [data-theme=light] .test-mode-btn.active{background:rgba(245,158,11,.15);border-color:#b45309;color:#b45309}
  [data-theme=light] .pgt{color:#111}
  [data-theme=light] .pgn{color:#111}
  .prs{padding:4px 0;flex:1}
  .pg-footer{display:flex;align-items:center;justify-content:space-between;padding:4px 6px;background:rgba(0,0,0,.15);border-top:1px solid rgba(255,255,255,.08);min-height:30px}
  .pg-footer-center{display:flex;align-items:center;gap:6px}
  .pr{display:grid;grid-template-columns:1fr 50px;align-items:center;padding:7px 16px;border-bottom:1px solid var(--brd)}
  .pr:last-child{border-bottom:none}
  .pr-tbl{font-size:15px;font-weight:500;color:var(--txt)}
  .pr-qty{font-family:var(--mono);font-size:18px;font-weight:700;color:var(--amber);text-align:right}
  .s-badge{font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:.8px}

  .empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:14px;color:var(--muted)}
  #main.products-view{grid-template-columns:1fr}
  #main.products-view aside{display:none}
  .empty-i{font-size:52px} .empty-t{font-size:19px;font-weight:600;letter-spacing:.8px}

  .pin-btn{background:transparent;border:none;cursor:pointer;opacity:.35;font-size:15px;transition:all .2s;padding:2px 5px;line-height:1}
  .pin-btn:hover{opacity:1;transform:scale(1.2)}
  .pin-btn.pinned{opacity:1;filter:drop-shadow(0 0 3px var(--amber))}
  .color-btn{width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.4);cursor:pointer;flex-shrink:0;transition:transform .15s}
  .color-btn:hover{transform:scale(1.2)}
  .color-inp{position:absolute;opacity:0;width:0;height:0}
  .pg{position:relative;display:flex;flex-direction:column}
  .pg-footer{display:flex;align-items:center;justify-content:space-between;padding:3px 5px;background:rgba(0,0,0,.15);border-top:1px solid rgba(255,255,255,.07)}
  .pg-center{display:flex;align-items:center;gap:5px}
  .pg.pinned-card{border-width:2px!important}
  .pg.zero{opacity:.45}
  .move-btn{background:rgba(0,0,0,.2);border:none;color:rgba(255,255,255,.6);font-size:11px;cursor:pointer;padding:4px 10px;border-radius:4px;transition:all .15s}
  .move-btn:hover{background:rgba(0,0,0,.5);color:#fff}
  .move-btn.left{}
  .move-btn.right{}
  /* \u2500\u2500 Konfig-Button \u2500\u2500 */
  .cfg-btn{background:none;border:none;cursor:pointer;color:var(--muted);padding:6px;border-radius:6px;transition:all .2s;display:flex;align-items:center}
  .cfg-btn:hover{background:var(--sur2);color:var(--txt)}
  .cfg-btn.pi-offline{color:#ef4444!important;animation:pulse-red 1.5s ease-in-out infinite}
  @keyframes pulse-red{0%,100%{opacity:1}50%{opacity:.4}}
  .mon-ip.pi-offline{color:#ef4444!important;font-weight:700;letter-spacing:.03em}
  /* \u2500\u2500 Modal \u2500\u2500 */
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:1000;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .25s}
  .modal-overlay.open{opacity:1;pointer-events:all}
  .modal{background:var(--sur);border:1px solid var(--brd);border-radius:12px;width:520px;max-width:95vw;max-height:90vh;overflow-y:auto;transform:translateY(12px);transition:transform .25s;box-shadow:0 24px 60px rgba(0,0,0,.5)}
  .modal-overlay.open .modal{transform:translateY(0)}
  .modal-hdr{display:flex;align-items:center;justify-content:space-between;padding:18px 22px 14px;border-bottom:1px solid var(--brd);position:sticky;top:0;background:var(--sur);z-index:1}
  .modal-title{font-size:14px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}
  .modal-close{background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px;padding:4px 8px;border-radius:4px;transition:color .15s}
  .modal-close:hover{color:var(--txt)}
  .modal-body{padding:20px 22px}
  .cfg-section{margin-bottom:22px}
  .cfg-sec-title{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:10px;display:flex;align-items:center;gap:8px}
  .cfg-sec-title::after{content:'';flex:1;height:1px;background:var(--brd)}
  .cfg-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
  .cfg-field{display:flex;flex-direction:column;gap:5px}
  .cfg-lbl{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
  .cfg-inp{background:var(--sur2);border:1px solid var(--brd);border-radius:6px;padding:8px 10px;color:var(--txt);font-family:var(--mono);font-size:13px;outline:none;transition:border-color .15s;width:100%}
  .cfg-inp:focus{border-color:var(--blue)}
  .cfg-preview{background:var(--sur2);border:1px solid var(--brd);border-radius:6px;padding:8px 10px;font-family:var(--mono);font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:6px}
  .cfg-footer{display:flex;gap:10px;padding-top:4px}
  .btn-save{background:var(--blue);color:#fff;border:none;border-radius:6px;padding:9px 20px;font-family:var(--font);font-weight:700;font-size:12px;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;transition:opacity .15s;display:flex;align-items:center;gap:6px}
  .btn-save:hover{opacity:.85}
  .btn-cancel{background:var(--sur2);color:var(--txt);border:1px solid var(--brd);border-radius:6px;padding:9px 16px;font-family:var(--font);font-weight:600;font-size:12px;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;transition:all .15s}
  .btn-cancel:hover{border-color:var(--brd2)}
  .btn-test{background:var(--sur2);color:var(--txt);border:1px solid var(--brd);border-radius:6px;padding:7px 12px;font-family:var(--font);font-weight:600;font-size:11px;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;transition:all .15s;white-space:nowrap}
  .btn-test:hover{border-color:var(--amber);color:var(--amber)}
  .cfg-msg{font-size:11px;padding:7px 10px;border-radius:5px;margin-top:10px;display:none}
  .cfg-msg.ok{display:block;background:rgba(16,185,129,.12);color:#10b981;border:1px solid rgba(16,185,129,.25)}
  .cfg-msg.err{display:block;background:rgba(239,68,68,.12);color:#ef4444;border:1px solid rgba(239,68,68,.25)}
  .cfg-msg.info{display:block;background:rgba(59,130,246,.12);color:#93c5fd;border:1px solid rgba(59,130,246,.25)}
  /* \u2500\u2500 Virtuell Tab \u2500\u2500 */
  #virtView{height:100%;overflow-y:auto;padding:20px;display:none}
  #virtView.active{display:block}
  .virt-toolbar{display:flex;align-items:center;gap:10px;margin-bottom:20px;flex-wrap:wrap}
  .v-toggle{display:flex;background:var(--sur2);border:1px solid var(--brd);border-radius:8px;overflow:hidden}
  .v-tog-btn{background:none;border:none;cursor:pointer;font-family:var(--font);font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding:8px 18px;transition:all .15s}
  .v-tog-btn.active{background:var(--amber);color:#000}
  .v-pp-btn{background:var(--sur2);border:1px solid var(--brd);border-radius:8px;cursor:pointer;font-family:var(--font);font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--txt);padding:8px 16px;display:flex;align-items:center;gap:6px;transition:all .15s}
  .v-pp-btn.paused{border-color:var(--amber);color:var(--amber)}
  .v-clr-btn{margin-left:auto;background:none;border:1px solid var(--brd);border-radius:8px;cursor:pointer;font-family:var(--font);font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding:8px 14px;transition:all .15s}
  .v-clr-btn:hover{border-color:var(--red);color:var(--red)}
  .bon-list{display:flex;flex-direction:column;gap:14px;max-width:440px}
  .bon-card{background:#f5f4ef;border-radius:8px 8px 2px 2px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.4);animation:bonPop .3s ease}
  @keyframes bonPop{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
  .bon-head{background:#e8e5dd;padding:8px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px dashed #ccc}
  .bon-meta{display:flex;flex-direction:column;gap:2px}
  .bon-badge{font-size:9px;font-weight:700;padding:2px 7px;border-radius:10px;letter-spacing:.04em;align-self:flex-start}
  .bon-badge.in{background:#dcfce7;color:#166534}
  .bon-badge.out{background:#dbeafe;color:#1e40af}
  .bon-time{font-family:var(--mono);font-size:10px;color:#888}
  .bon-del{background:none;border:none;cursor:pointer;color:#bbb;font-size:16px;line-height:1;padding:0 4px;transition:color .15s}
  .bon-del:hover{color:#ef4444}
  .bon-body{padding:12px 16px;font-family:'Courier New',monospace;font-size:12px;color:#333;line-height:1.7;background:#f9f8f4}
  .bon-item{font-size:15px;font-weight:700;color:#111;padding:1px 0}
  .bon-small{color:#888;font-size:11px}
  .bon-cut{height:6px;background:repeating-linear-gradient(90deg,#ddd 0 5px,transparent 5px 10px)}
  .bon-card{background:#f9f8f4;border-radius:6px 6px 0 0;overflow:hidden;animation:bonPop .3s ease;box-shadow:0 2px 12px rgba(0,0,0,.35)}
  @keyframes bonPop{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
  .bon-tape{background:#e8e6e0;padding:8px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px dashed #ccc}
  .bon-id{font-family:monospace;font-size:10px;color:#777}
  .bon-ts{font-family:monospace;font-size:10px;color:#999}
  .bon-badge2{font-size:9px;font-weight:700;padding:2px 8px;border-radius:10px;letter-spacing:.04em}
  .bon-badge2.in{background:#dcfce7;color:#166534}
  .bon-badge2.out{background:#dbeafe;color:#1e40af}
  .bon-body2{padding:12px 16px;font-family:'Courier New',Courier,monospace;font-size:13px;color:#111;line-height:1.7;background:#f9f8f4}
  .bon-item2{font-weight:700;font-size:14px;color:#111}
  .bon-small2{color:#888;font-size:11px}
  .bon-del2{background:none;border:none;cursor:pointer;color:#bbb;font-size:16px;line-height:1;padding:0 4px;transition:color .15s}
  .bon-zeit{font-family:monospace;font-size:11px;padding:2px 0}
  .in-zeit{color:#166534;font-weight:700}
  .dauer-zeit{color:#92400e;font-weight:700;font-size:13px}
  .out-zeit{color:#1e40af;font-weight:700}
  .bon-tisch{font-family:monospace;font-size:15px;font-weight:700;color:#111;padding:2px 0;border-bottom:1px solid #ddd;margin-bottom:4px}
  .bon-raw-line{font-family:'Courier New',Courier,monospace;font-size:12px;color:#111;white-space:pre-wrap;word-break:break-all;line-height:1.5}
  .bon-del2:hover{color:#ef4444}
  .bon-list2{display:flex;flex-direction:column;gap:14px;padding:16px;max-width:500px}
  /* \u2500\u2500 Bestellverlauf \u2500\u2500 */
  #histView{display:none;flex-direction:column;height:calc(100vh - var(--hh));padding:0;grid-row:2;grid-column:1/-1}
  .hist-topbar{display:flex;align-items:center;gap:8px;padding:8px 14px;border-bottom:1px solid var(--brd);flex-shrink:0;flex-wrap:wrap}
  #histView.active{display:flex;flex-direction:column}
  .hist-toolbar{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
  .hist-toolbar-title{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
  .kl-btn{background:var(--sur2);border:1px solid var(--brd);border-radius:20px;cursor:pointer;font-family:var(--font);font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);padding:4px 12px;transition:all .15s;white-space:nowrap}
  .kl-btn.active{background:var(--amber);color:#000;border-color:var(--amber)}
  .kl-btn:hover{border-color:var(--amber);color:var(--amber)}
  .hist-list{flex:1;overflow-y:auto;padding:8px 12px;display:flex;flex-direction:column;gap:4px}
  .hr{background:var(--sur);border:1px solid var(--brd);border-radius:6px;padding:7px 10px;font-size:11px;line-height:1.5}
  .hr-head{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
  .hr-tisch{font-size:13px;font-weight:700;color:var(--txt);min-width:70px}
  .hr-kel{font-size:11px;color:var(--amber);font-weight:700;letter-spacing:.03em}
  .hr-bon{font-size:10px;color:var(--muted);font-family:var(--mono)}
  .hr-time{font-size:10px;font-family:var(--mono);color:var(--muted);margin-left:auto}
  .hr-badge{font-size:9px;font-weight:700;padding:2px 7px;border-radius:10px;letter-spacing:.04em}
  .hr-badge.sent{background:rgba(34,197,94,.15);color:#16a34a}
  .hr-badge.open{background:rgba(251,191,36,.15);color:#d97706}
  .hr-dauer{font-size:10px;color:var(--muted);font-family:var(--mono)}
  .hr-items{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}
  .hr-item{font-size:11px;background:var(--sur2);border-radius:4px;padding:2px 8px;color:var(--txt);font-weight:600;font-family:var(--font);letter-spacing:.02em}
  .hist-empty{padding:40px;text-align:center;color:var(--muted);font-size:13px}
  .hist-tisch-wrap{display:flex;align-items:center;gap:6px;border-left:1px solid var(--brd);padding-left:10px;margin-left:6px;flex-shrink:0}
  .hist-tisch-lbl{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
  .hist-tisch-inp{background:var(--sur2);border:1px solid var(--brd);border-radius:6px;color:var(--txt);font-family:var(--mono);font-size:13px;font-weight:700;width:60px;padding:3px 8px;text-align:center;outline:none}
  .hist-tisch-inp:focus{border-color:var(--amber)}
  .hist-tisch-inp.active{border-color:var(--amber);background:rgba(245,158,11,.1)}
  .v-empty{color:var(--muted);font-size:14px;padding:40px;text-align:center;border:1px dashed var(--brd);border-radius:8px;max-width:440px}
  /* \u2500\u2500 Virtual Printer \u2500\u2500 */
  #vp-view{display:none;flex-direction:column;overflow-y:auto;height:calc(100vh - var(--hh));padding:20px;width:100%}
  #vp-view.active{display:flex;flex-direction:column}
  .vp-toolbar{display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--sur);border-bottom:1px solid var(--brd);flex-shrink:0}
  .vp-title{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
  .vp-seg{display:flex;background:var(--sur2);border-radius:6px;padding:2px;gap:2px}
  .vp-seg-btn{background:none;border:none;color:var(--muted);font-family:var(--font);font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:5px 12px;border-radius:4px;cursor:pointer;transition:all .15s}
  .vp-seg-btn.active{background:var(--blue);color:#fff}
  .vp-play{background:none;border:1px solid var(--brd);border-radius:6px;padding:5px 12px;color:var(--txt);font-family:var(--font);font-size:11px;font-weight:700;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:5px;margin-left:auto}
  .vp-play.playing{border-color:var(--green);color:var(--green)}
  .vp-play.paused{border-color:var(--amber);color:var(--amber)}
  .vp-bons{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}
  .vp-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--muted);gap:8px;font-size:13px}
  /* \u2500\u2500 Umsatz/Bons-Chart \u2500\u2500 */
  #vpChart{flex-shrink:0;padding:16px 20px 0;border-top:1px solid var(--brd)}
  .vpc-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
  .vpc-title{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
  .vpc-seg{display:flex;background:var(--sur2);border-radius:5px;padding:2px;gap:2px}
  .vpc-btn{background:none;border:none;color:var(--muted);font-family:var(--font);font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:4px 10px;border-radius:3px;cursor:pointer;transition:all .15s}
  .vpc-btn.active{background:var(--amber);color:#000}
  .vpc-wrap{position:relative;height:120px;width:100%}
  .vpc-svg{width:100%;height:100%;overflow:visible}
  .vpc-bar{transition:opacity .15s}
  .vpc-bar:hover{opacity:.7}
  .vpc-tooltip{position:absolute;background:var(--sur2);border:1px solid var(--brd2);border-radius:5px;padding:5px 9px;font-size:11px;font-family:var(--mono);color:var(--txt);pointer-events:none;display:none;white-space:nowrap;z-index:10}
  .vpc-now-line{stroke:var(--amber);stroke-width:1.5;stroke-dasharray:3,3}
  /* \u2500\u2500 Diagramm-View \u2500\u2500 */
  #diagView{display:none;flex-direction:column;overflow-y:auto;height:calc(100vh - var(--hh));padding:20px;width:100%;gap:16px}
  #diagView.active{display:flex}
  .diag-card{background:var(--sur);border:1px solid var(--brd);border-radius:10px;padding:18px}
  .diag-card-title{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
  .diag-seg{display:flex;background:var(--sur2);border-radius:5px;padding:2px;gap:2px}
  .diag-btn{background:none;border:none;color:var(--muted);font-family:var(--font);font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:4px 10px;border-radius:3px;cursor:pointer;transition:all .15s}
  .diag-btn.active{background:var(--amber);color:#000}
  .diag-kl-wrap{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px}
  .diag-kl-btn{background:none;border:1px solid var(--brd);color:var(--muted);font-family:var(--font);font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:4px 10px;border-radius:4px;cursor:pointer;transition:all .15s}
  .diag-kl-btn.active{border-color:var(--amber);color:var(--amber);background:rgba(245,158,11,.12)}
  .diag-chart-wrap{position:relative;height:160px;width:100%}
  .diag-svg{width:100%;height:100%;overflow:visible}
  .diag-bar{transition:opacity .15s;cursor:pointer}
  .diag-bar:hover{opacity:.65}
  .diag-tooltip{position:absolute;background:var(--sur2);border:1px solid var(--brd2);border-radius:6px;padding:7px 11px;font-size:11px;font-family:var(--mono);color:var(--txt);pointer-events:none;display:none;white-space:nowrap;z-index:10;line-height:1.6}
  .diag-now-line{stroke:var(--amber);stroke-width:1.5;stroke-dasharray:3,3}
  .diag-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}
  .diag-stat{background:var(--sur2);border-radius:7px;padding:12px;text-align:center}
  .diag-stat-val{font-size:22px;font-weight:800;color:var(--amber);font-family:var(--mono)}
  .diag-stat-lbl{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-top:3px}
  .bon-card{background:var(--sur);border:1px solid var(--brd);border-radius:8px;padding:12px 14px;display:flex;align-items:flex-start;gap:12px;transition:border-color .15s}
  .bon-card:hover{border-color:var(--brd2)}
  .bon-card-body{flex:1;min-width:0}
  .bon-card-hdr{display:flex;align-items:center;gap:8px;margin-bottom:6px}
  .bon-num{font-size:11px;font-weight:700;color:var(--muted);font-family:var(--mono)}
  .bon-time{font-size:10px;color:var(--muted);margin-left:auto}
  .bon-items{font-size:13px;font-weight:600;color:var(--txt);line-height:1.5}
  .bon-table{font-size:10px;color:var(--muted);margin-top:3px}
  .bon-del{background:none;border:none;color:var(--muted);cursor:pointer;padding:4px 8px;border-radius:4px;font-size:14px;transition:color .15s;flex-shrink:0}
  .bon-del:hover{color:var(--red)}
  .pi-ip-display{user-select:none;-webkit-user-select:none;pointer-events:none;opacity:.85}
  .accordion-btn{width:100%;background:var(--sur2);border:1px solid var(--brd);border-radius:6px;padding:9px 12px;color:var(--txt);font-family:var(--font);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:all .15s;margin-bottom:0}
  .accordion-btn:hover{border-color:var(--brd2)}
  .accordion-btn .arr{transition:transform .2s;font-size:10px}
  .accordion-btn.open .arr{transform:rotate(180deg)}
  .accordion-body{overflow:hidden;max-height:0;transition:max-height .3s ease}
  .accordion-body.open{max-height:400px}
  .asello-table{width:100%;border-collapse:collapse;margin-top:8px;font-size:11px}
  .asello-table tr{border-bottom:1px solid var(--brd)}
  .asello-table tr:last-child{border-bottom:none}
  .asello-table td{padding:6px 8px}
  .asello-table td:first-child{color:var(--muted);width:55%;font-weight:600}
  .asello-table td:last-child{font-family:var(--mono);color:var(--txt)}
  .asello-table .tag-on{background:rgba(16,185,129,.15);color:#10b981;border:1px solid rgba(16,185,129,.3);border-radius:3px;padding:1px 6px;font-family:var(--font);font-size:10px;font-weight:700}
  .asello-table .tag-off{background:var(--sur2);color:var(--muted);border:1px solid var(--brd);border-radius:3px;padding:1px 6px;font-family:var(--font);font-size:10px}
  .pip-lbl{font-size:16px;line-height:1}
  .pip-inp{background:var(--bg);border:1px solid var(--brd);color:var(--txt);font-family:var(--mono);font-size:12px;padding:4px 7px;border-radius:5px;width:140px;outline:none}
  .pip-inp:focus{border-color:var(--amber)}
  .pip-btn{background:transparent;border:1px solid var(--brd);color:var(--muted);padding:4px 7px;border-radius:5px;cursor:pointer;font-size:13px;transition:all .15s}
  .pip-btn:hover{border-color:var(--green);color:var(--green)}
  ::-webkit-scrollbar{width:12px;height:12px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:var(--brd2);border-radius:6px;border:2px solid transparent;background-clip:padding-box}
  ::-webkit-scrollbar-thumb:hover{background:var(--amber);background-clip:padding-box;border:2px solid transparent}

  /* Touch-Scroll-Haertung: explizit Wischen erlauben, Scroll-Chaining stoppen */
  .ta,#tickets,.totals-list,.pv,#virtView,.modal,
  .hist-list,#vp-view,.vp-bons,#diagView{
    -webkit-overflow-scrolling:touch;
    touch-action:pan-y;
    overscroll-behavior:contain;
  }
</style>
</head>
<body>
<div id="app">
  <header>
    <img class="logo-img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAAAoCAYAAACl+UfqAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAALi0lEQVR42u2Ze2xU153HP+feO+/xC9sYG4yxDdjgsBRsiHkqNGRTNWkJbB6bbTbabpBSdXeVfajtRlX+6GZXG62UZitVqypNlT6UZKMSKH3xMCyhEIMdAi4QbGNjD7bHz3l53nPn3nv2j7GnNiEJTVb7R+SfNNLMOWfO7/f73t/7CkCyQAAoCxAsgLEAxgIYC2AsgPGpSbvdohACIcRnVmkpJVJ+sKIQC3XGh1iGoihYlsWLL36XHdu3oKoCRVFIpbIoisBuV0lnDKSUFHoc6FmTZDqL06HhsGvEEzqmZeFx27FpCkiIJXVcDg3TkkgJNk0ha5ioqoKUoAhIprNYlkRVFZwODSlBiNwTFEKQSOq4XTYUITBMC1XNebdpWqhKTsZYIkOR14k+c7dhWCiKQBGQ0U2cDg3DMDFMSduJkzz33HN5fT/STXZsb6VuzWYO/OYShQUuHn9gLaHpLNf6xtm8qRpVgx8d6GLj2uVsb1nM+wNhOi+P8OSeFlQBR88OcHM8RlGhk8f+tIHj7T4cqsBu0xgJJVizcjGDQyFsqoKiwK6tKwDQTTj5zgA2TcGmKXi9DiLRNJ/fXsO5K+NEExmWlRfgGw6jKbCytoyxcIpQJMmXd9bx2pFu1taVMzwaoWKRm1Asg6IpbGuu4eDRqySSGb6yr5lYLJoPBx8bM4LBCOcPvkvPjRFCkRSxeJTKUi8/fKOTp59oZUm5l1ffOMvIztVsaLiXN3/ZSduZPlZUudixcQVH2rqIpLL4/BF8Pj+KomAXsLzcy6X+AJOBEOHJKMuXFrNokYdoLInH7aC7b4LznT3UV5ewtKqYKyPjdFwYYmfzUo6c6EK1qSwrLyAaTrC0sgi90sWhY10cOtFNS+NTPPf9Izy9r5lkPE3j8hJisQzBlMHQ0Cjnu0aQpsV4MMW6yvidZxMpBG6Hjf2PbmJzSy3Xh8IUep0UF7m55gtyuW8KRdNYXFqAqqp0DQSZimfxT8TRNI2SIg/feGonX324hWs3gnxz/z00ra5kPJzm+X/8AnXLy7kyGOLxfZu5/54mvB4XqqrisNu4OhDki/fdxb071rCrdTWaTWMyGKfQ5eDe1nr8gQSK3c6je1pYs6qKkgI3ybTJ7y4O0bi8jPUNlXznmfsJRTPU1Vbw7NO70ITCQ/euZd+D6+kdCmGa8s7B8LgcNDUs4eXXO9n2uWr+9Zn7SCazSAnpRIarfRP4JmNE4hkyWYPRyRh3rSxHGCamZWFaFh1XR+m44idjWEgp8U/GuD4UQkpJMp2l2xfklTc7uNQ9mgvjgGFJ+sci/OzQJU53DlBR6mFZRSHX+id4t3uMivJCJqdTvNM1zGuHL5FK6yiqQCA59D89pDMGppmLTX1DIUYmY0gpWb92Kb8+1UtWN3jlX75InuGdgJE1TFo3VNG8roqXX+9gKhRHAvXVJQyNTdPVO8GGhgosCUNj0xS77ezft4Eit51ILM3IZJyfHrrIu1f97H+4GSEE8XSWeEpHCIFhSWw2lY7LI/j84bxohmnhtNu42j/Jlf4JnA4bml3l4Mke+sajVFUUYlqSVMbgzEUfad1EFYKNjUsYm4gx4I9gt6sIAdMJnaxpIYRgfdMyHrpvLW/95gq9AxG8bvvHgzGbeiPRFN946STbW+txux381xsdJNI6poCpWAa300Z5mRchYGwqhltT6BsM4HXbMLIGgWiKrZtqKCt2UV+9CIBM1iQczwBgUwXhRIYfPL+Xvbub8nwdNpWpSJJvfu0e/vYvtgBQX1NK32CAqnIvHqedeEKnoqKQH3xnLyWFLjLpLBvWVvLUl/6EnU1VeJy2nA6JDKmMAcC3XjqGw+vg7o3LefHH7UQT6TuwjJlHZFoW57v8nOsaxlQVBsemGQ8mUBSV8hI3KyqL8LjsJDNZum9M4nLbKSsr4O1OH4FwAodNZUNjJSA4fKonB4ZuMjWdmgd6W3s/Zy/dJK1nAbAsiaYqdPx+mLffHSSe1HF5nEjDYldzzUwGgNB0ktMXfHQPTuF2apR6XWxeX41DVXDaVCCX0iPxnNKX3h/l2Jk+LE1wY3QaXTfnyXFbMGbNdUlZAfsfaebfXznDmfd8PPOVVrJSEtOzrKkvp6G2jEVFTpw2lcs3JmlYVcFfPrSR05dH6PEFCCYzFBe62NZcw+mLN3OMVAWHI5e8NE1BUQTf+3E7z750nGAkmRfA7bHz+i+7+Kf/+C19QwGa11SSlpK6GQsr8NoZ9If59neP8ZPDl3C5bJjSoq6mDI/XjmnNaKiKPL+/e6KVY+39/OdPzvE3j29iUbE7D+wHksfsR1EUCci2tuNSSin942EZmk5KKaWMJtIymkhLPWvIbNaQiVRGJlMZGYmlZDKtS8uyZCCSkMmULgORhMzoWalnDRkIx6WUUiZSmfxdGT23HomlZDSelqZpSSmlNExTBiIJGY4m5XQ8JbOGKaWUciIUk+lMNi9HIJKQ07GkTKV1mUhlZDSeklJKmc7oMps1pJRShqaTMpHS5SyFppNyZDwspZTyrQMHJCBVVZVz9dduX7vnqr+qiuKc+UpJgdsxv0DRcubomlPvlxblEHfN+C1AabEHKSVupx23M7dmt6mUFns+wFNVlPwdc2lxiTf//VY55pLD/ge+JYWueb1ISaGLkkJnri/5Y7tWIQSGkSu9FSFmALoFsFvOz5JpmnO+W/m9uc3RbLNkWXKm7M6Bbt3iyLPncmdzaXv23tw6+b358v1BaSEEUkqyWeMjG9CPbOHndq9CzPcxIXIxJplMkUyl8PvHGBoeQc9mUVU1f05VFQKBINe6e2/bMSpKjodpmihCoAhBKBSmt7ePVCo9h3+uB1EVhUwmk+9PQOb35j4eIcS8auJOOnHt03R5lmXx87cOc7a9k/raGkzL4tv//A+cOXuO7dtaATh9pp3jJ95mOjLNs9/6e5YtrZp3RzQa5Uevvsb4xBR/9eSfk0gk+d73X8Y0TR75sy/z+V07KCosZGoqwKBvCMMwePWn/82TTzzKjhkeup7lwsUutrZuyjd3/2fzjDudCQgh2LljK8FQmC13t/DmgV9wvO0UBw79irq6FSytqqTr91fZt+cBCgu8HP7VEXQ9y9RUkNWr6onGYjidDm4O+/n6019lefVSpJRs3bKZdU2NXL3Ww/P/9iKqplK9bCmhUJhVK+so8Hr47ZE2xsYm6L3ez7qmRo62nWJdUyNer/cTA6J9GqtQVZWz75xny90tnDr9Duc73mNJxWIqKhbT3t7J3oceRM/onG3vYPu2u7l5c4REMkksFscwDM6dv0BDw0oaVtcTDkc4cfI0X3rwfrq7exkY8FFaWoJpWSSiKSzLxDAMenr70DSN9y5eJhAI4XQ5GBh0U1xUxPmOC9y3exeWZX0iMD7x2E9RFKano3ReuITdbmdiYoq62hqCwTDDw6OUli7i6vvd+G4Os7V1E0ePnmRsfILtWzazdk0DwVCYNY2r8I+OcWPAx8qVdTzy8B58viG8BV6+/rW/Zu+eB7g5NEJ//wDxeJKe6/10dL5H7/V+amuXE43GKC8rI55MMOwfxe12f6rhzrxJ1+yw48iRI+zevRvTNOcFw1td5GLXZS5fvkZ9/QrWNK4ilUyjZ3VSqQz1dStQVYVjbacoLCigpeVz9PT0sX79XfzuTDsraqopLi5mfHwCt9vFyvpaQDA0PIJpmtSuqGFyKoDfP4rT6cTpdBAKhVFVlYICLx6Pm1Aows2hEdY1NTIxGaBpbQOa9uHGbhgGmqZx8OBBHnvsMVRVnZf5blt0nTt3Tn6W6ejRox9fdM2mvBdeeIHq6mosy5pJWR8eN2atZDaX35rKTNOcty+EyPv03P/M8pmtD5SZvdn9290/u68oyjw5PkpeRVG4ceNG/vfCQPiPySaqqn7mXxXcGisWLGPhjdoCGAtgLICxAMYCGAtgLIDx/0T/C9808K507J9yAAAAAElFTkSuQmCC" alt="Smarte Events">
    <div class="div"></div>
    <div class="mon-info">
      <div class="mon-host" id="mHost">\u2013</div>
      <div class="mon-ip"   id="mIp">\u2013.\u2013.\u2013.\u2013</div>
    </div>
        <button class="cfg-btn" onclick="openCfg()" title="Drucker-Konfiguration">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    </button>
    <div class="div"></div>
    <div class="rot-grp">
      <button class="rot-btn" id="rL" onclick="rot('left')" title="Hochformat links">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="5" y="1" width="8" height="14" rx="2" stroke="currentColor" stroke-width="1.3"/>
          <path d="M9 8L5 4L9 0" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="5" y1="4" x2="13" y2="4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
      </button>
      <button class="rot-btn active" id="rU" onclick="rot('landscape')" title="Querformat">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="5" width="16" height="9" rx="2" stroke="currentColor" stroke-width="1.3"/>
          <path d="M9 2L12 5M9 2L6 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
      </button>
      <button class="rot-btn" id="rR" onclick="rot('right')" title="Hochformat rechts">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="5" y="1" width="8" height="14" rx="2" stroke="currentColor" stroke-width="1.3"/>
          <path d="M9 8L13 4L9 0" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="13" y1="4" x2="5" y2="4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    <div class="div"></div>
    <div class="theme-wrap" onclick="toggleTheme()">
      <div class="theme-track"><div class="theme-thumb"></div></div>
      <span class="theme-lbl" id="tLbl">DUNKEL</span>
    </div>
    <div class="reload-wrap" onclick="hardReload()" title="App neu laden (Cache leeren)">
      <div class="reload-btn">\u21BB</div>
      <span class="theme-lbl">RELOAD</span>
    </div>
    <div class="tabs">
      <button class="tab active" id="tO" onclick="sv('orders')">Bestellungen</button>
      <button class="tab"        id="tP" onclick="sv('products')">Produkte</button>
      <button class="tab"        id="tV" onclick="sv('virtual')">Virtuell</button>
      <button class="tab"        id="tD" onclick="sv('diagram')">Diagramm</button>
      <button class="tab"        id="tH" onclick="sv('history')">Verlauf</button>
    </div>
    <div class="ws-dot" id="wsDot"></div>
  </header>

  <div id="main">
    <aside>
      <div class="sb-head">Live-Summe</div>
      <div class="totals-list" id="totList"></div>
      <div class="sb-foot"><span>Offene Bons</span><strong id="totBons">0</strong></div>
    </aside>
    <div id="tickets"></div>
  </div>
<div id="vp-view">
  <div class="vp-toolbar">
    <span class="vp-title">\u{1F5A8} Virtueller Drucker</span>
    <div class="vp-seg">
      <button class="vp-seg-btn active" id="vpIn" onclick="vpType('in')">\u{1F4E5} Einkommend</button>
      <button class="vp-seg-btn" id="vpOut" onclick="vpType('out')">\u{1F4E4} Ausgehend</button>
    </div>
    <button class="vp-play playing" id="vpPlay" onclick="vpTogglePlay()">
      <span id="vpPlayIcon">\u25B6</span><span id="vpPlayLabel">AKTIV</span>
    </button>
  </div>
  <div class="vp-bons" id="vpBons">
    <div class="vp-empty">\u23F3 Lade Bons\u2026</div>
  </div>
  <div id="vpChart">
    <div class="vpc-header">
      <span class="vpc-title">\u{1F4CA} Bons je Stunde</span>
      <div class="vpc-seg">
        <button class="vpc-btn active" id="vpc1" onclick="vpcDays(1)">Heute</button>
        <button class="vpc-btn" id="vpc7" onclick="vpcDays(7)">7 Tage</button>
        <button class="vpc-btn" id="vpc30" onclick="vpcDays(30)">30 Tage</button>
      </div>
    </div>
    <div class="vpc-wrap">
      <svg class="vpc-svg" id="vpcSvg" viewBox="0 0 480 120" preserveAspectRatio="none"></svg>
      <div class="vpc-tooltip" id="vpcTip"></div>
    </div>
  </div>
</div>
<div id="histView">
  <div class="hist-toolbar" id="histToolbar">
    <span class="hist-toolbar-title">Kellner:</span>
  </div>
  <div class="hist-tisch-wrap" style="flex-shrink:0">
    <span class="hist-tisch-lbl">Tisch:</span>
    <input type="text" id="histTischInp" class="hist-tisch-inp" placeholder="Nr." maxlength="6">
  </div>
  <div class="hist-list" id="histList"><div class="hist-empty">Lade Verlauf\u2026</div></div>
</div>
</div>
<div id="diagView">
  <div class="diag-card">
    <div class="diag-card-title">
      <span>\u{1F4CA} Artikel je Stunde</span>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <div class="diag-kl-wrap" id="diagKlWrap" style="margin-bottom:0"></div>
        <div class="diag-seg">
          <button class="diag-btn active" id="dg1" onclick="dgDays(1)">Heute</button>
          <button class="diag-btn" id="dg7" onclick="dgDays(7)">7 Tage</button>
          <button class="diag-btn" id="dg30" onclick="dgDays(30)">30 Tage</button>
        </div>
      </div>
    </div>
    <div class="diag-chart-wrap">
      <svg class="diag-svg" id="diagSvg" viewBox="0 0 480 160" preserveAspectRatio="none"></svg>
      <div class="diag-tooltip" id="diagTip"></div>
    </div>
    <div class="diag-summary" id="diagSummary">
      <div class="diag-stat"><div class="diag-stat-val" id="dgStatTickets">\u2013</div><div class="diag-stat-lbl">Bons</div></div>
      <div class="diag-stat"><div class="diag-stat-val" id="dgStatItems">\u2013</div><div class="diag-stat-lbl">Artikel</div></div>
      <div class="diag-stat"><div class="diag-stat-val" id="dgStatPeak">\u2013</div><div class="diag-stat-lbl">Spitzenstunde</div></div>
    </div>
  </div>
</div>


<!-- Drucker-Konfigurations-Modal -->
<div class="modal-overlay" id="cfgModal" onclick="if(event.target===this)closeCfg()">
  <div class="modal">
    <div class="modal-hdr">
      <span class="modal-title">\u2699 Drucker-Konfiguration</span>
      <button class="modal-close" onclick="closeCfg()">\u2715</button>
    </div>
    <div class="modal-body">
      <div class="cfg-section">
        <div class="cfg-sec-title">\u{1F3F7} Anzeigename</div>
        <div class="cfg-field">
          <label class="cfg-lbl">Name im Header</label>
          <div style="display:flex;gap:8px;align-items:center">
            <input type="text" id="cfgDisplayName" class="cfg-input" style="flex:1"
              placeholder="z.B. k\xFCchenmonitor" maxlength="30">
            <button class="btn-save" onclick="saveDisplayName()" style="padding:6px 14px;font-size:12px">\u{1F4BE} Speichern</button>
          </div>
          <div style="font-size:11px;color:var(--muted);margin-top:4px">Wird im Header statt des Domain-Namens angezeigt</div>
        </div>
      </div>
      <div class="cfg-section">
        <div class="cfg-sec-title">\u{1F4E5} Eingehender Drucker (Raspberry Pi)</div>

        <div class="cfg-field">
          <label class="cfg-lbl">asello Drucker-Einstellung</label>
          <div class="cfg-preview" id="proxyPreview" style="color:var(--muted)">\u2014</div>
        </div>
        <div style="margin-top:10px">
          <button class="accordion-btn" id="aselloAccBtn" onclick="toggleAsello()">
            <span>\u{1F4CB} asello Drucker-Einstellungen anzeigen</span>
            <span class="arr">\u25BC</span>
          </button>
          <div class="accordion-body" id="aselloAccBody">
            <table class="asello-table">
              <tr><td>Typ</td><td>Epson TM-T88V/TM-T70II Ethernet</td></tr>
              <tr><td>IP-Adresse</td><td id="aselloIp"><b style="color:var(--amber)">print.team24.training</b></td></tr>
              <tr><td>Port</td><td>80</td></tr>
              <tr><td style="color:var(--amber)">\u26A1 IMMER G\xDCLTIG</td><td style="font-size:10px;color:var(--muted)">Tunnel \u2013 funktioniert in jedem Netzwerk</td></tr>
              <tr><td>HTTPS verwenden</td><td><span class="tag-off">AUS</span></td></tr>
              <tr><td>Ohne Warten fortfahren</td><td><span class="tag-on">AN</span></td></tr>
              <tr><td>E-POS Device verwenden</td><td><span class="tag-off">AUS</span></td></tr>
              <tr><td>Netzwerk Timeout</td><td>20 Sek.</td></tr>
              <tr><td>Wartezeit nach Druck</td><td>7,5 Sek.</td></tr>
            </table>
          </div>
        </div>
        <div class="cfg-grid" style="margin-bottom:10px">
          <div class="cfg-field">
            <label class="cfg-lbl">Pi IP-Adresse <span style="font-size:10px;color:var(--muted)">(Raspberry Pi im Netzwerk)</span></label>
            <input class="cfg-inp" id="cfgProxyIp" placeholder="192.168.192.70">
          </div>
          <div class="cfg-field">
            <label class="cfg-lbl">Pi Port</label>
            <input class="cfg-inp" id="cfgProxyPort" placeholder="8009" type="number">
          </div>
        </div>
      </div>

      <div class="cfg-section">
        <div class="cfg-sec-title">\u{1F4E4} Ausgehender Drucker (Physisch)</div>
        <div class="cfg-grid">
          <div class="cfg-field">
            <label class="cfg-lbl">Drucker IP-Adresse <span style="font-size:10px;color:var(--muted)">(auto-erkannt bei Netzwechsel)</span></label>
            <div style="display:flex;gap:6px">
              <input class="cfg-inp" id="cfgPrinterIp" placeholder="192.168.192.202" style="flex:1">
              <button class="btn-test" id="scanBtn" onclick="doScanPrinter()" style="padding:6px 10px;font-size:11px">\u{1F50D}</button>
            </div>
          </div>
          <div class="cfg-field">
            <label class="cfg-lbl">Drucker Port</label>
            <input class="cfg-inp" id="cfgPrinterPort" placeholder="9100" type="number">
          </div>
        </div>
        <div class="cfg-grid" style="margin-top:10px">
          <div class="cfg-field">
            <label class="cfg-lbl">Zeichen pro Zeile</label>
            <input class="cfg-inp" id="cfgChars" placeholder="42" type="number" min="20" max="80" oninput="updateCplPreview()">
          </div>
          <div class="cfg-field">
            <label class="cfg-lbl">&nbsp;</label>
            <button class="btn-test" id="testBtn" onclick="doTestPrint()">\u{1F5A8} Testdruck</button>
          </div>
        </div>
        <div class="cfg-lbl" style="margin-top:8px;margin-bottom:4px">Vorschau Zeilenbreite</div>
        <div class="cfg-preview" id="cplPreview" style="font-size:10px">1234567890</div>
      </div>

      <div class="cfg-section" style="margin-top:12px">
        <div class="cfg-sec-title">\u{1F504} Backup-Drucker (Fallback)</div>
        <div class="cfg-grid">
          <div class="cfg-field">
            <label class="cfg-lbl">Backup IP-Adresse</label>
            <input class="cfg-inp" id="cfgBackupIp" placeholder="leer = kein Backup">
          </div>
          <div class="cfg-field">
            <label class="cfg-lbl">Backup Port</label>
            <input class="cfg-inp" id="cfgBackupPort" placeholder="9100" type="number">
          </div>
        </div>
      </div>
      <div class="cfg-footer">
        <button class="btn-save" onclick="saveCfg()">\u2713 Speichern</button>
        <button class="btn-cancel" onclick="closeCfg()">Abbrechen</button>
      </div>
      <div style="border-top:1px solid var(--brd);margin-top:16px;padding-top:14px">
        <div class="cfg-sec-title">\u{1F5D1} Alte Tickets</div>
        <div style="display:flex;align-items:center;gap:10px;margin-top:8px">
          <span style="font-size:12px;color:var(--muted)">Tickets \xE4lter als</span>
          <input class="cfg-inp" id="clearMinutes" value="60" type="number" min="5" style="width:70px">
          <span style="font-size:12px;color:var(--muted)">Minuten l\xF6schen</span>
          <button class="btn-cancel" onclick="clearOldTickets()" style="margin-left:auto;color:var(--red);border-color:var(--red)">L\xF6schen</button>
        </div>
      </div>
      <div class="cfg-msg" id="cfgMsg"></div>
    </div>
  </div>
</div>

<script src="/app.js" defer><\/script>
</body>
</html>`;
}
__name(getHTML, "getHTML");
__name2(getHTML, "getHTML");
__name22(getHTML, "getHTML");
var CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Key"
};
async function ensureKorrekturColumns(env222) {
  await env222.DB.prepare("ALTER TABLE tickets ADD COLUMN is_korrektur INTEGER DEFAULT 0").run().catch(() => {
  });
  await env222.DB.prepare("ALTER TABLE ticket_items ADD COLUMN is_korrektur INTEGER DEFAULT 0").run().catch(() => {
  });
}
__name(ensureKorrekturColumns, "ensureKorrekturColumns");
__name2(ensureKorrekturColumns, "ensureKorrekturColumns");
__name22(ensureKorrekturColumns, "ensureKorrekturColumns");
async function cleanupOldData(env222) {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1e3).toISOString().replace("T", " ").substring(0, 19);
  const pj = await env222.DB.prepare("DELETE FROM print_jobs WHERE created_at < ?").bind(cutoff).run().catch(() => ({ meta: { changes: 0 } }));
  const bl = await env222.DB.prepare("DELETE FROM bon_log WHERE created_at < ?").bind(cutoff).run().catch(() => ({ meta: { changes: 0 } }));
  const ti = await env222.DB.prepare("DELETE FROM ticket_items WHERE ticket_id IN (SELECT id FROM tickets WHERE created_at < ?)").bind(cutoff).run().catch(() => ({ meta: { changes: 0 } }));
  const tk = await env222.DB.prepare("DELETE FROM tickets WHERE created_at < ?").bind(cutoff).run().catch(() => ({ meta: { changes: 0 } }));
  console.log(`[CLEANUP] Gel\xF6scht: ${tk.meta.changes} Tickets, ${pj.meta.changes} Jobs, ${ti.meta.changes} Items, ${bl.meta.changes} Bon-Logs`);
  return { tickets: tk.meta.changes, jobs: pj.meta.changes, items: ti.meta.changes, bonLogs: bl.meta.changes };
}
__name(cleanupOldData, "cleanupOldData");
__name2(cleanupOldData, "cleanupOldData");
__name22(cleanupOldData, "cleanupOldData");
var index_default = {
  async scheduled(event, env222, ctx) {
    ctx.waitUntil(cleanupOldData(env222));
  },
  async fetch(request, env222, ctx) {
    const url = new URL(request.url);
    const method = request.method;
    if (method === "OPTIONS") return new Response(null, { headers: CORS });
    if (url.pathname.startsWith("/ws")) {
      const stationId = url.searchParams.get("station") || "all";
      const id = env222.KDS_ROOM.idFromName(stationId);
      const room = env222.KDS_ROOM.get(id);
      return room.fetch(request);
    }
    if (url.pathname.startsWith("/api/")) {
      return handleAPI(request, env222, url, method);
    }
    if (url.pathname === "/manifest.json") {
      const manifest = {
        name: "KDS Monitor",
        short_name: "KDS",
        start_url: "/",
        display: "fullscreen",
        background_color: "#0d0d0d",
        theme_color: "#0d0d0d",
        orientation: "any",
        icons: [
          { src: "https://kds.team24.training/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "https://kds.team24.training/icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      };
      return new Response(JSON.stringify(manifest), {
        headers: { ...CORS, "Content-Type": "application/manifest+json", "Cache-Control": "no-cache" }
      });
    }
    if (url.pathname === "/app.js") {
      return new Response(appJs, {
        headers: { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-cache" }
      });
    }
    return new Response(getHTML(), {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};
async function handleAPI(request, env222, url, method) {
  const path = url.pathname.replace("/api", "");
  try {
    if (path === "/stations" && method === "GET") return jsonResponse(await getStations(env222));
    if (path === "/tickets" && method === "GET") return jsonResponse(await getTickets(env222, url.searchParams.get("station")));
    if (path === "/tickets" && method === "POST") {
      requireApiKey(request, env222);
      const ticket = await createTicket(env222, await request.json());
      await broadcastUpdate(env222, ticket.station_id, { type: "ticket_created", ticket });
      return jsonResponse(ticket, 201);
    }
    const printMatch = path.match(/^\/tickets\/(\d+)\/print$/);
    if (printMatch && method === "POST") {
      const result = await printTicket(env222, parseInt(printMatch[1]));
      await broadcastUpdate(env222, result.station_id, { type: "ticket_printed", ticketId: parseInt(printMatch[1]) });
      await broadcastUpdate(env222, result.station_id, { type: "print_job", stationId: result.station_id });
      return jsonResponse(result);
    }
    const partialMatch = path.match(/^\/tickets\/(\d+)\/partial-print$/);
    if (partialMatch && method === "POST") {
      const body = await request.json();
      const result = await partialPrintTicket(env222, parseInt(partialMatch[1]), body.items || []);
      await broadcastUpdate(env222, result.station_id, { type: "ticket_partial_printed", ticketId: parseInt(partialMatch[1]) });
      await broadcastUpdate(env222, result.station_id, { type: "print_job", stationId: result.station_id });
      return jsonResponse(result);
    }
    const doneMatch = path.match(/^\/tickets\/(\d+)\/done$/);
    if (doneMatch && method === "POST") {
      const result = await markDone(env222, parseInt(doneMatch[1]));
      await broadcastUpdate(env222, result.station_id, { type: "ticket_done", ticketId: parseInt(doneMatch[1]) });
      return jsonResponse(result);
    }
    if (path === "/print-jobs/pending" && method === "GET") {
      requireApiKey(request, env222);
      const stationFilter = url.searchParams.get("station");
      return jsonResponse(await getPendingJobs(env222, stationFilter));
    }
    if (path === "/print-jobs/recent" && method === "GET") {
      requireApiKey(request, env222);
      return jsonResponse(await getRecentJobs(env222));
    }
    const completeMatch = path.match(/^\/print-jobs\/\d+\/complete$/);
    if (completeMatch && method === "POST") {
      requireApiKey(request, env222);
      return jsonResponse(await completeJob(env222, parseInt(path.split("/")[2])));
    }
    if (path === "/agent" && method === "POST") {
      requireApiKey(request, env222);
      const body = await request.json();
      const { hostname, ip, stationId, printerIp: reportedPrinterIp } = body;
      const agentData = { hostname, ip, stationId, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
      if (reportedPrinterIp) agentData.printerIp = reportedPrinterIp;
      const agentKey = stationId ? "agent_info_" + stationId : "agent_info";
      await env222.DB.prepare(
        "INSERT INTO kv_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value"
      ).bind(agentKey, JSON.stringify(agentData)).run().catch(async () => {
        await env222.DB.prepare("CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT)").run();
        await env222.DB.prepare("INSERT INTO kv_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(agentKey, JSON.stringify({ hostname, ip, updated_at: (/* @__PURE__ */ new Date()).toISOString() })).run();
      });
      return jsonResponse({ ok: true });
    }
    if (path === "/agent" && method === "GET") {
      const stationParam = url.searchParams.get("station");
      const agentKey = stationParam ? "agent_info_" + stationParam : "agent_info";
      const row = await env222.DB.prepare("SELECT value FROM kv_store WHERE key=?").bind(agentKey).first().catch(() => null);
      if (!row) {
        const fallback = await env222.DB.prepare("SELECT value FROM kv_store WHERE key='agent_info'").first().catch(() => null);
        return jsonResponse(fallback ? JSON.parse(fallback.value) : null);
      }
      return jsonResponse(JSON.parse(row.value));
    }
    if (path === "/agent-script" && method === "GET") {
      const stationId = parseInt(url.searchParams.get("station") || "0");
      const stations = {
        1: { hostname: "monitor1", printerIp: "192.168.192.199" },
        2: { hostname: "monitor2", printerIp: "10.0.0.125" },
        3: { hostname: "monitor3", printerIp: "192.168.192.212" }
      };
      const st = stations[stationId];
      if (!st) return new Response("station param required (1/2/3)", { status: 400 });
      const script = `'use strict';
const https = require('https');
const http  = require('http');
const net   = require('net');
const os    = require('os');

const API_HOST    = 'monitor3.smarte.events';
const API_KEY     = 'kds-smarte-events-2026';
const STATION_ID  = ${stationId};
const HOSTNAME_PI = '${st.hostname}';
const PRINTER_IP  = '${st.printerIp}';
const PRINTER_PORT = 9100;
const PROXY_PORT   = 8009;

function getLocalIp() {
  for (const ifaces of Object.values(os.networkInterfaces())) {
    for (const iface of ifaces) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return '127.0.0.1';
}

function apiRequest(method, path, body, cb) {
  const data = body ? JSON.stringify(body) : null;
  const req = https.request({
    hostname: API_HOST, port: 443, path: '/api' + path,
    method, headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': API_KEY,
      ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
    }
  }, res => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', () => {
      try { cb(null, JSON.parse(raw)); } catch(e) { cb(null, raw); }
    });
  });
  req.on('error', cb);
  req.setTimeout(8000, () => { req.destroy(new Error('timeout')); });
  if (data) req.write(data);
  req.end();
}

function sendHeartbeat(attempt) {
  attempt = attempt || 0;
  const ip = getLocalIp();
  apiRequest('POST', '/agent', { hostname: HOSTNAME_PI, ip, stationId: STATION_ID }, (err) => {
    if (err) {
      console.error('[HB] attempt', attempt + 1, 'failed:', err.message);
      if (attempt < 2) setTimeout(() => sendHeartbeat(attempt + 1), 5000 * (attempt + 1));
    } else {
      console.log('[HB] OK', new Date().toISOString());
    }
  });
}

function sendToPrinter(payload, cb) {
  const buf = Buffer.isBuffer(payload) ? payload : Buffer.from(payload, 'base64');
  const sock = new net.Socket();
  sock.setTimeout(5000);
  sock.connect(PRINTER_PORT, PRINTER_IP, () => { sock.write(buf); sock.end(); });
  sock.on('close', () => cb(null));
  sock.on('error', cb);
  sock.on('timeout', () => { sock.destroy(); cb(new Error('printer timeout')); });
}

function processPrintJobs() {
  apiRequest('GET', '/print-jobs/pending?station=' + STATION_ID, null, (err, data) => {
    if (err) return;
    const jobs = (data && (data.results || data)) || [];
    if (!Array.isArray(jobs) || jobs.length === 0) return;
    let i = 0;
    function next() {
      if (i >= jobs.length) return;
      const job = jobs[i++];
      sendToPrinter(job.payload || '', (pErr) => {
        if (pErr) { console.error('[PRINT] Job', job.id, 'printer error:', pErr.message); next(); return; }
        apiRequest('POST', '/print-jobs/' + job.id + '/complete', {}, () => {
          console.log('[PRINT] Job', job.id, 'done');
          next();
        });
      });
    }
    next();
  });
}

function processReprintJobs() {
  apiRequest('GET', '/reprint-jobs/pending?station=' + STATION_ID, null, (err, data) => {
    if (err) return;
    const jobs = (data && (data.results || data)) || [];
    if (!Array.isArray(jobs) || jobs.length === 0) return;
    jobs.forEach(job => {
      const buf = Buffer.from(job.text || '', 'utf8');
      sendToPrinter(buf, (pErr) => {
        if (pErr) { console.error('[REPRINT] Job', job.id, 'failed:', pErr.message); return; }
        apiRequest('POST', '/reprint-jobs/' + job.id + '/complete', {}, () => {
          console.log('[REPRINT] Job', job.id, 'done');
        });
      });
    });
  });
}

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ station: STATION_ID, hostname: HOSTNAME_PI, printer: PRINTER_IP, uptime: process.uptime() }));
}).listen(PROXY_PORT, () => console.log('[PROXY] Listening on', PROXY_PORT));

console.log('[KDS] Station', STATION_ID, '(' + HOSTNAME_PI + ') starting --', new Date().toISOString());
sendHeartbeat();
setInterval(sendHeartbeat, 30000);
setInterval(processPrintJobs, 5000);
setInterval(processReprintJobs, 5000);
`;
      return new Response(script, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
    if (path === "/config" && method === "GET") {
      const stationParam = url.searchParams.get("station");
      const cfgKey = stationParam ? "printer_config_" + stationParam : "printer_config";
      let row = await env222.DB.prepare("SELECT value FROM kv_store WHERE key=?").bind(cfgKey).first().catch(() => null);
      if (!row && stationParam) row = await env222.DB.prepare("SELECT value FROM kv_store WHERE key='printer_config'").first().catch(() => null);
      return jsonResponse(row ? JSON.parse(row.value) : {
        printerIp: "192.168.192.202",
        printerPort: 9100,
        charsPerLine: 42,
        proxyIp: "192.168.192.70",
        proxyPort: 8009
      });
    }
    if (path === "/config" && method === "POST") {
      requireApiKey(request, env222);
      const body = await request.json();
      const val = JSON.stringify({
        printerIp: body.printerIp || "192.168.192.202",
        printerPort: body.printerPort || 9100,
        charsPerLine: body.charsPerLine || 42,
        proxyIp: body.proxyIp || "192.168.192.70",
        proxyPort: body.proxyPort || 8009,
        backupIp: body.backupIp || "",
        backupPort: body.backupPort || 9100
      });
      const stationPostParam = url.searchParams.get("station") || body.stationId;
      const cfgKeyPost = stationPostParam ? "printer_config_" + stationPostParam : "printer_config";
      await env222.DB.prepare("INSERT INTO kv_store (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(cfgKeyPost, val).run().catch(async () => {
        await env222.DB.prepare("CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT)").run();
        await env222.DB.prepare("INSERT INTO kv_store (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(cfgKeyPost, val).run();
      });
      if (stationPostParam) {
        await env222.DB.prepare("INSERT INTO kv_store (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind("printer_config", val).run().catch(() => {
        });
      }
      return jsonResponse({ ok: true });
    }
    if (path === "/pins" && method === "GET") {
      const stationParam = url.searchParams.get("station");
      const pinsKey = stationParam ? "pins_" + stationParam : "pins";
      const row = await env222.DB.prepare("SELECT value FROM kv_store WHERE key=?").bind(pinsKey).first().catch(() => null);
      return jsonResponse(row ? JSON.parse(row.value) : { pins: {}, colors: {} });
    }
    if (path === "/pins" && method === "POST") {
      requireApiKey(request, env222);
      const body = await request.json();
      const val = JSON.stringify({ pins: body.pins || {}, colors: body.colors || {} });
      const stationPostParam = url.searchParams.get("station") || body.stationId;
      const pinsKeyPost = stationPostParam ? "pins_" + stationPostParam : "pins";
      await env222.DB.prepare("INSERT INTO kv_store (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(pinsKeyPost, val).run().catch(async () => {
        await env222.DB.prepare("CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT)").run();
        await env222.DB.prepare("INSERT INTO kv_store (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(pinsKeyPost, val).run();
      });
      return jsonResponse({ ok: true });
    }
    if (path === "/test-print" && method === "POST") {
      requireApiKey(request, env222);
      const row = await env222.DB.prepare("SELECT value FROM kv_store WHERE key='printer_config'").first().catch(() => null);
      const cfg = row ? JSON.parse(row.value) : { proxyIp: "192.168.192.70", proxyPort: 8009 };
      const piUrl = `http://print.team24.training/test-print`;
      try {
        const res = await fetch(piUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ charsPerLine: cfg.charsPerLine || 42 }),
          signal: AbortSignal.timeout(1e4)
        });
        const data = await res.json().catch(() => ({}));
        return jsonResponse({ ok: res.ok, ...data });
      } catch (e) {
        return jsonResponse({ ok: false, error: e.message }, 502);
      }
    }
    if (path === "/client-ip" && method === "GET") {
      return jsonResponse({ ip: request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unbekannt" });
    }
    if (path === "/totals" && method === "GET") return jsonResponse(await getTotals(env222, url.searchParams.get("station")));
    if (path === "/bon-log" && method === "POST") {
      requireApiKey(request, env222);
      const b = await request.json();
      const { type, preview, rawText } = b;
      try {
        await env222.DB.prepare("CREATE TABLE IF NOT EXISTS bon_log (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, preview TEXT, raw_text TEXT, created_at TEXT)").run();
        await env222.DB.prepare("ALTER TABLE bon_log ADD COLUMN preview TEXT").run().catch(() => {
        });
        await env222.DB.prepare("ALTER TABLE bon_log ADD COLUMN raw_text TEXT").run().catch(() => {
        });
        await env222.DB.prepare("INSERT INTO bon_log (type, preview, raw_text, created_at) VALUES (?,?,?,?)").bind(type || "incoming", preview || "", rawText || "", (/* @__PURE__ */ new Date()).toISOString()).run();
        await env222.DB.prepare("DELETE FROM bon_log WHERE type=? AND id NOT IN (SELECT id FROM bon_log WHERE type=? ORDER BY id DESC LIMIT 3)").bind(type || "incoming", type || "incoming").run().catch(() => {
        });
        return jsonResponse({ ok: true });
      } catch (dbErr) {
        console.error("bon-log DB Fehler:", dbErr.message);
        return jsonResponse({ ok: false, error: dbErr.message }, 500);
      }
    }
    if (path === "/bon-log" && method === "GET") {
      const type = url.searchParams.get("type") || "incoming";
      const limit = parseInt(url.searchParams.get("limit")) || 3;
      const stationParam = url.searchParams.get("station");
      let rows;
      if (stationParam) {
        rows = await env222.DB.prepare(
          "SELECT id, type, preview, raw_text, created_at FROM bon_log WHERE type=? AND station_id=? ORDER BY id DESC LIMIT ?"
        ).bind(type, parseInt(stationParam), limit).all().catch(() => ({ results: [] }));
      } else {
        rows = await env222.DB.prepare(
          "SELECT id, type, preview, raw_text, created_at FROM bon_log WHERE type=? ORDER BY id DESC LIMIT ?"
        ).bind(type, limit).all().catch(() => ({ results: [] }));
      }
      return jsonResponse(rows.results || []);
    }
    const reprintMatch = path.match(/^\/bon-log\/(\d+)\/reprint$/);
    if (reprintMatch && method === "POST") {
      requireApiKey(request, env222);
      const bonId = parseInt(reprintMatch[1]);
      const body = await request.json().catch(() => ({}));
      const station = parseInt(body.station) || 1;
      const bon = await env222.DB.prepare("SELECT id, preview, raw_text FROM bon_log WHERE id=?").bind(bonId).first().catch(() => null);
      if (!bon) return jsonResponse({ ok: false, error: "Bon nicht gefunden" }, 404);
      const text = bon.raw_text && bon.raw_text.length ? bon.raw_text : bon.preview || "";
      if (!text) return jsonResponse({ ok: false, error: "Kein Bon-Text vorhanden" }, 400);
      await env222.DB.prepare("CREATE TABLE IF NOT EXISTS reprint_jobs (id INTEGER PRIMARY KEY AUTOINCREMENT, station_id INTEGER, text TEXT, status TEXT DEFAULT 'pending', created_at TEXT, completed_at TEXT)").run();
      await env222.DB.prepare("INSERT INTO reprint_jobs (station_id, text, status, created_at) VALUES (?,?,'pending',?)").bind(station, text, (/* @__PURE__ */ new Date()).toISOString()).run();
      await env222.DB.prepare("DELETE FROM reprint_jobs WHERE status='done' AND completed_at < ?").bind(new Date(Date.now() - 36e5).toISOString()).run().catch(() => {
      });
      await broadcastUpdate(env222, station, { type: "print_job", stationId: station }).catch(() => {
      });
      return jsonResponse({ ok: true });
    }
    if (path === "/reprint-jobs/pending" && method === "GET") {
      const station = parseInt(url.searchParams.get("station")) || 1;
      await env222.DB.prepare("CREATE TABLE IF NOT EXISTS reprint_jobs (id INTEGER PRIMARY KEY AUTOINCREMENT, station_id INTEGER, text TEXT, status TEXT DEFAULT 'pending', created_at TEXT, completed_at TEXT)").run().catch(() => {
      });
      const r = await env222.DB.prepare("SELECT id, text FROM reprint_jobs WHERE station_id=? AND status='pending' ORDER BY id ASC").bind(station).all().catch(() => ({ results: [] }));
      return jsonResponse(r.results || []);
    }
    const reprintDoneMatch = path.match(/^\/reprint-jobs\/(\d+)\/complete$/);
    if (reprintDoneMatch && method === "POST") {
      requireApiKey(request, env222);
      const jobId = parseInt(reprintDoneMatch[1]);
      await env222.DB.prepare("UPDATE reprint_jobs SET status='done', completed_at=? WHERE id=?").bind((/* @__PURE__ */ new Date()).toISOString(), jobId).run().catch(() => {
      });
      return jsonResponse({ ok: true });
    }
    if (path === "/stats/items-by-hour" && method === "GET") {
      const days = parseInt(url.searchParams.get("days") || "1");
      const kellner = url.searchParams.get("kellner") || null;
      const cutoff = new Date(Date.now() - days * 24 * 3600 * 1e3).toISOString().replace("T", " ").slice(0, 19);
      let sql, binds;
      if (kellner) {
        sql = "SELECT strftime('%H', t.created_at) as hour, COUNT(DISTINCT t.id) as tickets, SUM(ti.quantity) as items FROM tickets t JOIN ticket_items ti ON ti.ticket_id = t.id WHERE t.created_at >= ? AND t.kellner = ? GROUP BY hour ORDER BY hour";
        binds = [cutoff, kellner];
      } else {
        sql = "SELECT strftime('%H', t.created_at) as hour, COUNT(DISTINCT t.id) as tickets, SUM(ti.quantity) as items FROM tickets t JOIN ticket_items ti ON ti.ticket_id = t.id WHERE t.created_at >= ? GROUP BY hour ORDER BY hour";
        binds = [cutoff];
      }
      const { results } = await env222.DB.prepare(sql).bind(...binds).all().catch(() => ({ results: [] }));
      const map = {};
      for (const r of results || []) map[r.hour] = { tickets: r.tickets || 0, items: r.items || 0 };
      const hours = Array.from({ length: 24 }, (_, i) => {
        const h = String(i).padStart(2, "0");
        return { hour: h, ...map[h] || { tickets: 0, items: 0 } };
      });
      return jsonResponse(hours);
    }
    if (path === "/stats/kellner" && method === "GET") {
      const days = parseInt(url.searchParams.get("days") || "1");
      const cutoff = new Date(Date.now() - days * 24 * 3600 * 1e3).toISOString().replace("T", " ").slice(0, 19);
      const { results } = await env222.DB.prepare(
        "SELECT DISTINCT kellner FROM tickets WHERE created_at >= ? AND kellner IS NOT NULL AND kellner != '' ORDER BY kellner"
      ).bind(cutoff).all().catch(() => ({ results: [] }));
      return jsonResponse((results || []).map((r) => r.kellner));
    }
    if (path === "/stats/bons-by-hour" && method === "GET") {
      const days = parseInt(url.searchParams.get("days") || "1");
      const cutoff = new Date(Date.now() - days * 24 * 3600 * 1e3).toISOString();
      const { results } = await env222.DB.prepare(
        "SELECT strftime('%H', created_at) as hour, COUNT(*) as count FROM bon_log WHERE type='incoming' AND created_at >= ? GROUP BY hour ORDER BY hour"
      ).bind(cutoff).all().catch(() => ({ results: [] }));
      const map = {};
      for (const r of results || []) map[r.hour] = r.count;
      const hours = Array.from({ length: 24 }, (_, i) => {
        const h = String(i).padStart(2, "0");
        return { hour: h, count: map[h] || 0 };
      });
      return jsonResponse(hours);
    }
    if (path === "/bon-log" && method === "DELETE") {
      requireApiKey(request, env222);
      const b = await request.json().catch(() => ({}));
      if (b.id) {
        await env222.DB.prepare("DELETE FROM bon_log WHERE id=?").bind(b.id).run().catch(() => {
        });
      } else {
        await env222.DB.prepare("DELETE FROM bon_log").run().catch(() => {
        });
      }
      return jsonResponse({ ok: true });
    }
    if (path === "/pause-state" && method === "GET") {
      const row = await env222.DB.prepare("SELECT value FROM kv_store WHERE key='pause_state'").first().catch(() => null);
      return jsonResponse({ paused: row ? JSON.parse(row.value).paused : false });
    }
    if (path === "/pause-state" && method === "POST") {
      requireApiKey(request, env222);
      const b = await request.json();
      const val = JSON.stringify({ paused: !!b.paused });
      await env222.DB.prepare("INSERT INTO kv_store (key,value) VALUES ('pause_state',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(val).run().catch(async () => {
        await env222.DB.prepare("CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT)").run();
        await env222.DB.prepare("INSERT INTO kv_store (key,value) VALUES ('pause_state',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(val).run();
      });
      return jsonResponse({ ok: true });
    }
    if (path === "/tickets/clear" && method === "POST") {
      requireApiKey(request, env222);
      const b = await request.json().catch(() => ({}));
      const olderThan = b.olderThanMinutes || 60;
      const cutoff = new Date(Date.now() - olderThan * 6e4).toISOString();
      await env222.DB.prepare("DELETE FROM tickets WHERE created_at < ?").bind(cutoff).run().catch(() => {
      });
      await env222.DB.prepare("DELETE FROM ticket_items WHERE ticket_id NOT IN (SELECT id FROM tickets)").run().catch(() => {
      });
      return jsonResponse({ ok: true, cutoff });
    }
    if (path === "/bons" && method === "GET") {
      const type = url.searchParams.get("type") || "in";
      const limit = parseInt(url.searchParams.get("limit") || "3");
      const rows = await env222.DB.prepare(
        "SELECT id, type, summary, created_at FROM bon_log WHERE type=? ORDER BY created_at DESC LIMIT ?"
      ).bind(type, limit).all().catch(() => ({ results: [] }));
      return jsonResponse(rows.results || []);
    }
    if (path.startsWith("/bons/") && method === "DELETE") {
      requireApiKey(request, env222);
      const id = parseInt(path.split("/")[2]);
      await env222.DB.prepare("DELETE FROM bon_log WHERE id=?").bind(id).run().catch(() => {
      });
      return jsonResponse({ ok: true });
    }
    if (path === "/bons" && method === "POST") {
      requireApiKey(request, env222);
      const body = await request.json();
      const summary = JSON.stringify({
        ticketNumber: body.ticketNumber,
        items: body.items,
        time: body.time,
        table: body.table,
        type: body.type
      });
      await env222.DB.prepare(
        "CREATE TABLE IF NOT EXISTS bon_log (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, summary TEXT, created_at TEXT)"
      ).run().catch(() => {
      });
      await env222.DB.prepare(
        "INSERT INTO bon_log (type, summary, created_at) VALUES (?,?,?)"
      ).bind(body.type || "in", summary, (/* @__PURE__ */ new Date()).toISOString()).run().catch(() => {
      });
      await env222.DB.prepare(
        "DELETE FROM bon_log WHERE type=? AND id NOT IN (SELECT id FROM bon_log WHERE type=? ORDER BY created_at DESC LIMIT 20)"
      ).bind(body.type || "in", body.type || "in").run().catch(() => {
      });
      return jsonResponse({ ok: true });
    }
    if (path === "/bons/state" && method === "GET") {
      const row = await env222.DB.prepare("SELECT value FROM kv_store WHERE key='bon_state'").first().catch(() => null);
      return jsonResponse(row ? JSON.parse(row.value) : { paused: false });
    }
    if (path === "/bons/state" && method === "POST") {
      requireApiKey(request, env222);
      const body = await request.json();
      const val = JSON.stringify({ paused: body.paused });
      await env222.DB.prepare("INSERT INTO kv_store (key,value) VALUES ('bon_state',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(val).run().catch(async () => {
        await env222.DB.prepare("CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT)").run();
        await env222.DB.prepare("INSERT INTO kv_store (key,value) VALUES ('bon_state',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(val).run();
      });
      return jsonResponse({ ok: true });
    }
    if (path === "/history" && method === "GET") {
      const kellner = url.searchParams.get("kellner") || null;
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 200);
      await env222.DB.prepare("ALTER TABLE tickets ADD COLUMN kellner TEXT").run().catch(() => {
      });
      const tisch = url.searchParams.get("tisch") || null;
      let rows;
      if (tisch) {
        rows = await env222.DB.prepare(
          "SELECT id, ticket_number, table_number, status, created_at, printed_at, kellner FROM tickets WHERE table_number=? ORDER BY created_at DESC LIMIT ?"
        ).bind(tisch, limit).all();
      } else if (kellner) {
        rows = await env222.DB.prepare(
          "SELECT id, ticket_number, table_number, status, created_at, printed_at, kellner FROM tickets WHERE kellner=? ORDER BY created_at DESC LIMIT ?"
        ).bind(kellner, limit).all();
      } else {
        rows = await env222.DB.prepare(
          "SELECT id, ticket_number, table_number, status, created_at, printed_at, kellner FROM tickets ORDER BY created_at DESC LIMIT ?"
        ).bind(limit).all();
      }
      const tickets = rows.results || [];
      for (const t of tickets) {
        const items = await env222.DB.prepare(
          "SELECT product_name, quantity FROM ticket_items WHERE ticket_id=? ORDER BY id"
        ).bind(t.id).all();
        t.items = items.results || [];
        if (t.printed_at && t.created_at) {
          t.wait_secs = Math.round((/* @__PURE__ */ new Date((t.printed_at || "").replace(" ", "T") + "Z") - /* @__PURE__ */ new Date((t.created_at || "").replace(" ", "T") + "Z")) / 1e3);
        } else if (t.created_at) {
          t.wait_secs = Math.round((Date.now() - (/* @__PURE__ */ new Date((t.created_at || "").replace(" ", "T") + "Z")).getTime()) / 1e3);
        } else {
          t.wait_secs = 0;
        }
      }
      const kellnerRows = await env222.DB.prepare(
        'SELECT DISTINCT kellner FROM tickets WHERE kellner IS NOT NULL AND kellner != "" ORDER BY kellner'
      ).all();
      const kellnerList = (kellnerRows.results || []).map((r) => r.kellner);
      return jsonResponse({ tickets, kellnerList });
    }
    if (path === "/admin/cleanup" && method === "POST") {
      requireApiKey(request, env222);
      const result = await cleanupOldData(env222);
      return jsonResponse({ ok: true, deleted: result });
    }
    if (path === "/status" && method === "GET") {
      const agentRow = await env222.DB.prepare("SELECT ip, stationId, updated_at FROM agent_state ORDER BY updated_at DESC LIMIT 1").first().catch(() => null);
      const ticketCount = await env222.DB.prepare("SELECT COUNT(*) as n FROM tickets WHERE status != 'done'").first().catch(() => ({ n: 0 }));
      return jsonResponse({
        ok: true,
        worker: "kds-cloudflare",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        openTickets: ticketCount?.n ?? 0,
        agent: agentRow ? { ip: agentRow.ip, stationId: agentRow.stationId, lastSeen: agentRow.updated_at } : null
      });
    }
    if (path === "/print-jobs" && method === "GET") {
      const stationId = url.searchParams.get("station");
      let jobs;
      if (stationId) {
        const r = await env222.DB.prepare("SELECT pj.*, t.table_number FROM print_jobs pj JOIN tickets t ON pj.ticket_id = t.id WHERE pj.status = 'pending' AND t.station_id = ? ORDER BY pj.created_at ASC").bind(parseInt(stationId)).all();
        jobs = r.results || [];
      } else {
        const r = await env222.DB.prepare("SELECT pj.*, t.table_number FROM print_jobs pj JOIN tickets t ON pj.ticket_id = t.id WHERE pj.status = 'pending' ORDER BY pj.created_at ASC").all();
        jobs = r.results || [];
      }
      return jsonResponse(jobs.map((j) => ({
        ...j,
        payload: (() => {
          try {
            return JSON.parse(j.payload);
          } catch {
            return j.payload;
          }
        })()
      })));
    }
    return jsonResponse({ error: "Not found" }, 404);
  } catch (err) {
    if (err.status === 401) return jsonResponse({ error: "Unauthorized" }, 401);
    console.error(err);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
}
__name(handleAPI, "handleAPI");
__name2(handleAPI, "handleAPI");
__name22(handleAPI, "handleAPI");
async function getStations(env222) {
  const { results } = await env222.DB.prepare("SELECT * FROM stations ORDER BY name").all();
  return results;
}
__name(getStations, "getStations");
__name2(getStations, "getStations");
__name22(getStations, "getStations");
async function getTickets(env222, stationId) {
  await ensureKorrekturColumns(env222);
  let query = `SELECT t.*, COALESCE(t.is_korrektur, 0) as is_korrektur, COALESCE(t.kellner, s.name, 'Kellner') as station_name, s.color as station_color FROM tickets t LEFT JOIN stations s ON t.station_id = s.id WHERE t.status != 'done'`;
  const params = [];
  if (stationId) {
    query += " AND t.station_id = ?";
    params.push(stationId);
  }
  query += " ORDER BY COALESCE(t.is_korrektur, 0) DESC, t.created_at ASC";
  const { results: tickets } = await env222.DB.prepare(query).bind(...params).all();
  if (!tickets.length) return [];
  const ids = tickets.map((t) => t.id);
  const { results: allItems } = await env222.DB.prepare("SELECT *, COALESCE(is_korrektur, 0) as is_korrektur FROM ticket_items WHERE ticket_id IN (" + ids.map(() => "?").join(",") + ")").bind(...ids).all();
  const itemsByTicket = {};
  for (const item of allItems) {
    if (!itemsByTicket[item.ticket_id]) itemsByTicket[item.ticket_id] = [];
    itemsByTicket[item.ticket_id].push({ ...item, extras: JSON.parse(item.extras || "[]") });
  }
  const now = Date.now();
  for (const ticket of tickets) {
    ticket.items = itemsByTicket[ticket.id] || [];
    ticket.wait_secs = Math.floor((now - (/* @__PURE__ */ new Date((ticket.created_at || "").replace(" ", "T") + "Z")).getTime()) / 1e3);
    ticket.is_korrektur = !!ticket.is_korrektur;
  }
  return tickets;
}
__name(getTickets, "getTickets");
__name2(getTickets, "getTickets");
__name22(getTickets, "getTickets");
async function createTicket(env222, body) {
  const { ticket_number, table_number, station_id, station_name: bonKellner, items, is_korrektur } = body;
  const originalItemsJson = JSON.stringify(items || []);
  await env222.DB.prepare("ALTER TABLE tickets ADD COLUMN kellner TEXT").run().catch(() => {
  });
  await ensureKorrekturColumns(env222);
  const existing = await env222.DB.prepare(
    "SELECT id, ticket_number, table_number, station_id FROM tickets WHERE ticket_number = ? AND station_id = ? AND status IN ('pending','printing')"
  ).bind(ticket_number, station_id).first().catch(() => null);
  if (existing) {
    console.log("[TICKET] Duplikat ignoriert (noch aktiv):", ticket_number, "station", station_id);
    return existing;
  }
  const isKorrInt = is_korrektur ? 1 : 0;
  const { meta } = await env222.DB.prepare("INSERT INTO tickets (ticket_number, table_number, station_id, original_items, kellner, is_korrektur) VALUES (?, ?, ?, ?, ?, ?)").bind(ticket_number, table_number, station_id, originalItemsJson, bonKellner || null, isKorrInt).run();
  const ticketId = meta.last_row_id;
  for (const item of items || []) {
    const itemKorrInt = item.is_korrektur ? 1 : 0;
    await env222.DB.prepare("INSERT INTO ticket_items (ticket_id, product_name, quantity, extras, is_korrektur) VALUES (?, ?, ?, ?, ?)").bind(ticketId, item.product_name, item.quantity, JSON.stringify(item.extras || []), itemKorrInt).run();
  }
  try {
    await env222.DB.prepare("ALTER TABLE bon_log ADD COLUMN station_id INTEGER").run().catch(() => {
    });
    const visibleItems = (items || []).filter((i) => !i.is_korrektur || i.quantity > 0);
    if (visibleItems.length > 0 && station_id) {
      const bonPreview = `Bonierbon
## Bereich: ${table_number || ""}
Benutzer: ${bonKellner || "Kellner"}
` + visibleItems.map((i) => `## ${i.quantity} ${i.product_name}`).join("\n") + "\nBonierbon - Keine Rechnung!";
      await env222.DB.prepare("INSERT INTO bon_log (type, preview, raw_text, created_at, station_id) VALUES (?,?,?,?,?)").bind("incoming", bonPreview, "", (/* @__PURE__ */ new Date()).toISOString(), station_id).run();
      await env222.DB.prepare("DELETE FROM bon_log WHERE type='incoming' AND station_id=? AND id NOT IN (SELECT id FROM bon_log WHERE type='incoming' AND station_id=? ORDER BY id DESC LIMIT 20)").bind(station_id, station_id).run().catch(() => {
      });
    }
  } catch (_e) {
  }
  return { id: ticketId, ticket_number, table_number, station_id, items, is_korrektur: !!is_korrektur };
}
__name(createTicket, "createTicket");
__name2(createTicket, "createTicket");
__name22(createTicket, "createTicket");
async function printTicket(env222, ticketId) {
  await ensureKorrekturColumns(env222);
  const ticket = await env222.DB.prepare("SELECT t.*, COALESCE(t.is_korrektur, 0) as is_korrektur, COALESCE(t.kellner, s.name, 'BESTELLUNG') as station_name FROM tickets t LEFT JOIN stations s ON t.station_id = s.id WHERE t.id = ?").bind(ticketId).first();
  if (!ticket) throw Object.assign(new Error("Not found"), { status: 404 });
  const { results: items } = await env222.DB.prepare("SELECT *, COALESCE(is_korrektur, 0) as is_korrektur FROM ticket_items WHERE ticket_id = ?").bind(ticketId).all();
  const originalItems = ticket.original_items ? JSON.parse(ticket.original_items) : null;
  const hadPartialPrints = originalItems && originalItems.length > 0;
  const payload = JSON.stringify({
    ticket_number: ticket.ticket_number,
    table_number: ticket.table_number,
    station_name: ticket.station_name,
    items: items.map((i) => ({ ...i, extras: JSON.parse(i.extras || "[]"), is_korrektur: !!i.is_korrektur })),
    created_at: ticket.created_at,
    all_items: hadPartialPrints ? originalItems : null,
    is_last: hadPartialPrints,
    partial: hadPartialPrints,
    is_korrektur: !!ticket.is_korrektur,
    printed_at: (/* @__PURE__ */ new Date()).toISOString()
  });
  await env222.DB.prepare("INSERT INTO print_jobs (ticket_id, payload) VALUES (?, ?)").bind(ticketId, payload).run();
  await env222.DB.prepare("UPDATE tickets SET status = 'printing', printed_at = CURRENT_TIMESTAMP WHERE id = ?").bind(ticketId).run();
  try {
    await env222.DB.prepare("ALTER TABLE bon_log ADD COLUMN station_id INTEGER").run().catch(() => {
    });
    if (ticket.station_id && items.length > 0) {
      const NL2 = "\n";
      const bonPreview = `KELLNER: ${ticket.station_name || "BESTELLUNG"}${NL2}Tisch ${ticket.table_number || ""}${NL2}Bon: #${ticket.ticket_number}${NL2}---${NL2}` + items.map((i) => `## ${i.quantity}x  ${i.product_name}`).join(NL2) + `${NL2}---`;
      await env222.DB.prepare("INSERT INTO bon_log (type, preview, raw_text, created_at, station_id) VALUES (?,?,?,?,?)").bind("outgoing", bonPreview, "", (/* @__PURE__ */ new Date()).toISOString(), ticket.station_id).run();
      await env222.DB.prepare("DELETE FROM bon_log WHERE type='outgoing' AND station_id=? AND id NOT IN (SELECT id FROM bon_log WHERE type='outgoing' AND station_id=? ORDER BY id DESC LIMIT 20)").bind(ticket.station_id, ticket.station_id).run().catch(() => {
      });
    }
  } catch (_e) {
  }
  return { ...ticket, status: "printing" };
}
__name(printTicket, "printTicket");
__name2(printTicket, "printTicket");
__name22(printTicket, "printTicket");
async function partialPrintTicket(env222, ticketId, selectedItems) {
  await ensureKorrekturColumns(env222);
  const ticket = await env222.DB.prepare("SELECT t.*, COALESCE(t.is_korrektur, 0) as is_korrektur, COALESCE(t.kellner, s.name, 'BESTELLUNG') as station_name FROM tickets t LEFT JOIN stations s ON t.station_id = s.id WHERE t.id = ?").bind(ticketId).first();
  if (!ticket) throw Object.assign(new Error("Not found"), { status: 404 });
  if (!selectedItems || selectedItems.length === 0) throw Object.assign(new Error("Keine Artikel"), { status: 400 });
  const { results: currentItems } = await env222.DB.prepare("SELECT id, product_name, quantity FROM ticket_items WHERE ticket_id = ?").bind(ticketId).all();
  const batchStmts = [];
  for (const sel of selectedItems) {
    const ex = currentItems.find((i) => i.product_name === sel.product_name);
    if (!ex) continue;
    const nQ = ex.quantity - sel.quantity;
    if (nQ <= 0) {
      batchStmts.push(env222.DB.prepare("DELETE FROM ticket_items WHERE id = ?").bind(ex.id));
    } else {
      batchStmts.push(env222.DB.prepare("UPDATE ticket_items SET quantity = ? WHERE id = ?").bind(nQ, ex.id));
    }
  }
  if (batchStmts.length > 0) await env222.DB.batch(batchStmts);
  const originalItems = JSON.parse(ticket.original_items || "[]");
  let allItemsForVon = originalItems;
  if (!allItemsForVon.length) {
    const { results: cur } = await env222.DB.prepare("SELECT * FROM ticket_items WHERE ticket_id = ?").bind(ticketId).all();
    allItemsForVon = cur.map((i) => ({ ...i, extras: JSON.parse(i.extras || "[]") }));
  }
  const { results: afterRemaining } = await env222.DB.prepare("SELECT id FROM ticket_items WHERE ticket_id = ?").bind(ticketId).all();
  const isLastPartial = afterRemaining.length === 0;
  const payload = JSON.stringify({
    ticket_number: ticket.ticket_number,
    table_number: ticket.table_number,
    station_name: ticket.station_name,
    items: selectedItems,
    all_items: allItemsForVon,
    partial: true,
    is_last: isLastPartial,
    is_korrektur: !!ticket.is_korrektur,
    created_at: ticket.created_at,
    printed_at: (/* @__PURE__ */ new Date()).toISOString()
  });
  await env222.DB.prepare("INSERT INTO print_jobs (ticket_id, payload) VALUES (?, ?)").bind(ticketId, payload).run();
  if (isLastPartial) await env222.DB.prepare("UPDATE tickets SET status = 'done' WHERE id = ?").bind(ticketId).run();
  return { ...ticket, partial: true };
}
__name(partialPrintTicket, "partialPrintTicket");
__name2(partialPrintTicket, "partialPrintTicket");
__name22(partialPrintTicket, "partialPrintTicket");
async function markDone(env222, ticketId) {
  const ticket = await env222.DB.prepare("SELECT * FROM tickets WHERE id = ?").bind(ticketId).first();
  if (!ticket) throw Object.assign(new Error("Not found"), { status: 404 });
  await env222.DB.prepare("UPDATE tickets SET status = 'done' WHERE id = ?").bind(ticketId).run();
  return { ...ticket, status: "done" };
}
__name(markDone, "markDone");
__name2(markDone, "markDone");
__name22(markDone, "markDone");
async function getTotals(env222, stationId) {
  let query = `SELECT ti.product_name, SUM(ti.quantity) as total FROM ticket_items ti JOIN tickets t ON ti.ticket_id = t.id WHERE t.status != 'done'`;
  const params = [];
  if (stationId) {
    query += " AND t.station_id = ?";
    params.push(stationId);
  }
  query += " GROUP BY ti.product_name ORDER BY total DESC";
  const { results } = await env222.DB.prepare(query).bind(...params).all();
  return results;
}
__name(getTotals, "getTotals");
__name2(getTotals, "getTotals");
__name22(getTotals, "getTotals");
async function getRecentJobs(env222) {
  const { results } = await env222.DB.prepare("SELECT pj.*, t.table_number FROM print_jobs pj JOIN tickets t ON pj.ticket_id = t.id ORDER BY pj.created_at DESC LIMIT 20").all();
  return results.map((j) => ({ ...j, payload: JSON.parse(j.payload) }));
}
__name(getRecentJobs, "getRecentJobs");
__name2(getRecentJobs, "getRecentJobs");
__name22(getRecentJobs, "getRecentJobs");
async function getPendingJobs(env222, stationId) {
  let query, results;
  if (stationId) {
    const r = await env222.DB.prepare("SELECT pj.*, t.table_number FROM print_jobs pj JOIN tickets t ON pj.ticket_id = t.id WHERE pj.status = 'pending' AND t.station_id = ? ORDER BY pj.created_at ASC").bind(parseInt(stationId)).all();
    results = r.results;
  } else {
    const r = await env222.DB.prepare("SELECT pj.*, t.table_number FROM print_jobs pj JOIN tickets t ON pj.ticket_id = t.id WHERE pj.status = 'pending' ORDER BY pj.created_at ASC").all();
    results = r.results;
  }
  return results.map((j) => ({ ...j, payload: JSON.parse(j.payload) }));
}
__name(getPendingJobs, "getPendingJobs");
__name2(getPendingJobs, "getPendingJobs");
__name22(getPendingJobs, "getPendingJobs");
async function completeJob(env222, jobId) {
  await env222.DB.prepare("UPDATE print_jobs SET status = 'done', completed_at = CURRENT_TIMESTAMP WHERE id = ?").bind(jobId).run();
  return { id: jobId, status: "done" };
}
__name(completeJob, "completeJob");
__name2(completeJob, "completeJob");
__name22(completeJob, "completeJob");
async function broadcastUpdate(env222, stationId, data) {
  const rooms = ["all"];
  if (stationId) rooms.push(String(stationId));
  for (const roomName of rooms) {
    try {
      const id = env222.KDS_ROOM.idFromName(roomName);
      const room = env222.KDS_ROOM.get(id);
      await room.fetch(new Request("https://internal/broadcast", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }));
    } catch (e) {
      console.error("Broadcast error:", e);
    }
  }
}
__name(broadcastUpdate, "broadcastUpdate");
__name2(broadcastUpdate, "broadcastUpdate");
__name22(broadcastUpdate, "broadcastUpdate");
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...CORS, "Content-Type": "application/json" } });
}
__name(jsonResponse, "jsonResponse");
__name2(jsonResponse, "jsonResponse");
__name22(jsonResponse, "jsonResponse");
function requireApiKey(request, env222) {
  const key = request.headers.get("X-API-Key");
  if (!env222.API_KEY || key !== env222.API_KEY) throw Object.assign(new Error("Unauthorized"), { status: 401 });
}
__name(requireApiKey, "requireApiKey");
__name2(requireApiKey, "requireApiKey");
__name22(requireApiKey, "requireApiKey");
export {
  KDSRoom,
  index_default as default
};
//# sourceMappingURL=index.js.map
