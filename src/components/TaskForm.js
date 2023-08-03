import React, { useEffect, useState } from "react";
import './TaskForm.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoadingActions } from "../store/slices/loading-slice";
import { EditActions } from "../store/slices/edit-slice";
import { ErrorActions } from "../store/slices/error-slice";
import dateMaker from "../utils/dateMaker";

function TaskForm() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const isLoading = useSelector(state => state.Loading.isLoading)
    const editInfo = useSelector(state => state.Edit)

    const [completionDate, setCompletionDate] = useState(new Date(Date.now() + 1000 * 60 * 60 * 24));
    const [content, setContent] = useState('')
    const [isContentBlur, setIsContentBlur] = useState(false)
    const [title, setTitle] = useState('')
    const [isTitleBlur, setIsTitleBlur] = useState(false)
    const [dateError, setDateError] = useState(false)

    useEffect(() => {
        dispatch(LoadingActions.setLoading(false))
    }, [dispatch])

    useEffect(() => {
        if (editInfo.isEdit) {
            setContent(editInfo.taskInfo)
            setTitle(editInfo.title)
            setCompletionDate(Date.parse(editInfo.completionDate))
        }
    }, [editInfo.isEdit, editInfo.taskInfo, editInfo.completionDate, editInfo.title])

    useEffect(() => {
        if (completionDate > new Date()) {
            setDateError(false)
        } else {
            setDateError(true)
        }
    }, [completionDate])

    const taskSubmit = async (e) => {
        e.preventDefault()
        if (content.trim().length === 0 || content.trim().length > 160) {
            setIsTitleBlur(true)
            setIsContentBlur(true)
            return
        }
        if (!dateError && (content.toString().trim().length < 160 || content.toString().trim().length > 0)) {
            dispatch(LoadingActions.setLoading(true))
            try {
                const body = {
                    title: title.toString(),
                    taskInfo: content.toString(),
                    completionDate
                }
                let url
                let method
                if (editInfo.isEdit) {
                    url = `http://localhost:3002/task/editTask/${editInfo.taskId}`
                    method = 'PATCH'
                } else {
                    url = 'http://localhost:3002/task/addTask'
                    method = 'POST'
                }
                const response = await fetch(url, {
                    method: method,
                    body: JSON.stringify(body),
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
                    dispatch(EditActions.setEdit({
                        isEdit: false,
                        taskInfo: null,
                        completionDate: null,
                        taskId: null
                    }))
                    navigate('/', { replace: true })
                } else {
                    throw new Error('Some error occured')
                }
            } catch (error) {
                dispatch(ErrorActions.setError(true))
                navigate('/error', { replace: true })
            }
        }
    }

    return (
        <React.Fragment>
            {!isLoading && <><div className='back_home'><button onClick={() => navigate('/', { replace: true })}>Home</button></div>
                <div className='task_outer_container'>
                    <div className="task_form">
                        <form >

                            <label htmlFor="title">Title</label>
                            <input style={{ 'fontSize': '18px' }} type="text" className="title_input" id="title" name="title" placeholder="Enter title here..." value={title} onChange={(e) => {
                                setTitle(e.target.value.trimStart())
                                setIsTitleBlur(false)
                            }} onBlur={() => setIsTitleBlur(true)}></input>
                            {isTitleBlur && (title.toString().trim().length > 50 || title.toString().trim().length === 0) && <p>{title.toString().trim().length > 50 ? 'Length of title should not be more than 50 characters' : 'Enter a title'}</p>}

                            <label className="content_label" htmlFor="content">Content</label>
                            <textarea style={{ 'fontSize': '18px' }} className="text_input" id="content" name="content" placeholder="Enter content here..." rows={5} value={content} onChange={(e) => {
                                setContent(e.target.value.trimStart())
                                setIsContentBlur(false)
                            }} onBlur={() => setIsContentBlur(true)}></textarea>
                            {isContentBlur && (content.toString().trim().length > 160 || content.toString().trim().length === 0) && <p>{content.toString().trim().length > 160 ? 'Length of content should not be more than 160 characters' : 'Enter some content'}</p>}

                        </form>
                        <div className="date_selector">
                            <div className="date_label">Completion Date</div>
                            <div className="date_picker">
                                <DatePicker selected={completionDate} onChange={(date) => setCompletionDate(date)} />
                            </div>
                            {dateError && <p>Enter a date greater than {dateMaker(new Date())} </p>}

                        </div>
                        <div className="task_button">
                            <button onClick={taskSubmit}>Submit</button>
                        </div>

                    </div>
                </div></>}
        </React.Fragment>
    )
}
export default TaskForm