\ProvidesClass{picINSAAnglais}[2014/05/06 version 1.0]
\LoadClass[a4paper,twoside,12pt,openright]{report}

\RequirePackage[francais,english]{babel}
\RequirePackage[utf8]{inputenc}
\RequirePackage{amsmath,amssymb,amsfonts,amsthm,textcomp}
\RequirePackage[cyr]{aeguill}
\RequirePackage[a4paper,twoside,lmargin=2cm,rmargin=2cm,tmargin=2.5cm,bmargin=3cm]{geometry}
\RequirePackage{graphicx}
\RequirePackage{verbatim}
\RequirePackage{moreverb}
\RequirePackage{lastpage}
\RequirePackage{fancyhdr}
\RequirePackage{multirow}
\RequirePackage{textcomp}
\RequirePackage{ifthen}
\RequirePackage{longtable}
\RequirePackage{fancybox}
\RequirePackage{array}
\RequirePackage{color}
\RequirePackage{colortbl}
\RequirePackage{makeidx}
\RequirePackage{float}
\RequirePackage{eurosym}
\RequirePackage{lscape}
\RequirePackage{tabularx}
\RequirePackage{enumerate}
\RequirePackage{ifpdf}
\RequirePackage[outerbars]{changebar}
\RequirePackage{layouts}
\RequirePackage{fp}
\RequirePackage{eso-pic}
\RequirePackage{rotating}
\RequirePackage{url}
\RequirePackage{xstring}
\RequirePackage{hhline}
\RequirePackage{pdfpages}
\RequirePackage{calc}
\RequirePackage{listings}
\RequirePackage{xr} % Références externes
\RequirePackage[colorlinks=true,urlcolor=blue,linktoc=all,hypertexnames=true,pdfmenubar=true,frenchlinks=true,linkcolor=black]{hyperref}

% Pour la watermark de l'option brouillon
\RequirePackage{everypage}
\RequirePackage{draftwatermark}
\SetWatermarkText{} % Rien par défaut

% Gestion des "no break space"
\DeclareUnicodeCharacter{00A0}{ }

% Pour éviter un warning latex on met nous mêmes les headheight à 15pt
\setlength{\headheight}{15pt}
% changement de la police des titres
\renewcommand{\rmdefault}{phv}

% Les valeurs qui suivent sont tirés de la charte insa (CharteGraphiqueINSARouen2008_V4.pdf) elle sont obtenus en passant les valeurs RGB entre 0 et 1 (valeur /255)
\definecolor{bleuInformatique}{rgb}{0.369,0.769,0.930}
\definecolor{vertChimie}{rgb}{0.784,0.820,0.00}
% La gris a été mis à une valeur moyenne et pas selon la charte (la valeur donnée est une valeur en jaune cyan magenta difficile à utiliser)
\definecolor{grisInsa}{gray}{0.5}



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 
%                                     % 
% Définition des options de la classe %
%                                     % 
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 



% Les otions possibles sont [asi|mrie],compacte,sansPage (défaut : On),[version|sansVersion|numero|date|nom] (défaut : version)


\newboolean{departASI}
\newboolean{departMRIE}
\newboolean{modeCompacte}
\newboolean{modeVersion}
% Le boolean n'est pas utilisé pour l'instant, tout se passe dans la déclaration d'option.
\newboolean{modeBrouillon}
\newboolean{modeNumero}
\newboolean{modeDate}
\newboolean{modePage}
\newboolean{modeNommee}

% Initialisation
\setboolean{departASI}{false}
\setboolean{departMRIE}{false}
\setboolean{modeCompacte}{false}
\setboolean{modePage}{true}
\setboolean{modeBrouillon}{false}
\setboolean{modeVersion}{true}
    \setboolean{modeNumero}{false}
    \setboolean{modeDate}{false}
    \setboolean{modeNommee}{false}

\RequirePackage{commun/commandesCommun}
\RequirePackage{commun/vocabulaireCommun}


\ProcessOptions
{}
% Options par défauts :
    \DeclareOption{asi}{\setboolean{departASI}{true}}
    \DeclareOption{mrie}{\setboolean{departMRIE}{true}}
    \DeclareOption{compacte}{\setboolean{modeCompacte}{true}}
    \DeclareOption{sansPage}{\setboolean{modePage}{false}}
    \DeclareOption{brouillon}{\setboolean{modeBrouillon}{true}
		\SetWatermarkText{BROUILLON}
		%\SetWatermarkLightness{0.8} %  default is set to 0.8.
		\SetWatermarkScale{0.9} % default scale of the text is 1.2
    }
    % Par défaut un document est versionné
        \DeclareOption{version}{\setboolean{modeVersion}{true}}
        \DeclareOption{sansVersion}{\setboolean{modeVersion}{false}}
        % Si il y'a une option parmis numero date ou nom on désactive la version et on active l'option
            \DeclareOption{numero}{\setboolean{modeVersion}{false}\setboolean{modeNumero}{true}}
            \DeclareOption{date}{\setboolean{modeVersion}{false}\setboolean{modeNumero}{false}\setboolean{modeDate}{true}}
            \DeclareOption{nom}{\setboolean{modeVersion}{false}\setboolean{modeNumero}{false}\setboolean{modeDate}{false}\setboolean{modeNommee}{true}}
