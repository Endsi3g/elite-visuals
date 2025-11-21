# Backup Information

## Date du backup
**20 novembre 2025 - 18:25**

## Backups créés

### 1. Copie complète du répertoire
- **Emplacement**: `C:\Users\quebe\Downloads\elite-visuals-backup-20251120_182048`
- **Type**: Copie complète incluant tous les fichiers
- **Contenu**: Tous les fichiers source, node_modules, .next, .git

### 2. Archive compressée (source uniquement)
- **Emplacement**: `C:\Users\quebe\Downloads\elite-visuals-backup-20251120_182525.zip`
- **Type**: Archive ZIP optimisée
- **Taille**: 0.34 MB
- **Contenu**: Code source uniquement (exclut node_modules, .next, .git)

### 3. Tag Git
- **Tag**: `backup-20251120-182536`
- **Description**: Backup automatique du 20251120-182536
- **Commande pour restaurer**: `git checkout backup-20251120-182536`

## Restauration

### Depuis l'archive ZIP
```powershell
Expand-Archive -Path "C:\Users\quebe\Downloads\elite-visuals-backup-20251120_182525.zip" -DestinationPath "C:\chemin\de\restauration"
cd "C:\chemin\de\restauration"
npm install
```

### Depuis le tag Git
```powershell
git checkout backup-20251120-182536
npm install
```

### Depuis la copie complète
```powershell
# Copier simplement le dossier
Copy-Item -Path "C:\Users\quebe\Downloads\elite-visuals-backup-20251120_182048" -Destination "C:\nouveau\chemin" -Recurse
```

## État du projet au moment du backup
- **Branche**: main
- **État**: Working tree clean (aucune modification non commitée)
- **Derniers commits**: Voir `git log`

## Notes
- L'archive ZIP exclut les dépendances (node_modules) et les builds (.next) pour réduire la taille
- Le tag Git permet de revenir à cette version exacte à tout moment
- La copie complète inclut tout et peut être utilisée immédiatement

## Prochains backups
Pour créer un nouveau backup, exécutez:
```powershell
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$archiveName = "elite-visuals-backup-$timestamp.zip"
Compress-Archive -Path ".\*" -DestinationPath "C:\Users\quebe\Downloads\$archiveName" -CompressionLevel Optimal
git tag -a "backup-$timestamp" -m "Backup du $timestamp"
```
