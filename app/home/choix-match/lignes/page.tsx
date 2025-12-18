import { Suspense } from "react";
import LignesClient from "./LignesClient";

export default function Page() {
    return (
        <Suspense fallback={<p>Chargement…</p>}>
            <LignesClient />
        </Suspense>
    );
}
