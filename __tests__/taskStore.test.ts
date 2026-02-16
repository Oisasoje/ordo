import { renderHook, act } from "@testing-library/react";
import useTaskStore from "../store/taskStore";
import { Task } from "../store/taskStore";

describe("TaskStore", () => {
  it("adds, updates, moves, and deletes a task", () => {
    const { result } = renderHook(() => useTaskStore());

    const newTask: Task = {
      id: 999,
      title: "Test Task",
      description: "Testing",
      priority: "High",
      createdAt: Date.now(),
      dueDate: Date.now() + 1000 * 60 * 60,
      tags: ["#test"],
      status: "Todo",
    };

    // Add
    act(() => result.current.addTask(newTask));
    expect(result.current.tasks.find((t) => t.id === 999)).toBeDefined();
    expect(result.current.activities[0].action).toBe("Created");

    // Update
    const updatedTask = { ...newTask, title: "Updated Task" };
    act(() => result.current.updateTask(updatedTask));
    expect(result.current.tasks.find((t) => t.id === 999)?.title).toBe(
      "Updated Task",
    );
    expect(result.current.activities[0].action).toBe("Edited");

    // Move
    act(() => result.current.moveTask(999, "Doing"));
    expect(result.current.tasks.find((t) => t.id === 999)?.status).toBe(
      "Doing",
    );
    expect(result.current.activities[0].action).toBe("Moved");

    // Delete
    act(() => result.current.removeTask(999));
    expect(result.current.tasks.find((t) => t.id === 999)).toBeUndefined();
    expect(result.current.activities[0].action).toBe("Deleted");
  });
});
