import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { ArrowLeft, Plus, Bot, BarChart3 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import AIAssistant from '../components/AIAssistant';
import LoadingSpinner from '../components/LoadingSpinner';

const COLUMNS = [
  { id: 'To Do', title: 'To Do', color: 'bg-gray-100' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-yellow-100' },
  { id: 'Done', title: 'Done', color: 'bg-green-100' }
];

function ProjectBoard() {
  const { projectId } = useParams();
  const {
    currentProject,
    tasks,
    loading,
    fetchProject,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskOrder,
    bulkUpdateTaskOrder
  } = useProject();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('To Do');

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
      fetchTasks(projectId);
    }
  }, [projectId]);

  const handleCreateTask = async (taskData) => {
    try {
      await createTask({ ...taskData, project: projectId });
      setShowCreateModal(false);
    } catch (error) {
      // Error is handled in context
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await updateTask(taskId, taskData);
    } catch (error) {
      // Error is handled in context
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        // Error is handled in context
      }
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // If no destination or dropped in same place
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const newTasks = { ...tasks };
    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    // Remove from source
    const sourceItems = [...newTasks[sourceColumn]];
    const [movedItem] = sourceItems.splice(source.index, 1);

    // Add to destination
    const destItems = [...newTasks[destColumn]];
    movedItem.status = destColumn;
    destItems.splice(destination.index, 0, movedItem);

    // Update order numbers
    sourceItems.forEach((item, index) => {
      item.order = index;
    });
    destItems.forEach((item, index) => {
      item.order = index;
    });

    // Update state immediately for better UX
    newTasks[sourceColumn] = sourceItems;
    newTasks[destColumn] = destItems;
    updateTaskOrder(newTasks);

    // Prepare bulk update data
    const bulkUpdateData = [];
    
    // Add source column items
    sourceItems.forEach((item, index) => {
      bulkUpdateData.push({
        id: item._id,
        status: sourceColumn,
        order: index
      });
    });

    // Add destination column items
    destItems.forEach((item, index) => {
      bulkUpdateData.push({
        id: item._id,
        status: destColumn,
        order: index
      });
    });

    // Send to server
    try {
      await bulkUpdateTaskOrder(bulkUpdateData);
    } catch (error) {
      // Revert on error
      fetchTasks(projectId);
    }
  };

  if (loading.projects || loading.tasks) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Project not found</h2>
        <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
        <Link to="/projects" className="btn-primary">
          Back to Projects
        </Link>
      </div>
    );
  }

  const totalTasks = Object.values(tasks).flat().length;
  const completedTasks = tasks['Done'].length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start space-x-4">
          <Link 
            to="/projects" 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors mt-1"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{currentProject.name}</h1>
            <p className="text-gray-600 mt-1">{currentProject.description}</p>
            
            {/* Progress Stats */}
            <div className="flex items-center space-x-6 mt-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <BarChart3 className="h-4 w-4" />
                <span>{totalTasks} total tasks</span>
              </div>
              <div className="text-sm text-gray-600">
                {totalTasks > 0 
                  ? `${Math.round((completedTasks / totalTasks) * 100)}% complete`
                  : '0% complete'
                }
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2 max-w-xs">
              <div 
                className="bg-success-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : '0%' 
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAIAssistant(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Bot className="h-5 w-5" />
            <span>AI Assistant</span>
          </button>
          <button
            onClick={() => {
              setSelectedStatus('To Do');
              setShowCreateModal(true);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-6 overflow-x-auto pb-6">
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex-shrink-0">
              <div className={`kanban-column ${column.color}`}>
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{column.title}</h3>
                    <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
                      {tasks[column.id].length}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStatus(column.id);
                      setShowCreateModal(true);
                    }}
                    className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[400px] space-y-3 ${
                        snapshot.isDraggingOver ? 'bg-white/30 rounded-lg' : ''
                      }`}
                    >
                      {tasks[column.id].map((task, index) => (
                        <Draggable 
                          key={task._id} 
                          draggableId={task._id} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${
                                snapshot.isDragging 
                                  ? 'transform rotate-3 shadow-lg' 
                                  : ''
                              }`}
                            >
                              <TaskCard
                                task={task}
                                onUpdate={handleUpdateTask}
                                onDelete={handleDeleteTask}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {/* Empty State */}
                      {tasks[column.id].length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
                          <button
                            onClick={() => {
                              setSelectedStatus(column.id);
                              setShowCreateModal(true);
                            }}
                            className="text-xs text-primary-600 hover:text-primary-700 mt-1"
                          >
                            Add a task
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTask}
        loading={loading.creating}
        initialStatus={selectedStatus}
      />

      {/* AI Assistant */}
      <AIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        projectId={projectId}
        projectName={currentProject.name}
      />
    </div>
  );
}

export default ProjectBoard;