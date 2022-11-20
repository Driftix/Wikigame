import json
import eel
from random import randint
import Scraper
from StructuredData import StructuredData
from Liens import Liens

#Penser à gérer quand on est offline
eel.init("web")

@eel.expose
def objectInitiator():
    
    htmlDepart = Scraper.requestHTML("https://fr.wikipedia.org/wiki/Sp%C3%A9cial:Page_au_hasard")
    urlArrive = Scraper.requestHTML("https://fr.wikipedia.org/wiki/Sp%C3%A9cial:Page_au_hasard")
    links = Scraper.httpURLCorrect(Scraper.getAllLinks(Scraper.excludeNoises(htmlDepart)))
    #On transforme d'abord les liens en json String
    json_string_links = json.dumps([ob.__dict__ for ob in links])
    #Puis on transforme un objet StructuredData en json String afin de l'envoyer au JS
    entree= Scraper.getURL(htmlDepart)
    sortie= Scraper.getURL(urlArrive)
    data = StructuredData(entree.lien,entree.nom,sortie.lien,sortie.nom,0,json_string_links)
    json_string_data = json.dumps(data.__dict__)
    return json_string_data

@eel.expose
def requestLink(link, score, lien_sortie):
    #link['lien'] correspond au lien link['nom'] du titre rattaché
    html = Scraper.requestHTML(link['lien'])
    links = Scraper.httpURLCorrect(Scraper.getAllLinks(Scraper.excludeNoises(html)))
    json_string_links = json.dumps([ob.__dict__ for ob in links])
    #peut-être modif url arrive
    entree= Scraper.getURL(html)
    sortie= Scraper.getURL(Scraper.requestHTML(lien_sortie))
    #Si on gagne on est redirigé sur une page de victoire
    checkWin(entree, sortie)
    score += 1
    data = StructuredData(entree.lien,entree.nom,sortie.lien,sortie.nom,score,json_string_links)
    json_string_data = json.dumps(data.__dict__)
    return json_string_data

#Permet d'effectuer une sauvegarde à l'instant t d'un partie
@eel.expose
def jsonSave(linksData,cookie) :
    try :
        with open('./saves/{}.json'.format(cookie),'w') as outfile:
            outfile.write(json.dumps(linksData))
    except IOError:
        print("Erreur d'enregistrement")

@eel.expose
def jsonLoad(cookie):
    try:
        with open('./saves/{}.json'.format(cookie),'r') as openfile:
            json_object = json.load(openfile)
            link = Liens(json_object.get("nom_entree"),json_object.get("lien_entree"))
            #On passe l'objet en dict parce que requestLink prend un dict en lien  
            #Le -1 sur le lien c'est parce que dès que l'on affiche la sauvegarde on avait +1 sur le score à cause de la redondance javascript
            return requestLink(link.__dict__, json_object.get("score")-1, json_object.get("lien_sortie"))
    except IOError:
        print("Erreur de lecture")

def checkWin(entree, sortie):
    if entree == sortie :
        eel.youWin()

@eel.expose
def navHover(link):
    urlScraped = Scraper.httpURLCorrect(Scraper.getAllLinks(Scraper.excludeNoises(Scraper.requestHTML(link['lien']))))
    print(urlScraped)
    return urlScraped
    
    
#Page d'entrée 
eel.start("index.html")