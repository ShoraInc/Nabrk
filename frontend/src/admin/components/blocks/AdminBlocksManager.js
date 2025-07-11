// components/admin/AdminBlocksManager.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import AdminSidebar from "../../components/shared/AdminSidebar";
import blocksApi from "../../../api/blocksApi";
import pagesApi from "../../../api/pagesApi";
import { BLOCK_TYPES_CONFIG } from "../../../config/blockTypesConfig";
import BlockCreator from "./BlockCreator";
import SortableBlockItem from "./SortableBlockItem";

const AdminBlocksManager = () => {
  const { pageId } = useParams();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [page, setPage] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreator, setShowCreator] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [reorderLoading, setReorderLoading] = useState(false);

  // Настройка сенсоров для drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Начинаем перетаскивание после движения на 8px
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadPageAndBlocks();
  }, [pageId]);

  const loadPageAndBlocks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Загружаем информацию о странице
      const pageData = await pagesApi.getPageByIdAdmin(pageId);
      setPage(pageData);

      // Загружаем блоки страницы
      if (pageData.slug) {
        const blocksData = await blocksApi.getBlocksByPageSlug(pageData.slug);
        setBlocks(blocksData);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error loading page and blocks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Обработка drag & drop
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      // Обновляем порядок локально для мгновенного отклика
      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      setBlocks(newBlocks);

      // Обновляем order в базе данных
      await updateBlocksOrder(newBlocks);
    }
  };

  // Обновление порядка блоков на сервере
  // Обновление порядка блоков на сервере
  const updateBlocksOrder = async (reorderedBlocks) => {
    try {
      setReorderLoading(true);

      // Обновляем order для каждого блока
      const updatePromises = reorderedBlocks.map((block, index) => {
        const newOrder = index;
        if (block.order !== newOrder) {
          // Обновляем в зависимости от типа блока
          if (block.type === "title") {
            return blocksApi.updateTitleBlock(block.id, { order: newOrder });
          } else if (block.type === "line") {
            return blocksApi.updateLineBlock(block.id, { order: newOrder });
          } else if (block.type === "contact-info") {
            return blocksApi.updateContactInfoBlock(block.id, {
              order: newOrder,
            });
          }
          // Добавьте другие типы блоков здесь
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);

      // Перезагружаем блоки для синхронизации
      await loadPageAndBlocks();
    } catch (err) {
      console.error("Error updating blocks order:", err);
      alert("Ошибка при изменении порядка блоков");
      // Возвращаем старый порядок при ошибке
      await loadPageAndBlocks();
    } finally {
      setReorderLoading(false);
    }
  };

  const handleBlockCreated = async (newBlock) => {
    setShowCreator(false);
    setEditingBlock(null);
    await loadPageAndBlocks();
  };

  const handleBlockUpdated = async (updatedBlock) => {
    setShowCreator(false);
    setEditingBlock(null);
    await loadPageAndBlocks();
  };

  const handleBlockDeleted = async (blockId) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот блок?")) {
      return;
    }

    try {
      await blocksApi.deleteBlock(blockId);
      await loadPageAndBlocks();
    } catch (err) {
      alert(`Ошибка при удалении блока: ${err.message}`);
    }
  };

  const handleEditBlock = (block) => {
    setEditingBlock(block);
    setShowCreator(true);
  };

  // Ручное изменение порядка стрелками
  const moveBlockUp = async (blockIndex) => {
    if (blockIndex === 0) return;

    const newBlocks = [...blocks];
    [newBlocks[blockIndex], newBlocks[blockIndex - 1]] = [
      newBlocks[blockIndex - 1],
      newBlocks[blockIndex],
    ];
    setBlocks(newBlocks);

    await updateBlocksOrder(newBlocks);
  };

  const moveBlockDown = async (blockIndex) => {
    if (blockIndex === blocks.length - 1) return;

    const newBlocks = [...blocks];
    [newBlocks[blockIndex], newBlocks[blockIndex + 1]] = [
      newBlocks[blockIndex + 1],
      newBlocks[blockIndex],
    ];
    setBlocks(newBlocks);

    await updateBlocksOrder(newBlocks);
  };

  const contentClass = `flex-1 transition-all duration-300 p-6 ${
    sidebarExpanded ? "ml-64" : "ml-16"
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
        {/* Заголовок */}
        <div className="mb-6 pt-12 lg:pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Редактор блоков
              </h1>
              <p className="text-gray-600 mt-2">
                Страница: {page?.title} ({page?.slug})
              </p>
            </div>
            {reorderLoading && (
              <div className="text-sm text-blue-600 flex items-center">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                Обновление порядка...
              </div>
            )}
          </div>
        </div>

        {/* Инструкция по drag & drop */}
        {blocks.length > 1 && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center text-blue-800">
              <span className="text-lg mr-2">💡</span>
              <span className="text-sm font-medium">
                Перетащите блоки для изменения порядка или используйте стрелки
                ↕️
              </span>
            </div>
          </div>
        )}

        {/* Кнопка добавления блока */}
        <div className="mb-6">
          <button
            onClick={() => {
              setEditingBlock(null);
              setShowCreator(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <span className="mr-2">+</span>
            Добавить блок
          </button>
        </div>

        {/* Создатель/редактор блоков */}
        {showCreator && (
          <div className="mb-6">
            <BlockCreator
              pageId={pageId}
              editingBlock={editingBlock}
              onBlockCreated={handleBlockCreated}
              onBlockUpdated={handleBlockUpdated}
              onCancel={() => {
                setShowCreator(false);
                setEditingBlock(null);
              }}
            />
          </div>
        )}

        {/* Список блоков с drag & drop */}
        <div className="space-y-4">
          {blocks.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                На странице пока нет блоков
              </h3>
              <p className="text-gray-500 mb-4">
                Начните создавать контент, добавив первый блок
              </p>
              <button
                onClick={() => {
                  setEditingBlock(null);
                  setShowCreator(true);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Добавить первый блок
              </button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={blocks.map((block) => block.id)}
                strategy={verticalListSortingStrategy}
              >
                {blocks.map((block, index) => (
                  <SortableBlockItem
                    key={block.id}
                    block={block}
                    index={index}
                    totalBlocks={blocks.length}
                    onEdit={handleEditBlock}
                    onDelete={handleBlockDeleted}
                    onMoveUp={moveBlockUp}
                    onMoveDown={moveBlockDown}
                    isReorderLoading={reorderLoading}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Статистика */}
        {blocks.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📊 Статистика блоков
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {blocks.length}
                </div>
                <div className="text-sm text-gray-600">Всего блоков</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(blocks.map((b) => b.type)).size}
                </div>
                <div className="text-sm text-gray-600">Типов блоков</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {
                    blocks.filter(
                      (b) => BLOCK_TYPES_CONFIG[b.type]?.hasTranslations
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">С переводами</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlocksManager;
