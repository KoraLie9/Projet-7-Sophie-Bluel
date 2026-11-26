/* 1/ VÉRIFIER SI L'UTILISATEUR EST CONNECTÉ */
/* On récupère le token enregistré dans le localStorage du navigateur. */
const token = localStorage.getItem("token");
const authLink = document.querySelector("#auth-link");

/* Si un token existe, on affiche les éléments du mode édition. */
if (token) {
  /* hidden = false permet d'afficher le bouton modifier. */
  document.querySelector("#edit-button").hidden = false;
  /* On affiche également le bandeau noir "Mode édition". */
  document.querySelector("#edit-banner").hidden = false;
  /* On cache les filtres avec la propriété CSS display: none. */
  document.querySelector(".filters").style.display = "none";
  /* textContent permet de changer le texte du lien. On remplace "login" par "logout". */
  authLink.textContent = "logout";
  /* Ici, on attend un clic sur le lien "logout". */
  authLink.addEventListener("click", (event) => {
    /* Empêche le lien d'ouvrir automatiquement login.html. */
    event.preventDefault();
    /* On supprime le token du localStorage pour déconnecter l'utilisateur. */
    localStorage.removeItem("token");
    /* On recharge la page pour revenir au mode visiteur. */
    window.location.reload();
  });
}

/* 2/ LES VARIABLES DES GALERIES */
/* On crée un tableau vide qui contiendra tous les projets. */
let tousLesTravaux = [];
/* Elle contiendra les photos de la galerie principale. */
const gallery = document.querySelector(".gallery");
/* Elle contiendra les boutons de filtrage. */
const filterContainer = document.querySelector(".filters");
/* Elle contiendra les petites photos dans la fenêtre modale. */
const galerieModale = document.querySelector("#modal-works");

/* 3/ AFFICHER LES TRAVAUX DANS LA GALERIE PRINCIPALE */
/* Le paramètre liste recevra un tableau contenant les projets à afficher. */
function afficherTravaux(liste) {
  /* On vide la galerie avant de la remplir pour éviter les doublons. */
  gallery.innerHTML = "";
  /* forEach parcourt un tableau élément par élément. À chaque passage, travail représente un projet de la liste. */
  liste.forEach((travail) => {
    /* Ici, on crée une figure qui contiendra une image et son titre. */
    const figure = document.createElement("figure");
    /* On crée une balise img pour afficher la photo. */
    const image = document.createElement("img");

    /* travail.imageUrl récupère l'adresse de l'image du projet. */
    image.src = travail.imageUrl;
    /* On utilise le titre du projet comme texte alternatif de l'image. */
    image.alt = travail.title;

    /* appendChild ajoute un élément à l'intérieur d'un autre. On ajoute ici l'image dans la figure. */
    figure.appendChild(image);

    /* On crée une balise figcaption pour afficher le titre du projet. */
    const titre = document.createElement("figcaption");
    /* textContent écrit le titre du projet dans la légende. */
    titre.textContent = travail.title;

    /* On ajoute le titre dans la figure, après l'image. */
    figure.appendChild(titre);
    /* On ajoute la figure complète dans la galerie principale. */
    gallery.appendChild(figure);
  });
}

