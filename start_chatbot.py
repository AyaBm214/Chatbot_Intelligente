#!/usr/bin/env python3
"""
Script de démarrage pour le chatbot Flask ESPRIT
Ce script démarre le serveur Flask du chatbot sur le port 5005
"""

import os
import sys
import subprocess
from pathlib import Path

# Ajouter le répertoire rasaflask au path
current_dir = Path(__file__).parent
rasaflask_dir = current_dir / "rasaflask"
venv_dir = current_dir / "venv"

def start_with_venv():
    """Démarre le serveur avec l'environnement virtuel"""
    venv_python = venv_dir / "bin" / "python"
    app_path = rasaflask_dir / "app.py"
    
    print("🤖 Démarrage du chatbot ESPRIT avec environnement virtuel...")
    print("📍 URL: http://localhost:5005")
    print("🔗 API Endpoint: http://localhost:5005/chat")
    print("⚡ Serveur prêt pour les requêtes du frontend React")
    print("✅ CORS activé pour http://localhost:3000")
    print("-" * 50)
    
    # Démarrer avec l'environnement virtuel
    subprocess.run([str(venv_python), str(app_path)])

if __name__ == "__main__":
    if venv_dir.exists():
        start_with_venv()
    else:
        # Fallback sans venv
        sys.path.insert(0, str(rasaflask_dir))
        try:
            from app import app
            app.run(
                host="0.0.0.0",
                port=5005,
                debug=True,
                use_reloader=False
            )
        except ImportError as e:
            print(f"❌ Erreur d'importation: {e}")
            print("Vérifiez que le fichier rasaflask/app.py existe")
            sys.exit(1)
        except Exception as e:
            print(f"❌ Erreur lors du démarrage: {e}")
            sys.exit(1)
