'use strict';
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Vignesh Vicky',
  movements: [200.56, 450.34, -400.343, 3000.4, -650.99, -130.6, 70.1, 1300.3],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2024-09-04T18:30:00.000Z',
    '2024-10-10T18:30:00.000Z',
    '2024-10-19T18:30:00.000Z',
    '2024-10-20T18:30:00.000Z',
    '2024-10-21T18:30:00.000Z',
    '2024-10-26T18:30:00.000Z',
    '2024-10-30T18:30:00.000Z',
    '2024-10-31T18:30:00.000Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const account2 = {
  owner: 'Sakthi Sri',
  movements: [
    5000.1, 3400.2, -150.4, -790.32, -3210.98, -1000, 8500.23, -30.22,
  ],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2024-09-04T18:30:00.000Z',
    '2024-10-10T18:30:00.000Z',
    '2024-10-19T18:30:00.000Z',
    '2024-10-20T18:30:00.000Z',
    '2024-10-21T18:30:00.000Z',
    '2024-10-26T18:30:00.000Z',
    '2024-10-30T18:30:00.000Z',
    '2024-10-31T18:30:00.000Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Pradeep PV',
  movements: [200.1, -200.2, 340.3, -300.4, -20.6, 50.65, 400.23, -460.78],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2024-09-04T18:30:00.000Z',
    '2024-10-10T18:30:00.000Z',
    '2024-10-19T18:30:00.000Z',
    '2024-10-20T18:30:00.000Z',
    '2024-10-21T18:30:00.000Z',
    '2024-10-26T18:30:00.000Z',
    '2024-10-30T18:30:00.000Z',
    '2024-10-31T18:30:00.000Z',
  ],
  currency: 'EUR',
  locale: 'en-GB',
};

const account4 = {
  owner: 'Vijay Kumar',
  movements: [430.3, 1000.4, 700.3, 50.3, 90.0],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2024-10-20T18:30:00.000Z',
    '2024-10-21T18:30:00.000Z',
    '2024-10-26T18:30:00.000Z',
    '2024-10-30T18:30:00.000Z',
    '2024-10-31T18:30:00.000Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const operationTransferContainer = document.querySelector(
  '.operation--transfer'
);
const operationLoanContainer = document.querySelector('.operation--loan');
const operationCloseContainer = document.querySelector('.operation--close');

const footerEl = document.getElementsByTagName('footer');

// footer message
document.getElementById('year').textContent = new Date().getFullYear();
// functions
// calc day
const formatMovementsDate = date => {
  // date difference clc
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (24 * 60 * 60 * 1000));
  const daysPassed = calcDaysPassed(new Date(), date);
  // returning date difference
  if (daysPassed == 0) return 'Today';
  if (daysPassed == 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// displaying movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  // sorted array
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date);
    const formattedMovementsAmount = new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: acc.currency,
    }).format(mov);
    const html = `
    <div class="movements__row ">
      <div class="movements__type movements__type--${type}">${i + 1
      } ${type}</div>     
      <div class="movements__date">${displayDate}</div> 
      <div class="movements__value">${formattedMovementsAmount}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displaying total balance
const calcPrintBalance = acc => {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  const formattedTotalBalance = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(acc.balance);
  labelBalance.textContent = `${formattedTotalBalance}`;
};

// display summary
const calcDisplaySummary = acc => {
  // total income
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const formattedTotalIncome = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(incomes);
  labelSumIn.textContent = `${formattedTotalIncome}`;
  // total outgoing
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const formattedTotalOut = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(out);
  labelSumOut.textContent = `${formattedTotalOut}`;
  // interest
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  const formattedTotalIntrest = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(interest);
  labelSumInterest.textContent = `${formattedTotalIntrest}`;
};

// creating usernames using their owner names
const createUsernames = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(username => username[0])
      .join('');
  });
};
createUsernames(accounts);

// elements blured
const bluredElements = [
  labelDate,
  labelBalance,
  labelSumIn,
  labelSumOut,
  labelSumInterest,
  labelTimer,
  containerMovements,
  operationTransferContainer,
  operationLoanContainer,
  operationCloseContainer,
];
// update ui function
const updateUI = acc => {
  // display movements
  displayMovements(acc);
  // display balance
  calcPrintBalance(acc);
  // display summary
  calcDisplaySummary(acc);
};
// after submitting username pin event
const resetInputDetails = () => {
  // clear input fields
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  // losing focus
  inputLoginUsername.blur();
  inputLoginPin.blur();
};
// logout timer function
const startLogoutTimer = () => {
  let time = 300;
  const timer = setInterval(() => {
    // min and sec
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String((time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    // clear interval after becomes 0
    if (time === 0) {
      clearInterval(timer);
      // logging out or back to initial stage
      labelWelcome.textContent = 'Log in to get started';
      // adding blur
      const addingBlur = bluredElements => {
        bluredElements.forEach(bluredElement => {
          bluredElement.classList.add('blur');
          bluredElement.classList.remove('remove-blur');
        });
      };
      addingBlur(bluredElements);
      resetInputDetails();
    }
    time--;
  }, 1000);
  return timer;
};
// event listeners
let currentAccount, timer;
// displaying details of the user
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display username
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]
      }`;
    // showing current date at top
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const day = `${now.getDate()}`.padStart(2, 0);
    const hour = `${now.getHours()}`.padStart(2, 0);
    const minute = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;
    // removing blur
    const removingBlur = bluredElements => {
      bluredElements.forEach(bluredElement => {
        bluredElement.classList.remove('blur');
        bluredElement.classList.add('remove-blur');
      });
    };
    removingBlur(bluredElements);
    resetInputDetails();
    // logout timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
    // update ui
    updateUI(currentAccount);
  } else {
    resetInputDetails();
    alert(`Wrong username or pin. Please enter a valid details.`);
  }
});

// transfer amount from current user to another user
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // input txt delete
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    currentAccount.username !== receiverAcc.username
  ) {
    // updating transfer amount
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // updating transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // update ui
    updateUI(currentAccount);
    // reset timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
  }
});

// close account
btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // deleting account
    const index = accounts.findIndex(
      acc => currentAccount.username === acc.username
    );
    accounts.splice(index, 1);
    // reset values to default
    // set default welcome text
    labelWelcome.textContent = 'Log in to get started';
    // adding blur
    const addingBlur = bluredElements => {
      bluredElements.forEach(bluredElement => {
        bluredElement.classList.add('blur');
        bluredElement.classList.remove('remove-blur');
      });
    };
    addingBlur(bluredElements);
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
  inputCloseUsername.blur();
});

// loan processing
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      // add loan
      currentAccount.movements.push(amount);
      // updating date date
      currentAccount.movementsDates.push(new Date().toISOString());
      // updating ui
      updateUI(currentAccount);
      // reset timer
      if (timer) clearInterval(timer);
      timer = startLogoutTimer();
    }, 1500);
    // loose focus
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
});

// sorting the movements
let isSorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount, !isSorted);
  isSorted = !isSorted;
});
