import React, { useContext, useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { UserContext } from './UserContext';  // Import the UserContext
import { db } from '../firebase'; // Import Firestore
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation

const HomePage = () => {
  const { user } = useContext(UserContext);  // Consume the user from context
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);  // Add loading state
  const navigate = useNavigate();  // Initialize navigate for routing

  // Fetch folders when the user changes
  useEffect(() => {
    const fetchFolders = async () => {
      if (user) {
        // Fetch the folders subcollection for the logged-in user
        const q = query(collection(db, "users", user.uid, "folders"));
        const querySnapshot = await getDocs(q);
        const fetchedCards = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCards(fetchedCards);
        setLoading(false);  // Set loading to false once data is fetched
      }
    };

    if (user) {
      fetchFolders();  // Fetch folders only when the user is logged in
    }
  }, [user]);  // Run this effect when the user changes

  // Function to add a new folder
  const addCard = async () => {
    if (!user) {  // Check if user is logged in
      console.log("No user logged in");
      return;
    }

    const newCard = {
      content: `Folder ${cards.length + 1}`,
      userId: user.uid,  // Include userId to associate the folder with the user
    };

    try {
      // Add the new folder under the user's folders subcollection
      const docRef = await addDoc(collection(db, "users", user.uid, "folders"), newCard);
      setCards(prevCards => [
        ...prevCards,
        { id: docRef.id, content: newCard.content }
      ]);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Handle folder card click
  const handleCardClick = (id) => {
    navigate(`/folderpage/${id}`);  // Navigate to the FolderPage with the folder ID
  };

  // If no user is logged in, display login message
  if (!user) {
    return (
      <div>
        <h2>Please log in to view your home page</h2>
      </div>
    );
  }

  // Show a loading message while folders are being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3>Welcome, {user.displayName}</h3>
      <Grid container spacing={2}>
        {/* First card is a plus card to add a new folder */}
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
            onClick={addCard}  // Trigger addCard on click
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

        {/* Dynamically generated folder cards */}
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
              onClick={() => handleCardClick(card.id)}  // Navigate to the folder page on click
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
