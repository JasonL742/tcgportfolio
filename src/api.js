import axios from "axios";

const APIKey = import.meta.env.VITE_Poke_Key;
const BASE_URL = "https://api.pokemontcg.io/v2";


export const fetchPokemonCards = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/cards`, {
      headers: { "X-Api-Key": APIKey },
      params: { q: `id:${query}` },
    });
    return response.data.data; // The API returns data in a nested object
  } catch (error) {
    console.error("Error fetching cards:", error);
    return [];
  }
};