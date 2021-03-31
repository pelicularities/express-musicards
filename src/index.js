require("./utils/db");
const app = require("./app");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Express app started on http://localhost:${PORT}`);
});
