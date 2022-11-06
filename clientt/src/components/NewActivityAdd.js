import { React, useRef } from "react";

import "./NewActivityAdd.css"
const NewActivityAdd = ({ setOwnVisibility, userCookie }) => {
    const modalRef = useRef(0);
    const activityInputField = useRef(0);
    const closeModal = e => {
        if (modalRef.current === e.target) {
            setOwnVisibility(false);
        }
    };

    const handleAddBtnClick = (e) => {
        let activity = activityInputField.current.value;
        if (activity !== "") {
            console.log(activity)
            fetch("http://localhost:3005/user/add-todo-item", {
                // Adding method type
                method: "POST",
                // Adding headers to the request
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "authorization": userCookie.token//"eyJhbGciOiJIUzI1NiJ9.ZGluZXNoYm9yc2VAZ21haWwuY29t.GcNFxh1NL1qMb17t48u33Jo9am194niNyFonB8r1G9Q"
                },
                body: JSON.stringify({
                    todo: activity
                })
            })
                // Converting to JSON
                .then(response => response.json())
                // Displaying results to console
                .then(json => {
                    console.log(json.data);
                    setOwnVisibility(false);
                }).catch((err) => {
                    console.log(err)
                    setOwnVisibility(false);
                });
        }
        else {
            closeModal();
        }
    }

    return (
        <div onClick={closeModal} ref={modalRef} className="modalBackground">
            <div className="modalContainer">
                <input ref={activityInputField} className="NewActivityAdd-input-field" type={"text"} placeholder={"enter Activity Name"}></input>
                <div className="NewActivityAdd-button-container">
                    <button onClick={handleAddBtnClick} className="NewActivityAdd-add-btn">Add</button>
                    <button onClick={() => { setOwnVisibility(false) }} className="NewActivityAdd-cancel-btn">Cancel</button>
                </div>

            </div>
        </div>
    )
}

export default NewActivityAdd;