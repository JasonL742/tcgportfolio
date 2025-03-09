import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const HomePage = () => {
  const [cards, setCards] = useState([]);  
  const navigate = useNavigate();

  const addCard = () => {
    setCards([
      ...cards,
      { id: cards.length + 1, content: `Card ${cards.length + 1}` },
    ]);
  };

  const handleCardClick = (id) => {
    navigate(`/folderpage/${id}`); // Navigate to FolderPage with a dynamic ID
  };

  return (
    <div style={{ padding: '20px' }}>
      <Grid container spacing={2}>
        {/* First card is a plus card */}
        <Grid item xs={12} sm={6} md={4}>
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
        </Grid>

        {/* Dynamically generated cards */}
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.id}>
            <Card 
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                width: '250px',
                cursor: 'pointer',
              }} 
              onClick={() => handleCardClick(card.id)} // Navigate on click
            >
              <CardContent style={{
                overflow: 'auto',
                maxHeight: '200px',
                wordWrap: 'break-word',
                maxWidth: '200px'
              }}>
                <Typography variant="h5">Folder {card.id}</Typography>
                <Typography variant="body1">{card.content}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default HomePage;
