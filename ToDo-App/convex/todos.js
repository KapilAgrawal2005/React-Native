import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
export const getTodos = query({
  handler: async (context) => {
    const todos = await context.db.query("todos").order("desc").collect();
    return todos;
  },
});

export const addTodos = mutation({
  args: { text: v.string() },
  handler: async (context, args) => {
    const todo = await context.db.insert("todos", {
      text: args.text,
      isCompleted: false,
    });
    return todo;
  },
});

export const toggleTodos = mutation({
  args: { id: v.id("todos") },
  handler: async (context, args) => {
    const todo = await context.db.get(args.id);
    if (!todo) {
      throw new ConvexError("No such todo is found");
    }
    await context.db.patch(args.id, { isCompleted: !todo.isCompleted });
    return todo;
  },
});

export const deleteTodos = mutation({
  args: { id: v.id("todos") },
  handler: async (context, args) => {
    await context.db.delete(args.id);
  },
});

export const updateTodo = mutation({
  args: { id: v.id("todos"), text: v.string() },
  handler: async (context, args) => {
    const todo = await context.db.patch(args.id, { text: args.text });
  },
});

export const clearAllTodos = mutation({
  handler: async (context) => {
    const todos = await context.db.query("todos").collect();

    for (const todo of todos) {
      await context.db.delete(todo._id);
    }
    return { deletedCount: todos.length };
  },
});
