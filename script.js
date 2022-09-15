'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, index) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  }, 1000);
};

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

const displaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((mov, cur) => mov + cur, 0);
  labelSumIn.textContent = `${Math.abs(incomes.toFixed(2))}€`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur);
  labelSumOut.textContent = `${Math.abs(out.toFixed(2))}€`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, cur) => acc + cur);
  labelSumInterest.textContent = `${Math.abs(interest.toFixed(2))}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (user, i) {
    user.username = user.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0]) //returns an array
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc.movements);
  // Display Balance
  displayBalance(acc);
  // Display Summary
  displaySummary(acc);
};

// Login function
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // prevents form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI ang Message
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  } else {
    console.error('User not found!');
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(mov => mov > amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }else if(currentAccount.movements.some(mov => mov < amount * 0.1)){
    alert(`You cannot loan any amount more than the 10% of your biggest deposit! ${amount * 0.1} is greater than ${currentAccount.movements.reduce((mov, cur) => mov > cur ? mov : cur)} `)
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // Hide UI
    containerApp.style.opacity = 0;
    // delete user
    accounts.splice(index, 1);
    inputCloseUsername.value = inputClosePin.value = '';
    labelWelcome.textContent = 'Log in to get started';
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// console.log('---------- FORLOOP----------');
// console.log('');
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // for(const movement of movements){
// for (const [index, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${index + 1}: You deposited ${movement} Pesos`);
//   } else {
//     console.log(
//       `Movement ${index + 1}: You withdrew ${Math.abs(movement)} Pesos`
//     );
//   }
// }

// console.log('');
// console.log('---------- FOREACH ----------');
// console.log('');

// movements.forEach(function (movement, i, arr) {
//   // (element, index, array) -> order of arguments in forEach
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement} Pesos`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)} Pesos`);
//   }
// });

// console.log('');
// console.log('---------- FOREACH MAP----------');
// console.log('');

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key} : ${value}`);
// });

// console.log('');
// console.log('---------- FOREACH SETS----------');
// console.log('');

// const uniqueCurrencies = new Set(['USD', 'GBP', 'USD', 'EURO', 'EURO']);

// uniqueCurrencies.forEach((value, _, map) => {
//   console.log(`${value} : ${value}`);
// });

// function checkDogs(dogArr1, dogArr2) {
//   let juliasDogsCorrected = dogArr1.slice(1, 3);
//   let allDogs = [...juliasDogsCorrected, ...dogArr2];

//   allDogs.forEach(function (dogAge, index) {
//     if (dogAge >= 3) {
//       console.log(
//         `Dog number ${index + 1} is an Adult 🐩, and is ${dogAge} years old`
//       );
//     } else {
//       console.log(`Dog number ${index + 1} is still a puppy 🐶`);
//     }
//   });
// }

// let Julia = [3, 5, 2, 12, 7];
// let Kate = [4, 1, 15, 8, 3];

// checkDogs(Julia, Kate);

const eurToUSD = 1.1;

// let movementsUSD = movements.map(mov => mov * eurToUSD);

// console.log(movementsUSD);

// const movementsDescription = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );

// console.log(movementsDescription.join('\n'));

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// const withdrawals = movements.filter(mov => mov < 0);

// console.log(movements);
// console.log(deposits);
// console.log(withdrawals);

// const balance = movements.reduce((acc, cur) => acc + cur, 0);

// console.log(balance);

// Display Maximum Value
// const max = movements.reduce((acc,cur) => acc > cur ? acc : cur, movements[0])
// console.log(max);

// const calcAverageHumanAge = function (dogs_ages) {
//   const dogAgeCalculated = dogs_ages
//     // Calculate the dog age in human years
//     .map(dogAge => (dogAge <= 2 ? dogAge * 2 : 16 + dogAge * 4))
//     //Exclude all dogs that are less than 18 human years old
//     .filter(dogAge => dogAge >= 18)
//     // Calculate the average human age of all adult dogs
//     .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
//   return dogAgeCalculated;
// };

// const data1 = [5, 2, 4, 1, 15, 8, 3];
// const data2 = [16, 6, 10, 5, 6, 1, 4];

// let avg1 = calcAverageHumanAge(data1);
// let avg2 = calcAverageHumanAge(data2);

// console.log(`Average 1 : ${Math.abs(avg1.toFixed(2))}`);
// console.log(`Average 2 : ${Math.abs(avg2.toFixed(2))}`);

// const totalDepositUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUSD)
//   .reduce((acc, cur) => acc + cur);

// console.log(totalDepositUSD);

// const account = accounts.find(acc => acc.owner === 'Sarah Smith');
// console.log(account);

// for (const account of accounts) {
//   if (account.owner === 'Sarah Smith') {
//     console.log(account);
//   }
// }

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);
