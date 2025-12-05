-- CreateTable
CREATE TABLE "Equipe" (
    "id_equipe" SERIAL NOT NULL,
    "nom_equipe" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipe_pkey" PRIMARY KEY ("id_equipe")
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
    "id_equipe" INTEGER,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id_utilisateur")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_mail_key" ON "Utilisateur"("mail");

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_id_equipe_fkey" FOREIGN KEY ("id_equipe") REFERENCES "Equipe"("id_equipe") ON DELETE SET NULL ON UPDATE CASCADE;
