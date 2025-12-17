import { prisma } from './lib/prisma'
import bcrypt from 'bcrypt';
import 'dotenv/config';


async function main() {

    const categorie = await prisma.categorie.create({
        data: { nom: 'Équipe Test' },
    });


    const utilisateursData = Array.from({ length: 10 }, (_, i) => ({
        prenom: `User${i + 1}`,
        nom: `Nom${i + 1}`,
        numero: `${i + 1}`,
        mail: `user${i + 1}@test.com`,
    }));

    for (const userData of utilisateursData) {
        const hashedPassword = await bcrypt.hash('mdp', 10);
        await prisma.utilisateur.create({
            data: { ...userData, mdp_hash: hashedPassword, id_categorie: categorie.id_categorie },
        });
    }


    for (let i = 0; i < 3; i++) {
        await prisma.match.create({
            data: {
                date_match: new Date(Date.now() + i * 86400000), // match chaque jour
                lieu: `Stade ${i + 1}`,
                score_domicile: Math.floor(Math.random() * 5),
                score_exterieur: Math.floor(Math.random() * 5),
                id_categorie: categorie.id_categorie,
            },
        });
    }

    console.log('Seed terminé : catégorie, 10 utilisateurs et 3 matchs créés !');
}

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
