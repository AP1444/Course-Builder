import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiMoreVertical,
  FiLink,
  FiFileText,
} from 'react-icons/fi';

const ResourceCard = ({ item, index, moveItem, onDelete, onEdit }) => {
  const ref = useRef(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const toggleOptions = e => {
    e.stopPropagation();
    setIsOptionsOpen(!isOptionsOpen);
  };

  const handleEdit = e => {
    e.stopPropagation();
    setIsOptionsOpen(false);
    onEdit(item);
  };

  const handleDelete = e => {
    e.stopPropagation();
    setIsOptionsOpen(false);
    onDelete(item.id);
  };

  // Drop target for reordering ResourceCards and unassigning from modules
  const [, drop] = useDrop({
    accept: 'ITEM',
    hover(draggedItem, monitor) {
      if (!ref.current) return;
      if (draggedItem.id === item.id) return;
      // Only reorder if both are unassigned
      if (draggedItem.moduleId === null && item.moduleId === null) {
        moveItem(draggedItem.id, item.id, null);
        draggedItem.id = item.id;
      }
    },
    drop(draggedItem, monitor) {
      // If coming from a module, unassign and place above this card
      if (draggedItem.moduleId !== null) {
        moveItem(draggedItem.id, item.id, null);
      }
    },
  });

  // Drag source for ResourceCard
  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: { id: item.id, moduleId: null },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="module-card-container"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="module-card">
        <div className="module-content">
          <div className="module-icon">
            {item.type === 'link' ? <FiLink /> : <FiFileText />}
          </div>
          <div className="module-info">
            <h3 className="module-title">{item.title}</h3>
            {item.type === 'link' ? (
              <a
                href={item.url}
                className="item-url"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.url}
              </a>
            ) : (
              <p className="module-subtitle">
                {item.fileName} ({Math.round(item.fileSize / 1024)} KB)
              </p>
            )}
          </div>
        </div>
        <div className="module-actions">
          <button className="btn-options" onClick={toggleOptions}>
            <FiMoreVertical className="options-icon" />
          </button>
          {isOptionsOpen && (
            <div className="options-menu">
              <button className="option-item" onClick={handleEdit}>
                <FiEdit2 className="option-icon" />
                Edit {item.type === 'link' ? 'link' : 'file'}
              </button>
              {item.type === 'file' && (
                <button
                  className="option-item"
                  onClick={() => alert('Download Successful')}
                >
                  <FiDownload className="option-icon" />
                  Download
                </button>
              )}
              <button className="option-item delete" onClick={handleDelete}>
                <FiTrash2 className="option-icon" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
