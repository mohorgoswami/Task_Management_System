import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, Clock, Tag, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const PRIORITY_COLORS = {
  Low: 'bg-blue-100 text-blue-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800'
};

const PRIORITY_ICONS = {
  Low: '●',
  Medium: '●●',
  High: '●●●'
};

function TaskCard({ task, onUpdate, onDelete, isDragging }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
    tags: task.tags.join(', ')
  });

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        ...editData,
        dueDate: editData.dueDate ? new Date(editData.dueDate) : null,
        tags: editData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      await onUpdate(task._id, updateData);
      setIsEditing(false);
    } catch (error) {
      // Error is handled in parent
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(task._id);
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';

  if (isEditing) {
    return (
      <div className="kanban-card">
        <form onSubmit={handleEdit} className="space-y-3">
          <div>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full text-sm font-medium border-none bg-gray-50 rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
              maxLength={100}
            />
          </div>
          
          <div>
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full text-sm border-none bg-gray-50 rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={3}
              required
              maxLength={1000}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={editData.priority}
              onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
              className="text-xs border-none bg-gray-50 rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            
            <input
              type="date"
              value={editData.dueDate}
              onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
              className="text-xs border-none bg-gray-50 rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <input
              type="text"
              value={editData.tags}
              onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
              placeholder="Tags (comma separated)"
              className="w-full text-xs border-none bg-gray-50 rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <button type="submit" className="text-xs bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700">
              Save
            </button>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`kanban-card group relative ${isDragging ? 'opacity-50' : ''}`}>
      {/* Menu Button */}
      <div className="absolute top-2 right-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all duration-200"
        >
          <MoreVertical className="h-3 w-3 text-gray-400" />
        </button>
        
        {showMenu && (
          <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[100px]">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsEditing(true);
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Edit2 className="h-3 w-3" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <Trash2 className="h-3 w-3" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Overdue Indicator */}
      {isOverdue && (
        <div className="absolute top-2 left-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </div>
      )}

      {/* Task Content */}
      <div className="pr-6">
        <h4 className="font-medium text-gray-900 text-sm mb-2 leading-tight">
          {task.title}
        </h4>
        
        <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700"
              >
                <Tag className="h-2 w-2 mr-1" />
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{task.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Priority */}
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>
              <span className="mr-1">{PRIORITY_ICONS[task.priority]}</span>
              {task.priority}
            </span>
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className={`flex items-center space-x-1 text-xs ${
              isOverdue ? 'text-red-600' : 'text-gray-500'
            }`}>
              <Clock className="h-3 w-3" />
              <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;