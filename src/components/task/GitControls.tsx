import { GitMerge, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui'

interface GitControlsProps {
  onMergePR: () => void
  onDeleteBranch: () => void
  canMerge?: boolean
  canDelete?: boolean
}

export function GitControls({ 
  onMergePR, 
  onDeleteBranch, 
  canMerge = false, 
  canDelete = false 
}: GitControlsProps) {
  return (
    <div className="flex items-center space-x-3">
      <Button 
        variant="success" 
        icon={<GitMerge className="h-4 w-4" />}
        onClick={onMergePR}
        disabled={!canMerge}
      >
        Merge PR
      </Button>
      
      <Button 
        variant="danger" 
        icon={<Trash2 className="h-4 w-4" />}
        onClick={onDeleteBranch}
        disabled={!canDelete}
      >
        Delete Branch
      </Button>
    </div>
  )
}
