const challenges = [
  {
    id: 1,
    title: 'Portail d’accès restreint',
    tag: 'Auth',
    difficulty: 'Facile',
    description:
      'Un portail interne semble exposer une faiblesse de sécurité. Le système demande un mot de passe, mais l’équipe de sécurité a laissé des indications dans un journal de test local.',
    clues: [
      'Le mot de passe est court et contient un mot connu dans le vocabulaire de la sécurité.',
      'Le mot respecte le format : mot + chiffre.',
      'Le mot de passe est : "password" suivi d’un nombre.'
    ],
    type: 'text',
    answer: 'password123',
    explanation: 'Ce scénario montre pourquoi les mots de passe faibles et courts sont faciles à casser. La bonne pratique est d’utiliser un mot de passe long et unique.'
  },
  {
    id: 2,
    title: 'Validation d’entrée',
    tag: 'Input',
    difficulty: 'Facile',
    description:
      'Une page de recherche a un champ qui affiche directement des données saisies. Un formateur a ajouté un texte de démonstration pour tester la validation côté serveur.',
    clues: [
      'Le danger majeur est l’injection de code HTML ou JavaScript dans un champ de saisie.',
      'On cherche une famille de vulnérabilités liée à des balises de script injectées.',
      'La protection consiste à filtrer, encoder et valider les entrées.'
    ],
    type: 'single-choice',
    options: ['XSS', 'DoS', 'Brute force', 'CSRF'],
    answer: 'XSS',
    explanation: 'L’XSS (Cross-Site Scripting) se produit lorsque des entrées non approuvées sont rendues dans la page sans échapper correctement les caractères.'
  },
  {
    id: 3,
    title: 'Audit des permissions',
    tag: 'Access',
    difficulty: 'Moyen',
    description:
      'Une application de gestion internalise les rôles utilisateurs. Le chef du projet a ajouté un compte de démonstration qui semble avoir plus de droits que prévu.',
    clues: [
      'Le problème vient souvent d’un rôle trop permissif.',
      'Un utilisateur normal ne doit pas pouvoir accéder à des fonctions d’administration.',
      'L’architecture de contrôle d’accès doit être explicite et minimale.'
    ],
    type: 'single-choice',
    options: ['Principe du moindre privilège', 'Compression des données', 'Redirection forcée', 'Utiliser un seul compte'],
    answer: 'Principe du moindre privilège',
    explanation: 'Le principe du moindre privilège limite l’accès aux éléments strictement nécessaires. C’est un fondement clé de la sécurité applicative.'
  },
  {
    id: 4,
    title: 'Protection contre la falsification',
    tag: 'Web',
    difficulty: 'Moyen',
    description:
      'Un site de gestion de demandes envoie une action de paiement via une requête et semble pouvoir être manipulée par un attaquant s’il est mal protégé.',
    clues: [
      'Le risque concerne une action réalisée sans autorisation explicite du navigateur utilisateur.',
      'La protection repose sur l’ajout de jetons dans les formulaires et les requêtes.',
      'Le mécanisme s’appuie sur une valeur non prédictible.'
    ],
    type: 'single-choice',
    options: ['Token CSRF', 'Compression gzip', 'Cache navigateur', 'Authentification HTTP'],
    answer: 'Token CSRF',
    explanation: 'Les tokens CSRF empêchent qu’une requête malveillante soit envoyée depuis un autre site sans l’intention de l’utilisateur connecté.'
  },
  {
    id: 5,
    title: 'Table de correspondance',
    tag: 'Sécu Web',
    difficulty: 'Moyen',
    description:
      'Un responsable security veut vérifier si le développement suit les bons réflexes. Il demande de relier chaque risque à sa bonne protection.',
    clues: [
      'Injection SQL → validation et requêtes paramétrées',
      'Mots de passe faibles → politique de mot de passe et MFA',
      'XSS → échappement des sorties HTML',
      'Fuite de données → chiffrement et contrôle d’accès'
    ],
    type: 'text',
    answer: 'mfa',
    explanation: 'En sécurité, les protections doivent correspondre au risque : validation des entrées, gestion des identités et chiffrement des données sensibles.'
  },
  {
    id: 6,
    title: 'Vulnérabilité de configuration',
    tag: 'Config',
    difficulty: 'Difficile',
    description:
      'Un serveur local de démonstration présente une erreur de configuration visible. Il expose des détails techniques que l’on ne doit pas divulguer en production.',
    clues: [
      'La meilleure pratique est de masquer les erreurs internes ou de les journaliser proprement.',
      'L’exposition d’informations permet à un attaquant de mieux cibler le système.',
      'Les messages d’erreur ne doivent pas révéler d’informations sensibles.'
    ],
    type: 'single-choice',
    options: ['Masquer les détails techniques', 'Rendre les erreurs visibles', 'Supprimer les logs', 'Désactiver le serveur'],
    answer: 'Masquer les détails techniques',
    explanation: 'Les erreurs détaillées peuvent aider un adversaire à identifier les versions, les librairies ou les faiblesses d’un environnement. Il faut minimiser les informations exposées.'
  }
];

