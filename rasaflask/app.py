from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import requests
import re
from difflib import SequenceMatcher

app = Flask(__name__)
CORS(app)

# Configuration de l'API backend
BACKEND_API_URL = "http://localhost:8080"

def similarity(a, b):
    """Calcule la similarité entre deux chaînes de caractères"""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def get_faq_from_backend(jwt_token=None):
    """Récupère les FAQ depuis l'API backend via l'endpoint public"""
    try:
        # Utiliser uniquement l'endpoint public (pas besoin d'authentification)
        response = requests.get(f"{BACKEND_API_URL}/public/questions", timeout=5)
        if response.status_code == 200:
            print("FAQ récupérées avec succès via endpoint public")
            return response.json()
        else:
            print(f"Erreur endpoint public: {response.status_code}")
            return []
    except Exception as e:
        print(f"Erreur connexion API FAQ: {e}")
        return []

def find_best_faq_match(user_message, faqs, threshold=0.3):
    """Trouve la meilleure correspondance FAQ pour le message utilisateur"""
    best_match = None
    best_score = 0
    
    for faq in faqs:
        # Comparer avec la question
        question_score = similarity(user_message, faq.get('texte', ''))
        
        # Vérifier aussi les mots-clés dans la question
        question_words = faq.get('texte', '').lower().split()
        user_words = user_message.lower().split()
        
        # Bonus si des mots-clés correspondent
        keyword_bonus = 0
        for word in user_words:
            if len(word) > 3 and word in ' '.join(question_words):
                keyword_bonus += 0.2
        
        total_score = question_score + keyword_bonus
        
        if total_score > best_score and total_score > threshold:
            best_score = total_score
            best_match = faq
    
    return best_match, best_score

@app.route('/')
def index():
    return render_template("chatbot.html")  # Ton template HTML

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    original_message = user_message
    user_message_lower = user_message.lower()
    
    # Récupérer le token JWT depuis les headers
    jwt_token = None
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        jwt_token = auth_header.split(' ')[1]
        print(f"JWT reçu du frontend: {jwt_token[:20]}...")

    # Priorité 1: Salutations (toujours en premier)
    if any(x in user_message_lower for x in ["bonjour", "salut", "bonsoir", "hello"]):
        reply = "Bonjour ! Je suis l'assistant virtuel d'ESPRIT. Comment puis-je vous aider ? 😊"
    
    # Priorité 2: Au revoir
    elif any(x in user_message_lower for x in ["merci", "au revoir", "à bientôt", "bye"]):
        reply = "Merci ! Bonne continuation pour ton PFE. 👋"
    
    # Priorité 3: Chercher dans les FAQ de l'admin
    else:
        faqs = get_faq_from_backend(jwt_token)
        best_match, score = find_best_faq_match(user_message, faqs)
        
        if best_match and score > 0.3:
            # Récupérer la réponse de la FAQ (structure modifiée: une seule réponse par question)
            reponse = best_match.get('reponse')
            if reponse:
                reply = reponse.get('texte', 'Réponse non disponible.')
            else:
                reply = "J'ai trouvé une question similaire mais pas de réponse associée."
        
        # Priorité 4: Réponses prédéfinies pour les sujets PFE
        elif any(x in user_message_lower for x in [
            "dates importantes", "soutenance", "date limite", "rendre le rapport", "échéance"
        ]):
            reply = "Les dates importantes comme les dépôts et les soutenances sont disponibles sur la plateforme officielle PFE. Consulte-la régulièrement."
        
        elif any(x in user_message_lower for x in [
            "déposer mon rapport", "soumettre le pfe", "uploader mon livrable", "livrables à fournir", "où déposer"
        ]):
            reply = "Tu dois déposer ton rapport final et ton code source sur la plateforme [PFE](https://pfe.esprit.tn). Respecte bien les échéances."
        
        elif any(x in user_message_lower for x in [
            "modèle pour le pfe", "valider mon rapport", "guide de rédaction", "règles", "normes"
        ]):
            reply = "Le rapport PFE doit suivre les normes de rédaction de l'école. Un modèle est disponible dans la section 'Ressources' de la plateforme PFE."
        
        elif any(x in user_message_lower for x in [
            "rôle de mon encadrant", "valide mon travail", "assister à la soutenance", "coordinateur pfe", "encadrant"
        ]):
            reply = "Ton encadrant t'aide à encadrer techniquement ton travail. Le coordinateur PFE vérifie l'avancement et valide les étapes."
        
        # Réponse par défaut
        else:
            reply = f"Je suis l'assistant virtuel ESPRIT pour les PFE. Je n'ai pas trouvé de réponse spécifique à votre question : '{original_message}'. Pouvez-vous reformuler ou poser une question sur les dates, livrables, règles ou rôles des encadrants ?"

    return jsonify({'reply': reply})

if __name__ == '__main__':
    app.run(port=5005)