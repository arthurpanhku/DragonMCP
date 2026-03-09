<div align="center">
  <img src="assets/logo.png" alt="DragonMCP Logo" width="200">

  # DragonMCP

  **Le Centre Nerveux des Agents de Vie Locale Chinois**

  [English](README.md) | [简体中文](README_zh-CN.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Français](README_fr.md) | [Deutsch](README_de.md)

  Laissez Claude / DeepSeek / Qwen commander directement vos plats à emporter, appeler un DiDi, vérifier les billets de train à grande vitesse et payer vos factures de services publics.

  [Exigences Produit (PRD)](.trae/documents/dragon_mcp_prd.md) • [Architecture](.trae/documents/dragon_mcp_technical_architecture.md) • [Contribuer](#-contributing--contribuer)

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
  [![MCP](https://img.shields.io/badge/Protocol-MCP-green.svg)](https://modelcontextprotocol.io/)
  [![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/arthurpanhku/DragonMCP/pulls)
</div>

---

## 🌟 Qu'est-ce que DragonMCP ?

DragonMCP est un serveur Model Context Protocol (MCP) conçu pour combler le fossé entre les agents IA et les services de vie locale en **Grande Chine (Chine continentale, Hong Kong) et en Asie**.

Il vise à résoudre le problème du "dernier kilomètre" entre les agents IA et les services du monde réel.

---

## 🔥 Démo en Direct : Horaires MTR en Temps Réel

Nous avons implémenté l'**Outil de Requête MTR (Mass Transit Railway)** comme notre premier MVP. Les agents IA peuvent désormais récupérer les horaires de train en temps réel directement depuis l'API ouverte de MTR.

**Scénario**:
> Utilisateur : "Quand est le prochain train d'Admiralty à Central ?"

**Réponse de l'Agent**:
> "Next Island Line train from Admiralty to Central (towards Kennedy Town):
> - Arriving in: 2 min(s) (10:30:00)
> - Subsequent trains: 5 min(s) (10:33:00)"

*(Essayez-le vous-même en connectant DragonMCP à votre client MCP !)*

---

## 🛠️ Services Supportés (Bêta)

Nous étendons activement notre support pour les services locaux. Voici les interfaces actuellement intégrées (certaines sont des mocks/placeholders pour le développement) :

| Catégorie     | Service          | Nom de l'outil           | Description                                              | Statut |
| :------------ | :--------------- | :----------------------- | :------------------------------------------------------- | :----- |
| **Voyage**    | **MTR (HK)**     | `search_mtr_schedule`    | Horaires de train en temps réel (Ligne Island/Tsuen Wan) | ✅ Live |
|               | **Amap (Gaode)** | `amap_search_poi`        | Recherche de POI (Restaurants, Hôtels, etc.)             | ✅ Live |
|               | **Amap (Gaode)** | `amap_walking_direction` | Planification d'itinéraire à pied                        | ✅ Live |
|               | **DiDi**         | `book_taxi_didi`         | Estimation du prix et réservation de course              | 🚧 Mock |
| **Paiement**  | **WeChat Pay**   | `wechat_pay_create`      | Créer une commande de paiement                           | 🚧 Mock |
|               | **Alipay**       | `alipay_pay_create`      | Créer une commande de paiement                           | 🚧 Mock |
| **Lifestyle** | **Meituan**      | `meituan_search_food`    | Recherche de livraison de nourriture                     | 🚧 Mock |
| **Shopping**  | **Taobao**       | `taobao_search_product`  | Recherche de produits                                    | 🚧 Mock |

---

## 🏗️ Architecture

DragonMCP agit comme un middleware entre les agents IA et diverses API de services locaux.

```mermaid
graph TD
    A[AI Agent Client] -->|MCP Protocol| B[DragonMCP Server]
    B --> C[Service Router]
    
    subgraph "Service Modules"
        C --> D[Payment Service]
        C --> E[Travel Service]
        C --> F[Lifestyle Service]
        C --> G[Gov Service]
    end
    
    subgraph "External APIs"
        D -.-> H[WeChat/Alipay]
        E -.-> I[MTR/Amap/Didi]
        F -.-> J[Meituan/Taobao]
        G -.-> K[HK Gov/Mainland Gov]
    end
```

Pour plus de détails, veuillez vous référer au [Document d'Architecture Technique](.trae/documents/dragon_mcp_technical_architecture.md).

---

## 🗺️ Feuille de Route et Fonctionnalités

### Phase 1 : MVP (Actuel)
- [x] **Framework Principal**: Configuration Express + MCP SDK + TypeScript.
- [x] **Voyage (MTR)**: Requête d'horaires en temps réel pour Island Line & Tsuen Wan Line.
- [x] **Voyage (Amap)**: Recherche de POI et itinéraires à pied.
- [x] **Mocks de Service**: Structure de base pour WeChat/Alipay/DiDi/Meituan/Taobao.
- [ ] **Livraison de Nourriture (Démo)**: Simuler le processus de commande (Recherche Boutique -> Menu -> Panier).
- [ ] **Configuration de Base**: Variables d'environnement & structure du projet.

### Phase 2 : Expansion
- [ ] **Intégration de Paiement**: WeChat Pay / Alipay (Sandbox/Génération de QR Code).
- [ ] **Plus de Transports**: Vérification de billets de train à grande vitesse (12306), estimation Didi/Uber.
- [ ] **E-commerce**: Agrégation de recherche de produits (Taobao/JD).
- [ ] **Support Multi-région**: Changer de contexte entre Chine continentale / HK / SG.

### Phase 3 : Écosystème
- [ ] **Système de Plugins**: Permettre à la communauté de contribuer des outils de service individuels.
- [ ] **Authentification Utilisateur**: Gestion sécurisée des jetons utilisateur pour les services personnels.

---

## 🚀 Commencer

### Prérequis
*   Node.js >= 18
*   npm ou yarn

### Installation

1.  Cloner le dépôt :
    ```bash
    git clone https://github.com/arthurpanhku/DragonMCP.git
    cd DragonMCP
    ```

2.  Installer les dépendances :
    ```bash
    npm install
    ```

3.  Configurer les variables d'environnement :
    ```bash
    cp .env.example .env
    # Éditer .env (AMAP_API_KEY requis pour les services de cartographie)
    ```

### Lancer le Serveur

Démarrer le serveur de développement avec support SSE :

```bash
npm run dev
```

Le serveur démarrera à `http://localhost:3000`.
Point de terminaison SSE : `http://localhost:3000/mcp/sse`

### Se Connecter à Claude Desktop

Ajoutez ce qui suit à votre `claude_desktop_config.json` :

```json
{
  "mcpServers": {
    "DragonMCP": {
      "command": "node",
      "args": ["/path/to/DragonMCP/dist/server.js"], 
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```
*(Note : Pour le développement local, vous devrez peut-être construire d'abord ou pointer vers le wrapper ts-node)*

---

## 🧪 Tests

Exécuter les tests unitaires et d'intégration :

```bash
# Activer les modules VM expérimentaux pour Jest (support ESM)
NODE_OPTIONS="$NODE_OPTIONS --experimental-vm-modules" npm test
```

---

## 🤝 Contribuer

Nous accueillons toutes les contributions ! Que vous soyez développeur, designer ou penseur produit.

### Nous avons besoin d'aide avec :
1.  **Scripts Playwright**: Simuler les flux web des applications de livraison de nourriture (Meituan/Ele.me).
2.  **Plus de Lignes MTR**: Ajouter des données de station pour East Rail Line, Tuen Ma Line, etc.
3.  **Intégration API Réelle**: Remplacer les mocks par de vraies API pour WeChat/Alipay/DiDi.

Voir [CONTRIBUTING.md](CONTRIBUTING.md) (Bientôt disponible) pour plus de détails.

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
