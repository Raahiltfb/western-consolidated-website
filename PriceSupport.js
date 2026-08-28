Content is user - generated and unverified.


1
Learn about artifacts
import { useState, useEffect } from "react";

// ---------- helpers ----------
const inr = (n) =>
  isNaN(n) || n === "" ? "" : Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });

const CONFIG_KEY = "pricing-config-v1";
const ENTRY_PREFIX = "entry:";

const SEED_RATINGS = [
  // 3-phase
  { kva: "15 (3ph) HA", minPrice: 283183.76, referFloor: 274787.47 },
  { kva: "15 (3ph) GK", minPrice: 309018.84, referFloor: 299856.56 },
  { kva: "20 (3ph)", minPrice: 333805.07, referFloor: 323907.88 },
  { kva: "25 (3ph)", minPrice: 406642.23, referFloor: 394585.45 },
  { kva: "30 (3ph)", minPrice: 465699.01, referFloor: 451891.22 },
  { kva: "35 (3ph)", minPrice: 473989.88, referFloor: 459936.27 },
  { kva: "40 (3ph)", minPrice: 529708.77, referFloor: 514003.12 },
  { kva: "45", minPrice: 542412.09, referFloor: 526329.79 },
  { kva: "58.5", minPrice: 585006.04, referFloor: 567660.85 },
  { kva: "82.5", minPrice: 933761.15, referFloor: 906075.51 },
  { kva: "125", minPrice: 1085201.59, referFloor: 1053025.8 },
  { kva: "160", minPrice: 1499180.84, referFloor: 1454730.73 },
  { kva: "200", minPrice: 1775830.0, referFloor: 1723177.36 },
  { kva: "250-SB", minPrice: 1837412.5, referFloor: 1782933.97 },
  { kva: "250", minPrice: 1994224.89, referFloor: 1935096.93 },
  { kva: "320", minPrice: 2433907.67, referFloor: 2361743.29 },
  { kva: "400", minPrice: 3474064.17, referFloor: 3371059.57 },
  { kva: "500", minPrice: 3612651.81, referFloor: 3505538.14 },
  { kva: "625", minPrice: 5082713.96, referFloor: 4932013.55 },
  { kva: "750", minPrice: 5695415.78, referFloor: 5526549.01 },
  // 1-phase
  { kva: "15 (1ph) HA", minPrice: 294351.19, referFloor: 285623.79 },
  { kva: "15 (1ph) GK", minPrice: 320186.27, referFloor: 310692.88 },
  { kva: "20 (1ph)", minPrice: 346307.56, referFloor: 336039.69 },
  { kva: "25 (1ph)", minPrice: 422403.86, referFloor: 409879.75 },
  { kva: "30 (1ph)", minPrice: 485698.07, referFloor: 471297.32 },
  { kva: "35 (1ph)", minPrice: 509492.53, referFloor: 494386.28 },
  { kva: "40 (1ph)", minPrice: 563010.25, referFloor: 546317.22 },
  { kva: "45 (1ph)", minPrice: 586451.94, referFloor: 569063.88 },
  { kva: "58.5 (1ph)", minPrice: 649361.82, referFloor: 630108.51 },
];

const DEFAULT_CONFIG = {
  pin: "2580",
  ratings: SEED_RATINGS,
};

