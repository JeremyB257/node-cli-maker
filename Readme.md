# Prisma CRUD Generator

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
git clone https://github.com/votre-username/prisma-crud-generator.git
cd prisma-crud-generator

# Installer les dépendances
npm install

# Construire le projet
npm run build

# Créer un lien symbolique pour utiliser l'outil globalement
npm link
```

## 📦 Dépendances

- Node.js (>= 14.x)
- TypeScript
- Prisma
- Express
- fs-extra
- commander
- chalk

## 🛠️ Utilisation

### Générer un CRUD complet

```bash
prisma-crud make:crud <entity>
```

Exemple :
```bash
prisma-crud make:crud user
```

Cette commande va :
1. Ajouter un modèle `User` au schéma Prisma
2. Exécuter une migration Prisma
3. Générer un contrôleur CRUD
4. Créer un fichier de routes Express
5. Mettre à jour le fichier index.ts principal (si disponible)

### Options

| Option | Description |
|--------|-------------|
| `-t, --no-timestamps` | Générer sans les champs createdAt et updatedAt |
| `-f, --fields <fields>` | Champs additionnels au format 'nom:type,description:String' |

Exemple avec options :
```bash
prisma-crud make:crud product --fields "price:Float,description:String,inStock:Boolean" --no-timestamps
```

### Générer uniquement un contrôleur

```bash
prisma-crud make:controller <entity>
```

### Générer uniquement des routes

```bash
prisma-crud make:routes <entity>
```

## 🌟 Exemples

### Générer un modèle avec des champs personnalisés

```bash
prisma-crud make:crud post --fields "title:String,content:String,published:Boolean"
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

## 🔧 Personnalisation

### Configuration TypeScript

Le projet utilise le fichier `tsconfig.json` suivant :

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "./",
    "declaration": true
  },
  "include": ["src/**/*", "cli.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## 💡 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

## 📚 Ressources additionnelles

- [Documentation Prisma](https://www.prisma.io/docs/)
- [Documentation Express](https://expressjs.com/fr/)
- [TypeScript](https://www.typescriptlang.org/docs/)