\ProcessOptions


\ifthenelse{\boolean{departASI}}{\RequirePackage{asi/vocabulaireASI} \newcommand{\departement}{\asiCourt{}}}{}
\ifthenelse{\boolean{departMRIE}}{\RequirePackage{mrie/vocabulaireMRIE} \newcommand{\departement}{\mrieCourt{}}}{}
%openright pour laisser les page blanche pour que les chapitres soit toujours en page de droite openany sinon
\ifthenelse{\boolean{modeCompacte}}{\@openrightfalse}{\@openrighttrue}

% Définition de ce qu'on va écrire en bas de page en fonction des options du package
% Pré-supposé : Page peut être vrai ou pas
% Pré-supposé : Parmis version, numero, date ou nom si l'un est vrai, tous les autres sont faux.
\ifthenelse{\boolean{modePage}}{
     \newcommand{\texteBasGauche}{\begin{minipage}{5cm}\raggedleft \footnotesize Page \thepage \end{minipage}}
     \ifthenelse{\boolean{modeVersion}}{
        \newcommand{\texteBasDroite}{\begin{minipage}{5cm}\raggedleft \footnotesize Version \versionPrive \end{minipage}}
     } 
     {
        \ifthenelse{\boolean{modeNumero}}{
            \newcommand{\texteBasDroite}{\begin{minipage}{5cm}\raggedleft \footnotesize Number \numeroPrive \end{minipage}}
         } 
         {
             \ifthenelse{\boolean{modeDate}}{
                \newcommand{\texteBasDroite}{\begin{minipage}{5cm}\raggedleft \footnotesize \datePrive \end{minipage}}
             } 
             {
                 \ifthenelse{\boolean{modeNommee}}{
                    \newcommand{\texteBasDroite}{\begin{minipage}{5cm}\raggedleft \footnotesize \nomPrive \end{minipage}}
                 } 
                 {
                    % Il n'y a que page donc on peut éventuellement la répartir des deux côté.
                    %\renewcommand{\texteBasGauche}{\begin{minipage}{5cm}\raggedleft \footnotesize Page \end{minipage}}
                    %\newcommand{\texteBasDroite}{\begin{minipage}{5cm}\raggedleft \footnotesize \thepage \end{minipage}}
                    \newcommand{\texteBasDroite}{}
                 }              
             }        
         }
     }
}
{
    % On n'affiche pas la page, donc on peut choisir de répartir le texte de chaque côté de la barre 
    % Ou bien l'affiche d'un seul côté :
    \ifthenelse{\boolean{modeVersion}}{
        %\newcommand{\texteBasGauche}{\begin{minipage}{5cm}\raggedleft \footnotesize Version \end{minipage}}
        %\newcommand{\texteBasDroite}{\begin{minipage}{5cm}\raggedleft \footnotesize \versionPrive \end{minipage}}
        \newcommand{\texteBasGauche}{}
        \newcommand{\texteBasDroite}{\begin{minipage}{5cm}\raggedleft \footnotesize Version \versionPrive \end{minipage}}
    }
    { 
        \ifthenelse{\boolean{modeNumero}}{
        \newcommand{\texteBasGauche}{}
        \newcommand{\texteBasDroite}{\begin{minipage}{5cm}\raggedleft \footnotesize Number \numeroPrive \end{minipage}}
        %\newcommand{\texteBasGauche}{\begin{minipage}{5cm}\raggedleft \footnotesize Numero \end{minipage}}
        %\newcommand{\texteBasDroite}{\begin{minipage}{5cm}\raggedleft \footnotesize \numeroPrive \end{minipage}}
        } 
        {
            \ifthenelse{\boolean{modeDate}}{
                \newcommand{\texteBasGauche}{}
                %\newcommand{\texteBasGauche}{\begin{minipage}{5cm}\raggedleft \footnotesize \datePrive \end{minipage}}
                \newcommand{\texteBasDroite}{\begin{minipage}{5cm}\raggedleft \footnotesize \datePrive \end{minipage}}
            } 
            {
                \ifthenelse{\boolean{modeNommee}}{
                    \newcommand{\texteBasGauche}{}
                    %\newcommand{\texteBasGauche}{\begin{minipage}{5cm}\raggedleft \footnotesize \nomPrive \end{minipage}}
                    \newcommand{\texteBasDroite}{\begin{minipage}{5cm}\raggedleft \footnotesize \nomPrive \end{minipage}}
                } 
                {
                    % Il n'y a rien a affiché
                    \newcommand{\texteBasGauche}{}
                    \newcommand{\texteBasDroite}{}
                }              
            }        
        }
    }
}



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 
%                                     % 
%    Parametres des pages de garde    %
%                                     % 
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 



