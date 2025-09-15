#!/usr/bin/env python3
"""
Script d'initialisation des données pour le ChatBot ESPRIT
Ce script peuple la base de données avec les données initiales nécessaires.
"""

import sqlite3
import json
from datetime import datetime, date
import os

class DataInitializer:
    """Classe pour initialiser les données du chatbot"""
    
    def __init__(self, db_path="chatbot_data.db"):
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
        self.create_tables()
    
    def create_tables(self):
        """Crée les tables nécessaires"""
        cursor = self.conn.cursor()
        
        # Table FAQ
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS faq (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                category TEXT,
                keywords TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Table des échéances
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS deadlines (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                deadline_date DATE NOT NULL,
                stage_type TEXT,
                student_level TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Table des encadrants
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS supervisors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                office TEXT,
                specialties TEXT,
                max_students INTEGER DEFAULT 10,
                current_students INTEGER DEFAULT 0,
                is_available BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Table des documents/templates
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS document_templates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                file_path TEXT,
                document_type TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Table des contacts
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                department TEXT NOT NULL,
                contact_person TEXT,
                email TEXT,
                phone TEXT,
                office TEXT,
                description TEXT,
                is_active BOOLEAN DEFAULT 1
            )
        ''')
        
        self.conn.commit()
    
    def populate_faq(self):
        """Remplit la table FAQ avec des données initiales"""
        cursor = self.conn.cursor()
        
        faq_data = [
            {
                "question": "Comment faire une demande de convention de stage ?",
                "answer": "1. Connectez-vous sur la plateforme ESPRIT\n2. Accédez à 'Mes Stages'\n3. Cliquez sur 'Nouvelle Convention'\n4. Remplissez le formulaire avec les informations de l'entreprise\n5. Joignez votre CV et lettre de motivation\n6. Soumettez votre demande",
                "category": "convention",
                "keywords": "convention,demande,stage,formulaire"
            },
            {
                "question": "Quels documents dois-je fournir pour ma convention ?",
                "answer": "Documents requis :\n• CV à jour\n• Lettre de motivation\n• Copie de la carte d'identité\n• Relevé de notes du dernier semestre\n• Attestation d'inscription\n• Formulaire de convention rempli",
                "category": "documents",
                "keywords": "documents,convention,cv,attestation"
            },
            {
                "question": "Combien de temps pour avoir ma convention signée ?",
                "answer": "Délai de traitement :\n• Administration ESPRIT : 3-5 jours ouvrables\n• Signature entreprise : Variable selon l'entreprise\n• Retour final : 7-14 jours en moyenne\n\nPensez à relancer si pas de nouvelles après 10 jours.",
                "category": "delais",
                "keywords": "délai,temps,convention,signature"
            },
            {
                "question": "Puis-je faire mon stage à l'étranger ?",
                "answer": "Oui, les stages à l'étranger sont autorisés avec :\n• Convention adaptée pour l'international\n• Assurance internationale\n• Accord préalable du coordinateur\n• Respect des mêmes exigences académiques\n• Encadrement à distance possible",
                "category": "international",
                "keywords": "étranger,international,assurance"
            },
            {
                "question": "Comment contacter mon encadrant ?",
                "answer": "Moyens de contact avec votre encadrant :\n• Email institutionnel (préféré)\n• Rendez-vous durant les heures de bureau\n• Plateforme de suivi des stages\n• Téléphone en cas d'urgence\n\nRespectez les horaires de bureau et privilégiez l'email.",
                "category": "encadrement",
                "keywords": "encadrant,contact,email,rendez-vous"
            },
            {
                "question": "Que faire si je trouve un stage après la date limite ?",
                "answer": "Si vous trouvez un stage après la date limite :\n• Contactez immédiatement le service stages\n• Expliquez votre situation\n• Une dérogation peut être accordée selon les cas\n• Procédure accélérée possible\n• Pénalité éventuelle sur la note finale",
                "category": "retard",
                "keywords": "retard,date limite,dérogation"
            }
        ]
        
        for faq in faq_data:
            cursor.execute('''
                INSERT OR REPLACE INTO faq (question, answer, category, keywords)
                VALUES (?, ?, ?, ?)
            ''', (faq['question'], faq['answer'], faq['category'], faq['keywords']))
        
        self.conn.commit()
        print("✅ FAQ data populated successfully")
    
    def populate_deadlines(self):
        """Remplit la table des échéances"""
        cursor = self.conn.cursor()
        
        deadlines_data = [
            {
                "title": "Dépôt des demandes de convention",
                "description": "Date limite pour soumettre votre demande de convention de stage",
                "deadline_date": "2025-02-15",
                "stage_type": "stage_technique",
                "student_level": "licence"
            },
            {
                "title": "Validation des plans de travail",
                "description": "Validation obligatoire du plan de travail par l'encadrant",
                "deadline_date": "2025-03-01",
                "stage_type": "pfe",
                "student_level": "master"
            },
            {
                "title": "Dépôt rapport intermédiaire",
                "description": "Soumission du rapport d'avancement (mi-parcours)",
                "deadline_date": "2025-04-15",
                "stage_type": "stage_technique",
                "student_level": "licence"
            },
            {
                "title": "Dépôt rapport final PFE",
                "description": "Dépôt du rapport final de PFE (1 semaine avant soutenance)",
                "deadline_date": "2025-05-15",
                "stage_type": "pfe",
                "student_level": "master"
            },
            {
                "title": "Période des soutenances",
                "description": "Période officielle des soutenances de stages et PFE",
                "deadline_date": "2025-06-01",
                "stage_type": "tous",
                "student_level": "tous"
            }
        ]
        
        for deadline in deadlines_data:
            cursor.execute('''
                INSERT OR REPLACE INTO deadlines 
                (title, description, deadline_date, stage_type, student_level)
                VALUES (?, ?, ?, ?, ?)
            ''', (deadline['title'], deadline['description'], 
                  deadline['deadline_date'], deadline['stage_type'], 
                  deadline['student_level']))
        
        self.conn.commit()
        print("✅ Deadlines data populated successfully")
    
    def populate_supervisors(self):
        """Remplit la table des encadrants"""
        cursor = self.conn.cursor()
        
        supervisors_data = [
            {
                "name": "Dr. Ahmed Ben Ali",
                "email": "ahmed.benali@esprit.tn",
                "office": "Bureau A205",
                "specialties": "Développement Web, Intelligence Artificielle, JavaScript, Python",
                "max_students": 8,
                "current_students": 3
            },
            {
                "name": "Pr. Fatma Gharbi",
                "email": "fatma.gharbi@esprit.tn",
                "office": "Bureau B102", 
                "specialties": "Réseaux, Cybersécurité, Administration Système, Cloud",
                "max_students": 10,
                "current_students": 5
            },
            {
                "name": "Dr. Mohamed Triki",
                "email": "mohamed.triki@esprit.tn",
                "office": "Bureau C301",
                "specialties": "Data Science, Machine Learning, Big Data, Analytics",
                "max_students": 6,
                "current_students": 2
            },
            {
                "name": "Dr. Sarah Mansouri", 
                "email": "sarah.mansouri@esprit.tn",
                "office": "Bureau A108",
                "specialties": "Développement Mobile, Android, iOS, React Native",
                "max_students": 8,
                "current_students": 4
            },
            {
                "name": "Pr. Karim Hadj Taieb",
                "email": "karim.hadjtaieb@esprit.tn",
                "office": "Bureau B205",
                "specialties": "Génie Logiciel, Architecture, DevOps, Qualité",
                "max_students": 10,
                "current_students": 6
            }
        ]
        
        for supervisor in supervisors_data:
            cursor.execute('''
                INSERT OR REPLACE INTO supervisors 
                (name, email, office, specialties, max_students, current_students)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (supervisor['name'], supervisor['email'], supervisor['office'],
                  supervisor['specialties'], supervisor['max_students'], 
                  supervisor['current_students']))
        
        self.conn.commit()
        print("✅ Supervisors data populated successfully")
    
    def populate_contacts(self):
        """Remplit la table des contacts"""
        cursor = self.conn.cursor()
        
        contacts_data = [
            {
                "department": "Service Stages",
                "contact_person": "Mme. Leila Ben Salah",
                "email": "stages@esprit.tn",
                "phone": "+216 71 250 000",
                "office": "Bureau A102",
                "description": "Gestion des conventions et suivi des stages"
            },
            {
                "department": "Coordination PFE",
                "contact_person": "M. Amine Chakroun",
                "email": "pfe@esprit.tn", 
                "phone": "+216 71 250 001",
                "office": "Bureau B205",
                "description": "Coordination des projets de fin d'études"
            },
            {
                "department": "Support Technique",
                "contact_person": "Équipe IT",
                "email": "support-technique@esprit.tn",
                "phone": "+216 71 250 500",
                "office": "Bureau C001",
                "description": "Assistance technique pour les plateformes"
            },
            {
                "department": "Administration Générale",
                "contact_person": "Secrétariat",
                "email": "admin@esprit.tn",
                "phone": "+216 71 250 000",
                "office": "Hall d'accueil",
                "description": "Informations générales et orientation"
            }
        ]
        
        for contact in contacts_data:
            cursor.execute('''
                INSERT OR REPLACE INTO contacts 
                (department, contact_person, email, phone, office, description)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (contact['department'], contact['contact_person'], 
                  contact['email'], contact['phone'], 
                  contact['office'], contact['description']))
        
        self.conn.commit()
        print("✅ Contacts data populated successfully")
    
    def populate_document_templates(self):
        """Remplit la table des templates de documents"""
        cursor = self.conn.cursor()
        
        templates_data = [
            {
                "name": "Template Rapport de Stage",
                "description": "Modèle officiel pour la rédaction du rapport de stage",
                "file_path": "/templates/rapport_stage_template.docx",
                "document_type": "rapport_stage"
            },
            {
                "name": "Template Rapport PFE",
                "description": "Modèle officiel pour la rédaction du rapport PFE",
                "file_path": "/templates/rapport_pfe_template.docx", 
                "document_type": "rapport_pfe"
            },
            {
                "name": "Formulaire Convention",
                "description": "Formulaire de demande de convention de stage",
                "file_path": "/templates/convention_form.pdf",
                "document_type": "convention"
            },
            {
                "name": "Guide Plan de Travail",
                "description": "Guide pour élaborer le plan de travail du stage/PFE",
                "file_path": "/templates/plan_travail_guide.pdf",
                "document_type": "plan_travail"
            },
            {
                "name": "Template Présentation Soutenance",
                "description": "Modèle PowerPoint pour la présentation de soutenance",
                "file_path": "/templates/soutenance_template.pptx",
                "document_type": "presentation"
            }
        ]
        
        for template in templates_data:
            cursor.execute('''
                INSERT OR REPLACE INTO document_templates 
                (name, description, file_path, document_type)
                VALUES (?, ?, ?, ?)
            ''', (template['name'], template['description'],
                  template['file_path'], template['document_type']))
        
        self.conn.commit()
        print("✅ Document templates data populated successfully")
    
    def run_initialization(self):
        """Lance l'initialisation complète des données"""
        print("🚀 Initialisation des données du ChatBot ESPRIT...")
        print("-" * 50)
        
        try:
            self.populate_faq()
            self.populate_deadlines()
            self.populate_supervisors()  
            self.populate_contacts()
            self.populate_document_templates()
            
            print("-" * 50)
            print("✅ Initialisation terminée avec succès !")
            print(f"📊 Base de données créée : {self.db_path}")
            
        except Exception as e:
            print(f"❌ Erreur lors de l'initialisation : {e}")
        finally:
            self.conn.close()

if __name__ == "__main__":
    # Initialisation des données
    initializer = DataInitializer()
    initializer.run_initialization()
    
    print("\n🔧 Pour lancer le chatbot :")
    print("1. rasa train")
    print("2. rasa run actions (dans un terminal séparé)")
    print("3. rasa shell")
