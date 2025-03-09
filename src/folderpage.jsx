import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link for navigation
import { db } from '../firebase'; // Import Firestore from your firebase config
import { collection, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore'; // Firestore methods
import { UserContext } from './UserContext';  
import './folder.css'; // Import custom CSS file

const folderpage = () => {
  const { user } = useContext(UserContext); // Get user from context
  const [cards, setCards] = useState([]); // User's card collection state
  const { id: folderId } = useParams(); // Folder id from URL
  const [loading, setLoading] = useState(true); 
  const userId = user ? user.uid : null; // Use userId if user exists

  // Fetch cards from Firestore based on userId and folderId
  useEffect(() => {
    if (!userId) return; // If userId is not available, don't try fetching cards

    const fetchCards = async () => {
      try {
        const cardsCollection = collection(db, `users/${userId}/folders/${folderId}/cards`);
        const cardSnapshot = await getDocs(cardsCollection);
        const cardList = cardSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCards(cardList); // Set the fetched cards to state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cards: ", error);
      }
    };

    fetchCards();
  }, [folderId, userId]); // Re-fetch when folderId or userId changes

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
      <h3 className="heading">My TCG Card Collection</h3>
      <div className="button-container">
        {/* Button linking to the market page with the id passed as part of the URL */}
        <Link to={`/market/${folderId}`} className="button-link">
          <button className="button">Go to Market</button>
        </Link>
      </div>

      <div className="grid-container">
        {/* Map over the cards array and render each card */}
        {cards.map((card) => (
          <div className="card" key={card.id}>
            <img src={card.image} alt={card.name} className="card-image" />
            <div className="card-content">
              <h5>{card.name}</h5>
              <p>Rarity: {card.rarity}</p>
            </div>
            <button className="remove-button" onClick={() => removeCard(card.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default folderpage;
