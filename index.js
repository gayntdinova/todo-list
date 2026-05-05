function createElement(tag, attributes, children, callbacks) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  if (callbacks) {
    Object.keys(callbacks).forEach((eventName) => {
      element.addEventListener(eventName, callbacks[eventName]);
    });
  }

  return element;
}

class Component {
  constructor() {
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }

  update() {
    const newDomNode = this.render();
    this._domNode.parentNode.replaceChild(newDomNode, this._domNode);
    this._domNode = newDomNode;
  }
}

class AddTask extends Component {
  constructor(onAddTask) {
    super();
    this.onAddTask = onAddTask;
  }

  render() {
    return createElement("div", { class: "add-todo" }, [
      createElement("input", {
        id: "new-todo",
        type: "text",
        placeholder: "Задание",
      }),
      createElement("button", { id: "add-btn" }, "+", {
        "click": (e) => {
          const input = e.target.parentNode.querySelector('input');
          if (!input) return;
          const value = input.value || '';
          this.onAddTask(value);
        }
      }),
    ]);
  }
}

class Task extends Component {
  constructor(task, index, onToggle, onDelete) {
    super();
    this.task = task;
    this.index = index;
    this.onToggle = onToggle;
    this.onDelete = onDelete;
    this.state = {
      confirmDelete: false
    };
  }

  render() {
    return createElement("li", {}, [
      createElement("input", this.task.completed ? { type: "checkbox", checked: "" } : { type: "checkbox" }, null, {
        "change": () => this.onToggle(this.index)
      }),
      createElement("label", { style: this.task.completed ? "color: gray" : "" }, this.task.text),
      createElement("button", this.state.confirmDelete ? { style: "background: red; color: white" } : {}, "🗑️", {
        "click": () => {
          if (!this.state.confirmDelete) {
            this.state.confirmDelete = true;
            this.update();
            return;
          }
          this.onDelete(this.index);
        }
      })
    ]);
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      tasks: [
        { text: "Сделать домашку", completed: false },
        { text: "Сделать практику", completed: false },
        { text: "Пойти домой", completed: false },
      ],
      inputValue: ""
    };
  }

  onAddTask(text) {
    if (text && text.trim()) {
      this.state.tasks.push({ text: text.trim(), completed: false });
    }
    this.update();
  }

  onCheckTask(index) {
    const task = this.state.tasks[index];
    task.completed = !task.completed;
    this.update();
  }

  onDeleteTask(index) {
    this.state.tasks.splice(index, 1);
    this.update();
  }

  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      new AddTask((text) => this.onAddTask(text)).getDomNode(),
      createElement("ul", { id: "todos" }, this.state.tasks.map((task, i) =>
        new Task(task, i, (index) => this.onCheckTask(index), (index) => this.onDeleteTask(index)).getDomNode()
      )),
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});