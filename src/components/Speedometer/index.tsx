import { useEffect, useRef } from 'react'
import ToastAlert from '../Toast'
import { Data } from '../../types/data'
import { Transactions } from '../../types/transactions'

interface Speedometer extends Data {
  transactions: Array<Transactions>
}

const Speedometer = ({total, expense, invest, income, transactions}: Speedometer) => {
  const speedometer = useRef(null)
  const expenseInvest = expense + invest
  const percent = Number((Number(total) * 100).toFixed(1))
  const available = Number((percent / income).toFixed(1)) || 0
  const percentAlert = 100 - available 
  
  const percentWithInvest = Number(((expenseInvest / income) * 100).toFixed(1))
  useEffect(() => {
    if(speedometer.current) {
      handleCalcRotate(percentWithInvest)
    }
  }, [speedometer, percentWithInvest])
  
  function handleCalcRotate(percent: number) {
    const deg = (percent * 180) / 100
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    speedometer.current.style.transform = `rotate(${deg}deg)`
  }

  return (
    <>
      <div className="container">
        <h3>Nível de risco</h3>
        <div className="wrapper">
          <div className="gauge">
            <div className="slice-colors">
              <div className="st slice-item"></div>
              <div className="st slice-item"></div>
              <div className="st slice-item"></div>
              <div className="st slice-item"></div>
              <div className="st slice-item"></div>
            </div>
            {
              transactions?.length > 0 && (
                <div className="needle" ref={speedometer}></div>
              )
            }
            <div className="gauge-center">
              <p className='percent'>{available}%<span>{available >= 0 ? "Disponível" : "Negativo"}</span></p>
            </div>
          </div>
        </div>
      </div>
      {
        (transactions?.length > 0 && percentAlert > 0) && (   
          <ToastAlert percent={percentAlert} />
        )
      }
    </>
  )
}

export default Speedometer