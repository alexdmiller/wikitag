"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wikijs_1 = __importDefault(require("wikijs"));
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const port = 5000;
app.get("/:search", async (req, res) => {
    const search = req.params.search;
    const page = await wikijs_1.default().api({
        action: "parse",
        page: search,
    });
    res.set({
        "Access-Control-Allow-Origin": "*",
    });
    res.send(page.parse.text["*"]);
});
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
//# sourceMappingURL=server.js.map