import { useEffect, useState } from "react";

interface Data {
  percent: number,
}

const ToastAlert = ({percent}: Data) => {
  const [show, setShow] = useState<boolean>(false)
  
  setTimeout(() => {
    setShow(false)
  }, 5000);

  useEffect(() => {
    if(percent > 80) {
      setShow(true)
    }
  }, [percent])
  

  return (
    <div className={show ? "modal show" : "modal"}>
      <div className="toast-content">
        <p>Você já utilizou {percent}% de sua renda</p>
      </div>
    </div>
  )
}

export default ToastAlert