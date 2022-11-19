#C'est ce qui est échangé entre le javascript et notre serveur web python
class StructuredData:
    def __init__(self,lien_entree,nom_entree,lien_sortie,nom_sortie,score,liens) -> None:
        self.lien_entree = lien_entree
        self.nom_entree = nom_entree
        self.lien_sortie = lien_sortie
        self.nom_sortie = nom_sortie
        self.score = score
        self.liens = liens
    