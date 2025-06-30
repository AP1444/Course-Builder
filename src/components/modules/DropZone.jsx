import { useDrop } from 'react-dnd';

const DropZone = ({ onDrop, beforeId, beforeModuleId, isUnassigned }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'ITEM',
    drop: (draggedItem) => {
      // If dropping before a ResourceCard, unassign (moduleId: null)
      // If dropping before a ModuleCard, assign to that module
      onDrop(draggedItem, beforeId, beforeModuleId);
    },
    canDrop: () => true,
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        height: 12,
        background: isOver && canDrop ? '#0caeba33' : 'transparent',
        margin: '8px 0',
        borderRadius: 4,
        transition: 'background 0.2s',
      }}
    />
  );
};

export default DropZone;