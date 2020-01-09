
import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import data from './data';

function dataProcessing(transactions) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const changedTransactions = transactions.map(transaction => {
    let points = 0;
    if (transaction.amount > 100) {
      let transactionAmount = transaction.amount - 100;
      points += (transactionAmount * 2);
    }
    if (transaction.amount > 50) {
      points += 50;
    }
    const month = new Date(transaction.transactionDate).getMonth();
    return { ...transaction, points, month };
  });
  let perMonthByCustomer = {};
  let totalPointsByCustomer = {};
  changedTransactions.forEach(changedTransactions => {
    let { customerId, name, month, points } = changedTransactions;

    if (!perMonthByCustomer[customerId]) {
      perMonthByCustomer[customerId] = [];
    }
    if (perMonthByCustomer[customerId][month]) {
      perMonthByCustomer[customerId][month].points += points;
      perMonthByCustomer[customerId][month].numOfTransactions++;
    }
    else {
      perMonthByCustomer[customerId][month] = {
        customer: name,
        month: monthNames[month],
        numOfTransactions: 1,
        points: points
      }
    }
    if (!totalPointsByCustomer[customerId]) {
      totalPointsByCustomer[customerId] = {
        customer: name,
        points: 0
      };
    }
    totalPointsByCustomer[customerId].points += points;
  });
  let pointsByCustomerMonth = [];
  for (var custKey in perMonthByCustomer) {
    perMonthByCustomer[custKey].forEach(cRow => {
      pointsByCustomerMonth.push(cRow);
    });
  }
  let pointsByCustomerTotal = [];
  for (custKey in totalPointsByCustomer) {
    pointsByCustomerTotal.push(totalPointsByCustomer[custKey]);
  }
  return {
    pointsByCustomerMonth: pointsByCustomerMonth,
    pointsByCustomerTotal: pointsByCustomerTotal
  };
}

const App = () => {
  const [datasByCustomerMonth, setDatasByCustomerMonth] = useState([])
  const [datasByCustomerTotal, setDatasByCustomerTotal] = useState([])
  const columnsByMonth = [
    { title: 'Customer', field: 'customer' },
    { title: 'Month', field: 'month' },
    { title: '# of Transactions', field: 'numOfTransactions', type: 'numeric' },
    { title: 'Reward Points', field: 'points', type: 'numeric' },
  ]
  const columnsByTotol = [
    { title: 'Customer', field: 'customer' },
    { title: 'Reward Points', field: 'points', type: 'numeric' }
  ]
  useEffect(() => {
    data().then((res) => {
      const results = dataProcessing(res)
      setDatasByCustomerMonth(results.pointsByCustomerMonth)
      setDatasByCustomerTotal(results.pointsByCustomerTotal)
    });
  }, []);
  return (
    <div style={{ width: '70%', padding: '30px 0px', margin: '0 auto' }}>
      <MaterialTable
        title="Rewards Points Total By Customer Per Month"
        columns={columnsByMonth}
        data={datasByCustomerMonth}
      />
      <MaterialTable
        title="Rewards Points Total By Customer"
        columns={columnsByTotol}
        data={datasByCustomerTotal}
        style={{ marginTop: '30px' }}
      />
    </div>
  );
}

export default App