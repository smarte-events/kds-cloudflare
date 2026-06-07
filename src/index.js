// ════════════════════════════════════════════════
//  KDS Worker – Haupt-Entry-Point
// ════════════════════════════════════════════════
import { KDSRoom }    from './kds-room.js';
import { getHTML }    from './frontend.js';
import appJs from './app.txt';
import { getPrinterHTML } from './printer.js';
import versionInfo from '../version.json';

export { KDSRoom };

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
};

// ─── Schema-Migrationen: is_korrektur Spalten sicherstellen ──────────────
// Lazy: lauft beim ersten createTicket; harmless wenn schon vorhanden.
async function ensureKorrekturColumns(env) {
  // Auf Tickets-Ebene
  await env.DB.prepare('ALTER TABLE tickets ADD COLUMN is_korrektur INTEGER DEFAULT 0').run().catch(()=>{});
  // Auf Item-Ebene (fuer Mischbons: ein Ticket mit Storno + normalem Item)
  await env.DB.prepare('ALTER TABLE ticket_items ADD COLUMN is_korrektur INTEGER DEFAULT 0').run().catch(()=>{});
}

async function cleanupOldData(env) {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);
  // Reihenfolge: print_jobs → bon_log → ticket_items → tickets (FK-Abhängigkeiten)
  const pj = await env.DB.prepare("DELETE FROM print_jobs WHERE created_at < ?").bind(cutoff).run().catch(()=>({meta:{changes:0}}));
  const bl = await env.DB.prepare("DELETE FROM bon_log WHERE created_at < ?").bind(cutoff).run().catch(()=>({meta:{changes:0}}));
  const ti = await env.DB.prepare("DELETE FROM ticket_items WHERE ticket_id IN (SELECT id FROM tickets WHERE created_at < ?)").bind(cutoff).run().catch(()=>({meta:{changes:0}}));
  const tk = await env.DB.prepare("DELETE FROM tickets WHERE created_at < ?").bind(cutoff).run().catch(()=>({meta:{changes:0}}));
  console.log(`[CLEANUP] Gelöscht: ${tk.meta.changes} Tickets, ${pj.meta.changes} Jobs, ${ti.meta.changes} Items, ${bl.meta.changes} Bon-Logs`);
  return { tickets: tk.meta.changes, jobs: pj.meta.changes, items: ti.meta.changes, bonLogs: bl.meta.changes };
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(cleanupOldData(env));
  },

  async fetch(request, env, ctx) {
    const url    = new URL(request.url);
    const method = request.method;

    if (method === 'OPTIONS') return new Response(null, { headers: CORS });

    if (url.pathname.startsWith('/ws')) {
      const stationId = url.searchParams.get('station') || 'all';
      const id   = env.KDS_ROOM.idFromName(stationId);
      const room = env.KDS_ROOM.get(id);
      return room.fetch(request);
    }

    if (url.pathname.startsWith('/api/')) {
      return handleAPI(request, env, url, method);
    }

    // /manifest.json – PWA Manifest für Homescreen-Installation
    if (url.pathname === '/manifest.json') {
      const manifest = {
        name: 'KDS Monitor',
        short_name: 'KDS',
        start_url: '/',
        display: 'fullscreen',
        background_color: '#0d0d0d',
        theme_color: '#0d0d0d',
        orientation: 'any',
        icons: [
          { src: 'https://kds.team24.training/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'https://kds.team24.training/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      };
      return new Response(JSON.stringify(manifest), {
        headers: { ...CORS, 'Content-Type': 'application/manifest+json', 'Cache-Control': 'no-cache' }
      });
    }

    // /app.js - JavaScript als separate Datei
    if (url.pathname === '/app.js') {
      return new Response(appJs, {
        headers: { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-cache' },
      });
    }

    // Beide Domains → gleiches Frontend (Bestellungen + Produkte + Virtuell)
    return new Response(getHTML(versionInfo.version), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};

async function handleAPI(request, env, url, method) {
  const path = url.pathname.replace('/api', '');

  try {
    if (path === '/stations' && method === 'GET') return jsonResponse(await getStations(env));
    if (path === '/tickets' && method === 'GET') return jsonResponse(await getTickets(env, url.searchParams.get('station')));
    if (path === '/tickets' && method === 'POST') {
      requireApiKey(request, env);
      const ticket = await createTicket(env, await request.json());
      await broadcastUpdate(env, ticket.station_id, { type: 'ticket_created', ticket });
      // Kein automatischer print_job beim Erstellen – nur manuell via Drucken-Button
      return jsonResponse(ticket, 201);
    }

    const printMatch = path.match(/^\/tickets\/(\d+)\/print$/);
    if (printMatch && method === 'POST') {
      const result = await printTicket(env, parseInt(printMatch[1]));
      await broadcastUpdate(env, result.station_id, { type: 'ticket_printed', ticketId: parseInt(printMatch[1]) });
      await broadcastUpdate(env, result.station_id, { type: 'print_job', stationId: result.station_id });
      return jsonResponse(result);
    }

    const partialMatch = path.match(/^\/tickets\/(\d+)\/partial-print$/);
    if (partialMatch && method === 'POST') {
      const body = await request.json();
      const result = await partialPrintTicket(env, parseInt(partialMatch[1]), body.items || []);
      await broadcastUpdate(env, result.station_id, { type: 'ticket_partial_printed', ticketId: parseInt(partialMatch[1]) });
      await broadcastUpdate(env, result.station_id, { type: 'print_job', stationId: result.station_id });
      return jsonResponse(result);
    }

    const doneMatch = path.match(/^\/tickets\/(\d+)\/done$/);
    if (doneMatch && method === 'POST') {
      const result = await markDone(env, parseInt(doneMatch[1]));
      await broadcastUpdate(env, result.station_id, { type: 'ticket_done', ticketId: parseInt(doneMatch[1]) });
      return jsonResponse(result);
    }

    if (path === '/print-jobs/pending' && method === 'GET') {
      requireApiKey(request, env);
      const stationFilter = url.searchParams.get('station');
      return jsonResponse(await getPendingJobs(env, stationFilter));
    }

    if (path === '/print-jobs/recent' && method === 'GET') {
      requireApiKey(request, env);
      return jsonResponse(await getRecentJobs(env));
    }

    const completeMatch = path.match(/^\/print-jobs\/\d+\/complete$/);
    if (completeMatch && method === 'POST') {
      requireApiKey(request, env);
      return jsonResponse(await completeJob(env, parseInt(path.split('/')[2])));
    }

    if (path === '/agent' && method === 'POST') {
      requireApiKey(request, env);
      const body = await request.json();
      const { hostname, ip, stationId, printerIp: reportedPrinterIp } = body;
      const agentData = { hostname, ip, stationId, updated_at: new Date().toISOString() };
      if (reportedPrinterIp) agentData.printerIp = reportedPrinterIp;
      const agentKey = stationId ? 'agent_info_' + stationId : 'agent_info';
      await env.DB.prepare(
        'INSERT INTO kv_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value'
      ).bind(agentKey, JSON.stringify(agentData)).run().catch(async () => {
        await env.DB.prepare('CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT)').run();
        await env.DB.prepare('INSERT INTO kv_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind(agentKey, JSON.stringify({ hostname, ip, updated_at: new Date().toISOString() })).run();
      });
      return jsonResponse({ ok: true });
    }

    if (path === '/agent' && method === 'GET') {
      const stationParam = url.searchParams.get('station');
      const agentKey = stationParam ? 'agent_info_' + stationParam : 'agent_info';
      const row = await env.DB.prepare('SELECT value FROM kv_store WHERE key=?').bind(agentKey).first().catch(() => null);
      if (!row) {
        const fallback = await env.DB.prepare("SELECT value FROM kv_store WHERE key='agent_info'").first().catch(() => null);
        return jsonResponse(fallback ? JSON.parse(fallback.value) : null);
      }
      return jsonResponse(JSON.parse(row.value));
    }


    if (path === '/config' && method === 'GET') {
      const stationParam = url.searchParams.get('station');
      const cfgKey = stationParam ? 'printer_config_' + stationParam : 'printer_config';
      let row = await env.DB.prepare('SELECT value FROM kv_store WHERE key=?').bind(cfgKey).first().catch(() => null);
      if (!row && stationParam) row = await env.DB.prepare("SELECT value FROM kv_store WHERE key='printer_config'").first().catch(() => null);
      return jsonResponse(row ? JSON.parse(row.value) : {
        printerIp: '192.168.192.202', printerPort: 9100, charsPerLine: 42,
        proxyIp: '192.168.192.70', proxyPort: 8009
      });
    }

    if (path === '/config' && method === 'POST') {
      requireApiKey(request, env);
      const body = await request.json();
      const val = JSON.stringify({
        printerIp:    body.printerIp    || '192.168.192.202',
        printerPort:  body.printerPort  || 9100,
        charsPerLine: body.charsPerLine || 42,
        proxyIp:      body.proxyIp      || '192.168.192.70',
        proxyPort:    body.proxyPort    || 8009,
        backupIp:     body.backupIp     || '',
        backupPort:   body.backupPort   || 9100,
      });
      const stationPostParam = url.searchParams.get('station') || body.stationId;
      const cfgKeyPost = stationPostParam ? 'printer_config_' + stationPostParam : 'printer_config';
      await env.DB.prepare('INSERT INTO kv_store (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value')
        .bind(cfgKeyPost, val).run().catch(async () => {
          await env.DB.prepare('CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT)').run();
          await env.DB.prepare('INSERT INTO kv_store (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind(cfgKeyPost, val).run();
        });
      // Immer auch global speichern als Fallback
      if (stationPostParam) {
        await env.DB.prepare('INSERT INTO kv_store (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value')
          .bind('printer_config', val).run().catch(() => {});
      }
      return jsonResponse({ ok: true });
    }

    if (path === '/pins' && method === 'GET') {
      const stationParam = url.searchParams.get('station');
      const pinsKey = stationParam ? 'pins_' + stationParam : 'pins';
      const row = await env.DB.prepare('SELECT value FROM kv_store WHERE key=?').bind(pinsKey).first().catch(() => null);
      return jsonResponse(row ? JSON.parse(row.value) : { pins: {}, colors: {} });
    }

    if (path === '/pins' && method === 'POST') {
      requireApiKey(request, env);
      const body = await request.json();
      const val = JSON.stringify({ pins: body.pins || {}, colors: body.colors || {} });
      const stationPostParam = url.searchParams.get('station') || body.stationId;
      const pinsKeyPost = stationPostParam ? 'pins_' + stationPostParam : 'pins';
      await env.DB.prepare('INSERT INTO kv_store (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value')
        .bind(pinsKeyPost, val).run().catch(async () => {
          await env.DB.prepare('CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT)').run();
          await env.DB.prepare('INSERT INTO kv_store (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind(pinsKeyPost, val).run();
        });
      return jsonResponse({ ok: true });
    }

    if (path === '/test-print' && method === 'POST') {
      requireApiKey(request, env);
      const row = await env.DB.prepare("SELECT value FROM kv_store WHERE key='printer_config'").first().catch(() => null);
      const cfg = row ? JSON.parse(row.value) : { proxyIp: '192.168.192.70', proxyPort: 8009 };
      // Tunnel-URL verwenden - Worker kann lokale IPs nicht erreichen!
      // print.team24.training ist der Tunnel direkt zum Pi
      const piUrl = `http://print.team24.training/test-print`;
      try {
        const res = await fetch(piUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ charsPerLine: cfg.charsPerLine || 42 }),
          signal: AbortSignal.timeout(10000),
        });
        const data = await res.json().catch(() => ({}));
        return jsonResponse({ ok: res.ok, ...data });
      } catch(e) {
        return jsonResponse({ ok: false, error: e.message }, 502);
      }
    }

    if (path === '/client-ip' && method === 'GET') {
      return jsonResponse({ ip: request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unbekannt' });
    }

    if (path === '/totals' && method === 'GET') return jsonResponse(await getTotals(env, url.searchParams.get('station')));

    // ── Bon-Log: einkommende/ausgehende Bons speichern ──────────────────
    if (path === '/bon-log' && method === 'POST') {
      requireApiKey(request, env);
      const b = await request.json();
      const { type, preview, rawText } = b;
      try {
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS bon_log (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, preview TEXT, raw_text TEXT, created_at TEXT)").run();
        await env.DB.prepare("ALTER TABLE bon_log ADD COLUMN preview TEXT").run().catch(()=>{});
        await env.DB.prepare("ALTER TABLE bon_log ADD COLUMN raw_text TEXT").run().catch(()=>{});
        await env.DB.prepare("INSERT INTO bon_log (type, preview, raw_text, created_at) VALUES (?,?,?,?)")
          .bind(type||'incoming', preview||'', rawText||'', new Date().toISOString()).run();
        await env.DB.prepare("DELETE FROM bon_log WHERE type=? AND id NOT IN (SELECT id FROM bon_log WHERE type=? ORDER BY id DESC LIMIT 3)").bind(type||'incoming', type||'incoming').run().catch(()=>{});
        return jsonResponse({ ok: true });
      } catch(dbErr) {
        console.error('bon-log DB Fehler:', dbErr.message);
        return jsonResponse({ ok: false, error: dbErr.message }, 500);
      }
    }

    if (path === '/bon-log' && method === 'GET') {
      const type = url.searchParams.get('type') || 'incoming';
      const limit = parseInt(url.searchParams.get('limit')) || 3;
      const rows = await env.DB.prepare(
        "SELECT id, type, preview, raw_text, created_at FROM bon_log WHERE type=? ORDER BY id DESC LIMIT ?"
      ).bind(type, limit).all().catch(() => ({ results: [] }));
      return jsonResponse(rows.results || []);
    }

    // ── Reprint: Bon-Log-Eintrag 1:1 erneut drucken ─────────────────────
    // Legt einen Roh-Druckjob (gespeicherter Bon-Text) in eine eigene Queue,
    // die der Print-Agent zusaetzlich pollt. Bestehender print_jobs-Pfad bleibt unberuehrt.
    const reprintMatch = path.match(/^\/bon-log\/(\d+)\/reprint$/);
    if (reprintMatch && method === 'POST') {
      requireApiKey(request, env);
      const bonId = parseInt(reprintMatch[1]);
      const body = await request.json().catch(() => ({}));
      const station = parseInt(body.station) || 1;
      const bon = await env.DB.prepare("SELECT id, preview, raw_text FROM bon_log WHERE id=?").bind(bonId).first().catch(() => null);
      if (!bon) return jsonResponse({ ok: false, error: 'Bon nicht gefunden' }, 404);
      const text = (bon.raw_text && bon.raw_text.length) ? bon.raw_text : (bon.preview || '');
      if (!text) return jsonResponse({ ok: false, error: 'Kein Bon-Text vorhanden' }, 400);
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS reprint_jobs (id INTEGER PRIMARY KEY AUTOINCREMENT, station_id INTEGER, text TEXT, status TEXT DEFAULT 'pending', created_at TEXT, completed_at TEXT)").run();
      await env.DB.prepare("INSERT INTO reprint_jobs (station_id, text, status, created_at) VALUES (?,?,'pending',?)")
        .bind(station, text, new Date().toISOString()).run();
      // Alte erledigte Reprint-Jobs aufraeumen (>1h)
      await env.DB.prepare("DELETE FROM reprint_jobs WHERE status='done' AND completed_at < ?")
        .bind(new Date(Date.now() - 3600000).toISOString()).run().catch(()=>{});
      await broadcastUpdate(env, station, { type: 'print_job', stationId: station }).catch(()=>{});
      return jsonResponse({ ok: true });
    }

    // ── Reprint-Queue: ausstehende Roh-Jobs fuer eine Station ───────────
    if (path === '/reprint-jobs/pending' && method === 'GET') {
      const station = parseInt(url.searchParams.get('station')) || 1;
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS reprint_jobs (id INTEGER PRIMARY KEY AUTOINCREMENT, station_id INTEGER, text TEXT, status TEXT DEFAULT 'pending', created_at TEXT, completed_at TEXT)").run().catch(()=>{});
      const r = await env.DB.prepare("SELECT id, text FROM reprint_jobs WHERE station_id=? AND status='pending' ORDER BY id ASC")
        .bind(station).all().catch(() => ({ results: [] }));
      return jsonResponse(r.results || []);
    }

    // ── Reprint-Job als erledigt markieren ──────────────────────────────
    const reprintDoneMatch = path.match(/^\/reprint-jobs\/(\d+)\/complete$/);
    if (reprintDoneMatch && method === 'POST') {
      requireApiKey(request, env);
      const jobId = parseInt(reprintDoneMatch[1]);
      await env.DB.prepare("UPDATE reprint_jobs SET status='done', completed_at=? WHERE id=?")
        .bind(new Date().toISOString(), jobId).run().catch(()=>{});
      return jsonResponse({ ok: true });
    }

    // ── /api/stats/items-by-hour (aus tickets+ticket_items) ───────────────────
    if (path === '/stats/items-by-hour' && method === 'GET') {
      const days = parseInt(url.searchParams.get('days') || '1');
      const kellner = url.searchParams.get('kellner') || null;
      const cutoff = new Date(Date.now() - days * 24 * 3600 * 1000).toISOString().replace('T',' ').slice(0,19);
      let sql, binds;
      if (kellner) {
        sql = "SELECT strftime('%H', t.created_at) as hour, COUNT(DISTINCT t.id) as tickets, SUM(ti.quantity) as items FROM tickets t JOIN ticket_items ti ON ti.ticket_id = t.id WHERE t.created_at >= ? AND t.kellner = ? GROUP BY hour ORDER BY hour";
        binds = [cutoff, kellner];
      } else {
        sql = "SELECT strftime('%H', t.created_at) as hour, COUNT(DISTINCT t.id) as tickets, SUM(ti.quantity) as items FROM tickets t JOIN ticket_items ti ON ti.ticket_id = t.id WHERE t.created_at >= ? GROUP BY hour ORDER BY hour";
        binds = [cutoff];
      }
      const { results } = await env.DB.prepare(sql).bind(...binds).all().catch(() => ({ results: [] }));
      // Alle 24 Stunden auffüllen
      const map = {};
      for (const r of (results || [])) map[r.hour] = { tickets: r.tickets || 0, items: r.items || 0 };
      const hours = Array.from({length: 24}, (_, i) => {
        const h = String(i).padStart(2, '0');
        return { hour: h, ...(map[h] || { tickets: 0, items: 0 }) };
      });
      return jsonResponse(hours);
    }

    // Kellner-Liste für Diagramm
    if (path === '/stats/kellner' && method === 'GET') {
      const days = parseInt(url.searchParams.get('days') || '1');
      const cutoff = new Date(Date.now() - days * 24 * 3600 * 1000).toISOString().replace('T',' ').slice(0,19);
      const { results } = await env.DB.prepare(
        "SELECT DISTINCT kellner FROM tickets WHERE created_at >= ? AND kellner IS NOT NULL AND kellner != '' ORDER BY kellner"
      ).bind(cutoff).all().catch(() => ({ results: [] }));
      return jsonResponse((results||[]).map(r=>r.kellner));
    }

        // ── /api/stats/bons-by-hour ─────────────────────────────────────────────
    if (path === '/stats/bons-by-hour' && method === 'GET') {
      const days = parseInt(url.searchParams.get('days') || '1');
      const cutoff = new Date(Date.now() - days * 24 * 3600 * 1000).toISOString();
      const { results } = await env.DB.prepare(
        "SELECT strftime('%H', created_at) as hour, COUNT(*) as count FROM bon_log WHERE type='incoming' AND created_at >= ? GROUP BY hour ORDER BY hour"
      ).bind(cutoff).all().catch(() => ({ results: [] }));
      // Alle 24 Stunden auffüllen
      const map = {};
      for (const r of (results || [])) map[r.hour] = r.count;
      const hours = Array.from({length: 24}, (_, i) => {
        const h = String(i).padStart(2, '0');
        return { hour: h, count: map[h] || 0 };
      });
      return jsonResponse(hours);
    }

    if (path === '/bon-log' && method === 'DELETE') {
      requireApiKey(request, env);
      const b = await request.json().catch(() => ({}));
      if (b.id) {
        await env.DB.prepare("DELETE FROM bon_log WHERE id=?").bind(b.id).run().catch(()=>{});
      } else {
        await env.DB.prepare("DELETE FROM bon_log").run().catch(()=>{});
      }
      return jsonResponse({ ok: true });
    }

    // ── Pause-State ───────────────────────────────────────────────────────
    if (path === '/pause-state' && method === 'GET') {
      const row = await env.DB.prepare("SELECT value FROM kv_store WHERE key='pause_state'").first().catch(()=>null);
      return jsonResponse({ paused: row ? JSON.parse(row.value).paused : false });
    }

    if (path === '/pause-state' && method === 'POST') {
      requireApiKey(request, env);
      const b = await request.json();
      const val = JSON.stringify({ paused: !!b.paused });
      await env.DB.prepare("INSERT INTO kv_store (key,value) VALUES ('pause_state',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(val).run().catch(async()=>{
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT)").run();
        await env.DB.prepare("INSERT INTO kv_store (key,value) VALUES ('pause_state',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(val).run();
      });
      return jsonResponse({ ok: true });
    }

    if (path === '/tickets/clear' && method === 'POST') {
      requireApiKey(request, env);
      const b = await request.json().catch(() => ({}));
      const olderThan = b.olderThanMinutes || 60;
      const cutoff = new Date(Date.now() - olderThan * 60000).toISOString();
      await env.DB.prepare("DELETE FROM tickets WHERE created_at < ?").bind(cutoff).run().catch(() => {});
      await env.DB.prepare("DELETE FROM ticket_items WHERE ticket_id NOT IN (SELECT id FROM tickets)").run().catch(() => {});
      return jsonResponse({ ok: true, cutoff });
    }

    // ── Bon-Log: letzte einkommende/ausgehende Bons ──────────────
    if (path === '/bons' && method === 'GET') {
      const type = url.searchParams.get('type') || 'in';
      const limit = parseInt(url.searchParams.get('limit') || '3');
      const rows = await env.DB.prepare(
        "SELECT id, type, summary, created_at FROM bon_log WHERE type=? ORDER BY created_at DESC LIMIT ?"
      ).bind(type, limit).all().catch(() => ({ results: [] }));
      return jsonResponse(rows.results || []);
    }

    if (path.startsWith('/bons/') && method === 'DELETE') {
      requireApiKey(request, env);
      const id = parseInt(path.split('/')[2]);
      await env.DB.prepare("DELETE FROM bon_log WHERE id=?").bind(id).run().catch(() => {});
      return jsonResponse({ ok: true });
    }

    if (path === '/bons' && method === 'POST') {
      requireApiKey(request, env);
      const body = await request.json();
      const summary = JSON.stringify({
        ticketNumber: body.ticketNumber,
        items: body.items,
        time: body.time,
        table: body.table,
        type: body.type,
      });
      await env.DB.prepare(
        "CREATE TABLE IF NOT EXISTS bon_log (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, summary TEXT, created_at TEXT)"
      ).run().catch(() => {});
      await env.DB.prepare(
        "INSERT INTO bon_log (type, summary, created_at) VALUES (?,?,?)"
      ).bind(body.type || 'in', summary, new Date().toISOString()).run().catch(() => {});
      // Max 20 Einträge pro Typ behalten
      await env.DB.prepare(
        "DELETE FROM bon_log WHERE type=? AND id NOT IN (SELECT id FROM bon_log WHERE type=? ORDER BY created_at DESC LIMIT 20)"
      ).bind(body.type || 'in', body.type || 'in').run().catch(() => {});
      return jsonResponse({ ok: true });
    }

    if (path === '/bons/state' && method === 'GET') {
      const row = await env.DB.prepare("SELECT value FROM kv_store WHERE key='bon_state'").first().catch(() => null);
      return jsonResponse(row ? JSON.parse(row.value) : { paused: false });
    }

    if (path === '/bons/state' && method === 'POST') {
      requireApiKey(request, env);
      const body = await request.json();
      const val = JSON.stringify({ paused: body.paused });
      await env.DB.prepare("INSERT INTO kv_store (key,value) VALUES ('bon_state',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value")
        .bind(val).run().catch(async () => {
          await env.DB.prepare("CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT)").run();
          await env.DB.prepare("INSERT INTO kv_store (key,value) VALUES ('bon_state',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(val).run();
        });
      return jsonResponse({ ok: true });
    }

    // ── Bestellverlauf ────────────────────────────────────────────────────
    if (path === '/history' && method === 'GET') {
      const kellner = url.searchParams.get('kellner') || null;
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 200);
      // Migration: kellner Spalte sicherstellen
      await env.DB.prepare('ALTER TABLE tickets ADD COLUMN kellner TEXT').run().catch(()=>{});
      const tisch = url.searchParams.get('tisch') || null;
      let rows;
      if (tisch) {
        rows = await env.DB.prepare(
          'SELECT id, ticket_number, table_number, status, created_at, printed_at, kellner FROM tickets WHERE table_number=? ORDER BY created_at DESC LIMIT ?'
        ).bind(tisch, limit).all();
      } else if (kellner) {
        rows = await env.DB.prepare(
          'SELECT id, ticket_number, table_number, status, created_at, printed_at, kellner FROM tickets WHERE kellner=? ORDER BY created_at DESC LIMIT ?'
        ).bind(kellner, limit).all();
      } else {
        rows = await env.DB.prepare(
          'SELECT id, ticket_number, table_number, status, created_at, printed_at, kellner FROM tickets ORDER BY created_at DESC LIMIT ?'
        ).bind(limit).all();
      }
      // Items für alle Tickets laden
      const tickets = rows.results || [];
      for (const t of tickets) {
        const items = await env.DB.prepare(
          'SELECT product_name, quantity FROM ticket_items WHERE ticket_id=? ORDER BY id'
        ).bind(t.id).all();
        t.items = items.results || [];
        // Wartezeit berechnen
        if (t.printed_at && t.created_at) {
          t.wait_secs = Math.round((new Date((t.printed_at||'').replace(' ','T')+'Z') - new Date((t.created_at||'').replace(' ','T')+'Z')) / 1000);
        } else if (t.created_at) {
          t.wait_secs = Math.round((Date.now() - new Date((t.created_at||'').replace(' ','T')+'Z').getTime()) / 1000);
        } else {
          t.wait_secs = 0;
        }
      }
      // Alle Kellner-Namen für Filter zurückgeben
      const kellnerRows = await env.DB.prepare(
        'SELECT DISTINCT kellner FROM tickets WHERE kellner IS NOT NULL AND kellner != "" ORDER BY kellner'
      ).all();
      const kellnerList = (kellnerRows.results || []).map(r => r.kellner);
      return jsonResponse({ tickets, kellnerList });
    }

    // Manueller Cleanup-Trigger (für Tests)
    if (path === '/admin/cleanup' && method === 'POST') {
      requireApiKey(request, env);
      const result = await cleanupOldData(env);
      return jsonResponse({ ok: true, deleted: result });
    }


    // ── /api/status – System-Übersicht ───────────────────────────────────────
    if (path === '/status' && method === 'GET') {
      const agentRow = await env.DB.prepare('SELECT ip, stationId, updated_at FROM agent_state ORDER BY updated_at DESC LIMIT 1').first().catch(() => null);
      const ticketCount = await env.DB.prepare("SELECT COUNT(*) as n FROM tickets WHERE status != 'done'").first().catch(() => ({ n: 0 }));
      return jsonResponse({
        ok: true,
        worker: 'kds-cloudflare',
        timestamp: new Date().toISOString(),
        openTickets: ticketCount?.n ?? 0,
        agent: agentRow ? { ip: agentRow.ip, stationId: agentRow.stationId, lastSeen: agentRow.updated_at } : null,
      });
    }

    // ── /api/print-jobs (GET ohne sub-path) → Alias für pending ─────────────
    if (path === '/print-jobs' && method === 'GET') {
      const stationId = url.searchParams.get('station');
      let jobs;
      if (stationId) {
        const r = await env.DB.prepare("SELECT pj.*, t.table_number FROM print_jobs pj JOIN tickets t ON pj.ticket_id = t.id WHERE pj.status = 'pending' AND t.station_id = ? ORDER BY pj.created_at ASC").bind(parseInt(stationId)).all();
        jobs = r.results || [];
      } else {
        const r = await env.DB.prepare("SELECT pj.*, t.table_number FROM print_jobs pj JOIN tickets t ON pj.ticket_id = t.id WHERE pj.status = 'pending' ORDER BY pj.created_at ASC").all();
        jobs = r.results || [];
      }
      return jsonResponse(jobs.map(j => ({
        ...j,
        payload: (() => { try { return JSON.parse(j.payload); } catch { return j.payload; } })()
      })));
    }

    return jsonResponse({ error: 'Not found' }, 404);

  } catch (err) {
    if (err.status === 401) return jsonResponse({ error: 'Unauthorized' }, 401);
    console.error(err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}

async function getStations(env) {
  const { results } = await env.DB.prepare('SELECT * FROM stations ORDER BY name').all();
  return results;
}

async function getTickets(env, stationId) {
  // Migration sicherstellen (idempotent)
  await ensureKorrekturColumns(env);
  // is_korrektur DESC: Storno-Bons zuerst, dann nach Zeit aufsteigend.
  // COALESCE schuetzt falls Spalte noch fehlt (existing Tickets ohne Wert)
  let query = `SELECT t.*, COALESCE(t.is_korrektur, 0) as is_korrektur, COALESCE(t.kellner, s.name, 'Kellner') as station_name, s.color as station_color FROM tickets t LEFT JOIN stations s ON t.station_id = s.id WHERE t.status != 'done'`;
  const params = [];
  if (stationId) { query += ' AND t.station_id = ?'; params.push(stationId); }
  query += ' ORDER BY COALESCE(t.is_korrektur, 0) DESC, t.created_at ASC';
  const { results: tickets } = await env.DB.prepare(query).bind(...params).all();
  if (!tickets.length) return [];
  const ids = tickets.map(t => t.id);
  const { results: allItems } = await env.DB.prepare('SELECT *, COALESCE(is_korrektur, 0) as is_korrektur FROM ticket_items WHERE ticket_id IN (' + ids.map(() => '?').join(',') + ')').bind(...ids).all();
  const itemsByTicket = {};
  for (const item of allItems) {
    if (!itemsByTicket[item.ticket_id]) itemsByTicket[item.ticket_id] = [];
    itemsByTicket[item.ticket_id].push({ ...item, extras: JSON.parse(item.extras || '[]') });
  }
  const now = Date.now();
  for (const ticket of tickets) {
    ticket.items = itemsByTicket[ticket.id] || [];
    ticket.wait_secs = Math.floor((now - new Date((ticket.created_at||'').replace(' ','T')+'Z').getTime()) / 1000);
    // Boolean-Konversion fuer Frontend
    ticket.is_korrektur = !!ticket.is_korrektur;
  }
  return tickets;
}

async function createTicket(env, body) {
  const { ticket_number, table_number, station_id, station_name: bonKellner, items, is_korrektur } = body;
  const originalItemsJson = JSON.stringify(items || []);
  // Migrationen sicherstellen
  await env.DB.prepare('ALTER TABLE tickets ADD COLUMN kellner TEXT').run().catch(()=>{});
  await ensureKorrekturColumns(env);
  // Duplikat-Check: gleiche ticket_number + station_id → existierendes Ticket zurückgeben
  const existing = await env.DB.prepare(
    "SELECT id, ticket_number, table_number, station_id FROM tickets WHERE ticket_number = ? AND station_id = ? AND status IN ('pending','printing')"
  ).bind(ticket_number, station_id).first().catch(() => null);
  if (existing) {
    console.log('[TICKET] Duplikat ignoriert (noch aktiv):', ticket_number, 'station', station_id);
    return existing;
  }
  const isKorrInt = is_korrektur ? 1 : 0;
  const { meta } = await env.DB.prepare('INSERT INTO tickets (ticket_number, table_number, station_id, original_items, kellner, is_korrektur) VALUES (?, ?, ?, ?, ?, ?)').bind(ticket_number, table_number, station_id, originalItemsJson, bonKellner || null, isKorrInt).run();
  const ticketId = meta.last_row_id;
  for (const item of (items || [])) {
    const itemKorrInt = item.is_korrektur ? 1 : 0;
    await env.DB.prepare('INSERT INTO ticket_items (ticket_id, product_name, quantity, extras, is_korrektur) VALUES (?, ?, ?, ?, ?)').bind(ticketId, item.product_name, item.quantity, JSON.stringify(item.extras || []), itemKorrInt).run();
  }
  return { id: ticketId, ticket_number, table_number, station_id, items, is_korrektur: !!is_korrektur };
}

async function printTicket(env, ticketId) {
  await ensureKorrekturColumns(env);
  const ticket = await env.DB.prepare('SELECT t.*, COALESCE(t.is_korrektur, 0) as is_korrektur, COALESCE(t.kellner, s.name, \'BESTELLUNG\') as station_name FROM tickets t LEFT JOIN stations s ON t.station_id = s.id WHERE t.id = ?').bind(ticketId).first();
  if (!ticket) throw Object.assign(new Error('Not found'), { status: 404 });
  const { results: items } = await env.DB.prepare('SELECT *, COALESCE(is_korrektur, 0) as is_korrektur FROM ticket_items WHERE ticket_id = ?').bind(ticketId).all();
  const originalItems = ticket.original_items ? JSON.parse(ticket.original_items) : null;
  const hadPartialPrints = originalItems && originalItems.length > 0;
  const payload = JSON.stringify({
    ticket_number: ticket.ticket_number,
    table_number: ticket.table_number,
    station_name: ticket.station_name,
    items: items.map(i => ({ ...i, extras: JSON.parse(i.extras || '[]'), is_korrektur: !!i.is_korrektur })),
    created_at: ticket.created_at,
    all_items: hadPartialPrints ? originalItems : null,
    is_last: hadPartialPrints,
    partial: hadPartialPrints,
    is_korrektur: !!ticket.is_korrektur,
    printed_at: new Date().toISOString()
  });
  await env.DB.prepare('INSERT INTO print_jobs (ticket_id, payload) VALUES (?, ?)').bind(ticketId, payload).run();
  await env.DB.prepare("UPDATE tickets SET status = 'printing', printed_at = CURRENT_TIMESTAMP WHERE id = ?").bind(ticketId).run();
  return { ...ticket, status: 'printing' };
}

async function partialPrintTicket(env, ticketId, selectedItems) {
  await ensureKorrekturColumns(env);
  const ticket = await env.DB.prepare('SELECT t.*, COALESCE(t.is_korrektur, 0) as is_korrektur, COALESCE(t.kellner, s.name, \'BESTELLUNG\') as station_name FROM tickets t LEFT JOIN stations s ON t.station_id = s.id WHERE t.id = ?').bind(ticketId).first();
  if (!ticket) throw Object.assign(new Error('Not found'), { status: 404 });
  if (!selectedItems || selectedItems.length === 0) throw Object.assign(new Error('Keine Artikel'), { status: 400 });
  const { results: currentItems } = await env.DB.prepare('SELECT id, product_name, quantity FROM ticket_items WHERE ticket_id = ?').bind(ticketId).all();
  const batchStmts = [];
  for (const sel of selectedItems) {
    const ex = currentItems.find(i => i.product_name === sel.product_name);
    if (!ex) continue;
    const nQ = ex.quantity - sel.quantity;
    if (nQ <= 0) { batchStmts.push(env.DB.prepare('DELETE FROM ticket_items WHERE id = ?').bind(ex.id)); }
    else { batchStmts.push(env.DB.prepare('UPDATE ticket_items SET quantity = ? WHERE id = ?').bind(nQ, ex.id)); }
  }
  if (batchStmts.length > 0) await env.DB.batch(batchStmts);
  const originalItems = JSON.parse(ticket.original_items || '[]');
  let allItemsForVon = originalItems;
  if (!allItemsForVon.length) { const { results: cur } = await env.DB.prepare('SELECT * FROM ticket_items WHERE ticket_id = ?').bind(ticketId).all(); allItemsForVon = cur.map(i => ({ ...i, extras: JSON.parse(i.extras || '[]') })); }
  const { results: afterRemaining } = await env.DB.prepare('SELECT id FROM ticket_items WHERE ticket_id = ?').bind(ticketId).all();
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
    printed_at: new Date().toISOString()
  });
  await env.DB.prepare('INSERT INTO print_jobs (ticket_id, payload) VALUES (?, ?)').bind(ticketId, payload).run();
  if (isLastPartial) await env.DB.prepare("UPDATE tickets SET status = 'done' WHERE id = ?").bind(ticketId).run();
  return { ...ticket, partial: true };
}

async function markDone(env, ticketId) {
  const ticket = await env.DB.prepare('SELECT * FROM tickets WHERE id = ?').bind(ticketId).first();
  if (!ticket) throw Object.assign(new Error('Not found'), { status: 404 });
  await env.DB.prepare("UPDATE tickets SET status = 'done' WHERE id = ?").bind(ticketId).run();
  return { ...ticket, status: 'done' };
}

async function getTotals(env, stationId) {
  let query = `SELECT ti.product_name, SUM(ti.quantity) as total FROM ticket_items ti JOIN tickets t ON ti.ticket_id = t.id WHERE t.status != 'done'`;
  const params = [];
  if (stationId) { query += ' AND t.station_id = ?'; params.push(stationId); }
  query += ' GROUP BY ti.product_name ORDER BY total DESC';
  const { results } = await env.DB.prepare(query).bind(...params).all();
  return results;
}

async function getRecentJobs(env) {
  const { results } = await env.DB.prepare("SELECT pj.*, t.table_number FROM print_jobs pj JOIN tickets t ON pj.ticket_id = t.id ORDER BY pj.created_at DESC LIMIT 20").all();
  return results.map(j => ({ ...j, payload: JSON.parse(j.payload) }));
}

async function getPendingJobs(env, stationId) {
  let query, results;
  if (stationId) {
    const r = await env.DB.prepare("SELECT pj.*, t.table_number FROM print_jobs pj JOIN tickets t ON pj.ticket_id = t.id WHERE pj.status = 'pending' AND t.station_id = ? ORDER BY pj.created_at ASC").bind(parseInt(stationId)).all();
    results = r.results;
  } else {
    const r = await env.DB.prepare("SELECT pj.*, t.table_number FROM print_jobs pj JOIN tickets t ON pj.ticket_id = t.id WHERE pj.status = 'pending' ORDER BY pj.created_at ASC").all();
    results = r.results;
  }
  return results.map(j => ({ ...j, payload: JSON.parse(j.payload) }));
}

async function completeJob(env, jobId) {
  await env.DB.prepare("UPDATE print_jobs SET status = 'done', completed_at = CURRENT_TIMESTAMP WHERE id = ?").bind(jobId).run();
  return { id: jobId, status: 'done' };
}

async function broadcastUpdate(env, stationId, data) {
  const rooms = ['all'];
  if (stationId) rooms.push(String(stationId));
  for (const roomName of rooms) {
    try {
      const id = env.KDS_ROOM.idFromName(roomName);
      const room = env.KDS_ROOM.get(id);
      await room.fetch(new Request('https://internal/broadcast', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }));
    } catch (e) { console.error('Broadcast error:', e); }
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

function requireApiKey(request, env) {
  const key = request.headers.get('X-API-Key');
  if (!env.API_KEY || key !== env.API_KEY) throw Object.assign(new Error('Unauthorized'), { status: 401 });
}
