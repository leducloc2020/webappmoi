// App.js
import React from 'react';
import './App.css';
import CarEntryTable from './components/CarEntryTable';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Quản lý thời gian ra vào của xe ô tô</h1>
      </header>
      <main>
        <CarEntryTable />
      </main>
    </div>
  );
}

export default App;
