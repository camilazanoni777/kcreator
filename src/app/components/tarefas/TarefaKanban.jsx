'use client'

import React, { useState } from 'react';
import { useEntityMutations } from '../../lib/hooks/useEntities';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const COLUMNS = [
  { key: 'pendente', label: 'Pendente', color: 'border-muted-foreground/30', headerBg: 'bg-muted', textColor: 'text-muted-foreground' },
  { key: 'andamento', label: 'Em Andamento', color: 'border-primary/30', headerBg: 'bg-primary/10', textColor: 'text-primary' },
  { key: 'concluida', label: 'Concluido', color: 'border-green-500/30', headerBg: 'bg-green-500/10', textColor: 'text-green-400' },
  { key: 'adiada', label: 'Adiado', color: 'border-destructive/30', headerBg: 'bg-destructive/10', textColor: 'text-destructive' },
];

const PRIORITY_META = {
  urgente: { label: 'Urgente', className: 'border-rouge-300 bg-rouge-100 text-rouge-700' },
  alta: { label: 'Alta', className: 'border-[#f0b38b] bg-[#ffe2cf] text-[#b85a2b]' },
  media: { label: 'Media', className: 'border-[#ecd08c] bg-[#fff1c7] text-[#9a6a16]' },
  baixa: { label: 'Baixa', className: 'border-[#dfb8a0] bg-[#f7e1d3] text-[#9b5d3c]' },
};

export default function TarefaKanban({ tarefas }) {
  const { update, remove } = useEntityMutations('Tarefa');
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const moveTaskToColumn = (taskId, nextColumn) => {
    const task = tarefas.find((item) => item.id === taskId);
    if (!task || task.status === nextColumn) return;

    update.mutate({
      id: task.id,
      data: { status: nextColumn },
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {COLUMNS.map((col) => {
        const items = tarefas.filter((t) => t.status === col.key);
        const isDropTarget = dragOverColumn === col.key;

        return (
          <div
            key={col.key}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = 'move';
              if (dragOverColumn !== col.key) {
                setDragOverColumn(col.key);
              }
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setDragOverColumn(null);
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              const taskId = event.dataTransfer.getData('text/plain') || draggedTaskId;

              if (taskId) {
                moveTaskToColumn(taskId, col.key);
              }

              setDraggedTaskId(null);
              setDragOverColumn(null);
            }}
            className={cn(
              'rounded-xl border bg-card/50 transition-all',
              col.color,
              isDropTarget && 'border-primary bg-primary/5 shadow-soft'
            )}
          >
            <div className={cn('flex items-center justify-between rounded-t-xl px-4 py-2.5', col.headerBg)}>
              <h3 className={cn('text-sm font-semibold', col.textColor)}>{col.label}</h3>
              <span className={cn('text-xs font-mono', col.textColor)}>{items.length}</span>
            </div>

            <div className="max-h-[60vh] space-y-2 overflow-y-auto p-2">
              {items.map((t) => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text/plain', t.id);
                    setDraggedTaskId(t.id);
                  }}
                  onDragEnd={() => {
                    setDraggedTaskId(null);
                    setDragOverColumn(null);
                  }}
                  className={cn(
                    'cursor-grab rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/30 active:cursor-grabbing',
                    draggedTaskId === t.id && 'opacity-55'
                  )}
                >
                  {t.prioridade && (
                    <div className="mb-2">
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]',
                          PRIORITY_META[t.prioridade]?.className || 'border-border bg-secondary text-muted-foreground'
                        )}
                      >
                        {PRIORITY_META[t.prioridade]?.label || t.prioridade}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-1">
                    <p className="flex-1 text-xs font-medium">{t.descricao}</p>

                    <div className="flex shrink-0 items-center gap-0.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-destructive"
                        onClick={() => remove.mutate(t.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-1.5 flex gap-2 text-[10px] text-muted-foreground">
                    <span>{t.responsavel}</span>
                    {t.area && <span>- {t.area}</span>}
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  {isDropTarget ? 'Solte a tarefa aqui' : 'Vazio'}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
