const express = require("express");
const cors = require("cors");


const app = express();
app.use(cors());

app.get("/warframe-riven", async (req, res) => {
  try {
    const response = await fetch("https://api.warframe.market/v1/riven/items");
    const jsonData = await response.json();
    res.json(jsonData);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Abrufen der Daten" });
  }
});

app.get("/warframe-auction", async (req, res) => {
  try {
    const { weapon_url_name } = req.query;

    // Wenn der Waffennamen nicht vorhanden ist, sende einen Fehler
    if (!weapon_url_name) {
      return res.status(400).json({ error: "Waffenname wird benötigt" });
    }
    const response = await fetch(
      `https://api.warframe.market/v1/auctions/search?type=riven&sort_by=price_asc&weapon_url_name=${weapon_url_name}`
    );
    const jsonData = await response.json();
    res.json(jsonData);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Abrufen der Daten" });
  }
});
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});