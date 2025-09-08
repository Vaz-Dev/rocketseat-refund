const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")
const expenseList = document.querySelector("ul")
const expensesHeader = document.querySelector("aside header")

amount.oninput = () => {
    let value = amount.value.replace(/\D/g, "")
    value = Number(value)/100
    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value){
    value = value.toLocaleString("pt-BR",{
        style:"currency",
        currency:"BRL",
    })

    return value
}

form.onsubmit = (event) => {
    event.preventDefault()

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }
    expenseAdd(newExpense)
    form.reset()
    expense.focus()
}

function expenseAdd(newExpense) {
    try {
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")
        expenseItem.innerHTML = `
            <img src="./img/${newExpense.category_id}.svg" alt="${newExpense.category_id}" />

            <div class="expense-info">
                <strong>${newExpense.expense}</strong>
                <span>${newExpense.category_name}</span>
            </div>

            <span class="expense-amount"><small>R$</small>${newExpense.amount
                .toUpperCase()
                .replace("R$","")
            }</span>

            <img src="./img/remove.svg" alt="remover" class="remove-icon" />
        `
        expenseList.append(expenseItem)
        updateTotals()
    } catch (error) {
        console.log(error)
        alert("Não foi possível atualizar a lista de despesas.")
    }
}

function updateTotals () {
    try {
        const items = expenseList.children
        let total = 0
        for (item of items) {
            const itemAmount = item.querySelector(".expense-amount")
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")
            value = parseFloat(value)
            total += value
        }
        total = formatCurrencyBRL(total).toUpperCase().replace("R$","")
        expensesHeader.innerHTML = `
        <p>
              Minhas solicitações <i>&bullet;</i>
              <span>${items.length} ${
            items.length != 1 ? "despesas" : "despesa"}
            </span>
            </p>
            <h2><small>R$</small>${total}</h2>
        `
    } catch (error) {
        console.log(error)
        alert("Nao foi possível atualizar os totais da lista.")
    }
}

expenseList.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-icon")) {
        const item = event.target.closest(".expense")
        item.remove()
        updateTotals()
    }
})