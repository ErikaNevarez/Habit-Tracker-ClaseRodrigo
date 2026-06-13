# CONTINUAR.md — Cómo sostener el build

Prerequisito: todos los ítems de `BUILD-READY.md` marcados.

---

## Primer comando

```bash
git checkout develop && git checkout -b feat/t-01-init-nextjs
```

---

## Loop por tarea (una tarea = una rama = un commit)

```
1. git checkout develop
2. git checkout -b feat/t-XX-<nombre-corto>
3. Invocar al agente implementer → tarea T-XX de plan.md
   - El implementer resume, lista archivos, ESPERA aprobación.
   - Aprobar → el implementer escribe el código.
   - El implementer propone el mensaje de commit (no lo ejecuta).
4. Invocar al agente reviewer → revisar el output de T-XX.
   - Si veredicto es RECHAZADO: implementer corrige, reviewer revisa de nuevo.
   - Si veredicto es APROBADO: continuar.
5. git add <archivos relevantes>
   git commit -m "feat(<scope>): <descripción>"   ← mensaje propuesto por implementer
6. Actualizar plan.md: marcar T-XX como [x].
   git add plan.md && git commit -m "chore: marcar T-XX como completada"
7. git checkout develop && git merge --no-ff feat/t-XX-<nombre-corto>
8. git push origin develop
9. Volver al paso 1 con la siguiente tarea desbloqueada.
```

---

## Si el implementer se atora dos veces en la misma tarea

1. El implementer declara el bloqueo con el error exacto.
2. Resuelves manualmente la parte bloqueada.
3. Documentas la solución en `CONTEXT.md`:
   ```
   ## YYYY-MM-DD — Bloqueo en T-XX
   **Error:** <mensaje exacto>
   **Solución manual:** <lo que hiciste>
   ```
4. Comunicas al implementer qué cambiaste; él retoma desde ese punto.

---

## Ramas `release/` y `hotfix/`

**`release/vX.Y`** — se crea desde `develop` cuando todas las tareas del núcleo están en `[x]` y listo para desplegar a Vercel:
```bash
git checkout develop && git checkout -b release/v1.0
# ajustes finales de versión, variables de producción
git checkout main && git merge --no-ff release/v1.0
git tag v1.0
git checkout develop && git merge --no-ff release/v1.0
```

**`hotfix/`** — se crea desde `main` solo para bugs críticos en producción:
```bash
git checkout main && git checkout -b hotfix/<descripcion>
# corregir, commit, merge a main Y a develop
git tag vX.Y.Z
```

---

## Referencia rápida de agentes

| Cuándo | Agente / skill |
|--------|----------------|
| Nueva tarea del plan | `implementer` |
| Revisar output antes de merge | `reviewer` |
| Decisión arquitectónica nueva | `/nuevo-adr` |
| Criterio de spec sin prueba | `/nueva-prueba-manual` |
| Rediseño de componente | `diseñador` |
