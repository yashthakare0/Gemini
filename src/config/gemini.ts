// ANOTHER GPT MODEL API USED FOR DEMONSTRATIONAL PURPOSE

const API_KEY = import.meta.env.VITE_CHAT_API_KEY;
const requestLink = "https://api.pawan.krd/pai-001/v1/chat/completions";

async function getAPIResponse(prompt: string) {
  const response = await fetch(requestLink, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      model: "pai-001",
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export default getAPIResponse;


