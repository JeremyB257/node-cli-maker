import fs from "fs-extra";
import path from "path";
import {execSync} from "child_process";

interface CrudOptions {
  withTimestamps?: boolean;
  additionnalFiels?: Record<string, string>;
}

export function makeCrud(entity: string, options: CrudOptions = {}) {
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
    let PrismaModelField = ["id        Int     @id @default(autoincrement())", "name      String"];
    if (options.additionnalFiels) {
      for (const [fieldName, fieldType] of Object.entries(options.additionnalFiels)) {
        PrismaModelField.push(`${fieldName} ${fieldType}`);
      }
    }
    if (options.withTimestamps) {
      PrismaModelField.push(`createdAt DateTime @default(now())`);
      PrismaModelField.push(`updatedAt DateTime @updatedAt`);
    }
    const prismaModel = `
      model ${entityCapitalized} {
       ${PrismaModelField.join("\n  ")}
      }
    `;

    fs.appendFileSync(schemaPath, prismaModel);
    console.log(`✅ Modèle Prisma ajouté à schema.prisma`);
  }

  // 2️⃣ Exécuter la migration
  try {
    execSync(`npx prisma migrate dev --name add_${entityLower}_table`);
    console.log(`✅ Migration Prisma appliquée`);
  } catch (err) {
    console.error(
      "❌ Erreur lors de la migration !, N'oubliez pas de migrer la modification 'npx prisma migrate dev --name ${entityCapitalized}-update'"
    );
  }

  // 3️⃣ Générer le contrôleur
  const controllerPath = path.join(projectRoot, `src/controllers/${entityCapitalized}.Controller.js`);
  if (fs.existsSync(controllerPath)) {
    console.log(`⚠️ Le contrôleur ${controllerPath} existe déjà, aucune modification effectuée.`);
  } else {
    const controllerContent = `import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Recupère tous les ${entityLower}
 */
export const getAll = async (req, res) => {
  try {
    const ${entityLower}s = await prisma.${entityLower}.findMany();
    res.status(200).json(${entityLower}s);
  } catch (err) {
    res.status(500).json({error: "Erreur lors de la récuperation des ${entityLower}"});
  }
};

/**
 * Recupère un ${entityLower} par son ID
 */
export const getOne = async (req, res) => {
  try {
    const ${entityLower} = await prisma.${entityLower}.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!${entityLower}) return res.status(404).json({ error: "${entityCapitalized} non trouvé" });
    res.status(200).json(${entityLower});
  } catch (err) {
    res.status(500).json({error: "Erreur lors de la récuperation de ${entityLower}"});
  }
};

/**
 * Crée un nouveau ${entityLower}
 */
export const create = async (req, res) => {
  try {
    const new${entityCapitalized} = await prisma.${entityLower}.create({ data: req.body });
    res.status(201).json(new${entityCapitalized});
   } catch (err) {
    res.status(500).json({error: "Erreur lors de la creation d'un ${entityLower}"});
  }
};

export const update = async (req, res) => {
  try {
    const updated${entityCapitalized} = await prisma.${entityLower}.update({ where: { id: parseInt(req.params.id) }, data: req.body });
    res.status(200).json(updated${entityCapitalized});
   } catch (err) {
    res.status(500).json({error: "Erreur lors de la modification d'un ${entityLower}"});
  }
};

export const remove = async (req, res) => {
  try {
  await prisma.${entityLower}.delete({ where: { id: parseInt(req.params.id) } });
  res.status(204).send();
   } catch (err) {
    res.status(500).json({error: "Erreur lors de la supression d'un ${entityLower}"});
  }
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
  console.log(`🎉 CRUD complet pour "${entityCapitalized}" créé avec Prisma !`);
}
