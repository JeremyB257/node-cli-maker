Node Maker - CLI pour Génération de CRUD avec Prisma & Express

Node Maker est un outil en ligne de commande permettant de générer automatiquement un CRUD complet avec Prisma et Express.js.

✨ Fonctionnalités

Génère un modèle Prisma dans schema.prisma.

Applique automatiquement une migration Prisma.

Crée un contrôleur CRUD avec Prisma.

Génère un fichier de routes Express.js.

Compatible avec tout projet Node.js utilisant Prisma.

🛠 Installation

Clonez ce repository puis installez le package globalement :

npm install -g .

Cela ajoutera la commande node-maker utilisable dans tous vos projets.

🎉 Utilisation

Dans un projet Node.js avec Prisma, exécutez la commande suivante pour générer un CRUD pour une entité :

node-maker make:crud User

Cela créera automatiquement :

Un modèle Prisma User dans prisma/schema.prisma

Un contrôleur UserController.js dans src/controllers/

Un fichier de routes user.js dans src/routes/
