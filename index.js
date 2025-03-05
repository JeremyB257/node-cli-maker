#!/usr/bin/env node

import {Command} from "commander";
import {makeCrud} from "./src/makeCrud.js";
import chalk from "chalk";

const program = new Command();

program
  .version("1.0.0")
  .description("CLI pour générer du CRUD avec Prisma et Express")
  .command("make:crud <entity>")
  .description("Génère un CRUD complet pour une entité")
  .action(entity => {
    console.log(chalk.blue(`📦 Génération du CRUD pour ${entity}...`));
    makeCrud(entity);
    console.log(chalk.green(`✅ CRUD généré avec succès !`));
  });

program.parse(process.argv);
