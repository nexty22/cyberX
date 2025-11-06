export default async function handler(req, res) {
  const { number } = req.query;

  if (!number) return res.status(400).json({ success: false, error: "Missing number" });

  try {
    const api = await fetch(`https://fam-official.serv00.net/api/famofc_simdatabase.php?number=${number}`);
    const data = await api.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
}
