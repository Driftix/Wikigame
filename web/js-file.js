
//Permet de savoir si on doit créer ou charger une partie
let pageParameter = new URLSearchParams(window.location.search).get('page')
if(pageParameter == 'start'){
    eel.objectInitiator()(createView);
}else if(pageParameter == 'load'){
    eel.jsonLoad(document.cookie)(createView);
}else if(pageParameter == 'menu'){
    window.location.href = "index.html";
}else{ //Si jamais on viens d'arriver sur le site !
    //Si on a pas de cookies on en crée un
    if(document.cookie == ""){
        createCookie();
    }//Si on a déjà un cookie y'a rien à faire :D
}

//Création de la vue du jeu 
async function createView(linksData){

    //On décode en JSON les données principales
    linksData = JSON.parse(linksData);
    //Ajout historique
    let historique = document.createElement("p");
    const newhistorique = document.createTextNode(linksData.nom_entree);
    historique.appendChild(newhistorique);
    historique.classList.add("historique");
    document.getElementById("historique").insertAdjacentElement("beforeend", historique);
    
    document.getElementById("goal").innerText = linksData.nom_sortie;
    document.getElementById("page").innerText = linksData.nom_entree;
    document.getElementById("score").innerText = "Votre Score: " + linksData.score;
    //On veut créér un bouton de sauvegarde avec notre linksData;
    createSaveButton(linksData);
    //Il faut penser à décoder les liens dans les datas
    JSON.parse(linksData.liens).forEach((link)=> createButton(link,linksData.score, linksData.lien_sortie));
    return await linksData
}   
function createButton(link,score, lien_sortie){
    let newDiv = document.createElement("button");
    const newContent = document.createTextNode(link.nom);
    newDiv.appendChild(newContent);
    newDiv.classList.add("boutonNavigation","btn-primary","btn");
    //Pour intéragir avec python pour obtenir les nouveaux liens
    newDiv.onclick = async function () {
        //Score dans le requestLink pas très beau mais c'est pour le mettre à jour dans le back
        let newlinks = await eel.requestLink(link,score, lien_sortie)(createView);
        //Supprime le bouton de sauvegarde lié à l'ancienne page
        let saveRowButton = document.getElementById("sauvegarde");
        saveRowButton.removeChild(saveRowButton.firstChild);
        //Pour supprimer tout les anciens boutons
        Array.from(document.getElementsByClassName('boutonNavigation')).forEach(bouton=>bouton.remove());
    }
    newDiv.onmouseover = async function (){
        console.log(document.cookie)
    }
    document.getElementById("list").insertAdjacentElement('beforeend',newDiv);   
}
function createSaveButton(linksData){
    let saveButton = document.createElement("button");
    const newSaveButton = document.createTextNode("Sauvegarder la partie");
    saveButton.appendChild(newSaveButton);
    saveButton.classList.add("btn-success","btn");
    //Action de click qui permet de sauvegarder
    saveButton.onclick = async function () {
        console.log(document.cookie)
        let save = await eel.jsonSave(linksData,document.cookie)();
    }
    document.getElementById("sauvegarde").insertAdjacentElement("beforeend", saveButton);
}
//Redirection de la page de victoire
eel.expose(youWin)
function youWin(){
    window.location.href = "win.html";
}



function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function createCookie(){
    let coookiestr = makeid(20);
    document.cookie = coookiestr;
}
