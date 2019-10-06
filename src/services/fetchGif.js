const API_KEY = "oBRhMXPdT5g7uGmPyEOxLUlTQ9twXjCS";

export default async function fetchGif(text) {
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/translate?api_key=${API_KEY}&s=${text}`
  );

  return await response.json();
}
