# 🦙 Configuration Ollama - LLM Open Source

Elite Visuals utilise maintenant **Ollama** pour les LLM open source au lieu d'OpenAI.

## 🎯 Avantages

- ✅ **100% Open Source** : Llama 3, Mistral, CodeLlama, etc.
- ✅ **Gratuit** : Pas de coûts API
- ✅ **Local** : Données privées, pas d'envoi externe
- ✅ **Rapide** : Exécution locale sur GPU/CPU
- ✅ **Fallback HuggingFace** : Si Ollama indisponible

## 📦 Installation Ollama

### Windows

1. **Télécharger Ollama**
   ```powershell
   # Télécharger depuis https://ollama.ai/download
   # Ou via winget
   winget install Ollama.Ollama
   ```

2. **Vérifier l'installation**
   ```powershell
   ollama --version
   ```

3. **Démarrer le service**
   ```powershell
   # Ollama démarre automatiquement en arrière-plan
   # Par défaut sur http://localhost:11434
   ```

### macOS

```bash
# Via Homebrew
brew install ollama

# Démarrer le service
ollama serve
```

### Linux

```bash
# Installation
curl -fsSL https://ollama.ai/install.sh | sh

# Démarrer le service
ollama serve
```

## 🤖 Modèles Disponibles

### Modèles Recommandés pour Elite Visuals

#### 1. **Llama 3** (Recommandé)
```bash
ollama pull llama3
```
- **Taille** : 4.7 GB
- **Usage** : Génération de texte général, scripts, briefs
- **Performance** : Excellent en français

#### 2. **Mistral**
```bash
ollama pull mistral
```
- **Taille** : 4.1 GB
- **Usage** : Créativité, storytelling
- **Performance** : Très bon en français

#### 3. **LLaVA** (Vision)
```bash
ollama pull llava
```
- **Taille** : 4.7 GB
- **Usage** : Analyse d'images
- **Performance** : Multimodal (texte + image)

#### 4. **CodeLlama**
```bash
ollama pull codellama
```
- **Taille** : 3.8 GB
- **Usage** : Génération de code
- **Performance** : Spécialisé code

### Autres Modèles

```bash
# Modèles plus petits (plus rapides)
ollama pull llama3:8b      # Version 8B paramètres
ollama pull mistral:7b     # Version 7B paramètres

# Modèles plus grands (meilleure qualité)
ollama pull llama3:70b     # Version 70B paramètres (nécessite 40GB+ RAM)
ollama pull mixtral:8x7b   # Mixture of Experts
```

## ⚙️ Configuration Elite Visuals

### Variables d'Environnement

Éditer `.env.local` :

```env
# Ollama Local
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# HuggingFace (Fallback optionnel)
HUGGINGFACE_API_KEY=hf_your_api_key
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.2
```

### Changer de Modèle

```env
# Pour Mistral
OLLAMA_MODEL=mistral

# Pour LLaVA (analyse d'images)
OLLAMA_MODEL=llava

# Pour CodeLlama
OLLAMA_MODEL=codellama
```

## 🚀 Utilisation

### Démarrer Ollama

```bash
# Le service démarre automatiquement
# Ou manuellement :
ollama serve
```

### Tester Ollama

```bash
# Test simple
ollama run llama3 "Bonjour, écris un script publicitaire de 30 secondes"

# Test avec LLaVA (vision)
ollama run llava "Analyse cette image"
```

### Vérifier le Service

```bash
# Vérifier que le service tourne
curl http://localhost:11434/api/tags
```

## 🔄 Fallback HuggingFace

Si Ollama n'est pas disponible, Elite Visuals utilise automatiquement HuggingFace Inference API.

### Obtenir une Clé HuggingFace

1. Créer un compte sur [HuggingFace](https://huggingface.co/)
2. Aller dans Settings > Access Tokens
3. Créer un nouveau token (Read access)
4. Ajouter dans `.env.local` :
   ```env
   HUGGINGFACE_API_KEY=hf_your_token_here
   ```

### Modèles HuggingFace Recommandés

```env
# Mistral 7B (Recommandé)
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.2

# Llama 2
HF_MODEL=meta-llama/Llama-2-7b-chat-hf

# Zephyr
HF_MODEL=HuggingFaceH4/zephyr-7b-beta
```

## 📊 Comparaison des Options

| Option | Coût | Vitesse | Qualité | Privé | Setup |
|--------|------|---------|---------|-------|-------|
| **Ollama Local** | Gratuit | Rapide | Très bon | ✅ | Moyen |
| **HuggingFace API** | Gratuit* | Moyen | Bon | ⚠️ | Facile |
| **OpenAI (ancien)** | Payant | Rapide | Excellent | ❌ | Facile |

*HuggingFace gratuit avec rate limits

## 🛠️ Dépannage

### Ollama ne démarre pas

```bash
# Vérifier le statut
ollama list

# Redémarrer le service
# Windows : Redémarrer l'application Ollama
# macOS/Linux :
pkill ollama
ollama serve
```

### Port déjà utilisé

```bash
# Changer le port
OLLAMA_HOST=0.0.0.0:11435 ollama serve

# Mettre à jour .env.local
OLLAMA_BASE_URL=http://localhost:11435
```

### Modèle trop lent

```bash
# Utiliser un modèle plus petit
ollama pull llama3:8b
# Puis dans .env.local
OLLAMA_MODEL=llama3:8b
```

### Erreur de mémoire

```bash
# Modèles 7B-13B : 8GB RAM minimum
# Modèles 70B+ : 40GB+ RAM minimum

# Solution : Utiliser un modèle plus petit ou HuggingFace
```

## 🎨 Fonctionnalités Elite Visuals

### Génération de Scripts

```typescript
import { generateScript } from "@/lib/ai/ollama"

const result = await generateScript(
  "Crée un script de 30 secondes pour une pub de parfum"
)
```

### Analyse d'Images

```typescript
import { analyzeMedia } from "@/lib/ai/ollama"

const result = await analyzeMedia("image", imageBase64)
```

### Génération de Briefs

```typescript
import { generateBrief } from "@/lib/ai/ollama"

const result = await generateBrief([
  "Campagne pour une marque de luxe",
  "Cible : 25-45 ans",
  "Budget : 50k€"
])
```

## 📚 Ressources

- [Ollama Documentation](https://github.com/ollama/ollama)
- [Modèles Ollama](https://ollama.ai/library)
- [HuggingFace Models](https://huggingface.co/models)
- [Llama 3 Guide](https://ai.meta.com/llama/)

## 🔐 Sécurité & Confidentialité

### Avantages Ollama Local

- ✅ Données restent sur votre machine
- ✅ Pas d'envoi vers des serveurs externes
- ✅ Conforme RGPD
- ✅ Pas de logs externes

### HuggingFace API

- ⚠️ Données envoyées à HuggingFace
- ⚠️ Soumis aux conditions d'utilisation HF
- ✅ Chiffrement HTTPS
- ✅ Pas de stockage permanent (selon modèle)

## 🎯 Recommandations

### Pour Développement

```env
OLLAMA_MODEL=llama3:8b  # Plus rapide
```

### Pour Production

```env
OLLAMA_MODEL=llama3     # Meilleure qualité
# + HuggingFace en fallback
HUGGINGFACE_API_KEY=hf_xxx
```

### Pour Analyse d'Images

```env
OLLAMA_MODEL=llava
```

---

**Migration réussie d'OpenAI vers Ollama** ✅  
**100% Open Source** 🦙  
**Coût : 0€** 💰
