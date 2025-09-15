const CHATBOT_API_URL = "http://localhost:5005";

class ChatbotService {
  async sendMessage(message) {
    try {
      // Récupérer le token JWT depuis localStorage
      const token = localStorage.getItem("token");
      
      const headers = {
        "Content-Type": "application/json",
      };
      
      // Ajouter le token JWT si disponible
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${CHATBOT_API_URL}/chat`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error("Erreur chatbot service:", error);
      throw new Error("Impossible de contacter le chatbot. Vérifiez que le serveur Flask est démarré.");
    }
  }

  // Vérifier si le service chatbot est disponible
  async checkHealth() {
    try {
      const response = await fetch(`${CHATBOT_API_URL}/`, {
        method: "GET",
        timeout: 5000,
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default new ChatbotService();
