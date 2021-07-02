const transactionsUl = document.querySelector("#transactions")
const incomeDisplay = document.querySelector("#money-plus")
const expenseDisplay = document.querySelector("#money-minus")
const balanceDisplay = document.querySelector("#balance")
const investDisplay = document.querySelector("#invest")
const form = document.querySelector("#form")
const inputTransactionName = document.querySelector("#text")
const inputTransactionAmount = document.querySelector("#amount")
const inputIsInvestment = document.querySelector("#isInvestment")
const body = document.querySelector("body")
const chart = document.querySelector("#chart")

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

const addTransactionIntoDom = ({ amount, name, id, IsInvestment }) => {

  const operator = amount < 0 ? "-" : "+"
  if (IsInvestment == true) var CSSClass = "invest"
  if (amount > 0 && IsInvestment == false) var CSSClass = "plus"
  if (amount < 0 && IsInvestment == false) var CSSClass = "minus"
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

  return investiment.reduce((accumulator, investiment) => accumulator + investiment, 0)
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

const getIncomes = (transactionsIsInvestment, transactionsAmounts) => {
  let investiment = transactionsIsInvestment[transactionsIsInvestment.length - 1]

  if (investiment == true) {
    return transactionsAmounts.filter(value => value > 0).reduce((accumulator) => accumulator).toFixed(2)
  } else {
    return transactionsAmounts.filter(value => value > 0).reduce((accumulator, value) => accumulator + value, 0).toFixed(2)
  }

}

const getTotal = (transactionsAmounts) =>
  transactionsAmounts.reduce((accumulator, transaction) => accumulator + transaction, 0).toFixed(2)


const updateBalanceValues = () => {
  const transactionsIsInvestment = transactions.map(({ IsInvestment }) => IsInvestment)
  const transactionsAmounts = transactions.map(({ amount }) => amount)
  const invest = getInvests(transactionsIsInvestment, transactionsAmounts)
  const total = getTotal(transactionsAmounts)
  const income = getIncomes(transactionsIsInvestment, transactionsAmounts)
  const expense = getExpenses(transactionsIsInvestment, transactionsAmounts)

  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `R$ ${income}`
  expenseDisplay.textContent = `R$ ${expense}`
  investDisplay.textContent = `R$ ${Math.abs(invest)}`

  transactionsUl.scroll({ top: 2000, left: 0, behavior: 'smooth' });

  if (balanceDisplay.textContent == "R$ 0.00" && incomeDisplay.textContent == "R$ 0.00") {

    chart.classList.add("none")

  } else {

    chart.classList.remove("none")

    let xValues = ["Receita", "Despesas", "Investimentos"];
    let yValues = [income, expense, invest];
    let barColors = ["#2ecc71", "#e74c3c", "#008aff"];

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

const addToTransactionsArray = (transactionName, transactionAmount, IsInvestment) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount),
    IsInvestment
  })
}

const cleanInputs = () => {
  inputTransactionName.value = ""
  inputTransactionAmount.value = ""
  inputIsInvestment.checked = false;
}

const handleFormSubmit = event => {
  event.preventDefault()

  const transactionName = inputTransactionName.value.trim()
  const transactionAmount = inputTransactionAmount.value.trim()
  const IsInvestment = inputIsInvestment.checked
  const isSomeInputEmpty = transactionName === "" || transactionAmount === ""

  if (isSomeInputEmpty) {
    alert("Por favor, preencha os dados da transação!")
    return
  }

  addToTransactionsArray(transactionName, transactionAmount, IsInvestment)
  init()
  updateLocalStorage()

  cleanInputs()
}

form.addEventListener("submit", handleFormSubmit)


/* ======== Chamada PWA ========= */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("./serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}
