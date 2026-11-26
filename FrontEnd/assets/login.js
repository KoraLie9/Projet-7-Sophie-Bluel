/* 1/ RÉCUPÉRER LE FORMULAIRE DE CONNEXION */

const formulaireConnexion = document.querySelector("#login form");
const champEmail = formulaireConnexion.querySelector('input[type="email"]');
const champMotDePasse = formulaireConnexion.querySelector(
  'input[type="password"]',
);
const messageErreur = document.querySelector("#login-error");

/* 2/ DÉTECTER L'ENVOI DU FORMULAIRE */

/* addEventListener permet d'écouter un événement.
  "Quand le formulaire est envoyé, exécute les instructions suivantes." */
formulaireConnexion.addEventListener("submit", (event) => {
  /* preventDefault() empêche le formulaire de s'envoyer automatiquement et la page de se recharger.
  Cela permet à JavaScript de récupérer les identifiants et de les envoyer à l'API avec fetch(). */
  event.preventDefault();

  /* On vérifie que la zone du message d'erreur existe. Si elle existe, textContent = "" efface
  le message d'erreur précédent. */
  if (messageErreur) {
    messageErreur.textContent = "";
  }

  /* 3/ RÉCUPÉRER L'EMAIL ET LE MOT DE PASSE */

  /* .value récupère l'email saisi par l'utilisateur.
    trim() supprime les espaces au début et à la fin.
    On enregistre le résultat dans la variable email. */
  const email = champEmail.value.trim();

  /* champMotDePasse.value contient le texte saisi dans le champ password. */
  const password = champMotDePasse.value;

  /* Si l'email ou le mot de passe est vide, on affiche un message et on arrête la fonction. */
  if (email === "" || password === "") {
    messageErreur.textContent = "Veuillez remplir tous les champs.";
    return;
  }

  /* 4/ ENVOYER LES IDENTIFIANTS À L'API */
  fetch("http://localhost:5678/api/users/login", {
    /* POST permet d'envoyer des données à l'API. */
    method: "POST",

    /* headers donne des informations sur les données envoyées. Content-Type précise leur format.
       application/json indique que les données sont envoyées au format JSON. */
    headers: {
      "Content-Type": "application/json",
    },

    /* body contient les données envoyées à l'API : l'email et le mot de passe.
    JSON.stringify() transforme ces données au format JSON pour les envoyer. */
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    /* 5/ TRAITER LA RÉPONSE DU SERVEUR */
    .then((response) => {
      /* Si la requête a échoué, throw new Error() déclenche une erreur. */
      if (!response.ok) {
        throw new Error("Email ou mot de passe incorrect.");
      }

      /* response.json() récupère les données JSON du serveur et les convertit en données JavaScript.
    return transmet le résultat au .then() suivant. */
      return response.json();
    })

    /* 6/ RÉCUPÉRER ET ENREGISTRER LE TOKEN */

    /* Le serveur a accepté les identifiants et renvoie des données appelées data. */
    .then((data) => {
      /* Si data.token est vide ou absent, on déclenche une erreur. */
      if (!data.token) {
        throw new Error("Aucun token reçu.");
      }

      /* localStorage permet de stocker des données dans le navigateur.
    setItem() enregistre le token reçu du serveur sous le nom "token". */
      localStorage.setItem("token", data.token);

      /* window.location.href permet de changer de page.
    On redirige l'utilisateur vers index.html, où script.js pourra récupérer le token enregistré. */
      window.location.href = "./index.html";
    })

    /* 7/ GÉRER LES ERREURS DE CONNEXION */
    /* .catch() récupère une erreur si la connexion échoue. */
    .catch((erreur) => {
      // On affiche le message d'erreur dans le formulaire.
      messageErreur.textContent =
        "Erreur dans l'identifiant ou le mot de passe";
    });
});
