FICHIERS_DIA=$(shell ls images/*.dia ressources/*.dia)
FICHIERS=$(basename ${FICHIERS_DIA})

RESSOURCES_SVG=$(shell ls ressources/*.svg)
RESSOURCES=$(basename ${RESSOURCES_SVG})
IMAGES_SVG=$(shell ls images/*.svg)
IMAGES=$(basename ${IMAGES_SVG})
# Importation des variables
include Makevars

all: dia svg pdf cleanrep

# génération rapide du pdf /!\ les numérotations/sommaire seront faux.
fast:
	TEXINPUTS=${TEXINPUTS}:$(CLSPATH):$(VOCPATH):$(THEMEPATH);\
	export TEXINPUTS;\
	pdflatex *.tex;\
	rm -f $(NOM_FICHIER).pdf
	mv ./*.pdf ./$(NOM_FICHIER).pdf

# Génération du pdf
pdf:
	TEXINPUTS=${TEXINPUTS}:$(CLSPATH):$(VOCPATH):$(THEMEPATH);\
	export TEXINPUTS;\
	pdflatex *.tex;\
	pdflatex *.tex;\
	pdflatex *.tex;\
	rm -f $(NOM_FICHIER).pdf
	mv *.pdf $(NOM_FICHIER).pdf

# Génération des pdf à partir des .dia
dia: #dia
	for fichier in $(FICHIERS); do\
                dia -e $$fichier.eps --filter=eps-builtin $$fichier.dia;\
                ps2pdf -dEPSCrop $$fichier.eps $$fichier.pdf;\
        done;\

svg:
	for fichier in $(RESSOURCES); do\
		inkscape $$fichier.svg --export-pdf="$$fichier.pdf";\
	done;\
	for fichier in $(IMAGES); do\
		inkscape $$fichier.svg --export-pdf="$$fichier.pdf";\
	done;\

# Nettoyage total
clean: cleanrep cleanpdf cleanimg


# Nettoyage du répertoire
cleanrep:	
	rm -f *.aux *.cb *.cb2 *.log *.toc *.out *.lot *.lof *.snm *.nav

cleanpdf:
	rm -f ./archivage/*.pdf

cleanimg:
	rm -f ./images/*.eps ./images/*.pdf
