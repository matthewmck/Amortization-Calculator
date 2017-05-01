var submit = document.getElementById('calc');
var reset = document.getElementById('reset');
var topActive = document.getElementById('top');
var paymentInfo = document.getElementById('paymentInfo');
var loanInfo = document.getElementById('loanInfo');
var container = document.getElementById('container');
var check = document.getElementById('check');

//Resets all input box's, check, and container
reset.addEventListener("click", function(){
	document.getElementById('loan').value = '';
	document.getElementById('interest').value = '';
	document.getElementById('term').value = '';
	check.innerHTML = '';

	//Clears container and container properties
	container.innerHTML = '';
	container.classList.remove("containerProperties");
	topActive.classList.remove("topActive");

	//Clears out payment and loan info divs
	paymentInfo.classList.remove("left");
	paymentInfo.innerHTML = '';
	loanInfo.classList.remove("right");
	loanInfo.innerHTML = '';
})

//When 'calculate' is clicked --> collect loan amount, interest, and term --> 
// clear previous calculations --> preform vaildation check --> initiate calculation 
submit.addEventListener("click", function(){
	var loanAmount = document.getElementById('loan').value;
	var interest = document.getElementById('interest').value;
	var term = document.getElementById('term').value;

	////Clears container and add's container properties
	container.innerHTML = '';
	paymentInfo.innerHTML = '';
	loanInfo.innerHTML = '';
	
	// Check for valid inputs
	if (loanAmount <= 0 || isNaN(Number(loanAmount))) {
		check.innerHTML = "Please enter vaild loan amount.";
	} else if (interest <= 0 || isNaN(Number(interest))) {
		check.innerHTML = "Please enter valid interest rate.";
	} else if (term <= 0 || isNaN(Number(term))) {
		check.innerHTML = "please enter a valid term.";
	} else {
		check.innerHTML = '';
		doMath(Number(loanAmount), Number(interest), Number(term));
	}
});

//Calculates amortization schedule and displays result
function doMath (loanAmount, interest, term) {
	var interestDecimal = interest/100; 	
	var monthlyRate = interestDecimal/12;	
	var numOfPayments = term*12;			

	container.classList.add("containerProperties");
	topActive.classList.add("topActive");

	//Calculates monthly payment
	var monthlyPayment = loanAmount*(monthlyRate)*Math.pow((1 + monthlyRate), numOfPayments) /
		(Math.pow((1 + monthlyRate), numOfPayments) - 1);

	//Payment info
	displayPaymentInfo(round(monthlyPayment, 2), numOfPayments);

	//loan info
	displayLoanInfo(monthlyPayment, numOfPayments, loanAmount);	

	var table = '';

	table += '<table><thead>';
	table += '<tr><th>Payment</th>';
	table += '<th>Amount</th>';
	table += '<th>Principal</th>';
	table += '<th>Interest</th>';
	table += '<th>Balance</th></tr>';
	table += '</thead><tbody>';

	var amount = loanAmount; 	//Holds current balance

	//Calculates amoritization schedule
	for(var i = 1; i <= numOfPayments; i++) {

		var interestAmount = amount*monthlyRate; 			//Amount of interest in monthly payment
		var principal = monthlyPayment - interestAmount; 	//Amount going towards the principal
		amount -= principal 								//Calculates remaning balance

		table += '<tr><td>' + i + '</td>';
		table += '<td>$' + round(monthlyPayment, 2) + '</td>';
		table += '<td>$' + round(principal, 2) + '</td>';
		table += '<td>$' + round(interestAmount, 2) + '</td>';
		table += '<td class="balance">$' + round(amount, 2) + '</td></tr>';

	}

	table += '</tbody></table>';
	container.innerHTML = table;
}

//Workaround for float point arithmetic. Properly rounds num and add's commas 
function round(num) {
	var result = (Math.round(num*Math.pow(10,2))/ Math.pow(10,2)).toFixed(2);
	return Number(result).toLocaleString()
}

//Checks input box to ensure only numbers are entered
function isNumber(key) {
	if (key.which == 8) {
		return true
	} else if (key.which < 48 || key.which > 57) {
  		return false
  	} else {
  		return true
  	}
}

//Checks interest rate input box, if not a number or decimal then invalid input
function isNumberOrDecimal(key) {
	if (key.which == 46) {
		return true
	} else if (key.which == 8) {
		return true
	} else if (key.which < 48 || key.which > 57) {
  		return false
  	} else {
		return true
  	}
}

function displayPaymentInfo (i, n) {
	paymentInfo.classList.add("left");
	var paymentInfoDiv = document.createElement('div');
	paymentInfo.appendChild(paymentInfoDiv);

	paymentInfoDiv.innerHTML += '<div class="infoProperties">Monthly Payment</div>';
	paymentInfoDiv.innerHTML += '<div>$' + i + '</div>';	
	paymentInfoDiv.innerHTML += '<div class="infoProperties">Number of Payments</div>';
	paymentInfoDiv.innerHTML += '<div>' + n + '</div>';	
}

function displayLoanInfo (i, n, z) {
	var totalAmount = (i * n).toFixed(2);		
	var displayAmount = Number(totalAmount).toLocaleString();
	var totalInterest = Number((totalAmount - z).toFixed(2)).toLocaleString(); 

	loanInfo.classList.add("right");
	var loanInfoDiv = document.createElement('div');
	loanInfo.appendChild(loanInfoDiv);

	loanInfoDiv.innerHTML += '<div class="infoProperties">Amount of Interest</div>';
	loanInfoDiv.innerHTML += '<div>$' + totalInterest + '</div>';	
	loanInfoDiv.innerHTML += '<div class="infoProperties">Total Cost</div>';
	loanInfoDiv.innerHTML += '<div>$' + displayAmount + '</div>';
}
