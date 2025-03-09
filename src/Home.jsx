import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';  // Import the UserContext
import { db } from '../firebase'; // Import Firestore
import { collection, addDoc, getDocs, query, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';  // Import useNavigate for routing
import './home.css';  // Import custom CSS file

const Home = () => {
  const { user } = useContext(UserContext);  // Consume the user from context
  const [cards, setCards] = useState([]);  // State for folders
  const [loading, setLoading] = useState(true);  // Add loading state
  const [textname, setTextname] = useState("");  // State for folder name input
  const navigate = useNavigate();  // Initialize navigate for routing
  useEffect(() => {
    const fetchFolders = async () => {
      if (user===null) {
        setLoading(false); // Set loading to false if no user is logged in
        return;
      }
      
      try {
        const q = query(collection(db, "users", user.uid, "folders"));
        const querySnapshot = await getDocs(q);
        const fetchedCards = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCards(fetchedCards);
      } catch (error) {
        console.error("Error fetching folders:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false after fetching
      }
    };

    if (user) {
      fetchFolders();  // Fetch folders only when the user is logged in
    }
  }, [user]);  // Run this effect when the user changes

  // Function to add a new folder
  const addCard = async () => {
    if (!user || !textname.trim()) {  // Check if user is logged in and folder name is not empty
      console.log("No user logged in or folder name is empty");
      return;
    }

    const newCard = {
      content: `Folder ${cards.length + 1}`,
      userId: user.uid, 
      Name: textname,  // Use the folder name from the input
    };

    try {
      // Add the new folder under the user's folders subcollection
      const docRef = await addDoc(collection(db, "users", user.uid, "folders"), newCard);
      setCards(prevCards => [
        ...prevCards,
        { id: docRef.id, content: newCard.content, Name: newCard.Name }
      ]);
      setTextname("");  // Clear the folder name input after adding the folder
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Function to delete a folder
  const deleteFolder = async (folderId) => {
    if (!user) return;  // Ensure the user is logged in

    try {
      // Delete the folder document from Firestore
      await deleteDoc(doc(db, "users", user.uid, "folders", folderId));
      // Remove the folder from the local state to update the UI
      setCards(prevCards => prevCards.filter(card => card.id !== folderId));
    } catch (e) {
      console.error("Error deleting folder: ", e);
    }
  };

  // Handle folder card click
  const handleCardClick = (id) => {
    navigate(`/folderpage/${id}`);  // Navigate to the FolderPage with the folder ID
  };

  // If no user is logged in, display login message
  if (user===null) {
    return (
      <div className="login-message">
        <h2>Please log in to view your home page</h2>
      </div>
    );
  }

  // Show a loading message while folders are being fetched
  if (loading) {
    return <div className="loading">loading...</div>;
  }

  return (
    <div className="home-container">
      <h3 className="welcome-message">Welcome, {user.displayName}</h3>
      <div className="grid-container">
        {/* First card is a plus card to add a new folder */}
        <div className="card add-card">
          <div className="card-content">
            <span className="add-icon">+</span>
            <h6>Add New Folder</h6>
            <input 
              type="text"
              value={textname}
              onChange={(e) => setTextname(e.target.value)}  // Handle folder name input change
              placeholder="Enter folder name"
            />
            <button onClick={addCard}>Add Folder</button>
          </div>
        </div>

        {/* Dynamically generated folder cards */}
        {cards.map((card) => (
          <div className="card" key={card.id} onClick={() => handleCardClick(card.id)}>
            <div className="card-content">
              <h5>{card.Name}</h5>  {/* Display the name of the folder */}
              <p>{card.content}</p>
            </div>
            {/* Add a delete button to each card */}
            <button className="delete-button" onClick={(e) => {
              e.stopPropagation();  // Prevent triggering the card click event
              deleteFolder(card.id); // Delete the folder
            }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
