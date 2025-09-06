import React, { useEffect, useState } from 'react';
import AdminSidebar from '../shared/AdminSidebar';
import { admin as QuestionsAdminApi } from '../../../api/questionsApi';

const AdminQuestions = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [types, setTypes] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('');

  const contentClass = `flex-1 transition-all duration-300 p-6 ${
    sidebarExpanded ? 'ml-64' : 'ml-16'
  }`;

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await QuestionsAdminApi.getQuestions({ search });
      setQuestions(data.questions || []);
    } catch (e) {
      setError('Ошибка при загрузке вопросов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const t = await QuestionsAdminApi.getTypes();
        setTypes(t.types || []);
      } catch (e) {
        // silent
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить вопрос?')) return;
    try {
      await QuestionsAdminApi.deleteQuestion(id);
      fetchQuestions();
    } catch (e) {
      alert('Ошибка при удалении');
    }
  };

  const handleOpenAnswer = (q) => {
    setSelectedQuestion(q);
    setAnswerText('');
    setSelectedTypeId('');
  };

  const handleCreateAnswer = async () => {
    if (!selectedQuestion || !answerText.trim() || !selectedTypeId) return;
    try {
      await QuestionsAdminApi.createAnswer({
        questionId: selectedQuestion.id,
        answer: answerText.trim(),
        typeId: Number(selectedTypeId),
      });
      setSelectedQuestion(null);
      setAnswerText('');
      setSelectedTypeId('');
      fetchQuestions();
      alert('Ответ сохранен как черновик');
    } catch (e) {
      alert('Ошибка при создании ответа');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar onToggle={setSidebarExpanded} />
      <div className={contentClass}>
        <div className="mb-6 pt-12 lg:pt-0">
          <h1 className="text-2xl font-bold text-gray-800">Все вопросы</h1>
          <p className="text-gray-600 mt-2">Поиск и управление вопросами</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-4 flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени, фамилии или тексту вопроса"
            className="flex-1 px-3 py-2 border border-gray-300 rounded"
          />
          <button onClick={fetchQuestions} className="px-4 py-2 bg-blue-600 text-white rounded">Поиск</button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Автор</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Вопрос</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{q.Name} {q.LastName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{q.Question}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {q.Answer ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Отвечен</span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Без ответа</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {!q.Answer && (
                        <button onClick={() => handleOpenAnswer(q)} className="text-blue-600 hover:text-blue-900 mr-2">Ответить</button>
                      )}
                      <button onClick={() => handleDelete(q.id)} className="text-red-600 hover:text-red-900">Удалить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedQuestion && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Ответ для: {selectedQuestion.Question}</h2>
              <button onClick={() => setSelectedQuestion(null)} className="text-gray-600 hover:text-gray-800">✖</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  rows={6}
                  placeholder="Введите текст ответа"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Тип ответа</label>
                <select
                  value={selectedTypeId}
                  onChange={(e) => setSelectedTypeId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                >
                  <option value="">Выберите тип</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>{t.titles?.ru || t.titles?.kz || t.titles?.en}</option>
                  ))}
                </select>
                <button
                  onClick={handleCreateAnswer}
                  disabled={!answerText.trim() || !selectedTypeId}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                >
                  Сохранить как черновик
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuestions;


