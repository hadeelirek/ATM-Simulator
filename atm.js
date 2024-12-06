
let currentAccount = null;
let checkedAmount = null;

const accounts = [
    { name: "julia", accountNo: "123456", pin: '2121', balance: 1050 },
    { name: "hadeel", accountNo: '123457', pin: '1212', balance: 1040 },
    { name: "emily", accountNo: '223344', pin: '5555', balance: 950 },
    { name: "Eilias", accountNo: '11', pin: '5', balance: 7000 }
];

function toggleMode() {
    let mode = document.body.className;
    const modeButton = document.getElementById("mode-button");
    if (mode == 'light-mode') {
        document.body.className = 'dark-mode';
        modeButton.innerHTML = "Switch to Light Mode";
    } else {
        document.body.className = "light-mode";
        modeButton.innerHTML = 'Switch to Dark Mode';
    };
}

function goToPage(page) {
    const atmMainPage = document.getElementById("atm");
    const atmButtonsPage = document.getElementById("atm-buttons");
    const withdrawPage = document.getElementById('withdraw');
    const depositPage = document.getElementById("deposit");
    const balancePage = document.getElementById("balance");

    atmMainPage.style.display = page == "atm" ? "block" : "none";
    atmButtonsPage.style.display = page == "atm-buttons" ? "block" : "none";
    withdrawPage.style.display = page == "withdraw" ? "block" : "none";
    depositPage.style.display = page == "deposit" ? "block" : "none";
    balancePage.style.display = page == "balance" ? "block" : "none";

    if (page == "balance") {
        displayBalance();
    };
    //main
    if (page == "atm-buttons") {
        document.getElementById("greeting").innerHTML = "Hi " + currentAccount.name;
        document.getElementById("withdrawal_amount").value = "";
        document.getElementById("amount").value = "";
        document.getElementById("error").innerHTML = "";
    }
    //logout
    if (page == "atm") {
        currentAccount = null;
        localStorage.removeItem("storedAccountNo");
        document.getElementById("withdrawal_amount").value = "";
        document.getElementById("amount").value = "";
        document.getElementById("error").innerHTML = "";
    }
};

function submitPassword() {
    const accountNoInput = document.getElementById('accountNo');
    const pinInput = document.getElementById("pin");

    const accountNo = accountNoInput.value;
    const pin = pinInput.value;

    const errorMessageDiv = document.getElementById('error-message');


    errorMessageDiv.style.display = 'none';


    currentAccount = accounts.find(account => account.accountNo === accountNo && account.pin === pin);

    if (currentAccount) {
        accountNoInput.value = "";
        pinInput.value = "";
        localStorage.setItem("storedAccountNo", currentAccount.accountNo);
        goToPage("atm-buttons");
    } else {
        errorMessageDiv.textContent = 'Incorrect account number or PIN.';
        errorMessageDiv.style.display = 'block';
    }
}

function displayBalance() {
    const balanceInfo = document.getElementById('balance-info');
    balanceInfo.innerHTML = "Account Number: " + currentAccount.accountNo + "<br> Current Balance: $" + currentAccount.balance;
}

const denominations = [100, 50, 20, 10];
const stacksize_notes = [100, 100, 100, 100];

function calculateAtmMoney() {
    let result = 0;
    for (let i = 0; i < denominations.length; i++) {
        result += denominations[i] * stacksize_notes[i];
    };
    return result;
};

function CheckAmount() {
    var amount = document.getElementById("withdrawal_amount").value;
    var atmMoney = calculateAtmMoney();

    if (isNaN(amount) || amount == "" || amount <= 0 || amount % 10 !== 0 || amount > atmMoney) {
        document.getElementById("error").innerHTML = "Amount specified is not valid!<br>Try again!";
        document.getElementById("withdrawInfo").style.display = "none";
    } else {
        if (currentAccount.balance < parseInt(amount)) {
            document.getElementById("error").innerHTML = "Insufficient funds!";
        } else {
            document.getElementById("error").innerHTML = amount + " is a valid amount!";
            document.getElementById("withdrawInfo").style.display = "block";
            ReadNotesStackSize();
            checkedAmount = parseInt(amount);
        };
    }
    return;
}

function ReadNotesStackSize() {
    var output = "";

    for (var i = 0; i < denominations.length; i++) {
        output += "Notes: $" + denominations[i] + ": " + stacksize_notes[i] + "<br>";
    };

    document.getElementById("notesstack").innerHTML = output;
}

function withdraw() {
    var output = "";
    var amount = checkedAmount;
    for (var i = 0; i < denominations.length; i++) {
        var noteCount = Math.floor(amount / denominations[i]);
        if (noteCount > 0) {
            var availableNotes = Math.min(noteCount, stacksize_notes[i]);
            if (availableNotes > 0) {
                output += availableNotes + " x " + "$" + denominations[i] + "<br>";
                amount -= (availableNotes * denominations[i]);

                stacksize_notes[i] -= availableNotes;
            }
        }
    }

    document.getElementById("error").innerHTML = output;
    ReadNotesStackSize();

    currentAccount.balance -= checkedAmount;

    var sentence = "Withdrawn: $" + checkedAmount + ". New Balance: $" + currentAccount.balance;
    alert(sentence);
    checkedAmount = null;
    document.getElementById("withdrawal_amount").value = "";
}

function deposit() {
    const amount = parseInt(document.getElementById('amount').value);
    if (isNaN(amount) || amount <= 0 || amount % 10 !== 0) {
        alert('Please enter a valid amount.');
    } else {
        currentAccount.balance += amount;
        stacksize_notes[3] += amount / 10;
        var sentence = "Deposited: $" + amount + ". New Balance: $" + currentAccount.balance;
        alert(sentence);
    }

}

window.onload = () => {
    let storedAccountNo = localStorage.getItem("storedAccountNo");
    if (storedAccountNo) {
        let foundAccount = accounts.find(account => account.accountNo == storedAccountNo);
        if (foundAccount) {
            currentAccount = foundAccount;
            goToPage("atm-buttons");
        };
    };
};
