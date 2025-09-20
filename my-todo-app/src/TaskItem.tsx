import { useState } from 'react';

type TaskItemProps = {
  text: string;
  done: boolean;
  category: string;
  description: string;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (newText: string) => void;
};

function TaskItem({ text, done, category, description,  onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li>
      <input type="checkbox" checked={done} onChange={onToggle} />

      {isEditing ? (
        <input
          type="text"
          defaultValue={text}
          onBlur={(e) => {
            onEdit(e.target.value); // ✅ call App’s editTask
            setIsEditing(false);
          }}
          autoFocus
        />
      ) : (
        <span>{text}</span>
      )}
      <h2>{category}</h2>
      <p>{description}</p>

      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </li>
  );
}

export default TaskItem;