/* 4/ AFFICHER LES TRAVAUX DANS LA MODALE */
/* Cette fonction affiche les projets dans la fenêtre modale. */
function afficherTravauxModale(liste) {
  /* On vide la galerie de la modale pour éviter les doublons. */
  galerieModale.innerHTML = "";
  /* On parcourt chaque projet du tableau reçu. */
  liste.forEach((travail) => {
    /* On crée une figure et une image pour chaque projet. */
    const figure = document.createElement("figure");
    const image = document.createElement("img");

    /* On récupère l'adresse de l'image et le titre du projet. */
    image.src = travail.imageUrl;
    image.alt = travail.title;

    /* On ajoute l'image dans notre figure. */
    figure.appendChild(image);

    /* On crée un bouton HTML qui servira à supprimer ce projet. */
    const boutonSupprimer = document.createElement("button");

    /* On précise que le bouton sert à une action, pas à envoyer un formulaire. */
    boutonSupprimer.type = "button";
    /* className permet d'attribuer une classe CSS au bouton. */
    boutonSupprimer.className = "delete-work";
    /* setAttribute ajoute un attribut HTML. aria-label donne un nom au bouton pour les lecteurs d'écran. */
    boutonSupprimer.setAttribute("aria-label", "Supprimer " + travail.title);
    /* innerHTML permet d'insérer du HTML dans un élément. On ajoute ici l'icône de poubelle de Font Awesome. */
    boutonSupprimer.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    /* On ajoute la poubelle à la figure qui contient déjà la photo. */
    figure.appendChild(boutonSupprimer);

    /* 5/ SUPPRIMER UN TRAVAIL AVEC L'API */
    /* On détecte le clic sur la poubelle du projet. */
    boutonSupprimer.addEventListener("click", () => {
      /* confirm affiche une fenêtre pour demander confirmation.
            La variable vaut true si on confirme, false si on annule. */
      const confirmation = confirm(
        "Voulez-vous vraiment supprimer ce projet ?",
      );
      /* ! signifie NON.
            Si la suppression n'est pas confirmée, return arrête la fonction. */
      if (!confirmation) {
        return;
      }
      /* fetch permet de communiquer avec l'API.
            ${travail.id} insère l'identifiant du projet à supprimer dans l'URL. On envoie une demande de suppression à l'API. */
      fetch(`http://localhost:5678/api/works/${travail.id}`, {
        method: "DELETE",
        /* headers permet d'ajouter des informations à la requête. Authorization envoie le token pour vérifier notre autorisation. */
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          /* response.ok vérifie si la requête a réussi. Si elle a échoué, throw new Error() déclenche une erreur. */
          if (!response.ok) {
            throw new Error("La suppression a échoué.");
          }

          /* L'API a confirmé la suppression.
                filter() crée un nouveau tableau en gardant uniquement
                les projets dont l'id est différent de celui supprimé.
                !== signifie "est différent de". */
          tousLesTravaux = tousLesTravaux.filter((projet) => {
            return projet.id !== travail.id;
          });

          /* On réaffiche la galerie principale avec le tableau mis à jour. */
          afficherTravaux(tousLesTravaux);
          /* On réaffiche également la galerie de la modale.*/
          afficherTravauxModale(tousLesTravaux);
        })

        /* .catch() récupère une erreur si la suppression échoue.
            erreur est le nom donné à cette erreur. */
        .catch((erreur) => {
          // On affiche un message si la suppression échoue.
          alert(erreur.message);
        });
    });

    /* On ajoute la figure avec sa photo et sa poubelle dans la modale. */
    galerieModale.appendChild(figure);
  });
}

/* 6/ RÉCUPÉRER LES PROJETS DEPUIS L'API */
fetch("http://localhost:5678/api/works")
  /* response.json() récupère les données JSON du serveur et les convertit en données JavaScript. */
  .then((response) => response.json())
  /* travaux représente le tableau des projets reçu de l'API. */
  .then((travaux) => {
    /* On remplace notre tableau vide par les projets récupérés. */
    tousLesTravaux = travaux;
    /* On affiche les projets dans la galerie principale. */
    afficherTravaux(tousLesTravaux);
    /* On affiche aussi les projets dans la galerie de la modale. */
    afficherTravauxModale(tousLesTravaux);
  });

