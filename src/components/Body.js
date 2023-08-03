import './Body.css'
import React, { useEffect, useCallback, useState } from 'react'
import { FaTrash } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoadingActions } from '../store/slices/loading-slice';
import { EditActions } from '../store/slices/edit-slice';
import { ErrorActions } from '../store/slices/error-slice';
import dateMaker from '../utils/dateMaker';

function Body({ isAppClick, resetAppClick }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [taskData, setTaskData] = useState()
    const [selectedTasks, setSelectedTasks] = useState('')
    const [isDeleteTasks, setIsDeleteTasks] = useState(false)
    const [isResetCheckbox, setIsResetCheckBox] = useState(false)
    const isLoading = useSelector(state => state.Loading.isLoading)

    useEffect(() => {
        dispatch(EditActions.setEdit({
            isEdit: false,
            title:null,
            taskInfo: null,
            completionDate: null,
            taskId: null
        }))
    }, [dispatch])

    const checkBoxHandler = (id, e) => {
        resetAppClick()
        if (e.target.checked) {
            setSelectedTasks(tasksId => tasksId.concat(`$${id}`))
            setIsDeleteTasks(true)
        } else {
            let taskArray = selectedTasks.split('$').splice(1, selectedTasks.split('$').length)
            if (taskArray.length === 1) {
                setIsDeleteTasks(false)
            }
            setSelectedTasks('')
            taskArray.filter(taskId => taskId !== id).map(taskId => {
                return setSelectedTasks(id => id.concat(`$${taskId}`))
            })
        }
    }

    const resetCheckboxFunction = useCallback(() => {
        selectedTasks.split('$').splice(1, selectedTasks.split('$').length).map(taskId => {
            if (document.getElementById(taskId)) {
                return document.getElementById(taskId).checked = false
            } else {
                return null
            }
        })
        setSelectedTasks('')
    }, [selectedTasks])

    useEffect(() => {
        if (isResetCheckbox || isAppClick) {
            resetCheckboxFunction()
            setIsDeleteTasks(false)
        }
    }, [isResetCheckbox, isAppClick, resetCheckboxFunction])

    const fetchTasks = useCallback(async () => {
        dispatch(LoadingActions.setLoading(true))
        dispatch(ErrorActions.setError(false))
        const url = 'http://localhost:3002/task/getAllTasks'
        try {
            const response = await fetch(url)
            if (response) {
                dispatch(LoadingActions.setLoading(false))
            }
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                setTaskData(data)
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            dispatch(ErrorActions.setError(true))
            navigate('/error', { replace: true })
        }
    }, [dispatch, navigate])

    useEffect(() => {
        fetchTasks()
    }, [fetchTasks])


    const deleteTask = async (tasks) => {
        dispatch(LoadingActions.setLoading(true))
        let url
        if (typeof tasks === 'string' && tasks.toString().startsWith('$')) {
            url = `http://localhost:3002/task/deleteSelectedTasks/${tasks}`
        } else {
            url = `http://localhost:3002/task/deleteTask/${tasks}`
        }
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response) {
                dispatch(LoadingActions.setLoading(false))
            }
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                fetchTasks()
                if (tasks.toString().startsWith('$')) {
                    resetCheckboxFunction()
                    setIsDeleteTasks(false)
                }
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            dispatch(ErrorActions.setError(true))
            navigate('/error', { replace: true })
        }
    }

    const editTask = async ({ taskId, taskData }) => {
        dispatch(LoadingActions.setLoading(true))
        try {
            const response = await fetch(`http://localhost:3002/task/editTask/${taskId}`, {
                method: 'PATCH',
                body: JSON.stringify(taskData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response) {
                dispatch(LoadingActions.setLoading(false))
            }
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                fetchTasks()
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            dispatch(ErrorActions.setError(true))
            navigate('/error', { replace: true })
        }
    }



    return (
        <React.Fragment>
            {isDeleteTasks && <div className='delete_tasks'><button onClick={() => deleteTask(selectedTasks)}>Delete Tasks</button></div>}

            {!isDeleteTasks && !isLoading && <div className='add_tasks'><button onClick={() => {
                dispatch(EditActions.setEdit({
                    isEdit: false,
                    title:null,
                    taskInfo: null,
                    completionDate: null,
                    taskId: null
                }))
                navigate('/task_form', { replace: true })
            }}>Add Task</button></div>}

            <div className='task_container'>
                {!isLoading && taskData && taskData.count === 0 && <div className="no_tasks">
                    <p>No tasks found.</p>
                </div>}
                {!isLoading && taskData && taskData.count > 0 && taskData.allTasks.map((task) => {
                    return <div className='task_body' key={task._id} onClick={e => e.stopPropagation()}>
                        <p className={`task-status ${task.status}`}>{task.status}</p>
                        <input type="checkbox" id={task._id} onChange={e => {
                            checkBoxHandler(task._id, e)
                        }} name="task_checkbox" onClick={() => {
                            setIsResetCheckBox(false)
                        }}></input>
                        <h3 className='title_heading'>Title:</h3>
                        <p>{task.title}</p>
                        <h3>Description:</h3>
                        <p className='task-content'>{task.taskInfo}</p>
                        <div className='completion_date'>
                            <h3>Completion Date:</h3>
                            <p>{dateMaker(task.completionDate)}</p>
                        </div>
                        {!isDeleteTasks && <div className='task-update'>
                            <button onClick={() => deleteTask(task._id)}><FaTrash /></button>
                            {task.status !== 'completed' && task.status !== 'cancelled' && <><button onClick={() => {
                                dispatch(EditActions.setEdit({
                                    isEdit: true,
                                    title:task.title,
                                    taskInfo: task.taskInfo,
                                    completionDate: task.completionDate,
                                    taskId: task._id
                                }))
                                navigate('/task_form', { replace: true })
                            }}><AiFillEdit /></button>
                                <button onClick={() => editTask({ taskId: task._id, taskData: { status: 'completed' } })} >Task Completed</button>
                                <button onClick={() => editTask({ taskId: task._id, taskData: { status: 'cancelled' } })}>Cancel Task</button></>}
                        </div>}
                    </div>
                })}
            </div>
        </React.Fragment>
    )
}
export default Body

