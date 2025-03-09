import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './market.css';
import axios from 'axios';
import pokemon from 'pokemontcgsdk'

pokemon.configure({apiKey: '72283e5f-3b89-4b20-8ddf-8ab81b2a01d4'})

const Market = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://api.ebay.com/buy/browse/v1/item_summary/search?q=cards');
        setItems(response.data.itemSummaries);
      } catch (error) {
        console.error('Error fetching data from eBay API', error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="market-container">
      <nav className="navbar">
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/market" className="navbar-link">Market</Link>
          </li>
          {/* Add more navbar items here */}
        </ul>
      </nav>
      <div className="market-body">
        <div className="market-items">
          {items.map(item => (
            <div key={item.itemId} className="market-item">
              <h3>{item.title}</h3>
              <img src={item.image.imageUrl} alt={item.title} />
              <p>{item.price.value} {item.price.currency}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default Market;