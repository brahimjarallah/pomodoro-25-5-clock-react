function App() {
  const [displayTime, setDisplayTime] = React.useState(60 * 25)
  const [breakTime, setBreaktime] = React.useState(60 * 5)
  const [sessionTime, setSessionTime] = React.useState(60 * 25)
  const [timerOn, setTimerOn] = React.useState(false)
  const [onBreak, setOnBreak] = React.useState(false)
  const [breakAudio, setBreakAudio] = React.useState(
    new Audio("./double-beep.mp3")
  )

  const playBreakSound = () => {
    breakAudio.currenTime = 0
    breakAudio.play()
  }

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60)
    let seconds = time % 60
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    )
  }
  const changeTime = (ammount, type) => {
    if (type == "break") {
      if (breakTime <= 60 && ammount < 0) {
        return
      }
      if (breakTime >= 1500 && ammount > 0) {
        return
      }
      setBreaktime((prev) => prev + ammount)
    } else {
      if (sessionTime <= 60 && ammount < 0) {
        return
      }
      if (sessionTime >= 3600 && ammount > 0) {
        return
      }
      setSessionTime((prev) => prev + ammount)

      if (!timerOn) {
        setDisplayTime(sessionTime + ammount)
      }
    }
  }

  const controlTime = () => {
    let second = 1000
    let date = new Date().getTime()
    let nextDate = new Date().getTime() + second
    let onBreakVariable = onBreak
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime()
        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              playBreakSound()
              onBreakVariable = true
              setOnBreak(true)
              return breakTime
            } else if (prev <= 0 && onBreakVariable) {
              playBreakSound()
              onBreakVariable = false
              setOnBreak(false)
              return sessionTime
            }
            return prev - 1
          })
          nextDate += second
        }
      }, 30)
      localStorage.clear()
      localStorage.setItem("interval-id", interval)
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"))
    }
    setTimerOn(!timerOn)
  }

  const resetTime = () => {
    setDisplayTime(60 * 25)
    setBreaktime(60 * 5)
    setSessionTime(60 * 25)
  }
  return (
    <div>
      <h1 className="center-align">Pomodoro Clock</h1>
      <div className="dual-container">
        <Length
          title="break length"
          type="break"
          changeTime={changeTime}
          time={breakTime}
          formatTime={formatTime}
        />
        <Length
          title="session length"
          type="session"
          changeTime={changeTime}
          time={sessionTime}
          formatTime={formatTime}
        />
      </div>
      <div className="display-time">
        <h1 className="display-title">{onBreak ? "Break" : "Session"}</h1>
        <h1>{formatTime(displayTime)}</h1>
        <button
          onClick={controlTime}
          className="btn-large deep-purple lighten-2"
        >
          {timerOn ? (
            <i className="material-icons">pause_circle_filled</i>
          ) : (
            <i className="material-icons">play_circle_filled</i>
          )}
        </button>
        <button onClick={resetTime} className="btn-large deep-purple lighten-2">
          <i className="material-icons">autorenew</i>
        </button>
      </div>
    </div>
  )
}

function Length({ title, changeTime, type, time, formatTime }) {
  return (
    <div>
      <h3>{title}</h3>,
      <div className="time-sets">
        <button
          onClick={() => {
            changeTime(-60, type)
          }}
          className="btn-small deep-purple lighten-2"
        >
          <i className="small material-icons">arrow_downward</i>
        </button>
        <h3>{formatTime(time)}</h3>
        <button
          onClick={() => changeTime(60, type)}
          className="btn-small deep-purple lighten-2"
        >
          <i className="small material-icons">arrow_upward</i>
        </button>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
