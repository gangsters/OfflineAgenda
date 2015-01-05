DOSSIER_RESULTAT=../packageLatexInsa
LIEN_DE_RETOUR=../cls

all:
	xsltproc commun/vocabulaireCommunEnCodeLatex.xsl commun/vocabulaireCommun.xml  > commun/vocabulaireCommun.sty
	xsltproc asi/vocabulaireASIEnCodeLatex.xsl asi/vocabulaireASI.xml  > asi/vocabulaireASI.sty
	cd ..
	# Conversion en ISO_8859-15
	#iconv -f UTF-8 -t ISO_8859-15 asi/vocabulaireASI.sty > tampon; mv tampon asi/vocabulaireASI.sty
	#iconv -f UTF-8 -t ISO_8859-15 commun/vocabulaireCommun.sty > tampon; mv tampon commun/vocabulaireCommun.sty
	# Le package ne doit pas contenir les fichiers qui permettent de créer les .sty ni les .svn
	cd ${DOSSIER_RESULTAT};\
	tar -C ${LIEN_DE_RETOUR} --exclude .svn --exclude *.xsl --exclude *.xml --exclude Makefile -cf - . | tar xf -;\

documentation: all
	pdflatex Documentation.tex;\
	pdflatex Documentation.tex;\
	rm -f *.aux *.cb *.cb2 *.log *.toc *.out
	# Pour l'instant ces fichiers sont vides ...
	xsltproc vocabulaireEnDocumentationLatex.xsl asi/vocabulaireASI.xml  | sed "s/\#\([0-9][0-9]*\)/\\\#\1/g" > asi/vocabulaire-documentation-ASI.tex
	xsltproc vocabulaireEnDocumentationLatex.xsl commun/vocabulaireCommun.xml  | sed "s/\#\([0-9][0-9]*\)/\\\#\1/g" > commun/vocabulaire-documentation-COMMUN.tex

clean:
	rm -f asi/vocabulaireASI.sty
	rm -f commun/vocabulaireCommun.sty
	rm -f ${DOSSIER_RESULTAT}/picINSA.cls
	rm -rf ${DOSSIER_RESULTAT}/asi
	rm -rf ${DOSSIER_RESULTAT}/commun
