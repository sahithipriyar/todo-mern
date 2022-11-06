import { React, useEffect, useState } from "react";
import "./TodoRow.css"


const TodoRow = ({ row, handleActionState }) => {
    const [timeCompleted, setTimeCompleted] = useState("");
    const [startAction, setStartAction] = useState(false);
    const [resumeAction, setResumeAction] = useState(false);
    const [endPauseAction, setEndPauseAction] = useState(false);
    const [nullAction, setNullAction] = useState(false);
    const [timeIntervalID, setTimeIntervalID] = useState();

    const calculateTimeToString = (time) => {
        let hours = parseInt(time / 3600);
        let minutes = parseInt((time % 3600) / 60);
        let seconds = parseInt((time % 3600) % 60);
        return [hours, minutes, seconds];
    }

    const setAllStatusFalse = () => {
        setNullAction(false)
        setEndPauseAction(false);
        setResumeAction(false);
        setStartAction(false);
    }
    useEffect(() => {
        if (row.status === "Pending") {
            setAllStatusFalse();
            setStartAction(true);
        }
        else if (row.status === "Paused") {
            setAllStatusFalse();
            setResumeAction(true);
            let [hours, minutes, seconds] = calculateTimeToString(row.bufferTime);
            let hoursStr = hours.toString(), minutesStr = minutes.toString(), secondsStr = seconds.toString()
            if (hoursStr.length !== 2) { hoursStr = "0" + hoursStr }
            if (minutesStr.length !== 2) { minutesStr = "0" + minutesStr }
            if (secondsStr.length !== 2) { secondsStr = "0" + secondsStr }
            setTimeCompleted(`${hoursStr}:${minutesStr}:${secondsStr}`)
        }
        else if (row.status === "Ongoing") {
            setAllStatusFalse();
            setEndPauseAction(true);
            let newOngoingDate = new Date()
            let objStartDate = new Date(row.StartTime);
            let diffTime = Math.abs(newOngoingDate - objStartDate);
            diffTime = Math.ceil(diffTime / (1000));
            console.log(diffTime, newOngoingDate, objStartDate)
            let [hours, minutes, seconds] = calculateTimeToString(diffTime + row.bufferTime);
            let hoursStr = hours.toString(), minutesStr = minutes.toString(), secondsStr = seconds.toString()
            if (hoursStr.length !== 2) { hoursStr = "0" + hoursStr }
            if (minutesStr.length !== 2) { minutesStr = "0" + minutesStr }
            if (secondsStr.length !== 2) { secondsStr = "0" + secondsStr }
            setTimeCompleted(`${hoursStr}:${minutesStr}:${secondsStr}`)
            if (seconds >= 60) {
                minutes++;
            }
            if (minutes >= 60) {
                hours++
            }
            // let testTime = [hours, minutes, seconds];
            const currTime = {
                hours: hours,
                minutes: minutes,
                seconds: seconds
            }
            const timerID = setInterval((time) => {
                time.seconds++
                if (time.seconds >= 60) {
                    time.minutes++;
                    time.seconds = 0
                    // minutes++;
                }
                if (time.minutes >= 60) {
                    time.minutes = 0
                    time.hours++;
                    // hours++
                }
                hoursStr = time.hours.toString(); minutesStr = time.minutes.toString(); secondsStr = time.seconds.toString()
                if (hoursStr.length !== 2) { hoursStr = "0" + hoursStr }
                if (minutesStr.length !== 2) { minutesStr = "0" + minutesStr }
                if (secondsStr.length !== 2) { secondsStr = "0" + secondsStr }
                setTimeCompleted(`${hoursStr}:${minutesStr}:${secondsStr}`)
            }, 1000, currTime);
            setTimeIntervalID(timerID)
        }
        else {

            setTimeCompleted(row.bufferTime);
            setAllStatusFalse();
            setNullAction(true)
        }
        // console.log(row);
        return (timeIntervalID) => { clearInterval(timeIntervalID) };
    }, [row.status])


    const handleEndClick = () => {
        handleActionState(row, "end");
        clearInterval(timeIntervalID);
    }
    const handlePauseClick = () => {
        handleActionState(row, "pause");
        clearInterval(timeIntervalID);
    }
    const handleStartClick = () => {
        handleActionState(row, "start");
    }
    const handleResumeClick = () => {
        handleActionState(row, "resume");
    }

    return (
        <div className="TodolistPage-tablerow">
            <div className="TodolistPage-tablerow-item"><p className="TodolistPage-tablerow-item-p">{row.activityName}</p></div>
            <div className="TodolistPage-tablerow-item"><p className="TodolistPage-tablerow-item-p">{row.status}</p></div>
            <div className="TodolistPage-tablerow-item"><p className="TodolistPage-tablerow-item-p">{timeCompleted}</p></div>
            <div className="TodolistPage-tablerow-item">
                {nullAction && <p className="TodolistPage-tablerow-resume_null-action" > </p>}
                {startAction && <p className="TodolistPage-tablerow-resume_start-action" onClick={handleStartClick} >Start</p>}
                {resumeAction && <p className="TodolistPage-tablerow-resume_start-action" onClick={handleResumeClick} >Resume</p>}
                {endPauseAction && (<div className="TodolistPage-tablerow-end-pause-action">
                    <div className="TodolistPage-tablerow-end-pause-action-item" onClick={handleEndClick}>End</div>
                    <div className="TodolistPage-tablerow-end-pause-action-item" onClick={handlePauseClick}>Pause</div>
                </div>)}

            </div>
        </div>

    );
}
export default TodoRow;