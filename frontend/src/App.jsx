import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/users")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched users:", data);
        setUsers(data);
      });
  }, []);

  const addUser = () => {
    fetch("http://localhost:8000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, role: "USER" })
    })
    .then(res => res.json())
    .then(user => setUsers([...users, user]));
    setUsername("");
  }

  return (
    <div>
      <h1>Users</h1>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username"/>
      <button onClick={addUser}>Add User</button>
      <ul>
        {users.map(u => <li key={u.id}>{u.username} - {u.role}</li>)}
      </ul>
    </div>
  );
}

export default App;
