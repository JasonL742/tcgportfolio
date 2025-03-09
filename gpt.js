import axios from 'axios';
import { config } from 'dotenv';
config(); // Load environment variables from .env

const apiKey = process.env.REACT_APP_GPT_Api_Key;

// The image URL you want to process
const imageUrl = "https://tcgplayer-cdn.tcgplayer.com/product/517035_in_1000x1000.jpg";

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
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        store: true,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response.data.choices[0]); // Log the response
  } catch (error) {
    console.error("Error making API request", error);
  }
};

getImageDescription();
