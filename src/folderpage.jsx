import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, TextField } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';  // To generate unique card IDs
import { useParams } from 'react-router-dom';


const folderpage = () => {
  const [cards, setCards] = useState([]); // User's card collection state
  const [cardName, setCardName] = useState(''); // Input for card name
  const [cardRarity, setCardRarity] = useState(''); // Input for card rarity
  const [cardImage, setCardImage] = useState(''); // Input for card image URL
  const { id } = useParams();//id from url
  // Handle adding a new card to the collection
  const addCard = () => {
    if (cardName && cardRarity && cardImage) {
      setCards([
        ...cards,
        {
          id: uuidv4(),
          name: cardName,
          rarity: cardRarity,
          image: cardImage,
        },
      ]);
      // Reset input fields
      setCardName('');
      setCardRarity('');
      setCardImage('');
    }
  };

  // Handle removing a card from the collection
  const removeCard = (id) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h3" gutterBottom>
        My TCG Card Collection
      </Typography>

      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Card Name"
          variant="outlined"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Card Rarity"
          variant="outlined"
          value={cardRarity}
          onChange={(e) => setCardRarity(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Card Image URL"
          variant="outlined"
          value={cardImage}
          onChange={(e) => setCardImage(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={addCard}>
          Add Card
        </Button>
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

export default folderpage;
