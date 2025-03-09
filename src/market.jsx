import React, { useEffect, useContext, useState } from 'react'; 
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { db, storage } from '../firebase'; // Import Firestore and Storage
import { doc, setDoc, collection } from 'firebase/firestore'; // Firestore functions
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // Storage functions
import './market.css';
import { UserContext } from './UserContext';
import { ToastContainer, toast } from 'react-toastify';
const API_URL = "https://api.pokemontcg.io/v2/cards";
const API_KEY = import.meta.env.VITE_Poke_Key; // Replace with your actual API key
const API_KEY_GPT =  import.meta.env.VITE_GPT_Api_Key
const Market = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("pikachu");
  const [cardNumber, setCardNumber] = useState(""); // For optional card number
  const [image, setImage] = useState(null); // For storing selected image
  const { id } = useParams(); // Get the folder ID from the URL
  const { user } = useContext(UserContext); 
  const userId = user ? user.uid : null;

  const fetchCards = async (searchTerm, cardNumber = "") => {
    setLoading(true);
    setError("");

    // Build the query for a broad name search
    let query = `name:${searchTerm}`;

    if (cardNumber) {
      // Only append the number if it's provided (exact match)
      query += ` number:${cardNumber}`;
    }

    try {
      const response = await axios.get(API_URL, {
        headers: { "X-Api-Key": API_KEY },
        params: { q: query, pageSize: 10 },
      });

      if (response.data && response.data.data) {
        setCards(response.data.data);
      } else {
        setError("No Pokémon cards found.");
        setCards([]);
      }
    } catch (err) {
      setError("Error fetching Pokémon cards.");
      console.error("API Error:", err);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cards on first load
  useEffect(() => {
    fetchCards(query, cardNumber);
  }, [query, cardNumber]);  // Re-fetch when query or cardNumber changes

  // Function to add a card to the folder
  const addCardToFolder = async (card) => {
    try {
      // Reference to the specific folder in Firestore
      const folderRef = doc(db, "users", userId, "folders", id); // Replace "user-id" with actual user ID

      // Reference to the collection inside the folder where cards are stored
      const cardsCollection = collection(folderRef, "cards");

      // Add the selected card to the folder's cards collection
      await setDoc(doc(cardsCollection, card.id), {
        name: card.name,
        set: card.set?.name || "Unknown",
        rarity: card.rarity || "Unknown",
        image: card.images.small,
        number: card.number,
        priceAdded: card.cardmarket.prices.avg1,
        dateAdded: card.tcgplayer.updatedAt,
      });

      console.log(`Card ${card.name} added to folder ${id}`);
      toast.success(`Card ${card.name} added to folder ${id}`);
    } catch (err) {
      console.error("Error adding card to folder:", err);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imagePath = `images/${file.name}`;
      const imageRef = ref(storage, imagePath);

      try {
        // Upload the image to Firebase Storage
        await uploadBytes(imageRef, file);
        // Get the image URL after upload
        const imageUrl = await getDownloadURL(imageRef);
        // Set the image URL to the search query
        setImage(imageUrl); // Store image URL for description extraction
        console.log("Image uploaded successfully, URL:", imageUrl);

      } catch (err) {
        console.error("Error uploading image:", err);
      }
    }
  };
  const deleteImage = async (imageUrl) => {
    try {
      // Get the reference for the image in Firebase Storage using its path
      const imageRef = ref(storage, imageUrl);
      // Delete the image
      await deleteObject(imageRef);
      console.log("Image deleted successfully.");
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };
  // Get image description and update the query
  const getImageDescription = async () => {
   
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "return the name of the pokemon on top and the number on the bottom before the /. Don't say anything else except the name and number with a space in between" },
                {
                  type: "image_url",
                  image_url: {
                    url: image,
                  },
                },
              ],
            },
          ],
          store: true,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY_GPT}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const description = response.data.choices[0]?.message.content;
      if (description) {
        const [name, number] = description.split(" ");
        setQuery(name); // Set the name to the search query
        setCardNumber(number); // Set the number to the cardNumber state
        console.log("Image description extracted:", description);
        deleteImage(image);
      }
    } catch (error) {
      console.error("Error making API request", error);
    }
  };

  
  return (
    <div className="market-container">
       <ToastContainer />
      <div className="market-body">
        <div className='searchbar'>
          <h1>Pokémon TCG Market</h1>
          <h2>Market Page for Folder ID: {id}</h2>
          {/* 🔍 Search Bar */}
          <div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a Pokémon..."
            />
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="Card number (optional)"
            />
            <button onClick={() => fetchCards(query, cardNumber)}>Search</button>
            <Link to={`/folderpage/${id}`}>
                    <button className="button">Done</button>
                  </Link>
          </div>
          {/* 🖼️ Upload Image Button */}
          <div>
        
            <input type="file" onChange={handleImageUpload} />
            <button onClick={getImageDescription}>Submit</button>
          </div>
        </div>

        {loading && <p>Loading cards...</p>}
        {error && <p>{error}</p>}

        {/* 🃏 Display Cards */}
        <div className="market-items">
          {cards.length > 0 ? (
            cards.map((card) => (
              <div key={card.id} className="market-item">
                <h3>{card.name}</h3>
                {card.images && <img src={card.images.small} alt={card.name} />}
                <p>Set: {card.set?.name || "Unknown"}</p>
                <p>Rarity: {card.rarity || "Unknown"}</p>
                {/* Button to add card to the folder */}
                <button onClick={() => addCardToFolder(card)}>Add to Folder</button>

              </div>
            ))
          ) : (
            !loading && !error && <p>No Pokémon cards found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Market;
