import fs from "fs-extra";
import path from "path";

export function makeCrud(entity) {
  const entityCapitalized = entity.charAt(0).toUpperCase() + entity.slice(1);
  const entityLower = entity.toLowerCase();

  console.log(`🚀 Génération du CRUD pour ${entityCapitalized} avec Prisma...`);

  const projectRoot = process.cwd(); // Prend le chemin du projet actuel

  // 1️⃣ Modifier le fichier schema.prisma
  const schemaPath = path.join(projectRoot, "prisma/schema.prisma");
  const prismaModel = `
model ${entityCapitalized} {
  id        Int     @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
}
`;

  if (!fs.existsSync(schemaPath)) {
    console.error("❌ Erreur : schema.prisma introuvable !");
    process.exit(1);
  }

  fs.appendFileSync(schemaPath, prismaModel);
  console.log(`✅ Modèle Prisma ajouté à schema.prisma`);

  // 3️⃣ Générer le contrôleur
  const controllerPath = path.join(projectRoot, `src/controllers/${entityCapitalized}.Controller.js`);
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

  // 4️⃣ Générer les routes
  const routePath = path.join(projectRoot, `src/routes/${entityLower}.routes.js`);
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

  console.log(`🎉 CRUD complet pour "${entityCapitalized}" créé avec Prisma !`);
}
