function eval() {
  // Do not use eval!!!
  return;
}
let operators = ["+", "-", "*", "/"];

function check(expr) {
  const openBrackets = expr.match(/[(]/g);
  const closenBrackets = expr.match(/[)]/g);

  if ((!openBrackets && closenBrackets) || (openBrackets && !closenBrackets))
    throw "ExpressionError: Brackets must be paired";
  if (openBrackets && closenBrackets) {
    if (openBrackets.length !== closenBrackets.length) {
      throw "ExpressionError: Brackets must be paired";
    }
  }
  return true;
}

function exprToArray(expr) {
    let arr = [];
    let number = "";
    let i = 0;
    while (i < expr.length) {
        if (operators.includes(expr[i]) || expr[i] == "(" || expr[i] == ")") {
            if (number.length != 0) {
                arr.push(Number(number));
                number = "";
            }
            arr.push(expr[i]);
            i++;
        }
        else {
            number += expr[i];
            i++;
        }
    }
    if (number.length != 0)
        arr.push(Number(number));
    return arr;
}

function removeSpaces(expr) {
  let re = /\s/g;
  return expr.replace(re, "");
}

function getPrrioritet(symbol) {
  if (symbol == "*" || symbol == "/") return 2;
  if (symbol == "+" || symbol == "-") return 1;
  else return 0;
}

function exprtToRPN(expr) {
  let stack = [];
  let exprRPN = [];
  for (i = 0; i < expr.length; i++) {
    if (expr[i] == "(") stack.push(expr[i]);
    else if (operators.includes(expr[i])) {
      if (stack.length == 0) {
        stack.push(expr[i]);
      } else {
        while (
          stack.length != 0 &&
          getPrrioritet(expr[i]) <= getPrrioritet(stack[stack.length - 1]) &&
          stack[stack.length - 1] != "("
        ) {
          exprRPN.push(stack.pop(stack.length - 1));
        }

        stack.push(expr[i]);
      }
    } else if (expr[i] == ")") {
      while (stack[stack.length - 1] != "(") {
        exprRPN.push(stack.pop(stack.length - 1));
      }
      stack.pop(stack.length - 1);
    } else exprRPN.push(expr[i]);
  }

  while (stack.length != 0) {
    if (stack[stack.length - 1] != "(")
      exprRPN.push(stack.pop(stack.length - 1));
    else stack.pop(stack.length - 1);
  }
  return exprRPN;
}

function calculate(exprRPN) {
  let stack = [];
  let operand1;
  let operand2;

  for (i = 0; i < exprRPN.length; i++) {
    if (operators.includes(exprRPN[i])) {
      switch (exprRPN[i]) {
        case "+":
          operand1 = stack.pop(stack[stack.length - 1]);
          operand2 = stack.pop(stack[stack.length - 1]);
          stack.push(operand1 + operand2);
          break;
        case "-":
          operand1 = stack.pop(stack[stack.length - 1]);
          operand2 = stack.pop(stack[stack.length - 1]);
          stack.push(operand2 - operand1);
          break;
        case "*":
          operand1 = stack.pop(stack[stack.length - 1]);
          operand2 = stack.pop(stack[stack.length - 1]);
          stack.push(operand1 * operand2);
          break;
        case "/":
          operand1 = stack.pop(stack[stack.length - 1]);
          if (operand1 == 0) throw "TypeError: Division by zero.";
          operand2 = stack.pop(stack[stack.length - 1]);
          stack.push(operand2 / operand1);
          break;
        case "^":
          operand1 = stack.pop(stack[stack.length - 1]);
          operand2 = stack.pop(stack[stack.length - 1]);
          stack.push(Math.pow(operand1, operand2));
          break;
      }
    } else stack.push(Number(exprRPN[i]));
  }
  return stack[0];
}

function expressionCalculator(expr) {
  let arr = exprToArray(removeSpaces(expr));
  if (check(expr)) return calculate(exprtToRPN(arr));
  else throw "Invalid expression!";
}

module.exports = {
  expressionCalculator
};
