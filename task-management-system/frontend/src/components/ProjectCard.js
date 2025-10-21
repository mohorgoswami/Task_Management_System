import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MoreVertical, Edit2, Trash2, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

function ProjectCard({ project, onUpdate, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: project.name,
    description: project.description
  });

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await onUpdate(project._id, editData);
      setIsEditing(false);
    } catch (error) {
      // Error is handled in parent
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(project._id);
  };

  if (isEditing) {
    return (
      <div className="card">
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="input"
              required
              maxLength={100}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="textarea"
              rows={3}
              required
              maxLength={500}
            />
          </div>
          
          <div className="flex space-x-2">
            <button type="submit" className="btn-primary">
              Save
            </button>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="card group hover:shadow-md transition-all duration-200 relative">
      {/* Menu Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all duration-200"
        >
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </button>
        
        {showMenu && (
          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsEditing(true);
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Project Content */}
      <Link to={`/project/${project._id}`} className="block">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-8">
            {project.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Project Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <BarChart3 className="h-4 w-4" />
            <span>{project.taskCount} tasks</span>
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(project.createdDate), 'MMM dd, yyyy')}</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Progress</span>
            <span>{project.taskCount > 0 ? Math.round((project.completedTasks || 0) / project.taskCount * 100) : 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: project.taskCount > 0 
                  ? `${Math.round((project.completedTasks || 0) / project.taskCount * 100)}%` 
                  : '0%' 
              }}
            ></div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProjectCard;