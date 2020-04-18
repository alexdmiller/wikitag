import wiki from "wikijs";
import express from "express";

const app = express();
const port = 5000;

app.get("/:search", async (req, res) => {
  const search = req.params.search;

  const page = await (wiki() as any).api({
    action: "parse",
    page: search,
  });
  res.set({
    "Access-Control-Allow-Origin": "*",
  });
  res.send(page.parse.text["*"]);
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
