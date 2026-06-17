// sanity/plugins/bulkEditor/index.tsx
import { definePlugin } from 'sanity'
import { StackIcon } from '@sanity/icons'
import { BulkEditorTool } from './BulkEditorTool'

export const bulkEditorPlugin = definePlugin({
  name: 'bulk-editor',
  tools: [
    {
      name: 'bulk-editor',
      title: 'Bulk Editor',
      icon: StackIcon,
      component: BulkEditorTool,
    },
  ],
})
