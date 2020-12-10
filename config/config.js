let config = {};

if (Deno.env.get("TEST_ENVIRONMENT")) {
  config.database = {
    hostname: "hattie.db.elephantsql.com",
    database: "vidojnmf",
    user: "vidojnmf",
    password: "MMbNYpohnJsz-E44oaxsmEhfMxLLifC6",
    port: 5432,
  };
} else {
  config.database = {
    hostname: "balarama.db.elephantsql.com",
    database: "ikoqblsx",
    user: "ikoqblsx",
    password: "8Uz9GefdyuHa32549vcUWPa12zxwVJqZ",
    port: 5432,
  };
}

export { config };
