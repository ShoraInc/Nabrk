import React, { useEffect, useState } from 'react';
import AdminSidebar from '../shared/AdminSidebar';
import { admin as QuestionsAdminApi } from '../../../api/questionsApi';

const AdminTypes = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ru: '',
    en: '',
    kz: ''
  });

  const contentClass = `flex-1 transition-all duration-300 p-6 ${
    sidebarExpanded ? 'ml-64' : 'ml-16'
  }`;

  const fetchTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await QuestionsAdminApi.getTypes();
      setTypes(data.types || []);
    } catch (e) {
      setError('Ошибка при загрузке типов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleCreate = async () => {
    if (!formData.ru && !formData.en && !formData.kz) {
      alert('Заполните хотя бы один перевод');
      return;
    }
    try {
      await QuestionsAdminApi.createType(formData);
      setFormData({ ru: '', en: '', kz: '' });
      setShowForm(false);
      fetchTypes();
    } catch (e) {
      alert('Ошибка при создании типа');
    }
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setFormData({
      ru: type.titles?.ru || '',
      en: type.titles?.en || '',
      kz: type.titles?.kz || ''
    });
    setShowForm(true);
  };

  const handleUpdate = async () => {
    if (!editingType) return;
    if (!formData.ru && !formData.en && !formData.kz) {
      alert('Заполните хотя бы один перевод');
      return;
    }
    try {
      await QuestionsAdminApi.updateType(editingType.id, formData);
      setEditingType(null);
      setFormData({ ru: '', en: '', kz: '' });
      setShowForm(false);
      fetchTypes();
    } catch (e) {
      alert('Ошибка при обновлении типа');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить тип?')) return;
    try {
      await QuestionsAdminApi.deleteType(id);
      fetchTypes();
    } catch (e) {
      alert('Ошибка при удалении типа');
    }
  };

  const handleCancel = () => {
    setEditingType(null);
    setFormData({ ru: '', en: '', kz: '' });
    setShowForm(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar onToggle={setSidebarExpanded} />
      <div className={contentClass}>
        <div className="mb-6 pt-12 lg:pt-0">
          <h1 className="text-2xl font-bold text-gray-800">Управление типами ответов</h1>
          <p className="text-gray-600 mt-2">Создание и редактирование типов ответов</p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Добавить тип
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {editingType ? 'Редактировать тип' : 'Создать новый тип'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Русский</label>
                <input
                  type="text"
                  value={formData.ru}
                  onChange={(e) => setFormData({ ...formData, ru: e.target.value })}
                  placeholder="Введите на русском"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">English</label>
                <input
                  type="text"
                  value={formData.en}
                  onChange={(e) => setFormData({ ...formData, en: e.target.value })}
                  placeholder="Enter in English"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Қазақша</label>
                <input
                  type="text"
                  value={formData.kz}
                  onChange={(e) => setFormData({ ...formData, kz: e.target.value })}
                  placeholder="Қазақша енгізіңіз"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={editingType ? handleUpdate : handleCreate}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
              >
                {editingType ? 'Обновить' : 'Создать'}
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-gray-500">Загрузка...</div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Русский</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Қазақша</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {types.map((type) => (
                  <tr key={type.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{type.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{type.titles?.ru || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{type.titles?.en || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{type.titles?.kz || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(type)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleDelete(type.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTypes;
