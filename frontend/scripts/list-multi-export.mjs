import fs from "node:fs";
import path from "node:path";

const out = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) {
      walk(full);
    } else if (/\.(ts|tsx)$/.test(name.name) && !name.name.includes(".test.")) {
      const c = fs.readFileSync(full, "utf8");
      const n = (c.match(/^export /gm) ?? []).length;
      if (n > 1) {
        out.push({ n, full: full.replace(/\\/g, "/") });
      }
    }
  }
}

walk(path.join(process.cwd(), "src"));
out.sort((a, b) => b.n - a.n);
for (const { n, full } of out) {
  console.log(`${n}\t${full}`);
}
