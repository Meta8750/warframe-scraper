import React, { useEffect, useState } from "react";
import styles from "./style/main.module.css";

const WarframeData = () => {
  const [rivenItems, setRivenItems] = useState([]); // Alle Riven-Mods
  const [auctions, setAuctions] = useState([]); // Auktionen für die Mods
  const [loading, setLoading] = useState(false);

    const fetchRivens = async () => {
      try {
        const response = await fetch("http://localhost:5500/warframe-riven");
        if (!response.ok) {
          throw new Error("Fehler beim Abrufen der Riven");
        }
        const jsonData = await response.json();
        setLoading(true);
        // Speichert die Waffen-URLs (um sie für die Auktionen zu verwenden)
        const rivenList = jsonData.payload.items.filter(riven => ["rifle"].includes(riven.riven_type)).map(riven => riven.url_name);
        setRivenItems(rivenList);
        // Direkt alle Auktionen abrufen
        fetchAllRivenAuctions(rivenList);
      } catch (error) {
        console.error("Fehler:", error);
      }
    };

    const fetchAllRivenAuctions = async (rivenList) => {
      try {
        const allAuctions = [];

        for (const weapon_url_name of rivenList) {
        
          const response = await fetch(
            `http://localhost:5500/warframe-auction?weapon_url_name=${weapon_url_name}`
          );

          if (!response.ok) {
            console.warn(`Fehler beim Abrufen der Auktionen für ${weapon_url_name}`);
            continue;
          }

          const jsonData = await response.json();

          

          // Filtere nur Offline-Verkäufer & speichere 2 billigste Einträge
          const filteredAuctions = jsonData.payload.auctions
            .filter(auction => auction.owner.status !== "ingame")
            .slice(0, 1)
            

          allAuctions.push(...filteredAuctions);
        }

        setAuctions(allAuctions);
        setLoading(false);
      } catch (error) {
        console.error("Fehler beim Abrufen der Auktionen:", error);
      }
    };

    


  return (
    <div>
    
      <h1>Warframe Market Data</h1>
      <button onClick={() => fetchRivens()} className={"w-10 h-10"}></button>
      {loading ? <p>Lade Daten...</p> : (
        <ul>
          {auctions.map((item, index) => (
            <li key={index} className={item.buyout_price > 100 ? "!text-l text-red-600" : ""}>
              {item.item.weapon_url_name} - {item.buyout_price} Plat (Verkäufer: {item.owner.ingame_name})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WarframeData;
