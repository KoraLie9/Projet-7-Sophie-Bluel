/* VÉRIFIER SI L'UTILISATEUR EST CONNECTÉ */

// Récupère le token enregistré.
const token = localStorage.getItem("token");

// Récupère le lien "login" dans le menu.
const authLink = document.querySelector("#auth-link");

if (token) {
// Affiche le bouton modifier si l'utilisateur est connecté.
    document.querySelector("#edit-button").hidden = false;
    // Affiche le bandeau noir.
    document.querySelector("#edit-banner").hidden = false;
    // Cache les boutons de filtrage si l'utilisateur est connecté.
    document.querySelector(".filters").style.display = "none";
    // Remplace le texte "login" par "logout".
    authLink.textContent = "logout";

    // Détecte un clic sur "logout".
    authLink.addEventListener("click", (event) => {

        // Empêche d'ouvrir la page login.
        event.preventDefault();

        // Supprime le token enregistré.
        localStorage.removeItem("token");

        // Recharge la page d'accueil.
        window.location.reload();

    });

} else {

    console.log("Utilisateur non connecté");

}

/* LES VARIABLES */

// Ce tableau servira à conserver tous les projets de Sophie.
let tousLesTravaux = [];

// ".gallery" signifie : cherche l'élément qui possède la classe CSS "gallery".
const gallery = document.querySelector(".gallery");

// Cet élément contiendra nos boutons de filtrage.
const filterContainer = document.querySelector(".filters");


/* AFFICHER LES PROJETS */
/*  function : Une fonction regroupe des instructions que nous pourrons réutiliser.
liste est un PARAMÈTRE.
Quand nous appellerons cette fonction, nous lui donnerons un tableau de projets qui portera le nom "liste".*/
function afficherTravaux(liste) {
/*  Nous vidons la galerie avant d'afficher les projets.*/
  gallery.innerHTML = "";
/* forEach est une méthode qui parcourt un tableau.
En français : "Pour chaque élément présent dans liste, exécute les instructions suivantes."
travail représente UN SEUL projet du tableau.*/
  liste.forEach((travail) => {
// Ici, nous créons une balise <figure> : une image et son titre.
    const figure = document.createElement("figure");
// Nous créons une balise <img> : Pour l'instant, elle ne possède aucune image.
    const image = document.createElement("img");
/* travail est un OBJET. Un objet regroupe plusieurs informations sur un même élément.
travail.imageUrl signifie : "Récupère l'adresse de l'image de ce projet."
image.src signifie : "L'adresse de l'image dans la balise <img>." */
    image.src = travail.imageUrl;
// travail.title récupère le titre du projet.
    image.alt = travail.title;
// appendChild est une MÉTHODE : Elle permet d'ajouter un élément HTML à l'intérieur d'un autre élément.
    figure.appendChild(image);
// Nous créons une balise <figcaption> : Elle servira à afficher le titre sous l'image.
    const titre = document.createElement("figcaption");
/*textContent permet de définir le texte contenu dans un élément HTML.
Nous récupérons le titre du projet et nous l'inscrivons dans la légende.*/
    titre.textContent = travail.title;
// Nous ajoutons la légende dans la figure, après l'image.
    figure.appendChild(titre);
// Nous ajoutons toute la figuredans notre galerie HTML.
    gallery.appendChild(figure);

  });

}

/* PARTIE 3 : RÉCUPÉRER LES PROJETS */

// fetch permet de faire une demande à un serveur.
fetch("http://localhost:5678/api/works")
// .then signifie : "Quand l'opération précédente est terminée, exécute ce qui suit."
// response représente la réponse reçue du serveur.
  .then((response) => response.json())
// .json() permet de lire les données JSON reçues et de les convertir en données JavaScript.
// travaux est le nom que nous donnons au tableau reçu.
  .then((travaux) => {

   /* Au départ, tousLesTravaux contenait un tableau vide.
Maintenant, nous remplaçons ce tableau vide par le tableau reçu depuis l'API.*/
    tousLesTravaux = travaux;
/* Dans la fonction afficherTravaux, la fonction affichera donc tous les projets.*/
    afficherTravaux(tousLesTravaux);

  });

/* RÉCUPÉRER LES CATÉGORIES */

fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((categories) => {

/* CRÉER LE BOUTON "TOUS" */
// Nous créons un bouton HTML <button>.
    const allButton = document.createElement("button");
// Nous écrivons le mot "Tous" à l'intérieur du bouton.
    allButton.textContent = "Tous";
// Nous ajoutons le bouton dans l'élément HTML qui contient tous nos filtres.
    filterContainer.appendChild(allButton);

// addEventListener permet de surveiller un événement sur un élément HTML.
// () => { ... } est une fonction fléchée.
    allButton.addEventListener("click", () => {
/* Quand l'utilisateur clique sur "Tous", nous appelons afficherTravaux.
Nous lui transmettons le tableau complet. Toutes les images sont donc réaffichées.*/
      afficherTravaux(tousLesTravaux);
    });
/* CRÉER LES AUTRES BOUTONS */
// categories est un tableau.
    categories.forEach((categorie) => {
// Pour chaque catégorie, nous créons un nouveau bouton HTML.
      const button = document.createElement("button");
// categorie est un objet.
// categorie.name récupère le nom de la catégorie actuelle.
      button.textContent = categorie.name;
// Nous ajoutons ce boutondans notre zone de filtres.
      filterContainer.appendChild(button);

/* FILTRER LES PROJETS*/

      button.addEventListener("click", () => {
/* Nous créons une nouvelle variable appelée travauxFiltres.
Elle contiendra uniquement les projets correspondant à la catégorie choisie.
filter est une méthode des tableaux. Elle examine chaque projet et conserve ceux qui respectent
la condition demandée.*/
        const travauxFiltres = tousLesTravaux.filter((travail) => {

/* travail.categoryId représente l'identifiant de la catégorie du projet.
categorie.id représente l'identifiant de la catégorie du bouton cliqué.
Nous vérifions donc : "Est-ce que la catégorie du projet correspond à la catégorie choisie ?"
return renvoie le résultat : true ou false.
Si c'est vrai : filter garde le projet.
Si c'est faux : filter l'écarte.*/
          return travail.categoryId === categorie.id;

        });

// Nous appelons notre fonction pour afficher ces projets.
        afficherTravaux(travauxFiltres);

      });

    });

  });

/* OUVRIR ET FERMER LA MODALE */

// Récupère le bouton "modifier" dans le HTML.
const boutonModifier = document.querySelector("#edit-button");

// Récupère la fenêtre modale.
const modale = document.querySelector("#modal");

// Récupère la croix qui ferme la modale.
const boutonFermer = document.querySelector("#close-modal");


// OUVRIR LA MODALE

// Quand on clique sur "modifier"...
boutonModifier.addEventListener("click", () => {

    // On rend la modale visible.
    modale.hidden = false;
});

// FERMER LA MODALE

// Quand on clique sur la croix...
boutonFermer.addEventListener("click", () => {
    // On cache la modale.
    modale.hidden = true;
});