async function loadConfig() {
  try {
    const res = await window.storage.get(CONFIG_KEY, true);
    if (!res) {
      const cfg = { ...DEFAULT_CONFIG };
      try {
        await saveConfig(cfg);
      } catch (e) {
        console.error("seed save failed", e);
      }
      return cfg;
    }
    const cfg = JSON.parse(res.value);
    // Migrate old "— A / — B" labels to engine series names if present
    let migrated = false;
    const RENAMES = {
      "15 (3ph) — A": "15 (3ph) HA",
      "15 (3ph) — B": "15 (3ph) GK",
      "15 (1ph) — A": "15 (1ph) HA",
      "15 (1ph) — B": "15 (1ph) GK",
    };
    (cfg.ratings || []).forEach((r) => {
      if (RENAMES[r.kva]) {
        r.kva = RENAMES[r.kva];
        migrated = true;
      }
    });
    if (migrated) {
      try {
        await saveConfig(cfg);
      } catch (e) {
        console.error("migration save failed", e);
      }
    }
    // If the stored config has no ratings yet, seed it with the preset floors
    if (!cfg.ratings || cfg.ratings.length === 0) {
      cfg.ratings = SEED_RATINGS;
      try {
        await saveConfig(cfg);
      } catch (e) {
        console.error("seed save failed", e);
      }
    }
    return cfg;
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

async function saveConfig(cfg) {
  await window.storage.set(CONFIG_KEY, JSON.stringify(cfg), true);
}

async function logEntry(entry) {
  const id = `${ENTRY_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  try {
    const res = await window.storage.set(id, JSON.stringify(entry), true);
    // Verify the write actually landed
    if (!res) return false;
    return true;
  } catch (e) {
    console.error("log failed", e);
    return false;
  }
}

async function loadEntries() {
  try {
    const listed = await window.storage.list(ENTRY_PREFIX, true);
    const keys = listed?.keys || [];
    const results = await Promise.all(
      keys.map(async (k) => {
        try {
          const r = await window.storage.get(k, true);
          return r ? { key: k, ...JSON.parse(r.value) } : null;
        } catch {
          return null;
        }
      })
    );
    return results.filter(Boolean).sort((a, b) => b.ts - a.ts);
  } catch {
    return [];
  }
}

// Tests whether this device can actually write to the shared log
async function checkStorageHealth() {
  const key = `healthcheck-${Math.random().toString(36).slice(2, 8)}`;
  try {
    const w = await window.storage.set(key, "ok", true);
    if (!w) return false;
    try {
      await window.storage.delete(key, true);
    } catch { }
    return true;
  } catch {
    return false;
  }
}

function getVerdict(cfg, kva, price) {
  const r = cfg.ratings.find((x) => x.kva === kva);
  if (!r) return null;
  const p = Number(price);
  if (p >= r.minPrice) return "APPROVED";
  if (p >= r.referFloor) return "REFER";
  return "NOT_POSSIBLE";
}

const VERDICT_META = {
  APPROVED: {
    label: "Approved",
    sub: "This price is approved. You may proceed with the order.",
    bg: "bg-emerald-600",
    badge: "bg-emerald-100 text-emerald-800",
  },
  REFER: {
    label: "Refer to management",
    sub: "This price needs sign-off. Please contact the office before committing.",
    bg: "bg-amber-500",
    badge: "bg-amber-100 text-amber-800",
  },
  NOT_POSSIBLE: {
    label: "Not possible",
    sub: "This price cannot be offered at any level. Please re-quote.",
    bg: "bg-red-600",
    badge: "bg-red-100 text-red-700",
  },
};

// ---------- dealer view ----------
function DealerView({ config }) {
  const [kva, setKva] = useState("");
  const [customer, setCustomer] = useState("");
  const [dealer, setDealer] = useState("");
  const [price, setPrice] = useState("");
  const [verdict, setVerdict] = useState(null);
  const [busy, setBusy] = useState(false);
  const [refId, setRefId] = useState("");
  const [logged, setLogged] = useState(true);
  const [storageOk, setStorageOk] = useState(null); // null = checking

  useEffect(() => {
    checkStorageHealth().then(setStorageOk);
  }, []);

  const ratings = config?.ratings || [];

  const submit = async () => {
    if (!kva || !customer.trim() || !price || Number(price) <= 0) return;
    setBusy(true);
    const v = getVerdict(config, kva, price);
    const ref = `WC-${Date.now().toString().slice(-6)}`;
    const ok = await logEntry({
      ts: Date.now(),
      kva,
      customer: customer.trim(),
      dealer: dealer.trim(),
      price: Number(price),
      verdict: v,
      ref,
    });
    setLogged(ok);
    setVerdict(v);
    setRefId(ref);
    setBusy(false);
  };

  const reset = () => {
    setVerdict(null);
    setCustomer("");
    setPrice("");
    setRefId("");
  };

  if (verdict) {
    const m = VERDICT_META[verdict];
    return (
      <div className="max-w-md mx-auto">
        <div className={`${m.bg} text-white rounded-2xl p-8 text-center shadow-lg`}>
          <div className="text-3xl font-bold tracking-tight mb-2">{m.label}</div>
          <p className="text-white text-sm opacity-90 mb-4">{m.sub}</p>
          <div className="bg-white bg-opacity-15 rounded-lg py-3 px-4 text-sm">
            <div className="font-mono text-lg">{refId}</div>
            <div className="opacity-90 mt-1">
              {kva} kVA · {customer} · ₹{inr(price)}
            </div>
          </div>
          {!logged && (
            <div className="mt-3 bg-white text-slate-900 rounded-lg py-2.5 px-4 text-xs font-medium">
              ⚠ This entry could not be saved to the office log. Please sign in to your account and
              try again, or send a screenshot of this screen (with the reference number) to the office.
            </div>
          )}
        </div>
        <button
          onClick={reset}
          className="mt-4 w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
        >
          Check another price
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {storageOk === false && (
        <div className="mb-4 bg-amber-100 border border-amber-300 text-amber-900 rounded-xl p-4 text-sm">
          <b>Not connected to the office log.</b> Price checks will work, but your entries will not
          reach the office. Please sign in to your Claude account, then reload this page.
        </div>
      )}
      {storageOk === true && (
        <div className="mb-4 text-xs text-emerald-700 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          Connected — entries will be logged with the office
        </div>
      )}
      {ratings.length === 0 ? (
        <div className="text-center text-slate-500 py-12 border border-dashed border-slate-300 rounded-xl">
          No ratings have been set up yet.
          <br />
          Please contact the office.
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Genset rating (kVA)</label>
            <select
              value={kva}
              onChange={(e) => setKva(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-900"
            >
              <option value="">Select rating</option>
              {ratings.map((r) => (
                <option key={r.kva} value={r.kva}>
                  {r.kva} kVA
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Customer name</label>
            <input
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder=""
              className="w-full p-3 rounded-xl border border-slate-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Dealer / salesperson <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              value={dealer}
              onChange={(e) => setDealer(e.target.value)}
              placeholder="Your name or firm"
              className="w-full p-3 rounded-xl border border-slate-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Offered price — basic, excluding GST (₹)
            </label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
              inputMode="numeric"
              placeholder=""
              className="w-full p-3 rounded-xl border border-slate-300 font-mono"
            />
            {price && <div className="text-xs text-slate-500 mt-1">₹{inr(price)}</div>}
          </div>
          <button
            onClick={submit}
            disabled={busy || !kva || !customer.trim() || !price}
            className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-semibold disabled:opacity-40 hover:bg-slate-800"
          >
            {busy ? "Checking…" : "Check price"}
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- admin view ----------
function AdminView({ config, setConfig }) {
  const [tab, setTab] = useState("log");
  const [entries, setEntries] = useState(null);
  const [saving, setSaving] = useState(false);
  const [newKva, setNewKva] = useState("");
  const [newMin, setNewMin] = useState("");
  const [newRefer, setNewRefer] = useState("");
  const [newPin, setNewPin] = useState("");

  const refreshLog = async () => {
    setEntries(null);
    setEntries(await loadEntries());
  };

  useEffect(() => {
    refreshLog();
  }, []);

  const persist = async (cfg) => {
    setSaving(true);
    setConfig(cfg);
    await saveConfig(cfg);
    setSaving(false);
  };

  const addRating = async () => {
    const kva = newKva.trim();
    const min = Number(newMin);
    const refer = Number(newRefer);
    if (!kva || !min || !refer || refer > min) return;
    const others = config.ratings.filter((r) => r.kva !== kva);
    const ratings = [...others, { kva, minPrice: min, referFloor: refer }].sort((a, b) => {
      const pa = /1ph/i.test(a.kva) ? 1 : 0;
      const pb = /1ph/i.test(b.kva) ? 1 : 0;
      if (pa !== pb) return pa - pb; // 3-phase group first, then 1-phase
      return (parseFloat(a.kva) || 0) - (parseFloat(b.kva) || 0);
    });
    await persist({ ...config, ratings });
    setNewKva("");
    setNewMin("");
    setNewRefer("");
  };

  const removeRating = async (kva) => {
    await persist({ ...config, ratings: config.ratings.filter((r) => r.kva !== kva) });
  };

  const changePin = async () => {
    if (newPin.trim().length < 4) return;
    await persist({ ...config, pin: newPin.trim() });
    setNewPin("");
  };

  const copyCsv = () => {
    if (!entries) return;
    const rows = [
      ["Date", "Time", "Ref", "kVA", "Customer", "Dealer", "Price (excluding-GST)", "Verdict"],
      ...entries.map((e) => {
        const d = new Date(e.ts);
        return [
          d.toLocaleDateString("en-IN"),
          d.toLocaleTimeString("en-IN"),
          e.ref || "",
          e.kva,
          `"${e.customer}"`,
          `"${e.dealer || ""}"`,
          e.price,
          VERDICT_META[e.verdict]?.label || e.verdict,
        ];
      }),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const ta = document.createElement("textarea");
    ta.value = csv;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    alert("CSV copied to clipboard. Paste into Excel.");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex gap-2 mb-6">
        {[
          ["log", "Entry log"],
          ["ratings", "Price floors"],
          ["settings", "Settings"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "log" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-slate-500">
              {entries === null ? "Loading…" : `${entries.length} entries, newest first`}
            </div>
            <div className="flex gap-2">
              <button onClick={refreshLog} className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50">
                Refresh
              </button>
              <button onClick={copyCsv} className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50">
                Copy CSV
              </button>
            </div>
          </div>
          {entries !== null && entries.length === 0 && (
            <div className="text-center text-slate-400 py-10 border border-dashed border-slate-300 rounded-xl">
              No submissions yet.
            </div>
          )}
          <div className="space-y-2">
            {(entries || []).map((e) => {
              const m = VERDICT_META[e.verdict] || {};
              const d = new Date(e.ts);
              return (
                <div key={e.key} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${m.badge || "bg-slate-100"}`}>
                    {m.label || e.verdict}
                  </span>
                  <span className="font-mono text-sm text-slate-500">{e.ref}</span>
                  <span className="font-semibold text-slate-900">{e.kva} kVA</span>
                  <span className="text-slate-700">{e.customer}</span>
                  {e.dealer && <span className="text-slate-500 text-sm">via {e.dealer}</span>}
                  <span className="font-mono font-semibold text-slate-900 ml-auto">₹{inr(e.price)}</span>
                  <span className="text-xs text-slate-400 w-full sm:w-auto">
                    {d.toLocaleDateString("en-IN")} {d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "ratings" && (
        <div>
          <p className="text-sm text-slate-500 mb-4">
            For each rating: prices at or above the <b>minimum</b> are auto-approved. Prices between the{" "}
            <b>refer floor</b> and the minimum show "Refer to management". Below the refer floor shows "Not
            possible". Dealers never see these numbers.
          </p>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4">
            <div className="grid grid-cols-4 gap-2 px-4 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <div>kVA</div>
              <div>Minimum (₹)</div>
              <div>Refer floor (₹)</div>
              <div></div>
            </div>
            {config.ratings.length === 0 && (
              <div className="px-4 py-6 text-sm text-slate-400">No ratings yet — add your first below.</div>
            )}
            {config.ratings.map((r) => (
              <div key={r.kva} className="grid grid-cols-4 gap-2 px-4 py-3 border-t border-slate-100 items-center text-sm">
                <div className="font-semibold">{r.kva}</div>
                <div className="font-mono">₹{inr(r.minPrice)}</div>
                <div className="font-mono">₹{inr(r.referFloor)}</div>
                <button onClick={() => removeRating(r.kva)} className="text-red-500 text-xs justify-self-end hover:underline">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="text-sm font-semibold text-slate-700 mb-3">Add or update a rating</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input value={newKva} onChange={(e) => setNewKva(e.target.value)} placeholder="kVA" className="p-2.5 rounded-lg border border-slate-300 text-sm" />
              <input value={newMin} onChange={(e) => setNewMin(e.target.value.replace(/[^0-9.]/g, ""))} inputMode="decimal" placeholder="Minimum price ₹" className="p-2.5 rounded-lg border border-slate-300 text-sm font-mono" />
              <input value={newRefer} onChange={(e) => setNewRefer(e.target.value.replace(/[^0-9.]/g, ""))} inputMode="decimal" placeholder="Refer floor ₹" className="p-2.5 rounded-lg border border-slate-300 text-sm font-mono" />
            </div>
            {newMin && newRefer && Number(newRefer) > Number(newMin) && (
              <div className="text-xs text-red-500 mt-2">Refer floor must be at or below the minimum price.</div>
            )}
            <button
              onClick={addRating}
              disabled={saving || !newKva.trim() || !newMin || !newRefer || Number(newRefer) > Number(newMin)}
              className="mt-3 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save rating"}
            </button>
            <div className="text-xs text-slate-400 mt-2">
              Entering an existing kVA overwrites its floors.
            </div>
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 max-w-sm">
          <div className="text-sm font-semibold text-slate-700 mb-2">Change admin PIN</div>
          <p className="text-xs text-slate-500 mb-3">Current PIN: <span className="font-mono">{config.pin}</span></p>
          <input
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            placeholder="New PIN (min 4 characters)"
            className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-mono mb-3"
          />
          <button
            onClick={changePin}
            disabled={saving || newPin.trim().length < 4}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium disabled:opacity-40"
          >
            Update PIN
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- shell ----------
export default function App() {
  const [config, setConfig] = useState(null);
  const [view, setView] = useState("dealer");
  const [pinInput, setPinInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    loadConfig().then(setConfig);
  }, []);

  const tryUnlock = async () => {
    const fresh = await loadConfig();
    setConfig(fresh);
    if (pinInput === fresh.pin) {
      setUnlocked(true);
      setPinError(false);
      setPinInput("");
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100" style={{ fontFamily: "system-ui, sans-serif" }}>
      <header className="bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="font-bold tracking-tight text-lg leading-tight">Price Support Portal</div>
            <div className="text-xs text-slate-400">Genset price approval · basic, ex-GST</div>
          </div>
          <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setView("dealer")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${view === "dealer" ? "bg-white text-slate-900" : "text-slate-300"}`}
            >
              Dealer
            </button>
            <button
              onClick={() => setView("admin")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${view === "admin" ? "bg-white text-slate-900" : "text-slate-300"}`}
            >
              Admin
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-8">
        {config === null ? (
          <div className="text-center text-slate-400 py-16">Loading…</div>
        ) : view === "dealer" ? (
          <DealerView config={config} />
        ) : unlocked ? (
          <AdminView config={config} setConfig={setConfig} />
        ) : (
          <div className="max-w-xs mx-auto bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <div className="font-semibold text-slate-800 mb-1">Admin access</div>
            <p className="text-xs text-slate-500 mb-4">Enter the admin PIN to manage price floors and view the log.</p>
            <input
              value={pinInput}
              onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
              onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
              type="password"
              inputMode="numeric"
              placeholder="PIN"
              className="w-full p-3 rounded-xl border border-slate-300 text-center font-mono text-lg tracking-widest mb-2"
            />
            {pinError && <div className="text-xs text-red-500 mb-2">Incorrect PIN.</div>}
            <button onClick={tryUnlock} className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-medium">
              Unlock
            </button>
          </div>
        )}
      </main>
    </div>
  );
}