/* 7/ RÉCUPÉRER LES CATÉGORIES ET CRÉER LES FILTRES */
fetch("http://localhost:5678/api/categories")
  /* On convertit les données JSON en données JavaScript. */
  .then((response) => response.json())
  /* categories représente le tableau des catégories récupérées. */
  .then((categories) => {
    /* CRÉER LE BOUTON "TOUS" */
    /* On crée un bouton HTML. */
    const allButton = document.createElement("button");
    /* On écrit "Tous" à l'intérieur du bouton. */
    allButton.textContent = "Tous";
    /* On ajoute ce bouton dans la div .filters. */
    filterContainer.appendChild(allButton);
    /* Lorsqu'on clique sur "Tous", on affiche tous les projets. */
    allButton.addEventListener("click", () => {
      afficherTravaux(tousLesTravaux);
    });

    /* CRÉER LES BOUTONS DES AUTRES CATÉGORIES */
    categories.forEach((categorie) => {
      /* On crée un bouton pour cette catégorie. */
      const button = document.createElement("button");
      /* On récupère le nom de la catégorie pour l'écrire sur le bouton. */
      button.textContent = categorie.name;
      /* On ajoute le bouton dans notre zone de filtres. */
      filterContainer.appendChild(button);

      /* On détecte un clic sur ce bouton de catégorie. */
      button.addEventListener("click", () => {
        /* filter() sélectionne uniquement les projets dont la catégorie correspond au bouton sélectionné. */
        const travauxFiltres = tousLesTravaux.filter((travail) => {
          return travail.categoryId === categorie.id;
        });
        /* On affiche uniquement les projets filtrés. */
        afficherTravaux(travauxFiltres);
      });
    });
  });

/* 8/ OUVRIR ET FERMER LA MODALE */
/* On récupère le bouton "modifier" dans notre HTML. */
const boutonModifier = document.querySelector("#edit-button");
/* On récupère la fenêtre modale. */
const modale = document.querySelector("#modal");
/* On récupère la croix permettant de fermer la modale. */
const boutonFermer = document.querySelector("#close-modal");

/* On récupère les deux zones de la modale : la galerie photo et le formulaire d'ajout. */
const zoneGalerie = document.querySelector("#modal-gallery");
const zoneAjout = document.querySelector("#modal-add");

/* OUVRIR LA MODALE */
/* Quand on clique sur le bouton Modifier, on ouvre la modale. */
boutonModifier.addEventListener("click", () => {
  /* hidden = false permet d'afficher la modale. */
  modale.hidden = false;
  /* On affiche la galerie des photos. */
  zoneGalerie.hidden = false;
  /* hidden = true permet de cacher le formulaire d'ajout. */
  zoneAjout.hidden = true;
});

/* FERMER LA MODALE AVEC LA CROIX */
/* On détecte un clic sur la croix pour fermer la modale. */
boutonFermer.addEventListener("click", () => {
  /* On cache la modale. */
  modale.hidden = true;
});

/* FERMER LA MODALE EN CLIQUANT SUR LE FOND GRIS */
/* On détecte un clic sur la modale. event contient les informations sur ce clic. */
modale.addEventListener("click", (event) => {
  /* event.target représente l'élément sur lequel on a cliqué.
        === vérifie si cet élément est exactement la modale.
        Ainsi, on ferme la fenêtre uniquement si on clique sur le fond gris. */
  if (event.target === modale) {
    modale.hidden = true;
  }
});

/* 9/ NAVIGUER ENTRE LES DEUX ZONES DE LA MODALE */
/* ALLER AU FORMULAIRE D'AJOUT */
/* On récupère le bouton "Ajouter une photo" dans le HTML. */
const boutonAjouter = document.querySelector("#add-photo-button");
/* On détecte un clic sur le bouton "Ajouter une photo". */
boutonAjouter.addEventListener("click", () => {
  /* On cache la galerie des photos. */
  zoneGalerie.hidden = true;
  /* On affiche le formulaire d'ajout. */
  zoneAjout.hidden = false;
});

/* RETOUR À LA GALERIE */
/* On récupère le bouton avec la flèche de retour. */
const boutonRetour = document.querySelector("#back-to-gallery");
/* On détecte un clic sur la flèche de retour. */
boutonRetour.addEventListener("click", () => {
  /* On cache le formulaire d'ajout. */
  zoneAjout.hidden = true;
  /* On affiche de nouveau la galerie des photos. */
  zoneGalerie.hidden = false;
});
