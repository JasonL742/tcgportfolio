import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';  // Import the UserContext
import { db } from '../firebase'; // Import Firestore
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import './home.css';  // Import custom CSS file

const Home = () => {
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

  // Show a loading message while folders are being fetched
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If no user is logged in, display login message
  if (!user) {
    return (
      <div className="login-message">
        <h2>Please log in to view your home page</h2>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h3 className="welcome-message">Welcome, {user.displayName}</h3>
      <div className="grid-container">
        {/* First card is a plus card to add a new folder */}
        <div className="card add-card" onClick={addCard}>
          <div className="card-content">
            <span className="add-icon">+</span>
            <h6>Add New Folder</h6>
          </div>
        </div>

        {/* Dynamically generated folder cards */}
        {cards.map((card) => (
          <div className="card" key={card.id} onClick={() => handleCardClick(card.id)}>
            <div className="card-content">
              <h5>Folder {card.id}</h5>
              <p>{card.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
