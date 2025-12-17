-- CreateTable
CREATE TABLE "Categorie" (
    "id_categorie" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("id_categorie")
);

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id_utilisateur" SERIAL NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "mdp_hash" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_categorie" INTEGER NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id_utilisateur")
);

-- CreateTable
CREATE TABLE "Match" (
    "id_match" SERIAL NOT NULL,
    "date_match" TIMESTAMP(3) NOT NULL,
    "lieu" TEXT,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_categorie" INTEGER NOT NULL,
    "score_domicile" INTEGER NOT NULL,
    "score_exterieur" INTEGER NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id_match")
);

-- CreateTable
CREATE TABLE "Ligne" (
    "id_ligne" SERIAL NOT NULL,
    "nom" TEXT,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_match" INTEGER NOT NULL,
    "positions" JSONB NOT NULL,

    CONSTRAINT "Ligne_pkey" PRIMARY KEY ("id_ligne")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_mail_key" ON "Utilisateur"("mail");

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_id_categorie_fkey" FOREIGN KEY ("id_categorie") REFERENCES "Categorie"("id_categorie") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_id_categorie_fkey" FOREIGN KEY ("id_categorie") REFERENCES "Categorie"("id_categorie") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ligne" ADD CONSTRAINT "Ligne_id_match_fkey" FOREIGN KEY ("id_match") REFERENCES "Match"("id_match") ON DELETE RESTRICT ON UPDATE CASCADE;
