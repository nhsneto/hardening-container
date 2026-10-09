const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send({ msg: "Funcionando!" });
});

app.listen(PORT, () => {
  console.log(`App escutando na porta ${PORT}`);
});
