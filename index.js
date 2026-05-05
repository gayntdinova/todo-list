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

  onAddInputChange(event) {
    this.state.inputValue = event.target.value;
  }

  onAddTask() {
    if (this.state.inputValue.trim()) {
      this.state.tasks.push({ text: this.state.inputValue, completed: false });
      this.state.inputValue = "";
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
      createElement("div", { class: "add-todo" }, [
        createElement("input", {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
          value: this.state.inputValue
        }, null, {
          "input": (e) => this.onAddInputChange(e)
        }),
        createElement("button", { id: "add-btn" }, "+", {
          "click": () => this.onAddTask()
        }),
      ]),
      createElement("ul", { id: "todos" }, this.state.tasks.map((task, i) =>
        createElement("li", {}, [
          createElement("input", task.completed ? { type: "checkbox", checked: "" } : { type: "checkbox" }, null, {
            "change": () => this.onCheckTask(i)
          }),
          createElement("label", { style: task.completed ? "color: gray" : "" }, task.text),
          createElement("button", {}, "🗑️", {
            "click": () => this.onDeleteTask(i)
          })
        ])
      )),
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});