import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { projectAPI, taskAPI } from '../services/api';
import toast from 'react-hot-toast';

const ProjectContext = createContext();

const initialState = {
  projects: [],
  currentProject: null,
  tasks: {
    'To Do': [],
    'In Progress': [],
    'Done': []
  },
  loading: {
    projects: false,
    tasks: false,
    creating: false,
    updating: false,
    deleting: false
  },
  error: null
};

function projectReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.key]: action.value }
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
        loading: { ...initialState.loading }
      };
    
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.projects,
        loading: { ...state.loading, projects: false }
      };
    
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [action.project, ...state.projects],
        loading: { ...state.loading, creating: false }
      };
    
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => 
          p._id === action.project._id ? action.project : p
        ),
        currentProject: state.currentProject?._id === action.project._id 
          ? action.project 
          : state.currentProject,
        loading: { ...state.loading, updating: false }
      };
    
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p._id !== action.projectId),
        currentProject: state.currentProject?._id === action.projectId 
          ? null 
          : state.currentProject,
        loading: { ...state.loading, deleting: false }
      };
    
    case 'SET_CURRENT_PROJECT':
      return {
        ...state,
        currentProject: action.project
      };
    
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.tasks,
        loading: { ...state.loading, tasks: false }
      };
    
    case 'ADD_TASK':
      const newTaskStatus = action.task.status;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [newTaskStatus]: [...state.tasks[newTaskStatus], action.task]
        },
        loading: { ...state.loading, creating: false }
      };
    
    case 'UPDATE_TASK':
      const updatedTask = action.task;
      const newTasks = { ...state.tasks };
      
      // Remove from all columns
      Object.keys(newTasks).forEach(status => {
        newTasks[status] = newTasks[status].filter(t => t._id !== updatedTask._id);
      });
      
      // Add to correct column
      newTasks[updatedTask.status] = [...newTasks[updatedTask.status], updatedTask];
      
      return {
        ...state,
        tasks: newTasks,
        loading: { ...state.loading, updating: false }
      };
    
    case 'DELETE_TASK':
      const tasksAfterDelete = { ...state.tasks };
      Object.keys(tasksAfterDelete).forEach(status => {
        tasksAfterDelete[status] = tasksAfterDelete[status].filter(
          t => t._id !== action.taskId
        );
      });
      
      return {
        ...state,
        tasks: tasksAfterDelete,
        loading: { ...state.loading, deleting: false }
      };
    
    case 'UPDATE_TASK_ORDER':
      return {
        ...state,
        tasks: action.tasks
      };
    
    default:
      return state;
  }
}

export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      dispatch({ type: 'SET_LOADING', key: 'projects', value: true });
      const response = await projectAPI.getAll();
      dispatch({ type: 'SET_PROJECTS', projects: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message });
      toast.error('Failed to fetch projects');
    }
  };

  // Fetch project by ID
  const fetchProject = async (projectId) => {
    try {
      const response = await projectAPI.getById(projectId);
      dispatch({ type: 'SET_CURRENT_PROJECT', project: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message });
      toast.error('Failed to fetch project');
      throw error;
    }
  };

  // Create new project
  const createProject = async (projectData) => {
    try {
      dispatch({ type: 'SET_LOADING', key: 'creating', value: true });
      const response = await projectAPI.create(projectData);
      dispatch({ type: 'ADD_PROJECT', project: response.data });
      toast.success('Project created successfully');
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message });
      toast.error('Failed to create project');
      throw error;
    }
  };

  // Update project
  const updateProject = async (projectId, projectData) => {
    try {
      dispatch({ type: 'SET_LOADING', key: 'updating', value: true });
      const response = await projectAPI.update(projectId, projectData);
      dispatch({ type: 'UPDATE_PROJECT', project: response.data });
      toast.success('Project updated successfully');
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message });
      toast.error('Failed to update project');
      throw error;
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    try {
      dispatch({ type: 'SET_LOADING', key: 'deleting', value: true });
      await projectAPI.delete(projectId);
      dispatch({ type: 'DELETE_PROJECT', projectId });
      toast.success('Project deleted successfully');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message });
      toast.error('Failed to delete project');
      throw error;
    }
  };

  // Fetch tasks for a project
  const fetchTasks = async (projectId) => {
    try {
      dispatch({ type: 'SET_LOADING', key: 'tasks', value: true });
      const response = await taskAPI.getByProject(projectId);
      dispatch({ type: 'SET_TASKS', tasks: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message });
      toast.error('Failed to fetch tasks');
    }
  };

  // Create new task
  const createTask = async (taskData) => {
    try {
      dispatch({ type: 'SET_LOADING', key: 'creating', value: true });
      const response = await taskAPI.create(taskData);
      dispatch({ type: 'ADD_TASK', task: response.data });
      toast.success('Task created successfully');
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message });
      toast.error('Failed to create task');
      throw error;
    }
  };

  // Update task
  const updateTask = async (taskId, taskData) => {
    try {
      dispatch({ type: 'SET_LOADING', key: 'updating', value: true });
      const response = await taskAPI.update(taskId, taskData);
      dispatch({ type: 'UPDATE_TASK', task: response.data });
      toast.success('Task updated successfully');
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message });
      toast.error('Failed to update task');
      throw error;
    }
  };

  // Update task status (for drag and drop)
  const updateTaskStatus = async (taskId, status, order) => {
    try {
      await taskAPI.updateStatus(taskId, { status, order });
    } catch (error) {
      toast.error('Failed to update task status');
      throw error;
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      dispatch({ type: 'SET_LOADING', key: 'deleting', value: true });
      await taskAPI.delete(taskId);
      dispatch({ type: 'DELETE_TASK', taskId });
      toast.success('Task deleted successfully');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message });
      toast.error('Failed to delete task');
      throw error;
    }
  };

  // Update task order (for drag and drop)
  const updateTaskOrder = (newTasks) => {
    dispatch({ type: 'UPDATE_TASK_ORDER', tasks: newTasks });
  };

  // Bulk update task orders
  const bulkUpdateTaskOrder = async (tasks) => {
    try {
      await taskAPI.bulkUpdateOrder({ tasks });
    } catch (error) {
      toast.error('Failed to update task order');
    }
  };

  const contextValue = {
    ...state,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    updateTaskOrder,
    bulkUpdateTaskOrder
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

export default ProjectContext;