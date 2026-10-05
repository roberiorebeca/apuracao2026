// Verificação rápida, sem dependências: node scripts/check.mjs
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const m = html.match(/<script>([\s\S]*)<\/script>/);
assert(m, "script inline não encontrado em public/index.html");

new Function(m[1]); // erro de sintaxe falha aqui (não executa o código)

// Executa só a parte pura (parser e montagem de URL)
const head = m[1].split("/* ---------- Estado e rede")[0];
const { parseResult, buildUrl, VIEWS, makeViews } = new Function(head + "\nreturn { parseResult, buildUrl, VIEWS, makeViews };")();

assert.equal(VIEWS.length, 5, "esperado: presidente, governador, senador, dep. federal, dep. estadual");
assert.match(buildUrl("oficial", VIEWS.find(v => v.id === "dest")), /\/6259\/dados\/mt\/mt-c0007-e006259-u\.json$/);
const br = makeViews({ uf: "mt", level: "br", mun: "", munNm: "" });
assert.match(buildUrl("oficial", br[0]), /\/6257\/dados\/br\/br-c0001-e006257-u\.json$/);
assert.match(buildUrl("oficial", br[1]), /\/6259\/dados\/mt\/mt-c0003-e006259-u\.json$/, "no nível Brasil, os demais cargos usam o estado");
const mun = makeViews({ uf: "mt", level: "mun", mun: "90859", munNm: "X" });
assert.match(buildUrl("oficial", mun[4]), /\/6259\/dados\/mt\/mt90859-c0007-e006259-u\.json$/);
assert(mun.every(v => v.local), "visão de município deve ser marcada como local");
assert.equal(makeViews({ uf: "df", level: "uf", mun: "", munNm: "" })[4].cargo, 8, "DF usa deputado distrital (cargo 8)");

const amostra = {
  and: "p", dt: "04/10/2026", ht: "17:29:10",
  carg: [{ cd: "1", nv: "1", agr: [{ par: [{ sg: "XX", cand: [
    { n: "13", sqcand: "1", nmu: "A", vap: "700", pvapn: "70,00", e: "n", st: "Não eleito", dvt: "Válido" },
    { n: "22", sqcand: "2", nmu: "B", vap: "300", pvapn: "30,00", e: "n", st: "Não eleito", dvt: "Válido" }] }] }] }],
  s: { pstn: "50", ts: "10", st: "5" }, e: { te: "100", c: "80", pcn: "80" }, v: { tv: "1000", vb: "10", tvn: "20" }
};
const r = parseResult(amostra, VIEWS[0]);
assert.equal(r.cands[0].name, "A");
assert.equal(r.cands[0].votes, 700);
assert.equal(r.sectionsPct, 50);

const vercel = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
assert(vercel.rewrites.some(x => x.source.startsWith("/tse/")), "falta o repasse /tse/ no vercel.json");

console.log("OK: sintaxe, URLs e parser");
