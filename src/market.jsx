import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import './market.css'
const API_URL = "https://api.pokemontcg.io/v2/cards";
const API_KEY = "72283e5f-3b89-4b20-8ddf-8ab81b2a01d4"; // Replace with your actual API key

const Market = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("pikachu");
  const [cardNumber, setCardNumber] = useState(""); // For optional card number

  const fetchCards = async (searchTerm, cardNumber = "") => {
    setLoading(true);
    setError("");

    // Build the query for a broad name search
    let query = `name:${searchTerm}`;

    if (cardNumber) {
      // Only append the number if it's provided (exact match)
      query += ` number:${cardNumber}`;
    }

    try {
      const response = await axios.get(API_URL, {
        headers: { "X-Api-Key": API_KEY },
        params: { q: query, pageSize: 10 },
      });

      if (response.data && response.data.data) {
        setCards(response.data.data);
      } else {
        setError("No Pokémon cards found.");
        setCards([]);
      }
    } catch (err) {
      setError("Error fetching Pokémon cards.");
      console.error("API Error:", err);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cards on first load
  useEffect(() => {
    fetchCards(query, cardNumber);
  }, [query, cardNumber]);  // Re-fetch when query or cardNumber changes

  return (
    <div className="market-container">
      <div className="market-body">
        <div className='searchbar'>
        <h1>Pokémon TCG Market</h1>

        {/* 🔍 Search Bar */}
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a Pokémon..."
          />
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="Card number (optional)"
          />
          <button onClick={() => fetchCards(query, cardNumber)}>Search</button>
        </div>
      </div>
        {loading && <p>Loading cards...</p>}
        {error && <p>{error}</p>}

        {/* 🃏 Display Cards */}
        <div className="market-items">
          {cards.length > 0 ? (
            cards.map((card) => (
              <div key={card.id} className="market-item">
                <h3>{card.name}</h3>
                {card.images && <img src={card.images.small} alt={card.name} />}
                <p>Set: {card.set?.name || "Unknown"}</p>
                <p>Rarity: {card.rarity || "Unknown"}</p>
              </div>
            ))
          ) : (
            !loading && !error && <p>No Pokémon cards found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Market;