let currentIndex = 0;
let score = 0;
let solved = new Set();

const scoreNode = document.getElementById('score');
const missionList = document.getElementById('mission-list');
const challengeCard = document.getElementById('challenge-card');
const tagNode = document.getElementById('tag');
const difficultyNode = document.getElementById('difficulty');
const titleNode = document.getElementById('title');
const descriptionNode = document.getElementById('description');
const cluesNode = document.getElementById('clues');
const answerArea = document.getElementById('answer-area');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const feedbackNode = document.getElementById('feedback');

function renderMissionList() {
  missionList.innerHTML = '';

  challenges.forEach((challenge, index) => {
    const button = document.createElement('button');
    button.className = 'mission-btn' + (index === currentIndex ? ' active' : '');
    button.textContent = `${index + 1}. ${challenge.title}`;
    button.addEventListener('click', () => {
      currentIndex = index;
      renderCurrentChallenge();
    });
    missionList.appendChild(button);
  });
}

function renderCurrentChallenge() {
  const challenge = challenges[currentIndex];
  tagNode.textContent = challenge.tag;
  difficultyNode.textContent = challenge.difficulty;
  titleNode.textContent = challenge.title;
  descriptionNode.textContent = challenge.description;
  cluesNode.innerHTML = challenge.clues.map((clue) => `<div class="clue">${clue}</div>`).join('');
  answerArea.innerHTML = '';
  feedbackNode.className = 'feedback';
  feedbackNode.textContent = '';

  if (challenge.type === 'single-choice') {
    challenge.options.forEach((option) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = option;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.option-btn').forEach((el) => el.classList.remove('selected'));
        btn.classList.add('selected');
      });
      answerArea.appendChild(btn);
    });
  } else {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Votre réponse...';
    input.className = 'text-input';
    input.autocomplete = 'off';
    answerArea.appendChild(input);
  }

  renderMissionList();
}

function getSelectedAnswer() {
  const challenge = challenges[currentIndex];

  if (challenge.type === 'single-choice') {
    const selected = document.querySelector('.option-btn.selected');
    return selected ? selected.textContent.trim() : '';
  }

  const input = document.querySelector('.text-input');
  return input ? input.value.trim().toLowerCase() : '';
}

function showFeedback(isCorrect, message) {
  feedbackNode.className = `feedback ${isCorrect ? 'success' : 'error'}`;
  feedbackNode.textContent = message;
}

function validateAnswer() {
  const challenge = challenges[currentIndex];
  const answer = getSelectedAnswer();

  if (!answer) {
    showFeedback(false, 'Choisissez une réponse avant de valider.');
    return;
  }

  if (answer.toLowerCase() === challenge.answer.toLowerCase()) {
    if (!solved.has(challenge.id)) {
      solved.add(challenge.id);
      score += 10;
      scoreNode.textContent = score;
    }

    showFeedback(true, `Bonne réponse ! ${challenge.explanation}`);
    return;
  }

  showFeedback(false, `Réponse incorrecte. Essaye encore ou passe à une autre mission. ${challenge.explanation}`);
}

submitBtn.addEventListener('click', validateAnswer);
nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % challenges.length;
  renderCurrentChallenge();
});

scoreNode.textContent = score;
renderCurrentChallenge();
