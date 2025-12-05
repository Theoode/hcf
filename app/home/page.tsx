import Card from "../../components/SectionCard";

export default function HomePage() {
    return (
        <main className="mt-14 p-4 flex flex-col items-center justify-center gap-6">
            <Card
                title="Equipes"
                image="https://plus.unsplash.com/premium_photo-1664303592174-21bf4edd29d2?q=80&w=980&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                redirect={"/home/equipes"} />
            <Card
                title="Calendrier / Résultats"
                image="https://images.unsplash.com/photo-1486128105845-91daff43f404?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                redirect={"/home/calendrier"}/>
            <Card
                title="Création lignes"
                image="https://images.unsplash.com/photo-1586348278474-312d4266bbc3?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                redirect={"/home/lignes"} />
        </main>
    );
}
