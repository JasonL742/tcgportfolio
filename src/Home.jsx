import React, { useState } from 'react';
import { Grid2, Card, CardContent, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';  // Material UI Add icon

const HomePage = () => {
  const [cards, setCards] = useState([]);  // State to hold dynamically added cards

  // Function to add a new card to the state
  const addCard = () => {
    setCards([
      ...cards,
      { id: cards.length + 1, content: `Card ${cards.length + 1}` },
    ]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Grid2 container spacing={2}>
        {/* First card is a plus card */}
        <Grid2 item xs={12} sm={6} md={4}>
          <Card
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              width: '200px',
              cursor: 'pointer',
            }}
            onClick={addCard}
          >
            <CardContent>
              <Typography variant="h5" color="primary">
                <AddIcon style={{ fontSize: '50px' }} />
              </Typography>
              <Typography variant="h6" color="primary">
                Add New Folder
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        {/* Dynamically generated cards */}
        {cards.map((card) => (
          <Grid2 item xs={12} sm={6} md={4} key={card.id}>
            <Card style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              width: '250px',
              cursor: 'pointer',
            }}>
              <CardContent   style={{
                  overflow: 'auto', // Enable vertical scrolling
                  maxHeight: '200px',
                  wordWrap: 'break-word',
                  maxWidth: '200px' // Limit the height of content
                }}>
                <Typography variant="h5">folder{card.id}</Typography>
                <Typography variant="body1">{card.content}</Typography>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </div>
  );
};

export default HomePage;
