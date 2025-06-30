import { useState, useMemo } from 'react';

import EmptyState from '../ui/EmptyState';
import Header from '../ui/Header';
import OutlineSidebar from '../ui/OutlineSidebar';

import LinkModal from './LinkModal';
import ModuleCard from './ModuleCard';
import ModuleModal from './ModuleModal';
import UploadModal from './UploadModal';
import ResourceCard from './ResourceCard';
import DropZone from './DropZone';

const CourseBuilder = () => {
  const [modules, setModules] = useState([]);
  const [items, setItems] = useState([]);

  // Modal states
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Edit modals for resources
  const [editingResource, setEditingResource] = useState(null);
  const [isLinkEditModalOpen, setIsLinkEditModalOpen] = useState(false);
  const [isFileEditModalOpen, setIsFileEditModalOpen] = useState(false);

  const [currentModule, setCurrentModule] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  // Highlight search matches
  const highlightMatch = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(
      `(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi'
    );
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          style={{
            background: 'none',
            fontWeight: 700,
            color: 'inherit',
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Filtered modules/resources for search
  const filteredModules = useMemo(() => {
    if (!searchTerm.trim())
      return modules.map(module => ({
        ...module,
        show: true,
        highlight: false,
        isExpanded: false,
        resources: items.filter(item => item.moduleId === module.id),
      }));

    const search = searchTerm.trim().toLowerCase();
    return modules
      .map(module => {
        const moduleMatch = module.name.toLowerCase().includes(search);
        const moduleResources = items.filter(
          item => item.moduleId === module.id
        );
        const matchingResources = moduleResources.filter(
          item =>
            item.title.toLowerCase().includes(search) ||
            (item.type === 'link' && item.url.toLowerCase().includes(search)) ||
            (item.type === 'file' &&
              item.fileName.toLowerCase().includes(search))
        );
        if (moduleMatch) {
          return {
            ...module,
            show: true,
            highlight: true,
            isExpanded: true,
            resources: moduleResources.map(item => ({
              ...item,
              highlight: false,
            })),
          };
        }
        if (matchingResources.length > 0) {
          return {
            ...module,
            show: true,
            highlight: false,
            isExpanded: true,
            resources: moduleResources.map(item =>
              matchingResources.some(m => m.id === item.id)
                ? { ...item, highlight: true }
                : { ...item, highlight: false }
            ),
          };
        }
        return {
          ...module,
          show: false,
          highlight: false,
          isExpanded: true,
          resources: [],
        };
      })
      .filter(m => m.show);
  }, [modules, items, searchTerm]);

  // Unassigned resources
  const unassignedItems = items
    .filter(item => item.moduleId === null)
    .sort((a, b) => a.order - b.order);

  // Filtered unassigned resources for search
  const filteredUnassignedItems = useMemo(() => {
    if (!searchTerm.trim()) return unassignedItems;

    const search = searchTerm.trim().toLowerCase();
    return unassignedItems
      .map(item => {
        const match =
          item.title.toLowerCase().includes(search) ||
          (item.type === 'link' && item.url.toLowerCase().includes(search)) ||
          (item.type === 'file' &&
            item.fileName.toLowerCase().includes(search));
        if (match) {
          return {
            ...item,
            highlight: true,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [unassignedItems, searchTerm]);

  // Modal handlers
  const handleAddClick = type => {
    switch (type) {
      case 'module':
        setCurrentModule(null);
        setIsModuleModalOpen(true);
        break;
      case 'link':
        setCurrentModuleId(null);
        setIsLinkModalOpen(true);
        break;
      case 'upload':
        setCurrentModuleId(null);
        setIsUploadModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleCloseModuleModal = () => {
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleCloseLinkModal = () => {
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleSaveModule = module => {
    if (currentModule) {
      setModules(modules.map(m => (m.id === module.id ? module : m)));
    } else {
      setModules([...modules, module]);
    }
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleEditModule = module => {
    setCurrentModule(module);
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = moduleId => {
    setModules(modules.filter(module => module.id !== moduleId));
    setItems(items.filter(item => item.moduleId !== moduleId));
  };

  const handleAddItem = (moduleId, type) => {
    setCurrentModuleId(moduleId);
    if (type === 'link') {
      setIsLinkModalOpen(true);
    } else if (type === 'file') {
      setIsUploadModalOpen(true);
    }
  };

  const handleSaveLink = linkItem => {
    if (!linkItem.title || !linkItem.url) return;
    const unassigned = items.filter(i => i.moduleId === null);
    const maxOrder =
      unassigned.length > 0
        ? Math.max(...unassigned.map(i => i.order ?? 0))
        : -1;
    setItems([...items, { ...linkItem, order: maxOrder + 1 }]);
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleSaveUpload = fileItem => {
    if (!fileItem.title || !fileItem.fileName) return;
    const unassigned = items.filter(i => i.moduleId === null);
    const maxOrder =
      unassigned.length > 0
        ? Math.max(...unassigned.map(i => i.order ?? 0))
        : -1;
    setItems([...items, { ...fileItem, order: maxOrder + 1 }]);
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleDeleteItem = itemId => {
    setItems(items.filter(item => item.id !== itemId));
  };

  // Reorder modules
  const moveModule = (dragIndex, hoverIndex) => {
    const updated = [...modules];
    const [removed] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, removed);
    setModules(updated.map((m, i) => ({ ...m, order: i })));
  };

  // Reorder/move items
  const moveItem = (dragItemId, beforeId, targetModuleId) => {
    const dragItem = items.find(i => i.id === dragItemId);
    let updated = items.filter(i => i.id !== dragItemId);

    if (targetModuleId === null) {
      const beforeIndex = beforeId
        ? updated.findIndex(i => i.id === beforeId && i.moduleId === null)
        : -1;
      dragItem.moduleId = null;
      if (beforeIndex === -1) {
        updated.push(dragItem);
      } else {
        updated.splice(beforeIndex, 0, dragItem);
      }
    } else {
      const beforeIndex = beforeId
        ? updated.findIndex(
            i => i.id === beforeId && i.moduleId === targetModuleId
          )
        : -1;
      dragItem.moduleId = targetModuleId;
      if (beforeIndex === -1) {
        let lastIndex = -1;
        for (let i = updated.length - 1; i >= 0; i--) {
          if (updated[i].moduleId === targetModuleId) {
            lastIndex = i;
            break;
          }
        }
        updated.splice(lastIndex + 1, 0, dragItem);
      } else {
        updated.splice(beforeIndex, 0, dragItem);
      }
    }

    let order = 0;
    updated = updated.map(item => {
      if (item.moduleId === dragItem.moduleId) {
        return { ...item, order: order++ };
      }
      return item;
    });

    setItems(updated);
  };

  // Edit handlers for resources (unassigned and module items)
  const handleEditResource = resource => {
    setEditingResource(resource);
    if (resource.type === 'link') {
      setIsLinkEditModalOpen(true);
    } else if (resource.type === 'file') {
      setIsFileEditModalOpen(true);
    }
  };

  const handleSaveLinkEdit = updated => {
    setItems(
      items.map(item =>
        item.id === editingResource.id
          ? { ...item, title: updated.title, url: updated.url }
          : item
      )
    );
    setIsLinkEditModalOpen(false);
    setEditingResource(null);
  };

  const handleSaveFileEdit = updated => {
    setItems(
      items.map(item =>
        item.id === editingResource.id
          ? {
              ...item,
              title: updated.title,
              fileName: updated.fileName,
              fileSize: updated.fileSize,
              fileType: updated.fileType,
            }
          : item
      )
    );
    setIsFileEditModalOpen(false);
    setEditingResource(null);
  };

  const handleCloseLinkEditModal = () => {
    setIsLinkEditModalOpen(false);
    setEditingResource(null);
  };

  const handleCloseFileEditModal = () => {
    setIsFileEditModalOpen(false);
    setEditingResource(null);
  };

  // Download handler (optional)
  const handleDownloadFile = item => {
    alert(`Download: ${item.fileName}`);
  };

  const moduleCards = modules.sort((a, b) => a.order - b.order);

  return (
    <div className="course-builder" style={{ position: 'relative' }}>
      <Header onAddClick={handleAddClick} onSearch={setSearchTerm} />

      {modules.length === 0 && items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="builder-flex">
          <div className="builder-content">
            {/* DropZone at the top for unassigned */}
            <DropZone
              onDrop={draggedItem =>
                moveItem(draggedItem.id, unassignedItems[0]?.id, null)
              }
              beforeId={unassignedItems[0]?.id}
              beforeModuleId={null}
              isUnassigned
            />

            {/* Render unassigned ResourceCards */}
            {filteredUnassignedItems.map((item, idx) => (
              <div key={item.id}>
                <ResourceCard
                  item={{
                    ...item,
                    title: item.highlight
                      ? highlightMatch(item.title, searchTerm)
                      : item.title,
                    url:
                      item.type === 'link' && item.highlight
                        ? highlightMatch(item.url, searchTerm)
                        : item.url,
                    fileName:
                      item.type === 'file' && item.highlight
                        ? highlightMatch(item.fileName, searchTerm)
                        : item.fileName,
                  }}
                  index={idx}
                  moveItem={moveItem}
                  onDelete={handleDeleteItem}
                  onEdit={handleEditResource}
                  items={items}
                />
                <DropZone
                  onDrop={draggedItem =>
                    moveItem(
                      draggedItem.id,
                      filteredUnassignedItems[idx + 1]?.id,
                      null
                    )
                  }
                  beforeId={filteredUnassignedItems[idx + 1]?.id}
                  beforeModuleId={null}
                  isUnassigned
                />
              </div>
            ))}
            <DropZone
              onDrop={draggedItem => moveItem(draggedItem.id, null, null)}
              beforeId={null}
              beforeModuleId={null}
              isUnassigned
            />

            {/* DropZone before first module */}
            <DropZone
              onDrop={draggedItem =>
                moveItem(draggedItem.id, null, moduleCards[0]?.id)
              }
              beforeId={null}
              beforeModuleId={moduleCards[0]?.id}
            />

            {/* Modules */}
            {filteredModules.map((module, moduleIdx) => (
              <div key={module.id} id={`module-${module.id}`}>
                <ModuleCard
                  module={{
                    ...module,
                    name: module.highlight
                      ? highlightMatch(module.name, searchTerm)
                      : module.name,
                  }}
                  index={moduleIdx}
                  modules={modules}
                  items={module.resources.map(item =>
                    item.highlight
                      ? {
                          ...item,
                          title: highlightMatch(item.title, searchTerm),
                        }
                      : item
                  )}
                  moveModule={moveModule}
                  moveItem={moveItem}
                  handleEditItem={() => {}}
                  onEdit={handleEditModule}
                  onDelete={handleDeleteModule}
                  onAddItem={handleAddItem}
                  onDeleteItem={handleDeleteItem}
                  onEditItem={handleEditResource}
                />
                <DropZone
                  onDrop={draggedItem =>
                    moveItem(
                      draggedItem.id,
                      null,
                      filteredModules[moduleIdx + 1]?.id
                    )
                  }
                  beforeId={null}
                  beforeModuleId={filteredModules[moduleIdx + 1]?.id}
                />
              </div>
            ))}
          </div>
          {modules.length > 1 && <OutlineSidebar modules={modules} />}
        </div>
      )}

      {/* Module Modal */}
      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={handleCloseModuleModal}
        onSave={handleSaveModule}
        module={currentModule}
      />

      {/* Link Modal */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={handleCloseLinkModal}
        onSave={handleSaveLink}
        moduleId={currentModuleId}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onSave={handleSaveUpload}
        moduleId={currentModuleId}
      />

      {/* Link Edit Modal */}
      <LinkModal
        isOpen={isLinkEditModalOpen}
        onClose={handleCloseLinkEditModal}
        onSave={handleSaveLinkEdit}
        moduleId={null}
        initialTitle={editingResource?.title}
        initialUrl={editingResource?.url}
      />

      {/* File Edit Modal */}
      <UploadModal
        isOpen={isFileEditModalOpen}
        onClose={handleCloseFileEditModal}
        onSave={handleSaveFileEdit}
        moduleId={null}
        initialTitle={editingResource?.title}
        initialFileName={editingResource?.fileName}
      />
    </div>
  );
};

export default CourseBuilder;
