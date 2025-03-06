# NodeJs CRUD Generator

Un générateur de CRUD rapide et flexible pour les projets Node.js utilisant Prisma et Express.

## 📋 Fonctionnalités

- Génération automatique complète de CRUD (Create, Read, Update, Delete)
- Création de modèles Prisma avec migration automatique
- Génération de contrôleurs Express avec gestion d'erreurs
- Création automatique de routes RESTful
- Documentation Swagger intégrée
- Prise en charge de TypeScript
- Options de personnalisation (timestamps, champs additionnels, etc.)

## 🚀 Installation

```bash
# Cloner le dépôt
git clone https://github.com/JeremyB257/node-cli-maker.git
cd node-cli-maker

# Installer les dépendances
npm install

# Construire le projet
npm run build

# Créer un lien symbolique pour utiliser l'outil globalement
npm link
```
## 🛠️ Utilisation

### Générer un CRUD complet

```bash
node-maker make:crud <entity>
```

Exemple :
```bash
node-maker make:crud user
```

Cette commande va :
1. Ajouter un modèle `User` au schéma Prisma
2. Exécuter une migration Prisma
3. Générer un contrôleur CRUD
4. Créer un fichier de routes Express

### Options

| Option | Description |
|--------|-------------|
| `-t, --no-timestamps` | Générer sans les champs createdAt et updatedAt |
| `-f, --fields <fields>` | Champs additionnels au format 'nom:type,description:String' |

Exemple avec options :
```bash
node-maker make:crud product --fields "price:Float,description:String,inStock:Boolean" --no-timestamps
```

## 🌟 Exemples

### Générer un modèle avec des champs personnalisés

```bash
node-maker make:crud post --fields "title:String,content:String,published:Boolean"
```

Cela générera un modèle Prisma :

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  name      String
  title     String
  content   String
  published Boolean
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Structure de fichiers générée

Pour une entité `User` :

```
├── prisma/
│   └── schema.prisma  // Mise à jour avec le modèle User
│
├── src/
│   ├── controllers/
│   │   └── UserController.ts
│   │
│   └── routes/
│       └── user.routes.ts
```

## 📝 Endpoints API générés

Pour une entité `User`, les routes suivantes sont générées :

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/users` | Récupérer tous les utilisateurs |
| GET | `/users/:id` | Récupérer un utilisateur par ID |
| POST | `/users` | Créer un nouvel utilisateur |
| PUT | `/users/:id` | Mettre à jour un utilisateur existant |
| DELETE | `/users/:id` | Supprimer un utilisateur |


## 💡 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.
