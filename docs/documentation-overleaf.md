# Documentation AFRISTORY pour Overleaf

Copie le code LaTeX ci-dessous dans un projet Overleaf pour générer une documentation claire et professionnelle sur AFRISTORY.

```latex
\documentclass[11pt,a4paper]{article}

\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[french]{babel}
\usepackage{lmodern}
\usepackage{geometry}
\usepackage{hyperref}
\usepackage{tabularx}
\usepackage{array}
\usepackage{enumitem}
\usepackage{xcolor}
\usepackage{longtable}
\usepackage{titlesec}
\usepackage{setspace}

\geometry{margin=2.5cm}
\setstretch{1.12}
\setlist[itemize]{leftmargin=1.4cm}
\setlist[enumerate]{leftmargin=1.6cm}

\definecolor{AfriOrange}{HTML}{FF6B00}
\definecolor{AfriNavy}{HTML}{0A1128}
\definecolor{AfriGold}{HTML}{FFC800}
\definecolor{AfriGreen}{HTML}{00A859}
\definecolor{AfriGray}{HTML}{5F6B7D}
\definecolor{AfriLight}{HTML}{F7F9FC}

\hypersetup{
  colorlinks=true,
  linkcolor=AfriOrange,
  urlcolor=AfriOrange,
  citecolor=AfriGreen,
  pdftitle={AFRISTORY - Documentation fonctionnelle},
  pdfauthor={AFRISTORY},
  pdfsubject={Documentation de la plateforme AFRISTORY}
}

\titleformat{\section}
  {\large\bfseries\color{AfriNavy}}
  {\thesection}{0.75em}{}
\titleformat{\subsection}
  {\normalsize\bfseries\color{AfriNavy}}
  {\thesubsection}{0.75em}{}

\title{\Huge\bfseries AFRISTORY\\[0.25cm]\Large Documentation fonctionnelle, technique et perspectives}
\author{Projet PWA social, culturel et sportif autour des JOJ Dakar 2026}
\date{\today}

\begin{document}

\begin{titlepage}
  \centering
  \vspace*{2cm}
  {\Huge\bfseries\color{AfriNavy} AFRISTORY\par}
  \vspace{0.6cm}
  {\Large\color{AfriOrange} Documentation fonctionnelle et technique\par}
  \vspace{1.5cm}
  {\large Plateforme sociale, culturelle et sportive autour des JOJ Dakar 2026\par}
  \vspace{0.6cm}
  {\large PWA installable, mobile-first et connectée à une base PostgreSQL\par}
  \vfill
  \begin{tabular}{>{\bfseries}p{4.3cm}p{8cm}}
    Projet & AFRISTORY \\
    Type & Application Web Progressive (PWA) \\
    Technologie & Angular, Node.js, Express, PostgreSQL \\
    Thématique & Sport, culture, communauté et engagement \\
  \end{tabular}
  \vfill
\end{titlepage}

\tableofcontents
\newpage

\section{Présentation générale}

AFRISTORY est une plateforme numérique pensée comme un réseau social panafricain centré sur les JOJ Dakar 2026. L'application rassemble dans un même espace le contenu sportif, les histoires de la communauté, les contenus culturels, les récompenses et les lieux à découvrir. Elle a été conçue pour fonctionner d'abord sur mobile, avec une expérience fluide, intuitive et installable comme une vraie application.

L'objectif principal de la plateforme est simple: offrir un espace unique où les utilisateurs peuvent suivre les compétitions, découvrir la culture africaine, publier des contenus, gagner des points et explorer Dakar et les sites liés à l'événement.

\subsection{Ce que fait la plateforme}

AFRISTORY permet de:
\begin{itemize}
  \item consulter un fil social dynamique;
  \item publier du texte, des images et des vidéos;
  \item suivre des événements sportifs en temps réel ou en mode démonstration;
  \item découvrir des contenus culturels et des lieux à visiter;
  \item gagner des points, des badges et suivre sa progression;
  \item installer l'application sur l'écran d'accueil du téléphone ou du navigateur;
  \item continuer à consulter une partie des contenus même hors ligne grâce au cache PWA.
\end{itemize}

\section{Explication claire de la plateforme}

AFRISTORY n'est pas seulement une vitrine d'informations. C'est une expérience communautaire qui associe:
\begin{itemize}
  \item \textbf{le sport}, via le suivi des JOJ et des compétitions;
  \item \textbf{la culture}, avec des contenus sur les pays, les traditions, les lieux et les créations africaines;
  \item \textbf{la communauté}, à travers les publications, les commentaires et les interactions;
  \item \textbf{la gamification}, avec un système de points, de missions et de récompenses;
  \item \textbf{la mobilité}, avec une interface pensée pour le téléphone avant tout.
\end{itemize}

Le produit vise à rendre les informations locales et événementielles plus vivantes, plus humaines et plus engageantes. Un utilisateur peut suivre l'actualité sportive, partager une photo, commenter un post, explorer un lieu culturel, consulter son profil et voir ses points évoluer dans la même application.

\section{Fonctionnalités disponibles}

\subsection{Accueil et fil social}

La page d'accueil joue le rôle de tableau de bord principal. Elle met en avant:
\begin{itemize}
  \item un hero visuel dynamique avec fond vidéo;
  \item les tendances du moment;
  \item les statistiques principales de la plateforme;
  \item le profil utilisateur;
  \item un composeur de publication;
  \item le fil des publications de la communauté.
\end{itemize}

Le fil social permet de:
\begin{itemize}
  \item publier un message;
  \item ajouter une image ou une vidéo;
  \item liker un contenu;
  \item commenter une publication;
  \item partager un post;
  \item conserver le contenu localement pour le hors ligne.
\end{itemize}

\subsection{Stories}

La section stories propose un défilement horizontal inspiré des réseaux sociaux modernes. Elle met en avant des cartes courtes avec:
\begin{itemize}
  \item une image;
  \item un nom;
  \item un pays;
  \item un indicateur de statut ou de contexte.
\end{itemize}

\subsection{Sport}

La page sport centralise les informations sur les événements et les résultats liés aux JOJ. Elle met en avant:
\begin{itemize}
  \item les matchs ou épreuves en cours;
  \item les scores et les statuts;
  \item les athlètes importants;
  \item le classement des médailles;
  \item les moments forts de la compétition.
\end{itemize}

\subsection{Culture}

La page culture valorise le patrimoine africain et les contenus éditoriaux liés aux pays, aux traditions, aux arts et aux expériences locales. Elle permet de:
\begin{itemize}
  \item découvrir des cartes culturelles enrichies;
  \item lire des contenus visuels;
  \item relier sport et culture dans une seule interface;
  \item mettre en avant l'identité continentale de la plateforme.
\end{itemize}

\subsection{Explorer}

La page explorer sert à découvrir Dakar et les lieux utiles autour de l'événement. Elle met en avant:
\begin{itemize}
  \item des lieux à visiter;
  \item des espaces culturels;
  \item des points de mobilité;
  \item des repères géographiques ou événementiels;
  \item des recommandations pour mieux vivre l'expérience JOJ.
\end{itemize}

\subsection{Récompenses}

La page récompenses introduit un système de progression et de motivation. L'utilisateur peut:
\begin{itemize}
  \item accumuler des points;
  \item suivre des missions;
  \item débloquer des badges;
  \item consulter des offres partenaires;
  \item mesurer sa régularité et son engagement.
\end{itemize}

\subsection{Profil}

Le profil utilisateur permet de regrouper les informations personnelles et sociales:
\begin{itemize}
  \item photo de profil;
  \item nom et identifiant;
  \item bio;
  \item pays;
  \item points;
  \item abonnés;
  \item badges gagnés.
\end{itemize}

\subsection{Mode PWA et hors ligne}

AFRISTORY est installable comme une application. L'utilisateur peut:
\begin{itemize}
  \item l'ajouter à l'écran d'accueil;
  \item l'ouvrir en plein écran;
  \item profiter d'un comportement proche d'une application native;
  \item consulter certains contenus même sans connexion.
\end{itemize}

\section{Parcours utilisateur}

Le parcours classique d'un utilisateur est le suivant:
\begin{enumerate}
  \item l'utilisateur ouvre la plateforme;
  \item il consulte la page d'accueil et le fil social;
  \item il explore les sections sport, culture et exploration;
  \item il crée un compte ou se connecte;
  \item il publie du contenu, interagit et gagne des points;
  \item il installe l'application sur son téléphone s'il le souhaite;
  \item il revient régulièrement pour suivre l'activité et progresser.
\end{enumerate}

\section{Architecture fonctionnelle}

\subsection{Frontend}

Le frontend est développé en Angular et constitue l'interface principale de l'application. Il est organisé autour de composants réutilisables et de pages thématiques. L'expérience a été pensée en mobile first, avec:
\begin{itemize}
  \item un dock de navigation sur mobile;
  \item une navigation plus classique sur desktop;
  \item des cartes visuelles adaptées aux petits écrans;
  \item des composants interactifs et lisibles;
  \item une identité graphique marquée.
\end{itemize}

\subsection{Backend}

Le backend repose sur Node.js et Express. Il gère:
\begin{itemize}
  \item l'authentification;
  \item la génération et la vérification des jetons JWT;
  \item l'accès aux données;
  \item les mutations de contenu;
  \item l'initialisation des données de démonstration.
\end{itemize}

\subsection{Base de données}

La plateforme s'appuie sur PostgreSQL. La base contient les utilisateurs, les contenus, les récompenses et les différentes données nécessaires au fonctionnement de la plateforme. Une phase de seed permet de charger beaucoup de contenus pour que l'application soit immédiatement exploitable et démonstrative.

\subsection{PWA et cache}

AFRISTORY utilise un service worker pour:
\begin{itemize}
  \item mettre en cache les ressources nécessaires;
  \item accélérer l'ouverture;
  \item améliorer l'expérience hors ligne;
  \item permettre une installation fluide en tant qu'application.
\end{itemize}

\section{Identité visuelle et expérience}

L'interface repose sur une palette fortement identitaire:
\begin{itemize}
  \item orange pour l'énergie et l'action;
  \item navy pour la confiance et la lisibilité;
  \item gold pour l'accent et la lumière;
  \item green pour la croissance et le mouvement.
\end{itemize}

L'expérience a été pensée pour être:
\begin{itemize}
  \item moderne;
  \item lisible;
  \item intuitive;
  \item accessible;
  \item cohérente sur mobile, tablette et desktop.
\end{itemize}

\section{Perspectives d'évolution}

AFRISTORY peut évoluer vers plusieurs axes:
\begin{itemize}
  \item \textbf{Temps réel}: notifications en direct, live scores et flux instantané.
  \item \textbf{Modération}: validation automatique des contenus et anti-spam.
  \item \textbf{Géolocalisation}: carte des lieux et itinéraires pour les visiteurs.
  \item \textbf{Messages privés}: échanges entre utilisateurs et communautés.
  \item \textbf{Push notifications}: alertes pour les événements, les commentaires et les missions.
  \item \textbf{Multilingue}: français, anglais et autres langues africaines.
  \item \textbf{Statistiques avancées}: tableau de bord d'activité et d'engagement.
  \item \textbf{Application native}: encapsulation de la PWA pour Android et iOS.
  \item \textbf{Intelligence éditoriale}: recommandations personnalisées selon les centres d'intérêt.
\end{itemize}

\section{Conclusion}

AFRISTORY est une plateforme sociale et culturelle conçue pour accompagner les JOJ Dakar 2026 tout en valorisant la jeunesse, le sport, la culture africaine et la participation communautaire. Son intérêt principal réside dans sa capacité à réunir plusieurs expériences dans une seule application: suivre, publier, explorer, progresser et installer l'application comme un vrai produit mobile moderne.

L'application a donc une vocation à la fois informative, communautaire, événementielle et évolutive. Elle peut devenir un espace de référence pour raconter l'Afrique en mouvement, à travers le sport, la culture et les usages numériques contemporains.

\end{document}
```
