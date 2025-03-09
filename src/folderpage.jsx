import React, { useState, useContext, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, TextField } from '@mui/material';
import { useParams, Link } from 'react-router-dom'; // Import Link for navigation
import { db } from '../firebase'; // Import Firestore from your firebase config
import { collection, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore'; // Firestore methods
import { UserContext } from './UserContext';  

const FolderPage = () => {
  const { user } = useContext(UserContext); // Get user from context
  const [cards, setCards] = useState([]); // User's card collection state
  const [cardName, setCardName] = useState(''); // Input for card name
  const [cardRarity, setCardRarity] = useState(''); // Input for card rarity
  const [cardImage, setCardImage] = useState(''); // Input for card image URL
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

  // Handle adding a new card to the collection
  const addCard = async () => {
    if (cardName && cardRarity && cardImage) {
      try {
        const newCard = {
          name: cardName,
          rarity: cardRarity,
          image: cardImage
        };
        const cardsCollection = collection(db, `users/${userId}/folders/${folderId}/cards`);
        const docRef = await addDoc(cardsCollection, newCard);
        setCards([ ...cards, { id: docRef.id, ...newCard } ]);
        // Reset input fields
        setCardName('');
        setCardRarity('');
        setCardImage('');
      } catch (error) {
        console.error("Error adding card: ", error);
      }
    }
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
    
    <div style={{ padding: '20px' }}>
      
      <Typography variant="h3" gutterBottom>
        My TCG Card Collection
      </Typography>
         {/* Button linking to the market page with the id passed as part of the URL */}
         <div style={{ margin: '20px' }}>
        <Link to={`/market/${folderId}`}>
          <Button variant="contained" color="primary">
            Go to Market
          </Button>
        </Link>
      </div>

      <Grid container spacing={2}>
        {/* Map over the cards array and render each card */}
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.id}>
            <Card
              style={{
                width: '250px',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <img
                src={card.image}
                alt={card.name}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                }}
              />
              <CardContent style={{ flex: 1 }}>
                <Typography variant="h5">{card.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Rarity: {card.rarity}
                </Typography>
              </CardContent>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => removeCard(card.id)}
                style={{ marginBottom: '10px' }}
              >
                Remove
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

   
    </div>
  );
};

export default FolderPage;
