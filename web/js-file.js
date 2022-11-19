let start = document.getElementById("main");
let load = document.getElementById("load");
start.onclick = async function () {
    
    await eel.objectInitiator()(createView);
    //await eel.objectInitiator()(createView);
  }
load.onclick = async function () {
    await eel.jsonLoad()(createView)
}
async function createView(linksData){
    //Suppression du bouton start
    start.remove();
    //Suppression du bouton loadSave
    load.remove();
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
    document.getElementById("score").innerText = linksData.score;
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
        let hover = await eel.navHover(link)()
        console.log(hover.liens);
        document.getElementById("test").innerText = hover
    }
    document.getElementById("list").insertAdjacentElement('beforeend',newDiv);   
}
function createSaveButton(linksData){
    let saveButton = document.createElement("button");
    const newSaveButton = document.createTextNode("Sauvegarder la partie");
    saveButton.appendChild(newSaveButton);
    saveButton.classList.add("btn-primary","btn");
    //Action de click qui permet de sauvegarder
    saveButton.onclick = async function () {
        let save = await eel.jsonSave(linksData)();
    }
    document.getElementById("sauvegarde").insertAdjacentElement("beforeend", saveButton);
}
//Redirection de la page de victoire
eel.expose(youWin)
function youWin(){
    window.location.href = "win.html";
}