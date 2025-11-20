# 🚀 Démarrage Rapide - Supabase

## 📋 Étapes d'installation

### 1. Exécuter le schéma SQL

1. Connectez-vous à votre [Dashboard Supabase](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor** (icône de base de données)
4. Cliquez sur **New Query**
5. Copiez tout le contenu de `supabase/schema.sql`
6. Collez-le dans l'éditeur
7. Cliquez sur **Run** (ou Ctrl+Enter)

✅ Vous devriez voir "Success. No rows returned" - c'est normal !

### 2. Vérifier les tables

Dans le **Table Editor** :
- ✅ profiles
- ✅ boards
- ✅ board_items
- ✅ tasks
- ✅ comments
- ✅ board_collaborators
- ✅ ai_generations

### 3. Vérifier le Storage

Dans **Storage** :
- ✅ Bucket `media` doit exister
- ✅ Public access activé

### 4. Configurer l'authentification

Dans **Authentication > Providers** :
- ✅ Email activé (par défaut)
- Optionnel : Google, GitHub, etc.

## 💻 Utilisation dans votre code

### Authentification

```typescript
import { useAuth } from '@/lib/supabase'

function MyComponent() {
  const { user, signIn, signOut, loading } = useAuth()

  const handleSignIn = async () => {
    await signIn('user@example.com', 'password')
  }

  if (loading) return <div>Loading...</div>
  if (!user) return <button onClick={handleSignIn}>Sign In</button>

  return (
    <div>
      <p>Welcome {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Boards

```typescript
import { useMyBoards, boards } from '@/lib/supabase'

function BoardsList() {
  const { boards: myBoards, loading } = useMyBoards()

  const createNewBoard = async () => {
    await boards.create('My New Board', 'Board description')
  }

  return (
    <div>
      <button onClick={createNewBoard}>Create Board</button>
      {myBoards.map(board => (
        <div key={board.id}>{board.title}</div>
      ))}
    </div>
  )
}
```

### Board Items (avec temps réel)

```typescript
import { useBoardItems } from '@/lib/supabase'

function BoardCanvas({ boardId }: { boardId: string }) {
  const { items, createItem, updateItem, deleteItem } = useBoardItems(boardId)

  const addImage = async () => {
    await createItem({
      board_id: boardId,
      type: 'image',
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      content: { url: 'https://example.com/image.jpg' }
    })
  }

  return (
    <div>
      {items.map(item => (
        <div key={item.id} style={{ 
          position: 'absolute', 
          left: item.x, 
          top: item.y 
        }}>
          {/* Render item */}
        </div>
      ))}
    </div>
  )
}
```

### Tasks

```typescript
import { useTasks } from '@/lib/supabase'

function TaskBoard({ boardId }: { boardId: string }) {
  const { tasks, createTask, updateTask } = useTasks(boardId)

  const addTask = async () => {
    await createTask({
      board_id: boardId,
      title: 'New Task',
      status: 'backlog',
      priority: 'medium'
    })
  }

  const completeTask = async (taskId: string) => {
    await updateTask(taskId, { 
      status: 'done',
      completed_at: new Date().toISOString()
    })
  }

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <button onClick={() => completeTask(task.id)}>Complete</button>
        </div>
      ))}
    </div>
  )
}
```

### Upload de fichiers

```typescript
import { useFileUpload } from '@/lib/supabase'

function FileUploader() {
  const { uploadFile, uploading, progress } = useFileUpload()

  const handleUpload = async (file: File) => {
    const path = `uploads/${Date.now()}-${file.name}`
    const result = await uploadFile(file, path)
    console.log('File uploaded:', result.publicUrl)
  }

  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
      />
      {uploading && <progress value={progress} max={100} />}
    </div>
  )
}
```

### Commentaires

```typescript
import { useComments } from '@/lib/supabase'

function CommentSection({ boardId }: { boardId: string }) {
  const { comments, createComment, deleteComment } = useComments(boardId)

  const addComment = async (content: string) => {
    await createComment({
      board_id: boardId,
      content
    })
  }

  return (
    <div>
      {comments.map(comment => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          <small>By {comment.user?.email}</small>
        </div>
      ))}
    </div>
  )
}
```

## 🔒 Permissions et RLS

### Vérifier les permissions

```typescript
import { useCanEditBoard, useIsBoardOwner } from '@/lib/supabase'

function BoardActions({ boardId }: { boardId: string }) {
  const isOwner = useIsBoardOwner(boardId)
  const canEdit = useCanEditBoard(boardId)

  return (
    <div>
      {canEdit && <button>Edit Board</button>}
      {isOwner && <button>Delete Board</button>}
    </div>
  )
}
```

### Ajouter un collaborateur

```typescript
import { boards } from '@/lib/supabase'

async function addCollaborator(boardId: string, userEmail: string) {
  // 1. Trouver l'utilisateur par email
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', userEmail)
    .single()

  if (!profiles) throw new Error('User not found')

  // 2. Ajouter comme collaborateur
  await boards.addCollaborator(boardId, profiles.id, 'editor')
}
```

## 🔄 Temps réel

Les hooks `useBoardItems`, `useTasks`, et `useComments` incluent déjà le temps réel !

Les changements sont automatiquement synchronisés entre tous les utilisateurs connectés.

## 🧪 Test rapide

Ouvrez la console de votre navigateur et testez :

```javascript
// Créer un board
const { data } = await supabase.from('boards').insert({ 
  title: 'Test Board',
  owner_id: (await supabase.auth.getUser()).data.user.id
}).select().single()

console.log('Board créé:', data)

// Créer un item
await supabase.from('board_items').insert({
  board_id: data.id,
  type: 'text',
  content: { text: 'Hello World!' }
})
```

## 📚 Ressources

- [Documentation complète](./README.md)
- [Schéma SQL](./schema.sql)
- [Supabase Docs](https://supabase.com/docs)

## 🆘 Problèmes ?

### Erreur "relation does not exist"
➡️ Le schéma SQL n'a pas été exécuté. Retournez à l'étape 1.

### Erreur "permission denied"
➡️ Vérifiez que vous êtes authentifié et que les politiques RLS sont activées.

### Les updates en temps réel ne fonctionnent pas
➡️ Vérifiez que Realtime est activé dans Database > Replication.

### Upload échoue
➡️ Vérifiez que le bucket `media` existe et que les politiques de storage sont configurées.
