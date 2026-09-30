import { spawnSync } from "node:child_process";

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: true });

  if (result.status) {
    process.exit(result.status);
  }
}

run("npx", ["prisma", "generate"]);

if (process.env.DATABASE_URL) {
  run("npx", ["prisma", "migrate", "deploy"]);
} else {
  console.warn("Skipping prisma migrate deploy because DATABASE_URL is not set.");
}

run("npx", ["next", "build"]);