\newcommand{\titreAcronymePrive}[0]{\ }
\newcommand{\titreAcronyme}[1]{
  \renewcommand{\titreAcronymePrive}[0]{#1}
}

\newcommand{\titreGeneralPrive}[0]{\ }
\newcommand{\titreGeneral}[1]{
  \renewcommand{\titreGeneralPrive}[0]{#1}
}

\newcommand{\sousTitreGeneralPrive}[0]{\ }
\newcommand{\sousTitreGeneral}[1]{
  \renewcommand{\sousTitreGeneralPrive}[0]{#1}
}

\newcommand{\titreDetaillePrive}[0]{\ }
\newcommand{\titreDetaille}[1]{
  \renewcommand{\titreDetaillePrive}[0]{#1}
}

\newcommand{\versionPrive}[0]{\ }
\newcommand{\version}[1]{
  \renewcommand{\versionPrive}[0]{#1}
}

\newcommand{\nomPrive}[0]{\ }
\newcommand{\nom}[1]{
  \renewcommand{\nomPrive}[0]{#1}
}

\newcommand{\numeroPrive}[0]{\ }
\newcommand{\numero}[1]{
  \renewcommand{\numeroPrive}[0]{#1}
}

\newcommand{\datePrive}[0]{\ }
\newcommand{\dateDocument}[1]{
  \renewcommand{\datePrive}[0]{#1}
}

\newcommand{\auteursPrive}[0]{\ }
\newcommand{\auteurs}[1]{
  \renewcommand{\auteursPrive}[0]{#1}
}

\newcommand{\destinatairesPrive}[0]{\ }
\newcommand{\destinataires}[1]{
  \renewcommand{\destinatairesPrive}[0]{#1}
}

\newcommand{\resumePrive}[0]{\ }
\newcommand{\resume}[1]{
  \renewcommand{\resumePrive}[0]{#1}
}

\newcommand{\motsClesPrive}[0]{\ }
\newcommand{\motsCles}[1]{
  \renewcommand{\motsClesPrive}[0]{#1}
}

\newcommand{\natureDerniereModificationPrive}[0]{\ }
\newcommand{\natureDerniereModification}[1]{
  \renewcommand{\natureDerniereModificationPrive}[0]{#1}
}

\newcommand{\referenceVersionPrive}[0]{\ }
\newcommand{\referenceVersion}[1]{
  \renewcommand{\referenceVersionPrive}[0]{#1}
}

\newcommand{\modeDiffusionControlePrive}[0]{FALSE}
\newcommand{\modeDiffusionControle}[0]{
  \renewcommand{\modeDiffusionControlePrive}[0]{TRUE}
}

\newcommand{\modeDiffusionNonControle}[0]{
  \renewcommand{\modeDiffusionControlePrive}[0]{FALSE}
}



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 
%                                  % 
%  Définition du style des pages   %
%                                  % 
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 



\fancypagestyle{pageIncluse}{
  \fancyhf{}
  \fancyfoot[CE]{
    \begin{picture}(0,0)
      \put(-510,-65){\includegraphics[width=350mm,height=25mm]{commun/images/Volutes3.pdf}}
      \put(-270,-20){\texteBasGauche{}}
      \put(-115,-40){
        \begin{minipage}{10cm}
        \raggedleft \scriptsize \textit{
          This document is the property of the \departement{} department of \insaRouen{} and cannot be repricated nor communicated to third parties without prior authorization
        }
        \end{minipage}
      }
      \put(146,-42){\texteBasDroite{}}
    \end{picture}
  }

  \fancyfoot[CO]{
  \begin{picture}(0,0)
  \put(-485,-65){\includegraphics[width=350mm,height=25mm]{commun/images/Volutes3bis.pdf}}
  \put(125,-20){\texteBasGauche{}}
  \put(-175,-40){
        \begin{minipage}{10cm}
        \raggedleft \scriptsize \textit{
          This document is the property of the \departement{} department of \insaRouen{} and cannot be repricated nor communicated to third parties without prior authorization
        }
        \end{minipage}
  }
  \put(-285,-45){\texteBasDroite{}}
  \end{picture}}

  \renewcommand{\topfraction}{0.85}
  \renewcommand{\textfraction}{0.1}
  \renewcommand{\floatpagefraction}{0.75}
}


\fancypagestyle{pageNormale}{ 
  % Haut de page avec le titre à droite ou à gauche en fonction de la page pair ou impair :
  \fancyhf{}
  \fancyhead[LE]{\itshape \referenceVersionPrive}
  \fancyhead[RO]{\itshape \referenceVersionPrive}
  \renewcommand{\headrulewidth}{0.2pt}

  % Haut de page fancy en cours de discution avec les graphistes INSA 
  %  \fancyhf{}
  %  \renewcommand{\headrulewidth}{0pt}
     
  % Logo Insa si on ne veut pas changer pour les pages impair on rajoute LO ici
%  \fancyhead[LE]{
%    \begin{picture}(0,0)
      % On définit la ligne ici car on sait qu'on ne touchera jamais au logo de l'insa et donc qu'il ne changera jamais de place.
%      \put(30,-5){\line(2,0){400}\makebox(1,1)[t]{}}
%      \put(-50,-5){\includegraphics[height=15mm]{commun/images/logoInsaDeRouen.pdf}}
%    \end{picture}
%  }
    
   % Logo Insa page impair:
%  \fancyhead[LO]{
%    \begin{picture}(0,0)
%      \put(-40,-5){\includegraphics[height=15mm]{asi/images/logoASI.pdf}}
%    \end{picture}
%  }   
    
  % Logo Secondaire si on ne veut pas changer pour les pages impair on rajoute RO ici :   
%  \fancyhead[RE]{
%      \begin{picture}(0,0)
%              \put(0,-5){\includegraphics[height=15mm]{asi/images/logoASI.pdf}}
%      \end{picture}
%  }
    
  % Logo insa changé de côté sur les pages impaires :   
%  \fancyhead[RO]{
%    \begin{picture}(0,0)
        % On définit la ligne ici car on sait qu'on ne touchera jamais au logo de l'insa et donc qu'il ne changera jamais de place.
%        \put(-480,-5){\line(2,0){450}\makebox(1,1)[t]{}}
%        \put(-30,-5){\includegraphics[height=15mm]{commun/images/logoInsaDeRouen.pdf}}
%    \end{picture}
%  }
    
%  \fancyhead[CE,CO]{
%    \itshape
%    \titreDetaillePrive{}
%    \referenceVersionPrive
%  }

  \fancyfoot[CE]{
    \begin{picture}(0,0)
      \put(-510,-48){\includegraphics[width=350mm,height=25mm]{commun/images/Volutes3.pdf}}
      \put(-270,-31){\texteBasGauche{}}
      \put(-205,-30){\texteBasDroite{}}
      \put(-300,-50){
        \begin{minipage}{20cm}
          \raggedleft \scriptsize 
          \textit{This document is the property of the \departement{} department of \insaRouen{} and cannot be repricated nor communicated to third parties without prior authorization}
          \end{minipage}
      }
    \end{picture}
  }

  \fancyfoot[CO]{
    \begin{picture}(0,0)
      \put(-510,-48){\includegraphics[width=350mm,height=25mm]{commun/images/Volutes3bis.pdf}}
      \put(-55,-31){\texteBasGauche{}}
      \put(10,-30){\texteBasDroite{}}
      \put(-300,-50){
      \begin{minipage}{20cm}
        \raggedleft \scriptsize 
        \textit{This document is the property of the \departement{} department of \insaRouen{} and cannot be repricated nor communicated to third parties without prior authorization}
        \end{minipage}
      }
    \end{picture}
  }

  \renewcommand{\topfraction}{0.85}
  \renewcommand{\textfraction}{0.1}
  \renewcommand{\floatpagefraction}{0.75}
}

\fancypagestyle{pageCouverture}{
  \fancyhf{}
  \renewcommand{\footrulewidth}{0pt}
  \renewcommand{\headrulewidth}{0pt}
}

% \newcommand{\StylePageNormal}[0]
% {\lhead{\itshape \titreDetaillePrive : \referenceVersionPrive}
%   %   \rhead{\itshape \today}
%   \rhead{}
%   \renewcommand{\headrulewidth}{0.2pt}

%   %   --- Pieds ---
%   %   \lfoot{\footnotesize \textit{\departement{} - INSA - Tous droits réservés}}
%   \lfoot{ \scriptsize \textit{Ce document est la propriété du département \departement{} de l'INSA-Rouen et ne peut} \newline \scriptsize \textit{être ni reproduit, ni communiqué à des tiers sans autorisation préalable}}
%   \rfoot{Page \thepage{ }sur \pageref{LastPage}}
%   \renewcommand{\footrulewidth}{0.2pt}

%   %   --- Figures ----
%   \renewcommand{\topfraction}{0.85}
%   \renewcommand{\textfraction}{0.1}
%   \renewcommand{\floatpagefraction}{0.75}
% }

% Redefinition des chapitres
\makeatletter
\def\@makechapterhead#1{% chapter
  \vspace*{5\p@}
  {
    \parindent \z@ \raggedright \normalfont
    \ifnum \c@secnumdepth >\m@ne
    \huge\bfseries \@chapapp\space \thechapter
    \par\nobreak
    \vskip 5\p@
    \fi
    \interlinepenalty\@M
    \Huge \bfseries #1\par\nobreak
    \vskip 10\p@
    \thispagestyle{fancy}% Permet d'ajouter l'entête de pied de page
  }
}

\def\@schapter#1{
  \if@twocolumn
  \@topnewpage[\@makeschapterhead{#1}]
  \else
  \@makeschapterhead{#1}
  \@afterheading
  \fi
}

\def\@makeschapterhead#1{% chapter*
  \vspace*{5\p@}
  {
    \parindent \z@ \raggedright
    \normalfont
    \interlinepenalty\@M
    \Huge \bfseries  #1\par\nobreak
    \vskip 10\p@
    \thispagestyle{fancy} % Permet d'ajouter l'entête de pied de page
  }
}
\makeatother




%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 
%                                  % 
%   Définition des environnements  %
%                                  % 
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 



\newenvironment{pagesService}{
    %\addcontentsline{toc}{chapter}{Service page}
    % \StylePageNormal
    % \thispagestyle{fancy}
    \addcontentsline{toc}{chapter}{Service page}
    \chapter*{Service page}
  }
  {
}


\newenvironment{historique}{
  \section*{Historical developments}
    \begin{center}
      \begin{longtable}{|p{0.1\textwidth}|p{0.12\textwidth}|p{0.25\textwidth}|p{0.25\textwidth}|p{0.15\textwidth}|}
        \hline	% Une ligne horizontale
        \rowcolor[gray]{.8}
        Version				 & Date					& Author(s)			 & Modification(s) & Modified part(s)\\
        \hline
        \endfirsthead
        \hline	% Une ligne horizontale
        \rowcolor[gray]{.8}
        Version				 & Date					& Author(s)			 & Modification(s) & Modified part(s)\\
        \hline
        \endhead
  }
  {
      \end{longtable}
    \end{center}
}

\newcommand{\unHistorique}[5]{
  #1 & #2	&	#3	& #4 & #5 \\
  \hline
}


\newenvironment{suiviDiffusions}{
	\section*{Diffusions monitoring}
		\begin{center}
			\begin{longtable}{|p{0.1\linewidth}|p{0.12\linewidth}|p{0.7\linewidth}|}
        \hline
        \rowcolor[gray]{.8}
        Version				 & Date					& Recipient(s)\\
        \hline
        \endfirsthead
        \hline
        \rowcolor[gray]{.8}
        Version				 & Date					& Recipient(s)\\
        \hline
        \endhead
	}
	{
      \end{longtable}
    \end{center}
    \emph{Any remark or difficulty applying this document is to be signaled to the Quality Direction of PIC.}
}

\newcommand{\unSuivi}[3]{
	#1 & #2	& #3 \\
	\hline
}
	
\newenvironment{lesDestinataires}{
    \vspace{-14.5pt}
    \begin{list}{}{
      \setlength{\leftmargin}{0pt}
      \setlength{\topsep}{0pt}
      \setlength{\parskip}{0pt}
      \setlength{\partopsep}{0pt}
      \setlength{\parsep}{0pt}
    }
  }
  {
    \end{list}
}

\newenvironment{signatures}{
	\section*{Signatures}
		\begin{center}
			\begin{longtable}{|p{0.15\linewidth}|p{0.17\linewidth}|p{0.25\linewidth}|p{0.12\linewidth}|p{0.2\linewidth}|}
				\hline
				\rowcolor[gray]{.8}
				& Function & Name & Date & Visa		 \\
				\hline
				\endfirsthead
				\hline
				\rowcolor[gray]{.8}
				& Function & Name & Date & Visa		 \\
				\hline
				\endhead
	}
	{
					\hline
			\end{longtable}
		\end{center}
}
\newcommand{\uneSignature}[4]{
	#1 & #2	& #3 & #4 &\\\hline
}

\newenvironment{ficheDeRole}[1]{
	  \begin{center}
	    \begin{tabular}{|13.5cm|}
	      \hline
	      \rowcolor[gray]{.8}
	      Descriptive Role File \\
	      \hline
	      \rowcolor[gray]{.6}
	      #1 \\
	      \hline
  }
  {
      \hline
      \end{tabular}
    \end{center}
}


\newenvironment{documentsApplicables}[1][Document]{
		\section*{Applicable Documents}
		\emph{All of the documents listed bellow are available in the \insaRouen{} library in the Madrillet site.}
		\begin{center}
	}
	{
		\end{center}
}

\newenvironment{listeDeDocumentsApplicables}[1][Version]{
	  \begin{longtable}{|p{0.20\linewidth}|p{0.20\linewidth}|p{0.60\linewidth}|}
      \hline
      \rowcolor[gray]{.8}
      #1	& Date & Document\\
      \hline
      \endfirsthead
      \hline
      \rowcolor[gray]{.8}
      #1 &	Date & Document\\
      \hline
      \endhead
	}
	{
    \end{longtable}
}

\newcommand{\unDocumentApplicable}[3]{
  #1 & #2 & #3 \\
  \hline
}


\newenvironment{terminologie}[1][Terminologie]{
		\section*{Terminology}
		{\emph{The following tables indicate the different terms and abbreviations' meanings used in this document.}}
		\begin{center}
	}
	{
		\end{center}
}

\newenvironment{terminologieUnTableau}[1][Terminologie]{
		\section*{Terminology}
				{\emph{The following table indicate the different terms and abbreviations' meanings used in this document.}}
		\begin{center}
	}
	{
		\end{center}
}


\newenvironment{listeDeDefinitions}[1][Terme(s)]{
    \begin{longtable}{|p{0.20\linewidth}|p{0.80\linewidth}|}
      \hline
      \rowcolor[gray]{.8}
      #1 & Meaning\\
      \hline
      \endfirsthead
      \hline
      \rowcolor[gray]{.8}
      #1 & Meaning\\
      \hline
      \endhead
  }
  {
    \end{longtable}
}

\newcommand{\uneTerminologie}[2]{
  #1 & #2 \\
  \hline
}
  
  
\newenvironment{listeDAbreviations}[1][Abbreviation]{
    \begin{longtable}{|p{0.20\linewidth}|p{0.80\linewidth}|}
      \hline
      \rowcolor[gray]{.8}
      #1 & Meaning\\
      \hline
      \endfirsthead
      \hline
      \rowcolor[gray]{.8}
      #1 & Meaning\\
      \hline
      \endhead
  }
  {
    \end{longtable}
}

\newcommand{\uneAbreviation}[2]{
  #1 & #2 \\
  \hline
}


\newenvironment{documentsReference}[1][Document]{
    \section*{Referenced documents}
    \emph{All of the documents listed below are downloadable at \url{qualite.insa-rouen.fr}.}
    \begin{center}
  }
  {
    \end{center}
}


\newenvironment{listeDeReferences}[1][Document]{
    \begin{longtable}{|p{0.65\linewidth}|p{0.3\linewidth}|}
      \hline
      \rowcolor[gray]{.8}
      #1 & Reference\\
      \hline
      \endfirsthead
      \hline
      \rowcolor[gray]{.8}
      #1 & Reference\\
      \hline
      \endhead
  }
  {
    \end{longtable}
}

\newcommand{\uneReference}[2]{
  #1 & #2 \\
  \hline
}


\newenvironment{enregistrementsRequis}[1][Enregistrement]{
    \section*{\isoNeufMilleUn{}-required documents management}
    \emph{The following table indicate the reference documents for the \isoNeufMilleUn{}-required records management.}
    \begin{center}
  }
  {
    \end{center}
}


\newenvironment{listeDEnregistrements}[1][Record]{
  \begin{longtable}{|p{0.5\linewidth}|p{0.5\linewidth}|}
    \hline
    \rowcolor[gray]{.8}
    Paragraph of the norm - Record & Referenced - location\\
    \hline
    \endfirsthead
    \hline
    \rowcolor[gray]{.8}
    Paragraph of the norm - Record & Referenced - location\\
    \hline
    \endhead
  }
  {
    \end{longtable}
}

\newcommand{\unEnregistrement}[2]{
  #1 & #2 \\
  \hline
}


\newenvironment{proceduresDocumentees}[1][Activité]{
    \section*{Documented procedures}
    \emph{The table below indicates the location of the documented procedures for the six activities required by \isoNeufMilleUn{}}
    \begin{center}
  }
  {
    \end{center}
}
  
  
\newenvironment{listeDeProcedures}[1][Activité]{
    \begin{longtable}{|p{0.4\linewidth}|p{0.6\linewidth}|}
      \hline
      \rowcolor[gray]{.8}
      Paragraph of the norm - Activity & Documented procedure\\
      \hline
      \endfirsthead
      \hline
      \rowcolor[gray]{.8}
      Paragraph of the norm - Activity & Documented procedure\\
      \hline
      \endhead
  }
  {
    \end{longtable}
}
  
\newcommand{\uneProcedure}[2]{
  #1 & #2 \\
  \hline
}


\newenvironment{documentsEfficacite}[1][Document]{
    \section*{Documents showing the QMS implementation's effectiveness}
    \emph{The following table indicates the reference documents necessary so as to show the QMS implementation's effectiveness}
    \begin{center}
  }
  {
    \end{center}
}


\newenvironment{listeDeDocuments}[1][Document]{
    \begin{longtable}{|p{0.4\linewidth}|p{0.6\linewidth}|}
      \hline
      \rowcolor[gray]{.8}
      Paragraph of the norm - Document & \unite{}'s referencial\\
      \hline
      \endfirsthead
      \hline
      \rowcolor[gray]{.8}
      Paragraph of the norm - Document & \unite{}'s referencial\\
      \hline
      \endhead
  }
  {
    \end{longtable}
}
  
\newcommand{\unDocument}[2]{
  #1 & #2 \\
  \hline
}



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 
%                                  % 
% Mise en page des pages de gardes %
%                                  % 
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 



\ifthenelse{\boolean{departASI}}{
  \newcommand{\EnteteCouverture}[0]{
    \noindent
    \begin{tabular}[t]{p{3cm}p{13cm}}
      \multirow{6}{3cm}{\flushleft{\includegraphics[width=3cm]{commun/imagesCommunes/logoinsa}}} & \\
      & \LARGE{\textbf{Département \departement{}}} \\
      & Institut National des Sciences Appliquées de Rouen \\
      & Avenue de l'Université - BP 08 - 76801 Saint-Etienne-du-Rouvray Cedex \\
      & Tél : 02 32 95 97 79 - Fax : 02 32 95 97 08 \\
      & Mail : \mailDep{} - Web : \siteDep{} \\
      & \\
      \cline{1-2}
      % \multicolumn{2}{p{16cm}}{\center{\includegraphics[width=4cm]{\cheminINPUTS IMAGES/logoasi}}} \\
    \end{tabular}

    \begin{tabular}[t]{p{8cm}p{8cm}}
      \center{\includegraphics[width=4cm]{asi/imagesAsi/logoASI}} & \center{\includegraphics[height=2cm]{asi/imagesAsi/logoP3}}
    \end{tabular}
    }
}
{}

\ifthenelse{\boolean{departMRIE}}{
  \newcommand{\EnteteCouverture}[0]
  {
    \noindent
    \begin{tabular}[t]{p{3cm}p{13cm}}
      \multirow{6}{3cm}{\flushleft{\includegraphics[width=3cm]{commun/imagesCommunes/logoinsa}}} & \\
      & \LARGE{\textbf{Département \departement{}}} \\
      & Institut National des Sciences Appliquées de Rouen \\
      & Avenue de l'Université - BP 08 - 76801 Saint-Etienne-du-Rouvray Cedex \\
      & Tél : 02 32 95 97 79 - Fax : 02 32 95 97 08 \\
      & Mail : \mailDep{} - Web : \siteDep{} \\
      & \\
      \cline{1-2}
      % \multicolumn{2}{p{16cm}}{\center{\includegraphics[width=4cm]{\cheminINPUTS IMAGES/logoasi}}} \\
    \end{tabular}

    \begin{tabular}[t]{p{8cm}p{8cm}}
      \center{\includegraphics[width=4cm]{mrie/imagesMrie/logomrie}}
    \end{tabular}
  }
}{}


\newcommand{\couverture}{
  \thispagestyle{pageCouverture}
  \begin{picture}(0,0)
    \put(10,-200){\includegraphics[width=161mm]{commun/images/image.png}} %pour mettre une image de fond qui sera recouverte.
    \put(-75,-755){\includegraphics[width=211mm]{commun/images/couverture.pdf}}
    \put(140,-620){
		\begin{minipage}{13cm} 
			\ifthenelse{\boolean{departASI}}{\color{bleuInformatique}}{}
			\ifthenelse{\boolean{departMRIE}}{\color{vertChimie}}{}
	
			\Large \titreGeneralPrive \\
			\textit{\Large \sousTitreGeneralPrive} \\ 
			\textbf{\Large \titreDetaillePrive}
		\end{minipage}
	}
    \put(-65,-600){
    	\begin{minipage}{6.3cm} 
    	\color{grisInsa}
    	\Large \raggedleft \titreAcronymePrive
    	\end{minipage}
    }
    \put(370,-750){
    	\begin{minipage}{5cm}
    	\raggedleft \footnotesize version \versionPrive 
    	\end{minipage}
    }
  \end{picture}
  \newpage
  % Si on fait une version "compacte" on enleve le cleardoublepage ici
  \ifthenelse{\boolean{modeCompacte}}{}{\cleardoublepage}
}


\newcommand{\informationsGenerales}[0]{
  \noindent
  \begin{center}
    \begin{minipage}{18cm}
      \begin{tabular}{lp{8cm}} % {|c|c|c|}
        % \hline % Une ligne sur tout le tableau
        \cline{1-1}
        \textit{\bfseries{Author(s)}} & \textsc{\auteursPrive}\\
        &\\% (pour avoir une ligne vide)
        \cline{1-1}
        \textit{\bfseries{Recipient(s)}} & \destinatairesPrive \\
        &\\% (pour avoir une ligne vide)
        \cline{1-1}
        \textit{\bfseries{Summary}} & \resumePrive \\
        &\\
        \cline{1-1}
        \textit{\bfseries{Theme and key words}} & \motsClesPrive \\
        &\\
        \cline{1-1}
        \textit{\bfseries{Nature of the last modification}} & \natureDerniereModificationPrive \\
        &\\
        \cline{1-1}
        \textit{\bfseries{Reference}} & \referenceVersionPrive , version \versionPrive\\
      \end{tabular}
    \end{minipage}
  \end{center}
  \vspace{3cm}
  \begin{tabular}[h]{p{0.1\linewidth}>{\centering}p{0.6\linewidth}p{0.3\linewidth}}
    & \hfill Copy in controlled diffusion
    &\ifthenelse{\equal{\modeDiffusionControlePrive}{VRAI}}{$\boxtimes$}{$\square$}\\
    & \hfill Copy in uncontrolled diffusion
    &\ifthenelse{\equal{\modeDiffusionControlePrive}{VRAI}}{$\square$}{$\boxtimes$}\\
  \end{tabular}
  \newpage
  \ifthenelse{\boolean{modeCompacte}}{}{\cleardoublepage}
}


% \newlength{\largeurCartouche}
% \newcommand{\includegraphicsAvecCartouche}[5]
% {\setlength{\largeurCartouche}{#1}
%   \centering \footnotesize
%   \begin{tabular}[h]{|p{0.2\largeurCartouche}|p{0.1\largeurCartouche}>{\centering}p{0.4\largeurCartouche}p{0.1\largeurCartouche}|p{0.2\largeurCartouche}|}
%     \hline
%     \multicolumn{5}{|c|}{\includegraphics[width=\largeurCartouche]{#2}}\\
%     \hline    \rowcolor[gray]{.8}
%     N\OE UD: #3 & TITRE: & #4 & & N°: #5\\
%     \hline
%   \end{tabular}
% }

\newcommand{\insererPageExterne}[1]{
  \newpage
  \thispagestyle{empty} \setlength{\unitlength}{1cm}
  \begin{picture}(21,29.7)
    \put(-2.6,1.5){\includegraphics[width=21cm]{#1}}
  \end{picture}
}

\newcommand{\pageQuatriemeCouverture}[0]{
  \newpage
  % \FPupn\result{1 2 +}
  % \FPupn\result{\thepage 2 div 2 * \thepage -}
  % \ifthen{\equal{\result}{3}}{\newpage}
  \thispagestyle{empty}
  \begin{picture}(0,0)
    \put(-75,-755){\includegraphics[width=211mm]{commun/images/couvertureBis.pdf}}
    \put(75, -550){
      \begin{normalsize}
        \begin{minipage}{10cm}
          \begin{tabular}{r}
            \insaRouen\\
            Avenue de l'Université - BP 08\\
            76801 Saint-Etienne-du-Rouvray Cedex\\
            Tél : 02 32 95 97 79\\
            Fax : 02 32 95 97 08\\
            \textit{\siteQualite}\\
            \textit{\siteDep}\\
          \end{tabular}
        \end{minipage}
      \end{normalsize}}
    \put(320, -610){\includegraphics[width=50mm]{asi/images/logoASI.pdf}}
  \end{picture}
}

\newcommand{\annexes}[0]{
  \newpage
  \addcontentsline{toc}{chapter}{Annexes}
  \thispagestyle{fancy}
  \begin{center}
    \begin{minipage}{10cm}
      \vspace{3in}
      \begin{center}
        {\LARGE \bf Annexes}\\
      \end{center}
    \end{minipage}
  \end{center}
  \appendix
  \newpage
}

% \renewcommand{\contentsname}{\ifthenelse{\boolean{modeCompacte}}{}{\cleardoublepage} Table des matières}

\AtBeginDocument{
  % \setmarginsrb{2cm}{1cm}{2cm}{1cm}{1cm}{0.5cm}{0.5cm}{1cm}
  % \pagestyle{fancy} %Style de page par defaut
  % \StylePageNormal
  % \fancyhf{}
  \pagestyle{pageNormale}
}



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Références aux procédures

\newenvironment{referencesProcedures}[1][WBS-Procédures]{
    \begin{longtable}{|p{3.0cm}|p{14.5cm}|p{5cm}|}
      \hline
	\rowcolor[gray]{0.65}
	\textbf{N° WBS} & \textbf{Title process / of the activity / of the task} & \textbf{Procedure reference} \\
      \hline
      \endhead
    }
    {
    \end{longtable}
}

\newcommand{\uneProcedureMaj}[3]{
  \rowcolor[gray]{0.4}
  #1 & #2 & #3 \\
  \hline
}

\newcommand{\uneProcedureSup}[3]{
  \rowcolor[gray]{0.55}
  \indent{} - #1 & #2 & #3 \\
  \hline
}

\newcommand{\uneProcedureMed}[3]{
  \rowcolor[gray]{0.7}
  \indent{} -- #1 & #2 & #3 \\
  \hline
}

\newcommand{\uneProcedureSub}[3]{
  \rowcolor[gray]{0.85}
  \indent{} --- #1 & #2 & #3 \\
  \hline
}

\newcommand{\uneProcedureSubSub}[3]{
  \rowcolor[gray]{1.0}
  \indent{} --- #1 & #2 & #3 \\
  \hline
}

\newenvironment{signaturesVerif}[1][Signatures - Verification, Validation, Approval]{
    \begin{longtable}{|p{0.15\linewidth}|p{0.2\linewidth}|p{0.22\linewidth}|p{0.12\linewidth}|p{0.2\linewidth}|}
      \hline
	\rowcolor[gray]{0.65}
	 & \textbf{Function} & \textbf{Name} & \textbf{Date} & \textbf{Signature} \\
      \hline
      \endhead
    }
    {
    \end{longtable}
}

\newcommand{\uneSignatureVerif}[5]{
  #1 & #2 & #3 & #4 & #5 \\[0.8cm]
  \hline
}

\newcommand{\qualityManager}{Quality Manager}
\newcommand{\picManager}{PIC Manager}
\newcommand{\generalDispositionOfQuality}{General Disposition of Quality}
\newcommand{\carryOutThePIC}{Carry Out the PIC}
