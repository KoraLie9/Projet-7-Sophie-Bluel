
 // Tableau qui conserve tous les travaux
let tousLesTravaux = [];

const gallery = document.querySelector(".gallery");
const filterContainer = document.querySelector(".filters");

// Fonction qui affiche les travaux dans la galerie
function afficherTravaux(liste) {

  // Vide la galerie
  gallery.innerHTML = "";

  // Parcourt les travaux de la liste
  liste.forEach((travail) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");

    image.src = travail.imageUrl;
    image.alt = travail.title;

    figure.appendChild(image);

    // Crée une légende
    const titre = document.createElement("figcaption");
    titre.textContent = travail.title;
    figure.appendChild(titre);
    gallery.appendChild(figure);

  }); 

} 


// Récupère les travaux depuis le serveur
fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((travaux) => {

    // Conserve tous les travaux
    tousLesTravaux = travaux;

    // Affiche tous les travaux au départ
    afficherTravaux(tousLesTravaux);

  });


// Récupère les catégories depuis le serveur
fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((categories) => {

    // Crée le bouton Tous
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";

    // Ajoute le bouton Tous dans les filtres
    filterContainer.appendChild(allButton);

    // Détecte un clic sur Tous
    allButton.addEventListener("click", () => {

      // Affiche tous les travaux
      afficherTravaux(tousLesTravaux);

    });

    // Parcourt chaque catégorie
    categories.forEach((categorie) => {

      // Crée un bouton
      const button = document.createElement("button");

      // Ajoute le nom de la catégorie
      button.textContent = categorie.name;

      // Ajoute le bouton dans les filtres
      filterContainer.appendChild(button);

      // Détecte un clic sur le bouton
      button.addEventListener("click", () => {

        // Garde les travaux de la catégorie choisie
        const travauxFiltres = tousLesTravaux.filter((travail) => {
          return travail.categoryId === categorie.id;
        });

        // Affiche uniquement les travaux filtrés
        afficherTravaux(travauxFiltres);

      }); 

    }); 

  }); 
