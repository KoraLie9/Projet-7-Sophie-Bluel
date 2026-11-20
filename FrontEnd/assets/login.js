
/* RÉCUPÉRER LE FORMULAIRE */

const formulaire = document.querySelector("#login form");
// Paragraphe qui affichera les erreurs.
const messageErreur = document.querySelector("#login-error");

/* DÉTECTER L'ENVOI DU FORMULAIRE */

formulaire.addEventListener("submit", (event) => {
    // Empêche le navigateur de recharger la page.
    event.preventDefault();
    // Efface le message d'erreur précédent.
    messageErreur.textContent = "";
    // Récupère l'email et le mot de passe saisis.
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;


    /* ENVOYER LES IDENTIFIANTS AU SERVEUR */

    fetch("http://localhost:5678/api/users/login", {

        // POST permet d'envoyer des données.
        method: "POST",

        // Indique que les données sont au format JSON.
        headers: {
            "Content-Type": "application/json"
        },

        // Prépare les identifiants pour l'envoi.
        body: JSON.stringify({
            email: email,
            password: password
        })

    })

    /* VÉRIFIER LA RÉPONSE DU SERVEUR */

    // response représente la réponse du serveur.
    .then((response) => {

        // Si l'email ou le mot de passe est incorrect.
        if (response.status === 401 || response.status === 404) {
            throw new Error("Email ou mot de passe incorrect.");
        }

        // Si une autre erreur se produit.
        if (!response.ok) {
            throw new Error("Une erreur est survenue.");
        }

        // Transforme la réponse JSON en données JavaScript.
        return response.json();

    })


    /* CONNEXION RÉUSSIE */

    // donnees contient les informations reçues.
    .then((donnees) => {

        // Enregistre le token dans le navigateur.
        localStorage.setItem("token", donnees.token);

        // Redirige vers la page d'accueil.
        window.location.href = "./index.html";

    })


    /* CONNEXION REFUSÉE */

    // Récupère les erreurs précédentes.
    .catch((erreur) => {

        // Affiche le message d'erreur dans le HTML.
        messageErreur.textContent = erreur.message;

    });

}); // Fin de addEventListener
