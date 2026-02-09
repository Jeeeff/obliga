module.exports = {
  apps: [
    {
      name: "obliga-bot",
      script: "src/index.ts",
      interpreter: "tsx",
      instances: 1,
      max_memory_restart: "200M",
      error_file: "logs/bot-error.log",
      out_file: "logs/bot-out.log",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
}
