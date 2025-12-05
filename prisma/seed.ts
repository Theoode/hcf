import { PrismaClient} from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {

    // 1) Créer l'équipe
    const equipe = await prisma.equipe.create({
        data: {
            nom_equipe: "Équipe Test",
        },
    });

    // 2) Hasher le mdp
    const hashedPassword = await bcrypt.hash("mdp", 10);

    // 3) Créer l'utilisateurs lié à l'équipe
    await prisma.utilisateur.create({
        data: {
            prenom: "Theo",
            nom: "Quennehen",
            numero: "18",
            mail: "test@test.com",
            mdp_hash: hashedPassword,

            // relation correcte :
            equipe: {
                connect: {
                    id_equipe: equipe.id_equipe,
                },
            },
        },
    });

    console.log("Seed terminé !");
}

main()
    .catch(err => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
