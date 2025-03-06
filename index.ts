#!/usr/bin/env node

import {Command} from "commander";
import {makeCrud} from "./src/makeCrud.js";
import chalk from "chalk";

interface CrudCommandOptions {
  timestamps?: boolean;
  fields?: string;
}

const program = new Command();

program.version("1.0.0").description("CLI pour générer du CRUD avec Prisma et Express");

program
  .command("make:crud <entity>")
  .description("Génère un CRUD complet pour une entité")
  .option("-t, --no-timestamps", "Generer sans les champs createdAt et updatedAt")
  .option("-f, --fields <fields>", "Champs additionnels au format 'nom:type,decription:String'")
  .action((entity: string, options: CrudCommandOptions) => {
    const additionnalFiels: Record<string, string> = {};
    if (options.fields) {
      options.fields.split(",").forEach(field => {
        const [name, type] = field.split(":");
        if (name && type) {
          additionnalFiels[name.trim()] = type.trim();
        }
      });
    }
    console.log(chalk.blue(`📦 Génération du CRUD pour ${entity}...`));
    makeCrud(entity, {
      withTimestamps: options.timestamps,
      additionnalFiels,
    });
    console.log(chalk.green(`✅ CRUD généré avec succès !`));
  });

program.parse(process.argv);
