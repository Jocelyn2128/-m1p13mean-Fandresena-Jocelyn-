use mallConnectDB;

-- // --- 1. Collection USERS (Acheteurs, Gérants, Admin) ---
db.createCollection("users", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["email", "password", "role", "firstName", "lastName", "phone", "createdAt", "updatedAt"],
         properties: {
            email: { bsonType: "string" },
            password: { bsonType: "string" },
            role: { enum: ["ADMIN_MALL", "BOUTIQUE", "ACHETEUR"] },
            firstName: { bsonType: "string" },
            lastName: { bsonType: "string" },
            phone: { bsonType: "string" }, // Important pour la recherche client en caisse
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
         }
      }
   }
});

-- // --- 2. Collection STORES (Boutiques) ---
db.createCollection("stores", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["ownerId", "name", "description", "logo", "coverImage", "category", "location", "openingHours", "status", "acceptedPaymentMethods", "createdAt", "updatedAt"],
         properties: {
            ownerId: { bsonType: "objectId" },
            name: { bsonType: "string" },
            description: { bsonType: "string" },
            logo: { bsonType: "string" },
            coverImage: { bsonType: "string" },
            category: { bsonType: "string" },
            location: {
               bsonType: "object",
               required: ["floor", "shopNumber"],
               properties: {
                  floor: { bsonType: "string" },
                  shopNumber: { bsonType: "string" }
               }
            },
            acceptedPaymentMethods: { 
               bsonType: "array", 
               items: { bsonType: "string" } // ex: ["Espèces", "MVola", "Carte Bancaire"]
            },
            openingHours: { bsonType: "string" },
            status: { bsonType: "string" }, 
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
         }
      }
   }
});

-- // --- 3. Collection PRODUCTS (Avec Gestion de Stock) ---
db.createCollection("products", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["storeId", "name", "description", "price", "currency", "images", "category", "stockStatus", "stockQuantity", "promotion", "createdAt", "updatedAt"],
         properties: {
            storeId: { bsonType: "objectId" },
            name: { bsonType: "string" },
            description: { bsonType: "string" },
            price: { bsonType: "double" },
            currency: { bsonType: "string" },
            images: { bsonType: "array", items: { bsonType: "string" } },
            category: { bsonType: "string" },
            stockStatus: { bsonType: "string" }, // 'disponible', 'rupture', 'precommande'
            stockQuantity: { bsonType: "int" },  // Quantité précise pour la gestion de stock
            promotion: {
               bsonType: "object",
               required: ["isOnSale"],
               properties: {
                  isOnSale: { bsonType: "bool" },
                  discountPrice: { bsonType: "double" },
                  endDate: { bsonType: "date" }
               }
            },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
         }
      }
   }
});

-- // --- 4. Collection CASH_REGISTERS (Gestion des Caisses Multiples) ---
db.createCollection("cashRegisters", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["storeId", "registerName", "status", "currentBalance", "createdAt", "updatedAt"],
         properties: {
            storeId: { bsonType: "objectId" },
            registerName: { bsonType: "string" }, // ex: "Caisse 01", "Caisse Mobile"
            status: { enum: ["ouvert", "ferme"] },
            currentBalance: { bsonType: "double" }, // Somme totale actuelle dans la caisse
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
         }
      }
   }
});

-- // --- 5. Collection ORDERS (Ventes, Réservations, Commandes, Tickets) ---
db.createCollection("orders", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["storeId", "items", "totalAmount", "orderType", "status", "paymentMethod", "receiptNumber", "createdAt", "updatedAt"],
         properties: {
            storeId: { bsonType: "objectId" },
            buyerId: { bsonType: "objectId" }, // Peut être null si vente comptoir sans client enregistré
            cashRegisterId: { bsonType: "objectId" }, // Liaison avec la caisse utilisée
            items: {
               bsonType: "array",
               minItems: 1,
               items: {
                  bsonType: "object",
                  required: ["productId", "name", "quantity", "unitPrice", "subTotal"],
                  properties: {
                     productId: { bsonType: "objectId" },
                     name: { bsonType: "string" }, // Copie du nom pour le ticket historique
                     quantity: { bsonType: "int" },
                     unitPrice: { bsonType: "double" },
                     subTotal: { bsonType: "double" }
                  }
               }
            },
            totalAmount: { bsonType: "double" },
            orderType: { enum: ["VENTE_DIRECTE", "RESERVATION", "COMMANDE_LIGNE"] },
            status: { enum: ["en_attente", "paye", "annule", "pret_pour_retrait"] },
            paymentMethod: { bsonType: "string" }, // Choisi parmi acceptedPaymentMethods de la boutique
            receiptNumber: { bsonType: "string" }, // ID unique pour ticket numérique (ex: "REC-2023-001")
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
         }
      }
   }
});

-- // --- 6. Collections EVENTS & FAVORITES (Inchangées) ---
db.createCollection("events", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["title", "content", "bannerImage", "startDate", "endDate", "createdAt", "updatedAt"],
         properties: {
            title: { bsonType: "string" },
            content: { bsonType: "string" },
            bannerImage: { bsonType: "string" },
            startDate: { bsonType: "date" },
            endDate: { bsonType: "date" },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" }
         }
      }
   }
});

db.createCollection("favorites", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["userId", "targetId", "type", "createdAt"],
         properties: {
            userId: { bsonType: "objectId" },
            targetId: { bsonType: "objectId" },
            type: { enum: ["PRODUCT", "STORE"] },
            createdAt: { bsonType: "date" }
         }
      }
   }
});

-- // --- INDEXATION ET RECHERCHE ---

-- // Unicité et performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "phone": 1 }); // Pour que la boutique retrouve un client rapidement par son tel
db.orders.createIndex({ "receiptNumber": 1 }, { unique: true });
db.stores.createIndex({ "ownerId": 1 });
db.cashRegisters.createIndex({ "storeId": 1 });

-- // Recherche textuelle pour l'application client et le catalogue boutique
db.products.createIndex({ "name": "text", "description": "text", "category": "text" });
db.stores.createIndex({ "name": "text", "category": "text" });

-- // Filtres et Tris
db.products.createIndex({ "createdAt": -1 });
db.orders.createIndex({ "createdAt": -1 });

continuer et voici une petit modification:
- en separe user boutique et boutique car un user boutique peuve avoir plusieur boutique:
   - on donne pas les information de la boutique lors de son inscription mais plutot apres la creation de son compte et on lie les boutiques a son compte via ownerId
   - apres son inscription, le user boutique peut créer une ou plusieurs boutiques et les lier à son compte via ownerId dans la collection stores. Ainsi, un user boutique peut gérer plusieurs boutiques sans que les informations de ces boutiques soient directement liées à son compte utilisateur.
   - donc si une utilisateur boutique creer une boutique l'admin doit valider la creation de la boutique
- rectifie l'interface user boutique car il y a 2 sidebar
- ajouter une interface pour gerer son boutique et les produits de sa boutique
- ajouter une interface pour gerer les caisses de sa boutique