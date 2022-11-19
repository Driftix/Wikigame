from typing import OrderedDict
from bs4 import BeautifulSoup
import requests
from urllib.parse import unquote
from Liens import Liens
#Fonction de requête pour obtenir un HTML parsé
def requestHTML(url):
    xa=u'\xa0'
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'
    }
    response = requests.get(url, headers=headers)
    response = BeautifulSoup(response.content,'html.parser')
    return response

#--------------------EXCLUDE NOISES-----------------------------------
#Permet de clean les éléments donc nous n'avons pas besoin
def excludeNoises(response):
    response = response.find(id="bodyContent")
    linkstoExclude = ["index.php", ":"]
    response = excludelinks(response, linkstoExclude)
    return response

#Exclus les liens comportants soit le même char soit le même string qu'en entrée
def excludelinks(response, link):
    for l in link : 
        for resp in response.find_all('a', href=True):
            if(l in resp['href']):
                resp.decompose()
    return response
#-------------------------------------------------------
#Récupère tous les liens de la page html
def getAllLinks(htmlwithoutnoises):
    links = []
    for resp in htmlwithoutnoises.find_all('a',href=True):
        links.append(resp)
    return links
#Corrige les liens de la page car certains on pas https://fr.wikipedia.org 
def httpURLCorrect(links):
    correctedLinks = []
    for link in links :
        #On vérifie au fûr et à mesure du remplissage de correctedlinks
        #Si le lien n'existe pas !
        #Si il exist on skip l'ajout du lien
        duplicate = False
        for correctedlink in correctedLinks:
            if unquote(link['href']) in correctedlink.lien:
                duplicate = True
                break
        if(not duplicate) :
            linkobj = Liens(link.text, link['href'])
            if("/wiki/" in linkobj.lien and "https://" not in linkobj.lien):
                linkobj.lien = unquote("https://fr.wikipedia.org" + linkobj.lien)
                correctedLinks.append(linkobj)
            elif ("https://fr.wikipedia.org" in link):
                correctedLinks.append(linkobj)
    return correctedLinks


#Permet de récupérer le liens d'une page générée aléatoirement
def getURL(response):
    #On espère qui y'a qu'un seul titre avec le span et cette classe ...
    title = response.find("h1", {"id": "firstHeading"}).findChildren()[0].text
    #Pour éviter les conneries du style espace caractères spéciaux etc...
    return Liens(title,("https://fr.wikipedia.org/wiki/"+title).replace(" ","_"))
