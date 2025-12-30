import type { Joueur } from "@/app/types/joueurs";

interface Props {
    joueurs: Joueur[];
    onSelect: (joueur: Joueur) => void;
    onClose: () => void;
}

export default function Modal({ joueurs, onSelect, onClose }: Props) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 lg:-rotate-90">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Choisir un joueur</h2>

                <div className="grid grid-cols-2 gap-4">
                    {joueurs.map((j) => (
                        <button
                            key={j.id_utilisateur}
                            onClick={() => onSelect(j)}
                            className="border rounded-lg p-3 hover:bg-gray-100 transition text-left"
                        >
                            <div className="font-semibold">
                                #{j.numero} {j.prenom}
                            </div>
                            <div className="text-sm text-gray-600">
                                {j.nom}
                            </div>
                        </button>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full py-2 bg-black text-white rounded-lg"
                >
                    Fermer
                </button>
            </div>
        </div>
    );
}
