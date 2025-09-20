import { useState, useEffect } from 'react';
import './App.css';
import TaskItem from "./TaskItem";

type Task = {
  text: string;
  done: boolean;
  category: string;
  description: string;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? (JSON.parse(saved) as Task[]) : [];
  });
  const [input, setInput] = useState('');
 const [filter, setFilter] = useState<'all' | 'active' | 'completed' | "work" | "personal">(() => {
  const saved = localStorage.getItem("filter");
  return saved ? (JSON.parse(saved) as 'all' | 'active' | 'completed' | "work" | "personal") : 'all';
});
  
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState("")

  // ✅ Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("filter", JSON.stringify(filter))
  }, [filter])

  const handleClick = () => {
    const newTask = { text: input, done: false, category, description };
    setTasks([...tasks, newTask]);
    setInput('');
  };

  const deleteButton = (indexToDelete: number) => {
    const updatedTasks = tasks.filter((_, index) => index !== indexToDelete);
    setTasks(updatedTasks);
  };

  const handleTaskCheckboxClick = (indexChange: number) => {
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks];
      updatedTasks[indexChange] = {
        ...updatedTasks[indexChange],
        done: !updatedTasks[indexChange].done,
      };
      return updatedTasks;
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "active") return !task.done;
    if (filter === "completed") return task.done;
    if(filter === "work") return task.category === "work"
      if(filter === "personal") return task.category === "personal"
    return true;
  });

 const editTask = (index: number, newText: string) => {
  setTasks(prevTasks => {
    const updatedTasks = [...prevTasks]
    updatedTasks[index] = { 
      ...updatedTasks[index],
      text: newText,
    }
    return updatedTasks
  })
};
const activeCount = tasks.filter(task => !task.done).length;
const totalCount = tasks.length

const deleteAll = () => {
  setTasks([]); 
};

const markAllCompleted = () => {
  setTasks(prevTasks =>
    prevTasks.map(task => ({
      ...task,
      done: true
    }))
  );
};

  return (
    <>
      <div>
  <label htmlFor="input">Text input</label>
  <input type="text" id="input" value={input} onChange={(e) => setInput(e.target.value)} />
  <textarea
  id="description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}   // makes it taller
  cols={50}  // makes it wider
></textarea>
  <select onChange={(e) => setCategory(e.target.value)}>
  <option value="">Select category</option>
  <option value="work">Work</option>
  <option value="personal">Personal</option>
  <option value="shopping">Shopping</option>
</select>


  <button type="button" onClick={handleClick}>Submit</button>
  <button type="button" onClick={deleteAll}>Delete all</button>
  <button type='button' onClick={markAllCompleted}>Mark All Completed</button>
  <p>Active tasks: {activeCount}</p>
  <p>Total tasks: {totalCount}</p>
</div>

      <div>
        <h1>Tasks:</h1>
        <label htmlFor="filter">Filter</label>
        <select
          id="filter"
          name="filter"
          value={filter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setFilter(e.target.value as 'all' | 'active' | 'completed' | "work" | "personal")
          }
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
        </select>
        <ul>
  {filteredTasks.map((task, index) => (
    <TaskItem
      key={index}
      text={task.text}
      done={task.done}
      category={task.category}
      description={task.description}
      onToggle={() => handleTaskCheckboxClick(index)}
      onDelete={() => deleteButton(index)}
      onEdit={(newText) => editTask(index, newText)}
    />
  ))}
</ul>
      </div>
    </>
  );
}

export default App;
