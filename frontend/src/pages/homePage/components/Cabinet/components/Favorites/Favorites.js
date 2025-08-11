// Cabinet/components/Favorites.js
import React, { useState, useEffect } from 'react';
import { ShoppingCart, FileText, X, Download, Trash2 } from 'lucide-react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Временные данные - в будущем заменить на API call
  const mockFavorites = [
    {
      id: 1,
      title: 'ШЫҒАРМАЛАРЫНЫҢ БІР ТОМДЫҚ ТОЛЫҚ ЖИНАҒЫ',
      author: 'ҚҰНАНБАЕВ АБАЙ'
    },
    {
      id: 2,
      title: 'РУССКО-ТУРКМЕНСКИЙ СЛОВАРЬ ХИМИЧЕСКИХ ТЕРМИНОВ',
      author: 'НИЯЗОВ АЙТ НИЯЗОВИЧ'
    },
    {
      id: 3,
      title: 'БОЛЕЗНИ ПИЩЕВОДА И КАРДИИ',
      author: 'ТАМУЛЕВИЧЮТЕ ДАЛЯ ИЗОЗОВНА'
    }
  ];

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      // TODO: Заменить на реальный API call
      // const response = await api.get('/favorites');
      // setFavorites(response.data);
      
      // Временная имитация API call
      setTimeout(() => {
        setFavorites(mockFavorites);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setLoading(false);
    }
  };

  const handleAddElectronicCopy = async (itemId) => {
    try {
      // TODO: API call
      // await api.post(`/favorites/${itemId}/electronic-copy`);
      console.log('Adding electronic copy for favorite:', itemId);
      // Показать уведомление об успехе
    } catch (error) {
      console.error('Error adding electronic copy:', error);
      // Показать уведомление об ошибке
    }
  };

  const handleAddToReadingRoom = async (itemId) => {
    try {
      // TODO: API call
      // await api.post(`/favorites/${itemId}/reading-room`);
      console.log('Adding to reading room for favorite:', itemId);
      // Показать уведомление об успехе
    } catch (error) {
      console.error('Error adding to reading room:', error);
      // Показать уведомление об ошибке
    }
  };

  const handleRemoveFromFavorites = async () => {
    if (selectedItems.length === 0) {
      alert('Выберите элементы для удаления');
      return;
    }

    try {
      // TODO: API call для удаления выбранных из избранного
      // await api.delete('/favorites', { data: { ids: selectedItems } });
      console.log('Removing selected from favorites:', selectedItems);
      
      // Обновить локальное состояние
      setFavorites(favorites.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      // Показать уведомление об успехе
    } catch (error) {
      console.error('Error removing from favorites:', error);
      // Показать уведомление об ошибке
    }
  };

  const handleDownloadFavorites = async () => {
    try {
      // TODO: API call для скачивания избранного
      // const response = await api.get('/favorites/download', { responseType: 'blob' });
      console.log('Downloading favorites');
      // Обработать скачивание файла
    } catch (error) {
      console.error('Error downloading favorites:', error);
      // Показать уведомление об ошибке
    }
  };

  const handleViewFavorites = () => {
    // TODO: Логика для просмотра избранного
    console.log('Viewing favorites');
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  if (loading) {
    return (
      <div className="content-section">
        <div className="section-header">
          <h2>Избранное</h2>
        </div>
        <div className="empty-state">
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>Избранное ({favorites.length})</h2>
        <div className="header-actions">
          <button className="icon-btn" onClick={handleRemoveFromFavorites}>
            <X size={20} />
          </button>
          <button className="icon-btn" onClick={handleDownloadFavorites}>
            <Download size={20} />
          </button>
          <button className="icon-btn" onClick={handleViewFavorites}>
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      
      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>Избранные элементы отсутствуют</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(favorites.map(item => item.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                    checked={selectedItems.length === favorites.length}
                  />
                </th>
                <th>Наименование / Автор</th>
                <th>Заказать</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map(item => (
                <tr key={item.id}>
                  <td>
                    <input 
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                    />
                  </td>
                  <td>
                    <div className="item-title">{item.title}</div>
                    <div className="item-author">{item.author}</div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn add-copy"
                        onClick={() => handleAddElectronicCopy(item.id)}
                      >
                        <ShoppingCart size={16} />
                        Электронная копия (+)
                      </button>
                      <button 
                        className="action-btn add-reading"
                        onClick={() => handleAddToReadingRoom(item.id)}
                      >
                        <FileText size={16} />
                        Читальный зал (+)
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Favorites;