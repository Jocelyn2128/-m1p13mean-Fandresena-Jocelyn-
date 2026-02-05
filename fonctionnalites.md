Voici une liste complète et structurée des fonctionnalités à développer pour votre application **MallConnect**. J'ai organisé cela par profil, en ajoutant des **fonctionnalités logiques** pour rendre l'application professionnelle et prête à l'emploi.

---

### 1. Profil : ADMINISTRATEUR DU CENTRE (Super Admin)
*L'objectif est de gérer la vie du centre commercial.*

*   **Gestion des Enseignes :** Approuver, suspendre ou supprimer des boutiques.
*   **Gestion des Événements :** Créer des bannières promotionnelles globales (ex: "Soldes de Noël", "Fête des mères") qui s'affichent sur l'accueil des clients.
*   **Statistiques Globales :** Voir le nombre total de ventes réalisées dans le centre, les boutiques les plus visitées et les produits les plus populaires.
*   **Modération :** Pouvoir supprimer un produit non conforme aux règles du centre.
*   **Plan du Centre :** Gérer les étages et les numéros de locaux.

---

### 2. Profil : BOUTIQUE (Gérant & Vendeur)
*L'objectif est de gérer le commerce physique et numérique.*

#### **A. Gestion Commerciale & POS (Point de Vente)**
*   **Saisie de Vente Directe :** Interface de caisse rapide pour scanner/sélectionner des produits pour un client présent physiquement.
*   **Recherche Client :** Trouver un client par son numéro de téléphone pour lier l'achat à son compte (Fidélité).
*   **Gestion Multi-Caisse :** Ouvrir/Fermer une caisse spécifique, voir le solde actuel par caisse.
*   **Ticket de Caisse Numérique :** Génération automatique d'un reçu après vente (format PDF ou affichage écran avec QR Code).
*   **Modes de Paiement :** Configurer les modes acceptés (Espèces, MVola, Orange Money, Carte).

#### **B. Gestion des Stocks & Produits**
*   **Inventaire en temps réel :** Le stock diminue automatiquement à chaque vente.
*   **Alertes de Stock Bas (Logique) :** Notification visuelle quand un produit descend en dessous de 5 unités.
*   **Mise à jour automatique :** Si le stock tombe à 0, le statut du produit passe automatiquement en "Rupture de stock" sur l'application client.
*   **Gestion des Promos :** Appliquer des réductions temporaires avec une date de fin automatique.

#### **C. Suivi des Commandes**
*   **Gestion des Réservations :** Voir les produits réservés par les clients en ligne, les préparer et marquer comme "Prêt pour retrait".
*   **Historique des Ventes :** Consulter les ventes passées, filtrer par date, par caisse ou par vendeur.

---

### 3. Profil : ACHETEUR (Client Final)
*L'objectif est de préparer sa visite ou d'acheter en ligne.*

#### **A. Shopping & Recherche**
*   **Recherche Globale (Text Search) :** Chercher un produit ("Jean") ou une boutique ("Zara") sur tout le centre.
*   **Filtres Avancés :** Filtrer par catégorie, par étage, ou voir uniquement les produits en promotion.
*   **Favoris :** "Liker" des boutiques ou des produits pour les retrouver facilement.

#### **B. Réservation & Achat**
*   **Réservation en ligne :** Bloquer un article pour 24h et choisir son mode de paiement (payer au moment du retrait en boutique).
*   **Commande Directe :** Commander plusieurs articles de différentes boutiques et recevoir les notifications quand chaque colis est prêt.

#### **C. Espace Client (Logique)**
*   **Portefeuille de Tickets :** Retrouver tous ses tickets de caisse numériques (plus besoin de papier).
*   **Historique d'Achat :** Voir tout ce qu'il a acheté dans le centre commercial.
*   **Notifications Push :** Recevoir une alerte quand une boutique favorite publie une promotion.

---

### 4. Fonctionnalités "Logiques" (Bonus à forte valeur ajoutée)

1.  **Le "X de Caisse" (Rapport journalier) :**
    *   À la fermeture de la caisse, le système génère un rapport : "Total Espèces : 500.000 Ar, Total MVola : 200.000 Ar".

5.  **Système de Validation Admin :**
    *   Lorsqu'une boutique modifie son logo ou son nom, l'Admin doit valider pour éviter les abus.

---

### 5. Organisation du Développement (Structure du code)

**Backend (Express/JS) :**
*   `routes/auth.js` : Inscription, Connexion (JWT).
*   `routes/store.js` : Gestion des boutiques et des caisses.
*   `routes/product.js` : CRUD produits et gestion des stocks.
*   `routes/order.js` : Logique de vente, calcul des totaux et décrémentation des stocks.

**Frontend (Angular/TS) :**
*   `components/pos-system` : L'interface de caisse pour les boutiques.
*   `components/catalog` : La vue produit pour les acheteurs.
*   `components/admin-dashboard` : Le panneau de contrôle du mall.
*   `services/cart.service.ts` : Gestion du panier local avant validation.