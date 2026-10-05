import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const { data } = await api.get("/todos");
      setTodos(data);
    } catch {
      setError("Could not load todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      const { data } = await api.post("/todos", form);
      setTodos([data, ...todos]);
      setForm({ title: "", description: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Could not add todo");
    }
  };

  const toggleTodo = async (todo) => {
    const { data } = await api.put(`/todos/${todo._id}`, { completed: !todo.completed });
    setTodos(todos.map((t) => (t._id === data._id ? data : t)));
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditForm({ title: todo.title, description: todo.description });
  };

  const saveEdit = async (id) => {
    if (!editForm.title.trim()) return;
    const { data } = await api.put(`/todos/${id}`, editForm);
    setTodos(todos.map((t) => (t._id === id ? data : t)));
    setEditingId(null);
  };

  const deleteTodo = async (id) => {
    await api.delete(`/todos/${id}`);
    setTodos(todos.filter((t) => t._id !== id));
  };

  const visible = todos.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.completed : !t.completed
  );

  return (
    <section>
      <h2>My Tasks</h2>

      <form className="card form" onSubmit={addTodo}>
        <input placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn">Add Task</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="filters">
        {["all", "pending", "done"].map((f) => (
          <button key={f} className={`btn btn-outline ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : visible.length === 0 ? (
        <p className="muted">No tasks to show.</p>
      ) : (
        <ul className="todo-list">
          {visible.map((todo) => (
            <li key={todo._id} className="card todo">
              {editingId === todo._id ? (
                <div className="form">
                  <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                  <input value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                  <div className="row">
                    <button className="btn" onClick={() => saveEdit(todo._id)}>Save</button>
                    <button className="btn btn-outline" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="todo-main">
                    <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo)} />
                    <div>
                      <strong className={todo.completed ? "done" : ""}>{todo.title}</strong>
                      {todo.description && <p className="muted">{todo.description}</p>}
                    </div>
                  </div>
                  <div className="row">
                    <button className="btn btn-outline" onClick={() => startEdit(todo)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => deleteTodo(todo._id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
