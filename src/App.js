import React, { useState, useEffect } from 'react';

export default function ShoppingApp() {
  const [list, setList] = useState([]);
  const [regulars, setRegulars] = useState([]);
  const [itemInput, setItemInput] = useState("");
  const [regInput, setRegInput] = useState("");

  // Load everything on startup
  useEffect(() => {
    fetch('/api/all')
      .then(res => res.json())
      .then(data => {
        setList(data.shoppingList || []);
        setRegulars(data.regulars || []);
      })
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  // --- ACTIONS ---

  const addItem = async (name) => {
    const text = name || itemInput;
    if (!text) return;
    const newList = [...list, text];
    setList(newList);
    setItemInput("");
    saveList(newList);
  };

  const deleteItem = async (index) => {
    const newList = list.filter((_, i) => i !== index);
    setList(newList);
    saveList(newList);
  };

  // New Clear List function with PIN check
  const handleClearList = () => {
    const pin = prompt("Enter PIN to clear the list:");
    if (pin === "anything") {
      const newList = [];
      setList(newList);
      saveList(newList);
    } else {
      alert("Incorrect PIN. Action ignored.");
    }
  };

  // Reusable save function to keep code clean
  const saveList = async (newList) => {
    await fetch('/api/save-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ list: newList })
    });
  };

  const addRegular = async () => {
    if (!regInput) return;
    const newRegs = [...regulars, regInput];
    setRegulars(newRegs);
    setRegInput("");
    await fetch('/api/save-regulars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regulars: newRegs })
    });
  };

  const removeRegular = async (index) => {
    const newRegs = regulars.filter((_, i) => i !== index);
    setRegulars(newRegs);
    await fetch('/api/save-regulars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regulars: newRegs })
    });
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>Shopping List</h2>

      {/* Regulars Dashboard */}
      <div style={{ background: '#eee', padding: '15px', borderRadius: '8px' }}>
        <p><strong>Quick Add</strong></p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {regulars.map((reg, idx) => (
            <div key={idx} style={{ background: '#ddd', padding: '5px 10px', borderRadius: '20px' }}>
              <span onClick={() => addItem(reg)} style={{ cursor: 'pointer' }}>{reg}</span>
              <button onClick={() => removeRegular(idx)} style={{ marginLeft: '8px', border: 'none', background: 'none', color: 'red', cursor: 'pointer' }}>×</button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '10px' }}>
          <input value={regInput} onChange={e => setRegInput(e.target.value)} placeholder="New Quick Add..." />
          <button onClick={addRegular}>Create</button>
        </div>
      </div>

      <hr />

      {/* Main List */}
      <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <input style={{ flex: 1 }} value={itemInput} onChange={e => setItemInput(e.target.value)} placeholder="Add one-time item..." />
        <button onClick={() => addItem()}>Add</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, border: '1px solid #ccc' }}>
        {list.map((item, index) => (
          <li key={index} style={{ 
            padding: '10px', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #ccc',
            backgroundColor: index % 2 !== 0 ? '#E3F2FD' : 'white' 
          }}>
            <span>{item}</span>
            <button onClick={() => deleteItem(index)} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
          </li>
        ))}
      </ul>

      {/* Clear List Button */}
      {list.length > 0 && (
        <button 
          onClick={handleClearList}
          style={{ 
            marginTop: '20px', 
            width: '100%', 
            padding: '10px', 
            background: '#333', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Clear Entire List
        </button>
      )}
    </div>
  );
}