import React from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import './Loading.css'
function Loading() {
    const isLoading = useSelector(state => state.Loading.isLoading)
    return (
        <React.Fragment>
            {isLoading && <div className="loading_container">
                <p>Loading...</p>
            </div>}
        </React.Fragment>
    )
}

export default Loading
