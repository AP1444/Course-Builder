import { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiLink,
  FiUpload,
} from 'react-icons/fi';

import ModuleItem from './ModuleItem';

const ModuleCard = ({
  module,
  onEdit,
  onDelete,
  items = [],
  onAddItem,
  onDeleteItem,
  index,
  moveModule,
  moveItem,
  onEditItem,
}) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const moduleItems = items.filter(item => item.moduleId === module.id);

  const toggleOptions = e => {
    e.stopPropagation();
    setIsOptionsOpen(!isOptionsOpen);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEdit = () => {
    onEdit(module);
    setIsOptionsOpen(false);
  };

  const handleDelete = () => {
    onDelete(module.id);
    setIsOptionsOpen(false);
  };

  const toggleAddMenu = e => {
    e.stopPropagation();
    setIsAddMenuOpen(!isAddMenuOpen);
  };

  const handleAddClick = type => {
    onAddItem(module.id, type);
    setIsAddMenuOpen(false);
  };

  const ref = useRef(null);

  // Drop target for modules (for reordering modules)
  const [, dropModule] = useDrop({
    accept: 'MODULE',
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveModule(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // Drop target for items (for dropping resources into empty module)
  const [, dropResource] = useDrop({
    accept: 'ITEM',
    canDrop: draggedItem => draggedItem.moduleId !== module.id,
    drop: (draggedItem, monitor) => {
      if (items.length === 0) {
        moveItem(draggedItem.id, null, module.id);
      }
    },
  });

  // Drag source for modules
  const [{ isDragging }, drag] = useDrag({
    type: 'MODULE',
    item: { id: module.id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Compose all refs on the same element
  drag(dropModule(dropResource(ref)));

  return (
    <div
      ref={ref}
      className="module-card-container"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="module-card" onClick={toggleExpanded}>
        <div className="module-content">
          <div className="module-icon">
            <span className={`icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          <div className="module-info">
            <h3 className="module-title">{module.name}</h3>
            <p className="module-subtitle">
              {moduleItems.length === 0
                ? 'Add items to this module'
                : `${moduleItems.length} item${moduleItems.length !== 1 ? 's' : ''}`}
            </p>
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
                Edit module name
              </button>
              <button className="option-item delete" onClick={handleDelete}>
                <FiTrash2 className="option-icon" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="module-content-expanded">
          {moduleItems.length === 0 ? (
            <div className="empty-module-content">
              <p className="empty-module-message">
                No content added to this module yet.
              </p>
              <div className="add-item-container">
                <button className="add-item-button" onClick={toggleAddMenu}>
                  <span className="add-icon">+</span> Add item
                </button>
                {isAddMenuOpen && (
                  <div className="add-item-menu">
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('link')}
                    >
                      <FiLink className="item-icon" />
                      Add a link
                    </button>
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('file')}
                    >
                      <FiUpload className="item-icon" />
                      Upload file
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="module-items">
              {items.map((item, itemIndex) => (
                <ModuleItem
                  key={item.id}
                  item={item}
                  index={itemIndex}
                  moveItem={moveItem}
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                />
              ))}
              <div className="add-item-container">
                <button className="add-item-button" onClick={toggleAddMenu}>
                  <span className="add-icon">+</span> Add item
                </button>
                {isAddMenuOpen && (
                  <div className="add-item-menu">
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('link')}
                    >
                      <FiLink className="item-icon" />
                      Add a link
                    </button>
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('file')}
                    >
                      <FiUpload className="item-icon" />
                      Upload file
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
