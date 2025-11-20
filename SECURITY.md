# 🔒 Politique de Sécurité

## Versions Supportées

Nous publions des mises à jour de sécurité pour les versions suivantes :

| Version | Supportée          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Signaler une Vulnérabilité

La sécurité de Elite Visuals est une priorité. Si vous découvrez une vulnérabilité de sécurité, merci de nous la signaler de manière responsable.

### 📧 Comment Signaler

**NE CRÉEZ PAS** d'issue publique pour les vulnérabilités de sécurité.

À la place, envoyez un email à : **security@elitevisuals.com**

Incluez dans votre rapport :

1. **Description** : Description détaillée de la vulnérabilité
2. **Impact** : Impact potentiel et scénarios d'exploitation
3. **Reproduction** : Étapes pour reproduire le problème
4. **Version** : Version affectée de Elite Visuals
5. **Environnement** : Détails de l'environnement (OS, navigateur, etc.)
6. **Suggestions** : Suggestions de correction si vous en avez

### 🕐 Délai de Réponse

- **Accusé de réception** : Dans les 48 heures
- **Évaluation initiale** : Dans les 7 jours
- **Mise à jour de statut** : Toutes les 2 semaines
- **Correction** : Selon la sévérité (voir ci-dessous)

### 🎯 Sévérité et Délais de Correction

| Sévérité | Description | Délai de Correction |
|----------|-------------|---------------------|
| **Critique** | Exploitation à distance sans authentification | 1-7 jours |
| **Haute** | Exploitation nécessitant une authentification | 7-30 jours |
| **Moyenne** | Exploitation limitée ou conditions spécifiques | 30-90 jours |
| **Basse** | Impact minimal ou théorique | 90+ jours |

### 🏆 Programme de Reconnaissance

Nous reconnaissons et remercions les chercheurs en sécurité qui signalent des vulnérabilités de manière responsable :

- Mention dans le CHANGELOG et les notes de version
- Crédit dans le fichier SECURITY.md
- Badge "Security Researcher" sur notre Discord (si applicable)

### ⚠️ Divulgation Responsable

Nous vous demandons de :

1. **Ne pas divulguer** la vulnérabilité publiquement avant que nous ayons publié un correctif
2. **Ne pas exploiter** la vulnérabilité au-delà de ce qui est nécessaire pour la démonstration
3. **Nous donner un délai raisonnable** pour corriger le problème avant toute divulgation publique
4. **Agir de bonne foi** pour éviter les violations de confidentialité, la destruction de données, ou l'interruption de service

### 🛡️ Périmètre

#### Dans le Périmètre

- Vulnérabilités dans le code source de Elite Visuals
- Problèmes d'authentification et d'autorisation
- Injection SQL, XSS, CSRF
- Exposition de données sensibles
- Problèmes de configuration de sécurité
- Vulnérabilités dans les dépendances critiques

#### Hors Périmètre

- Attaques de phishing ou d'ingénierie sociale
- Attaques DDoS
- Vulnérabilités dans les services tiers (Supabase, Vercel, etc.)
- Problèmes déjà connus et documentés
- Vulnérabilités nécessitant un accès physique à l'appareil

### 📋 Exemples de Vulnérabilités

#### Haute Priorité

- Contournement d'authentification
- Élévation de privilèges
- Injection SQL
- XSS stocké
- Exposition de clés API ou secrets
- Accès non autorisé aux données utilisateur

#### Priorité Moyenne

- XSS réfléchi
- CSRF sur actions sensibles
- Divulgation d'informations sensibles
- Problèmes de validation des entrées

#### Priorité Basse

- Problèmes de configuration mineurs
- Divulgation d'informations non sensibles
- Problèmes d'interface utilisateur sans impact sécurité

### 🔐 Bonnes Pratiques de Sécurité

Pour les utilisateurs et développeurs :

#### Clés API et Secrets

- **Ne jamais** commiter de clés API dans le code
- Utiliser `.env.local` pour les secrets (jamais versionné)
- Rotation régulière des clés API
- Utiliser des clés différentes pour dev/staging/production

#### Authentification

- Utiliser l'authentification Supabase
- Activer l'authentification multi-facteurs (MFA) quand disponible
- Utiliser des mots de passe forts
- Ne jamais partager les credentials

#### Données Utilisateur

- Chiffrement des données sensibles au repos
- Utilisation de HTTPS pour toutes les communications
- Respect du RGPD et des lois sur la protection des données
- Minimisation de la collecte de données

#### Dépendances

- Mise à jour régulière des dépendances
- Audit de sécurité avec `npm audit`
- Utilisation de dépendances maintenues et fiables
- Revue des nouvelles dépendances avant ajout

### 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)

### 🙏 Remerciements

Nous remercions les chercheurs en sécurité suivants pour leurs contributions :

<!-- Liste des contributeurs sécurité -->
- *Aucun rapport de sécurité à ce jour*

---

**Dernière mise à jour** : 19 novembre 2024

Pour toute question concernant cette politique, contactez : security@elitevisuals.com
