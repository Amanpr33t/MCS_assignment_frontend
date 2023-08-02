import React, { useEffect } from "react";
import './ErrorPage.css'
import { useDispatch, useSelector } from "react-redux";
import { LoadingActions } from "../store/slices/loading-slice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isError = useSelector(state => state.Error.isError)
    useEffect(() => {
        if (!isError) {
            navigate('/', { replace: true })
        }
    }, [isError, navigate])
    return (
        <React.Fragment>
            {isError && <div className="error_container">
                <h3>Some error occured.</h3>
                <div>
                    <Link to='/' onClick={() => {
                        navigate('/', { replace: true })
                        dispatch(LoadingActions.setLoading(true))
                    }}>Reload</Link>
                </div>
            </div>}
        </React.Fragment>
    )
}
export default ErrorPage