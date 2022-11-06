import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TodolistPage.css"
import NewActivityAdd from "./NewActivityAdd";
import TodoRow from "./TodoRow";



const TodolistPage = (props) => {

    const { setuserCookie, userCookie } = props;
    const navigate = useNavigate();

    const [todolist, setTodolist] = useState([]);
    const [todoOngoing, settodoOngoing] = useState("");
    const [UserName, setUserName] = useState("");
    const [Refresh, setRefresh] = useState(true);
    const [newActivityFormVisibility, setNewActivityFormVisibility] = useState(false);
    if (userCookie.token === "") {
        navigate("/");
    }
    useEffect(() => {
        if (userCookie.token === "") {
            navigate("/");
        }
        fetch("http://localhost:3005/user/todolist", {
            // Adding method type
            method: "GET",
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "authorization": userCookie.token//"eyJhbGciOiJIUzI1NiJ9.ZGluZXNoYm9yc2VAZ21haWwuY29t.GcNFxh1NL1qMb17t48u33Jo9am194niNyFonB8r1G9Q"
            }
        })
            // Converting to JSON
            .then(response => response.json())
            // Displaying results to console
            .then(json => {

                json.data.forEach((element, i) => {
                    element.index = i;
                });
                setUserName(json.username);
                setTodolist(json.data);
                settodoOngoing(json.currentOngoing)
                console.log(json.currentOngoing);
                console.log(json.data);

            }).catch((err) => {
                console.log(err)
            });
    }, [newActivityFormVisibility, Refresh,userCookie.token])

    const handleNewActivityBtnClick = () => {
        setNewActivityFormVisibility(true);
    }
    const handleLogoutClick = async () => {
        await setuserCookie("token", "", { path: "/" })
        if (userCookie.token === "") {
            navigate("/");
        }

    }

    const StartTimerOfTodo = (index, status, objStartDate) => {
        fetch("http://localhost:3005/user/todo-start", {
            // Adding method type
            method: "PUT",
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "authorization": userCookie.token//"eyJhbGciOiJIUzI1NiJ9.ZGluZXNoYm9yc2VAZ21haWwuY29t.GcNFxh1NL1qMb17t48u33Jo9am194niNyFonB8r1G9Q"
            },
            body: JSON.stringify({
                index: index,
                status: status,
                StartDate: objStartDate
            })
        })
            // Converting to JSON
            .then(response => response.json())
            // Displaying results to console
            .then(json => {
                setRefresh((!Refresh))

                console.log(json);
            }).catch((err) => {
                console.log(err)
            });
    }


    const PauseTimerOfTodo = (index, status, diffTime) => {
        fetch("http://localhost:3005/user/todo-pause", {
            // Adding method type
            method: "PUT",
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "authorization": userCookie.token//"eyJhbGciOiJIUzI1NiJ9.ZGluZXNoYm9yc2VAZ21haWwuY29t.GcNFxh1NL1qMb17t48u33Jo9am194niNyFonB8r1G9Q"
            },
            body: JSON.stringify({
                index: index,
                status: status,
                timeBuffer: diffTime
            })
        })
            // Converting to JSON
            .then(response => response.json())
            // Displaying results to console
            .then(json => {
                setRefresh((!Refresh))

                console.log(json);
            }).catch((err) => {
                console.log(err)
            });
    }


    const EndTimerOfTodo = (index, status, diffTime) => {
        fetch("http://localhost:3005/user/todo-end", {
            // Adding method type
            method: "PUT",
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "authorization": userCookie.token//"eyJhbGciOiJIUzI1NiJ9.ZGluZXNoYm9yc2VAZ21haWwuY29t.GcNFxh1NL1qMb17t48u33Jo9am194niNyFonB8r1G9Q"
            },
            body: JSON.stringify({
                index: index,
                status: status,
                timeBuffer: diffTime
            })
        })
            // Converting to JSON
            .then(response => response.json())
            // Displaying results to console
            .then(json => {
                setRefresh((!Refresh))

                console.log(json);
            }).catch((err) => {
                console.log(err)
            });
    }

    const calculateTimeToString =(time)=>{
        let hours= parseInt(time/3600).toString();
        let minutes = parseInt((time%3600)/60).toString();
        let seconds = parseInt((time%3600)%60).toString();
        if(hours.length!==2){hours="0"+hours}
        if(minutes.length!==2){minutes="0"+minutes}
        if(seconds.length!==2){seconds="0"+seconds}
        let timeString=`${hours}:${minutes}:${seconds}`
        // timeSting = timeSting + (time/3600).toString();
        return timeString;
    }

    const handleChangeAction = (obj, action, setTimeOfObj) => {
        console.log(obj)
        if (action === "start") {
            if (todoOngoing === "") {
                let objStartDate = new Date()
                StartTimerOfTodo(obj.index, "Ongoing", objStartDate)
            }
            else {
                alert("Pls End or pause previous Activity to start new")
            }

        }
        else if (action === "pause") {
            if (todoOngoing === obj.index.toString()) {
                let newPauseDate= new Date()
                let objStartDate = new Date(obj.StartTime);
                let diffTime = Math.abs(newPauseDate - objStartDate);
                diffTime = Math.ceil(diffTime / (1000));
                console.log(diffTime,newPauseDate,objStartDate)
                PauseTimerOfTodo(obj.index, "Paused", diffTime)
            }
            else {
                alert("pause error")
            }

        }
        else if (action === "resume") {
            if (todoOngoing === "") {
                let objStartDate = new Date();
                StartTimerOfTodo(obj.index, "Ongoing", objStartDate)
                // ResumeTimerOfTodo(obj.index, "Ongoing", diffTime)
            }
            else {
                alert("Pls End or pause all Activities to resume new")
            }

        }
        else if (action === "end") {
            if (todoOngoing === obj.index.toString()) {
                let newPauseDate= new Date()
                let objStartDate = new Date(obj.StartTime);
                let diffTime = Math.abs(newPauseDate - objStartDate);
                diffTime = Math.ceil(diffTime / (1000));
                diffTime=diffTime+obj.bufferTime
                console.log(diffTime,newPauseDate,objStartDate)
                let diffTimeString=calculateTimeToString(diffTime)
                EndTimerOfTodo(obj.index, "Completed", diffTimeString)
            }
            else {
                alert("end error")
            }

        }
    }

    return (
        <div className="TodolistPage-body" style={{ height: "100vh", width: "100vw" }}>
            <header className="TodolistPage-header">
                <div className="TodolistPage-header-username">{UserName}</div>
            </header>
            <section className="TodolistPage-section-container">
                <div className="TodolistPage-section-left-menu">
                    <div className="TodolistPage-left-menu-todolist">To Do List</div>
                    <div className="TodolistPage-left-menu-history">History</div>
                    <div onClick={handleLogoutClick} className="TodolistPage-left-menu-logout">Logout</div>
                </div>

                <div className="TodolistPage-section-listdown-container">
                    <div onClick={handleNewActivityBtnClick} className="TodolistPage-add-new-acivity-btn">Add new Activity</div>
                    <div className="TodolistPage-tablehead">
                        <div className="TodolistPage-tablehead-item"><p className="TodolistPage-tablehead-item-p">Activity</p></div>
                        <div className="TodolistPage-tablehead-item"><p className="TodolistPage-tablehead-item-p">Status</p></div>
                        <div className="TodolistPage-tablehead-item"><p className="TodolistPage-tablehead-item-p">Time taken (Hrs:Min:Sec)</p></div>
                        <div className="TodolistPage-tablehead-item"><p className="TodolistPage-tablehead-item-p">Action</p></div>

                    </div>
                    {todolist.map((ele) => { return <TodoRow handleActionState={handleChangeAction} row={ele} /> })}
                </div>
            </section>
            {newActivityFormVisibility && <NewActivityAdd c setOwnVisibility={setNewActivityFormVisibility} userCookie={userCookie} />}
        </div>
    );
}

export default TodolistPage;