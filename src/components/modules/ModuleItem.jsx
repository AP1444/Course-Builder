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

const ModuleItem = ({ item, onDelete, onEdit, moveItem }) => {
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

  const handleDownload = e => {
    e.stopPropagation();
    setIsOptionsOpen(false);
    alert('Download Successful');
  };

  const handleDelete = e => {
    e.stopPropagation();
    setIsOptionsOpen(false);
    onDelete(item.id);
  };

  const [, drop] = useDrop({
    accept: 'ITEM',
    hover(draggedItem, monitor) {
      if (!ref.current) return;
      if (draggedItem.id === item.id) return;
      moveItem(draggedItem.id, item.id, item.moduleId);
      draggedItem.id = item.id;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: { id: item.id, moduleId: item.moduleId },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`module-item ${item.type}-item`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="item-content">
        <div className="item-icon">
          {item.type === 'link' ? <FiLink /> : <FiFileText />}
        </div>
        <div className="item-info">
          <h4 className="item-title">{item.title}</h4>
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
            <p className="item-details">
              {item.fileName} ({Math.round(item.fileSize / 1024)} KB)
            </p>
          )}
        </div>
      </div>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button className="btn-options" onClick={toggleOptions}>
          <FiMoreVertical className="options-icon" />
        </button>
        {isOptionsOpen && (
          <div
            className="options-menu"
            style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              zIndex: 10,
            }}
          >
            <button className="option-item" onClick={handleEdit}>
              <FiEdit2 className="option-icon" />
              Edit {item.type === 'link' ? 'link' : 'file'}
            </button>
            {item.type === 'file' && (
              <button className="option-item" onClick={handleDownload}>
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
  );
};

export default ModuleItem;
