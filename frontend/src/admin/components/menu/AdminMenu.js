import React, { useState, useEffect } from "react";
import menuApi from "../../../api/menuApi";
import AdminSidebar from "../shared/AdminSidebar";
import MenuTree from "./MenuTree";
import AddParentModal from "./AddParentModal";
import AddChildModal from "./AddChildModal";
import EditMenuItemModal from "./EditMenuItemModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Загрузка меню
  const loadMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const menu = await menuApi.getMenu();
      setMenuItems(menu);
    } catch (err) {
      setError("Ошибка при загрузке меню: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  // Обработчики для родительских пунктов
  const handleAddParent = () => {
    setShowAddParentModal(true);
  };

  const handleAddChild = (parentItem) => {
    setSelectedItem(parentItem);
    setShowAddChildModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleDelete = (item) => {
    setEditingItem(item);
    setShowDeleteModal(true);
  };

  // Обработчики модальных окон
  const handleAddParentSuccess = () => {
    setShowAddParentModal(false);
    loadMenu();
  };

  const handleAddChildSuccess = () => {
    setShowAddChildModal(false);
    setSelectedItem(null);
    loadMenu();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingItem(null);
    loadMenu();
  };

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    setEditingItem(null);
    loadMenu();
  };

  const handleCloseModals = () => {
    setShowAddParentModal(false);
    setShowAddChildModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedItem(null);
    setEditingItem(null);
  };

  const contentClass = `flex-1 transition-all duration-300 p-6 ${
    sidebarExpanded ? 'ml-64' : 'ml-16'
  }`;

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar onToggle={setSidebarExpanded} />
        <div className={contentClass}>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Загрузка...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar onToggle={setSidebarExpanded} />
        <div className={contentClass}>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar onToggle={setSidebarExpanded} />
      
      <div className={contentClass}>
        <div className="mb-6 pt-12 lg:pt-0">
          <h1 className="text-2xl font-bold text-gray-800">Управление меню</h1>
          <p className="text-gray-600 mt-2">Создавайте и редактируйте иерархическое меню сайта</p>
        </div>

        {/* Дерево меню */}
        <MenuTree
          menuItems={menuItems}
          onAddParent={handleAddParent}
          onAddChild={handleAddChild}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Модальные окна */}
        {showAddParentModal && (
          <AddParentModal
            onSuccess={handleAddParentSuccess}
            onClose={handleCloseModals}
          />
        )}

        {showAddChildModal && selectedItem && (
          <AddChildModal
            parentItem={selectedItem}
            onSuccess={handleAddChildSuccess}
            onClose={handleCloseModals}
          />
        )}

        {showEditModal && editingItem && (
          <EditMenuItemModal
            item={editingItem}
            onSuccess={handleEditSuccess}
            onClose={handleCloseModals}
          />
        )}

        {showDeleteModal && editingItem && (
          <DeleteConfirmModal
            item={editingItem}
            onSuccess={handleDeleteSuccess}
            onClose={handleCloseModals}
          />
        )}
      </div>
    </div>
  );
};

export default AdminMenu;
