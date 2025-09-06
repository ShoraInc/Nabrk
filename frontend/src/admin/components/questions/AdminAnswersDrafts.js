import React, { useEffect, useState } from 'react';
import AdminSidebar from '../shared/AdminSidebar';
import { admin as QuestionsAdminApi } from '../../../api/questionsApi';

const AdminAnswersDrafts = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const contentClass = `flex-1 transition-all duration-300 p-6 ${
    sidebarExpanded ? 'ml-64' : 'ml-16'
  }`;

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await QuestionsAdminApi.getAnswers({ published: false, search });
      setAnswers(data.answers || []);
    } catch (e) {
      setError('Ошибка при загрузке черновиков');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDrafts(); }, []);

  const handlePublish = async (id) => {
    try {
      await QuestionsAdminApi.publishAnswer(id);
      fetchDrafts();
    } catch (e) { alert('Ошибка публикации'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить ответ?')) return;
    try {
      await QuestionsAdminApi.deleteAnswer(id);
      fetchDrafts();
    } catch (e) { alert('Ошибка удаления'); }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar onToggle={setSidebarExpanded} />
      <div className={contentClass}>
        <div className="mb-6 pt-12 lg:pt-0">
          <h1 className="text-2xl font-bold text-gray-800">Черновики ответов</h1>
          <p className="text-gray-600 mt-2">Не опубликованные ответы</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-4 flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по тексту ответа"
            className="flex-1 px-3 py-2 border border-gray-300 rounded"
          />
          <button onClick={fetchDrafts} className="px-4 py-2 bg-blue-600 text-white rounded">Поиск</button>
        </div>

        {loading ? (
          <div className="text-gray-500">Загрузка...</div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Вопрос</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ответ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {answers.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{a.Question?.Question}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{a.answer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{a.Type?.titles?.ru || a.Type?.titles?.kz || a.Type?.titles?.en || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button onClick={() => handlePublish(a.id)} className="text-green-600 hover:text-green-900">Опубликовать</button>
                      <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:text-red-900">Удалить</button>
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

export default AdminAnswersDrafts;


