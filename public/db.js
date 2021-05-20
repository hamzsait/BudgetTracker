let db 

const request = indexedDB.open('budgetDB', 1)

request.onupgradeneeded = (e) => {

    db = e.target.result
    db.createObjectStore("BudgetStore", {autoIncrement: true})

}

request.onsuccess = (e) => {

    db = e.target.result

    if (navigator.onLine){
        checkDB()
    }

}

request.onerror = (e) => {

    console.log(`Error: ${e.target.errorCode}`);

};

saveDB = (record) => {
    
    const transaction = db.transaction(["BudgetStore"], "readwrite");
    const store = transaction.objectStore("BudgetStore");
    store.add(record);

}

checkDB = () => {
  
    let transaction = db.transaction(['BudgetStore'], 'readwrite');
    const store = transaction.objectStore('BudgetStore');
    const getAll = store.getAll();
  

    getAll.onsuccess = function () {
      if (getAll.result.length > 0) {
        fetch('/api/transaction/bulk', {
          method: 'POST',
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.length !== 0) {
              transaction = db.transaction(['BudgetStore'], 'readwrite');
              const currentStore = transaction.objectStore('BudgetStore');
              currentStore.clear();
              console.log('Clearing store 🧹');
            }
          });
      }
    };
  }