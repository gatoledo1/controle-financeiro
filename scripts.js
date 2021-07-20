const transactionsUl = document.querySelector("#transactions")
const incomeDisplay = document.querySelector("#money-plus")
const expenseDisplay = document.querySelector("#money-minus")
const balanceDisplay = document.querySelector("#balance")
const investDisplay = document.querySelector("#invest")
const form = document.querySelector("#form")
const inputTransactionName = document.querySelector("#text")
const inputTransactionAmount = document.querySelector("#amount")
const inputIsInvestment = document.querySelector("#isInvestment")
const inputNotCount = document.querySelector("#notCount")
const body = document.querySelector("body")
const chart = document.querySelector("#chart")
const speedometer = document.querySelector(".needle")
const modalAlert = document.querySelector(".modal")
const toastAlert = document.querySelector(".toast-content")

const manipuleModal = (percent) => {
  toastAlert.innerHTML = `<p>Cuidado!! Você ja gastou ${percent}% de sua renda</p>`
  modalAlert.style.transform = "translate(0, 0)"
  modalAlert.style.transition = "opacity 0.7s, transform 0.5s"
  modalAlert.style.opacity = 1

  setTimeout(() => {
    modalAlert.style.transform = "translate(0, 110%)"
  }, 5000);
}

const localStorageTransactions = JSON.parse(localStorage
  .getItem("transactions"))
let transactions = localStorage
  .getItem("transactions") !== null ? localStorageTransactions : []

const removeTransaction = ID => {
  transactions = transactions.filter(transaction =>
    transaction.id !== ID)
  updateLocalStorage()
  init()
}

const addTransactionIntoDom = ({ amount, name, id, IsInvestment, IsNotCount }) => {

  const operator = amount < 0 ? "-" : "+"
  if (IsInvestment == true) var CSSClass = "invest"
  if (IsNotCount == true) var CSSClass = "justTotal"
  if (amount > 0 && IsInvestment != true && IsNotCount != true) var CSSClass = "plus"
  if (amount < 0 && IsInvestment != true && IsNotCount != true) var CSSClass = "minus"
  const amountWithoutOperator = Math.abs(amount)
  const li = document.createElement("li")

  li.classList.add(CSSClass)
  li.innerHTML = `
    ${name} 
    <span>${operator} R$${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">
      x
    </button>
  `
  transactionsUl.append(li)
}

function getInvests(transactionsIsInvestment, transactionsAmounts) {
  var investiment = []
  for (let index = 0; index < transactionsIsInvestment.length; index++) {
    if (transactionsIsInvestment[index] == true) {
      investiment = [...investiment, transactionsAmounts[index]]
    }
  }

  return Math.abs(investiment.reduce((accumulator, investiment) => accumulator + investiment, 0))
    .toFixed(2)
}

function getNotCount(transactionsIsNotCount, transactionsAmounts) {
  var arrayJustTotal = []
  for (let index = 0; index < transactionsIsNotCount.length; index++) {
    if (transactionsIsNotCount[index] == true) {
      arrayJustTotal = [...arrayJustTotal, transactionsAmounts[index]]
    }
  }

  return arrayJustTotal.reduce((accumulator, arrayJustTotal) => accumulator + arrayJustTotal, 0)
    .toFixed(2)
}

const getExpenses = (transactionsIsInvestment, transactionsAmounts) => {
  let expenseT = []
  for (let index = 0; index < transactionsIsInvestment.length; index++) {
    if (transactionsIsInvestment[index] == false) {
      expenseT = [...expenseT, transactionsAmounts[index]]
    }
  }
  return Math.abs(expenseT.filter(value => value < 0).reduce((accumulator, value) => accumulator + value, 0)).toFixed(2)

}

const getIncomes = (transactionsIsInvestment, transactionsIsNotCount, transactionsAmounts) => {
  let incomeT = []
  for (let index = 0; index < transactionsIsNotCount.length; index++) {
    if (transactionsIsInvestment[index] != true && transactionsIsNotCount[index] != true) {
      incomeT = [...incomeT, transactionsAmounts[index]]
    }
  }
  return incomeT.filter(value => value > 0).reduce((accumulator, value) => accumulator + value, 0).toFixed(2)


}

