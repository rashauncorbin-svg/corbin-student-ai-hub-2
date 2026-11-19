import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const files = ["app.js", "teacher.js", "worker/src/index.js"];
let failed = false;
for (const file of files) {
  if (!existsSync(file)) {
    console.error("Missing required source:", file);
    failed = true;
    continue;
  }
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) {
    console.error("JavaScript syntax check failed:", file, result.stderr || result.stdout);
    failed = true;
  } else {
    console.log("PASS JavaScript syntax:", file);
  }
}
for (const [html, assets] of [
  ["index.html", ["styles.css", "app.js", "teacher.html"]],
  ["teacher.html", ["styles.css", "teacher.css", "teacher.js"]]
]) {
  const source = readFileSync(html, "utf8");
  for (const asset of assets) {
    if (!existsSync(asset) || !source.includes(asset)) {
      console.error("Missing or unreferenced asset:", html, asset);
      failed = true;
    } else {
      console.log("PASS asset reference:", html, "->", asset);
    }
  }
}
const sql = readFileSync("worker/migrations/0001_initial.sql", "utf8");
for (const table of ["users", "classes", "enrollments", "lessons", "submissions"]) {
  if (!new RegExp("CREATE TABLE IF NOT EXISTS " + table + "\\b", "i").test(sql)) {
    console.error("Missing database table:", table);
    failed = true;
  } else console.log("PASS database table:", table);
}
if (failed) process.exit(1);
console.log("All repository validation checks passed.");
