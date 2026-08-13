import { ref } from 'vue'

/**
 * Guards an action (closing a dialog, leaving a tab, navigating away) that
 * would otherwise silently throw away unsaved changes. Pairs with
 * `ConfirmDialog`:
 *
 *   const discard = useConfirmDiscard()
 *
 *   watch(form, () => { discard.isDirty.value = true }, { deep: true })
 *
 *   function onCancel() {
 *     discard.guard(() => { form.value = { ...saved.value } })
 *   }
 *
 *   function onSaved() {
 *     discard.markClean()
 *   }
 *
 *   <ConfirmDialog
 *     v-model="discard.show.value"
 *     color="error"
 *     :title="t('common.discardChanges')"
 *     :message="t('common.discardChangesMessage')"
 *     @confirm="discard.confirm"
 *     @cancel="discard.cancel"
 *   />
 *
 * `guard(action)` runs `action` immediately when there's nothing unsaved
 * (`isDirty` false) — the dialog only ever appears when it would actually
 * prevent data loss.
 */
export function useConfirmDiscard() {
  const isDirty = ref(false)
  const show = ref(false)
  let pendingAction = null

  function guard(action) {
    if (!isDirty.value) {
      action()
      return
    }

    pendingAction = action
    show.value = true
  }

  function confirm() {
    show.value = false
    isDirty.value = false
    const action = pendingAction
    pendingAction = null
    action?.()
  }

  function cancel() {
    show.value = false
    pendingAction = null
  }

  function markDirty() {
    isDirty.value = true
  }

  function markClean() {
    isDirty.value = false
  }

  return {
    isDirty,
    show,
    guard,
    confirm,
    cancel,
    markDirty,
    markClean,
  }
}
