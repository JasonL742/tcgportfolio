import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link for navigation
import { db } from '../firebase'; // Import Firestore from your firebase config
import { collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore'; // Firestore methods
import { UserContext } from './UserContext';  
import { fetchPokemonCards } from './api'; // Import the fetchPokemonCards function
import './folder.css'; // Import custom CSS file

const FolderPage = () => {
  const { user } = useContext(UserContext); // Get user from context
  const [cards, setCards] = useState([]); // User's card collection state
  const [folderName, setFolderName] = useState(''); // State for folder name
  const { id: folderId } = useParams(); // Folder id from URL
  const [loading, setLoading] = useState(true);
  const [cardPrices, setCardPrices] = useState({}); // Store fetched card prices
  const userId = user ? user.uid : null; // Use userId if user exists

  // Fetch folder and cards data
  useEffect(() => {
    if (!userId) return; // If userId is not available, don't try fetching cards

    const fetchFolderData = async () => {
      try {
        // Fetch folder name
        const folderDocRef = doc(db, `users/${userId}/folders`, folderId);
        const folderDoc = await getDoc(folderDocRef);
        
        if (folderDoc.exists()) {
          setFolderName(folderDoc.data().Name); // Set folder name
        }

        // Fetch cards in the folder
        const cardsCollection = collection(db, `users/${userId}/folders/${folderId}/cards`);
        const cardSnapshot = await getDocs(cardsCollection);
        const cardList = cardSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCards(cardList); // Set the fetched cards to state
        setLoading(false);
        
        // Fetch prices for each card after Firestore data is loaded
        await fetchCardPrices(cardList);
      } catch (error) {
        console.error("Error fetching folder or cards: ", error);
      }
    };

    fetchFolderData();
  }, [folderId, userId]); // Re-fetch when folderId or userId changes

  // Fetch current prices for each card
  const fetchCardPrices = async (cardList) => {
    const prices = {};
    for (const card of cardList) {
      const cardData = await fetchPokemonCards(card.id);
      if (cardData.length > 0) {
        prices[card.id] = cardData[0].cardmarket.prices.avg1 || 'Price not available';
      } else {
        prices[card.id] = 'Price not available';
      }
    }
    setCardPrices(prices); // Set prices to state
  };

  // Handle removing a card from the collection
  const removeCard = async (id) => {
    try {
      const cardDoc = doc(db, `users/${userId}/folders/${folderId}/cards`, id);
      await deleteDoc(cardDoc);
      setCards(cards.filter((card) => card.id !== id));
    } catch (error) {
      console.error("Error removing card: ", error);
    }
  };

  if (!userId) {
    return <div>Please log in to see your collection</div>; // Show message if not logged in
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="folder-container">
      <h3 className="heading">{folderName}</h3> {/* Display folder name */}
      <div className="button-container">
        {/* Button linking to the market page with the id passed as part of the URL */}
        <Link to={`/market/${folderId}`} className="button-link">
          <button className="button">Add Cards</button>
        </Link>
      </div>

      <div className="grid-container">
        {/* Map over the cards array and render each card */}
        {cards.map((card) => (
          <div className="foldercard" key={card.id}>
            <img src={card.image} alt={card.name} className="card-image" />
            <div className="card-content">
              <h5>{card.name}</h5>
              <p>Rarity: {card.rarity}</p>
              <p>Price: {cardPrices[card.id] || 'Loading price...'}</p>
              <p>Price Added: {card.priceAdded}</p>
              <p>Gain: {card.priceAdded - cardPrices[card.id]}</p>
            </div>
            <button className="remove-button" onClick={() => removeCard(card.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderPage;
