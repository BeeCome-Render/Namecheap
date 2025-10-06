import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("✅ Namecheap Proxy is running!");
});

app.get("/check-domain", async (req, res) => {
  const domain = req.query.name;
  if (!domain) return res.status(400).json({ error: "No domain provided" });

  const apiUrl = `https://api.namecheap.com/xml.response?ApiUser=${process.env.NAMECHEAP_USER}&ApiKey=${process.env.NAMECHEAP_KEY}&UserName=${process.env.NAMECHEAP_USER}&Command=namecheap.domains.check&ClientIp=${process.env.CLIENT_IP}&DomainList=${domain}`;

  try {
    const response = await fetch(apiUrl);
    const xml = await response.text();
    res.type("text/xml").send(xml);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to connect to Namecheap API." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Proxy running on port ${PORT}`));
