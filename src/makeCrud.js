import fs from "fs-extra";
import path from "path";
import {execSync} from "child_process";

export function makeCrud(entity) {
  const entityCapitalized = entity.charAt(0).toUpperCase() + entity.slice(1);
  const entityLower = entity.toLowerCase();

  console.log(`🚀 Génération du CRUD pour ${entityCapitalized} avec Prisma...`);

  const projectRoot = process.cwd(); // Prend le chemin du projet actuel

  // 1️⃣ Modifier le fichier schema.prisma
  const schemaPath = path.join(projectRoot, "prisma/schema.prisma");
  if (!fs.existsSync(schemaPath)) {
    console.error("❌ Erreur : schema.prisma introuvable !");
    process.exit(1);
  }

  const schemaContent = fs.readFileSync(schemaPath, "utf-8");
  if (schemaContent.includes(`model ${entityCapitalized} {`)) {
    console.log(`⚠️ Le modèle ${entityCapitalized} existe déjà dans schema.prisma, aucune modification effectuée.`);
  } else {
    const prismaModel = `
      model ${entityCapitalized} {
        id        Int     @id @default(autoincrement())
        name      String
        createdAt DateTime @default(now())
      }
    `;
    
    fs.appendFileSync(schemaPath, prismaModel);
    console.log(`✅ Modèle Prisma ajouté à schema.prisma`);
  }

  // 2️⃣ Exécuter la migration
  try {
    execSync(`npx prisma migrate dev --name add_${entityLower}_table`);
    console.log(`✅ Migration Prisma appliquée`);
  } catch(err) {
    console.error("❌ Erreur lors de la migration !, N'oubliez pas de migrer la modification "npx prisma migrate dev --name ${entityCapitalized}-update"");
  }

  // 3️⃣ Générer le contrôleur
  const controllerPath = path.join(projectRoot, `src/controllers/${entityCapitalized}.Controller.js`);
  if (fs.existsSync(controllerPath)) {
    console.log(`⚠️ Le contrôleur ${controllerPath} existe déjà, aucune modification effectuée.`);
  } else {

  
  const controllerContent = `import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAll = async (req, res) => {
  const ${entityLower}s = await prisma.${entityLower}.findMany();
  res.json(${entityLower}s);
};

export const getOne = async (req, res) => {
  const ${entityLower} = await prisma.${entityLower}.findUnique({ where: { id: parseInt(req.params.id) } });
  if (!${entityLower}) return res.status(404).json({ error: "${entityCapitalized} non trouvé" });
  res.json(${entityLower});
};

export const create = async (req, res) => {
  const new${entityCapitalized} = await prisma.${entityLower}.create({ data: req.body });
  res.status(201).json(new${entityCapitalized});
};

export const update = async (req, res) => {
  const updated${entityCapitalized} = await prisma.${entityLower}.update({ where: { id: parseInt(req.params.id) }, data: req.body });
  res.json(updated${entityCapitalized});
};

export const remove = async (req, res) => {
  await prisma.${entityLower}.delete({ where: { id: parseInt(req.params.id) } });
  res.status(204).send();
};
`;

  fs.outputFileSync(controllerPath, controllerContent);
  console.log(`✅ Contrôleur généré : ${controllerPath}`);
}
  // 4️⃣ Générer les routes
  const routePath = path.join(projectRoot, `src/routes/${entityLower}.routes.js`);
  if (fs.existsSync(routePath)) {
    console.log(`⚠️ Le fichier de route ${routePath} existe déjà, aucune modification effectuée.`);
  } else {
    
  const routeContent = `import {Router} from "express";
const router = Router();
import { getAll, getOne, create, update, remove } from "../controllers/${entityCapitalized}.Controller.js";

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
`;

  fs.outputFileSync(routePath, routeContent);
  console.log(`✅ Routes générées : ${routePath}`);
}
  console.log(
    `🎉 CRUD complet pour "${entityCapitalized}" créé avec Prisma !`
  );
}