const getTotal = (transactionsAmounts) =>
  transactionsAmounts.reduce((accumulator, transaction) => accumulator + transaction, 0).toFixed(2)


const updateBalanceValues = () => {
  const transactionsIsInvestment = transactions.map(({ IsInvestment }) => IsInvestment)
  const transactionsIsNotCount = transactions.map(({ IsNotCount }) => IsNotCount)
  const transactionsAmounts = transactions.map(({ amount }) => amount)
  const invest = getInvests(transactionsIsInvestment, transactionsAmounts)
  const justTotal = getNotCount(transactionsIsNotCount, transactionsAmounts)
  const total = getTotal(transactionsAmounts)
  const income = getIncomes(transactionsIsInvestment, transactionsIsNotCount, transactionsAmounts)
  const expense = getExpenses(transactionsIsInvestment, transactionsAmounts)

  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `R$ ${income}`
  expenseDisplay.textContent = `R$ ${expense}`
  investDisplay.textContent = `R$ ${invest}`

  transactionsUl.scroll({ top: 2000, left: 0, behavior: 'smooth' });

  if (balanceDisplay.textContent == "R$ 0.00" && incomeDisplay.textContent == "R$ 0.00") {

    chart.classList.add("none")

  } else {

    var expenseInvest = expense * 1 + invest * 1
    var percent = ((expenseInvest / income) * 100).toFixed(1)
    var percent2 = (total * 100).toFixed(1)
    let available = (percent2 / income).toFixed(1)
    available = `<p class='percent'>${available}%<span>Disponível</span></p>`

    document.querySelector(".gauge-center").innerHTML = available

    if (percent < 20.0) {
      speedometer.style.transform = "rotate(10deg)"
    }
    else if (percent > 20.0 && percent < 40.0) {
      speedometer.style.transform = "rotate(40deg)"
    }
    else if (percent > 40.0 && percent < 60.0) {
      speedometer.style.transform = "rotate(105deg)"
    }
    else if (percent > 60.0 && percent < 80.0) {
      speedometer.style.transform = "rotate(140deg)"
    }
    else if (percent > 80.0 && percent < 95.0) {
      speedometer.style.transform = "rotate(160deg)"
      manipuleModal(percent)
    }
    else if (percent > 95.0 && percent < 250.0) {
      speedometer.style.transform = "rotate(182deg)"
      manipuleModal(percent)
    }

    chart.classList.remove("none")

    let xValues = ["Saldo", "Despesas", "Investimentos"];
    let yValues = [total, expense, Math.abs(invest)];
    let barColors = ["#9f58f6", "#e74c3c", "#008aff"];

    new Chart("chart", {
      type: "doughnut",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      }
    });
  }

}

const init = () => {
  transactionsUl.innerHTML = ""
  transactions.forEach(addTransactionIntoDom)
  updateBalanceValues()

}

init()

const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionAmount, IsInvestment, IsNotCount) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount),
    IsInvestment,
    IsNotCount
  })
}

const cleanInputs = () => {
  inputTransactionName.value = ""
  inputTransactionAmount.value = ""
  inputIsInvestment.checked = false;
  inputNotCount.checked = false;
}

const handleFormSubmit = event => {
  event.preventDefault()

  const transactionName = inputTransactionName.value.trim()
  const transactionAmount = inputTransactionAmount.value.trim()
  const IsInvestment = inputIsInvestment.checked
  const IsNotCount = inputNotCount.checked
  const isSomeInputEmpty = transactionName === "" || transactionAmount === ""

  if (isSomeInputEmpty) {
    alert("Por favor, preencha os dados da transação!")
    return
  }

  addToTransactionsArray(transactionName, transactionAmount, IsInvestment, IsNotCount)
  init()
  updateLocalStorage()

  cleanInputs()
}

form.addEventListener("submit", handleFormSubmit)

/* ======== DATE TO PRINT ========= */
let data = new Date()
let dataFormatada = ((data.getDate())) + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear()
document.querySelector("#date-print").innerHTML = `Data: ${dataFormatada}`

const downloadPDF = document.querySelector("#download")
downloadPDF.addEventListener("click", () => {
  window.print()
})

/* ======== Chamada PWA ========= */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("./serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}
