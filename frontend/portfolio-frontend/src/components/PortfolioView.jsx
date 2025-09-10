import { useState } from "react";
import api from "../api";

function PortfolioView() {
  const [userId, setUserId] = useState("");
  const [portfolio, setPortfolio] = useState(null);

  const fetchPortfolio = async () => {
    try {
      const res = await api.get(`/portfolios/${userId}`);
      setPortfolio(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching portfolio");
    }
  };

  return (
    <div>
      <h2>View Portfolio</h2>
      <input
        type="number"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={fetchPortfolio}>Get Portfolio</button>

      {portfolio && (
        <div style={{ marginTop: "1rem" }}>
          <h3>{portfolio.name}</h3>
          <p>Email: {portfolio.email}</p>
          <h4>Skills</h4>
          <ul>
            {portfolio.skills?.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
          <h4>Projects</h4>
          <ul>
            {portfolio.projects?.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PortfolioView;
