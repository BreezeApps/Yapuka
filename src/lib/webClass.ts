import { fetch } from '@tauri-apps/plugin-http';

export class WebService {
  private url: string;

  constructor(url: string) {
    this.url = url; // https://example.com/
  }

  /*async init() {
    await this.db.execute("PRAGMA foreign_keys = ON;");
  }*/

  /* ==================== BOARDS ==================== */
  async createBoard(name: string): Promise<boolean | string> {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("name", name);
    const response = await fetch(this.url + 'board/', {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded
    });
    if (response.status === 200) {
      if (JSON.parse(await response.text()).ok === "cool") {
        return true;
      } else {
        return response.text()
      }
    } else {
      return ""
    }
  }

  async updateBoard(id: number, newName: string): Promise<boolean | string> {
    const response = await fetch(this.url + 'board?id=' + id + '&name=' + newName, {
      method: 'PUT',
    });
    if (response.status === 200) {
      if (JSON.parse(await response.text()).ok === "cool") {
        return true
      } else {
        return response.text();
      }
    } else {
      return ""
    }
  }

  async removeBoard(id: number): Promise<boolean | string> {
    const response = await fetch(this.url + 'board?id=' + id, {
      method: 'DELETE',
    });
    if (response.status === 200) {
      if (JSON.parse(await response.text()).ok === "cool") {
        return true
      } else {
        return response.text();
      }
    } else {
      return ""
    }
  }

  async getBoardById(id: number): Promise<string> {
    const response = await fetch(this.url + 'board/' + id, {
      method: 'GET',
    });
    if (response.status === 200) {
      return response.text();
    } else {
      return ""
    }
  }

  async getAllBoards(): Promise<string> {
    const response = await fetch(this.url + 'board/', {
      method: 'GET',
    });
    if (response.status === 200) {
      return response.text();
    } else {
      return ""
    }
  }

  /* ==================== COLLECTIONS ==================== */
  async createCollection(boardId: number, name: string, color?: string): Promise<boolean | string> {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("name", name);
    urlencoded.append("board_id", boardId.toString());
    urlencoded.append("color", color === undefined ? "" : color);

    const response = await fetch(this.url + 'collection/', {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded
    });
    if (response.status === 200) {
      if (JSON.parse(await response.text()).ok === "cool") {
        return true;
      } else {
        return response.text()
      }
    } else {
      return ""
    }
  }

  async updateCollection(id: number, newName: string, newColor?: number): Promise<boolean | string> {
    newColor = newColor
    const response = await fetch(this.url + 'collection?id=' + id + '&name=' + newName, {
      method: 'PUT',
    });
    if (response.status === 200) {
      if (JSON.parse(await response.text()).ok === "cool") {
        return true
      } else {
        return response.text();
      }
    } else {
      return ""
    }
  }

  async removeCollection(id: number): Promise<boolean | string> {
    const response = await fetch(this.url + 'collection?id=' + id, {
      method: 'DELETE',
    });
    if (response.status === 200) {
      if (JSON.parse(await response.text()).ok === "cool") {
        return true
      } else {
        return response.text();
      }
    } else {
      return ""
    }
  }

  async getCollectionById(id: number): Promise<string> {
    const response = await fetch(this.url + 'collection/id/' + id, {
      method: 'GET',
    });
    if (response.status === 200) {
      return response.text();
    } else {
      return ""
    }
  }

  async getAllCollections(): Promise<string> {
    const response = await fetch(this.url + 'collection/', {
      method: 'GET',
    });
    if (response.status === 200) {
      return response.text();
    } else {
      return ""
    }
  }

  async getCollectionsByBoard(boardId: number): Promise<string> {
    const response = await fetch(this.url + 'collection/' + boardId, {
      method: 'GET',
    });
    if (response.status === 200) {
      return response.text();
    } else {
      return ""
    }
  }

  /* ==================== TASKS ==================== */
  async createTask(collectionId: number, order: number, name?: string, description?: string, dueDate?: string): Promise<boolean | string> {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("name", name === undefined ? "" : name);
    urlencoded.append("collection_id", collectionId.toString());
    urlencoded.append("order", order.toString());
    urlencoded.append("description", description === undefined ? "" : description);
    urlencoded.append("due_date", dueDate === undefined ? "" : dueDate);

    const response = await fetch(this.url + 'task/', {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded
    });
    if (response.status === 200) {
      if (JSON.parse(await response.text()).ok === "cool") {
        return true;
      } else {
        return response.text()
      }
    } else {
      return ""
    }
  }

  async updateTask(id: number, collection_id: number, order: number, newName?: string, newDescription?: string, newDueDate?: string): Promise<boolean | string> {
    const response = await fetch(this.url + 'task?id=' + id + '&collection_id=' + collection_id + '&order=' + order + '&description=' + newDescription + '&name=' + newName + '&due_date=' + newDueDate, {
      method: 'PUT',
    });
    if (response.status === 200) {
      if (JSON.parse(await response.text()).ok === "cool") {
        return true
      } else {
        return response.text();
      }
    } else {
      return ""
    }
  }

  async updateTaskOrder(id: number, order: string): Promise<boolean | string> {
    const response = await fetch(this.url + 'task?id=' + id + '&order=' + order, {
      method: 'PATCH',
    });
    if (response.status === 200) {
      if (JSON.parse(await response.text()).ok === "cool") {
        return true
      } else {
        return response.text();
      }
    } else {
      return ""
    }
  }

  async removeTask(id: number): Promise<boolean | string> {
    const response = await fetch(this.url + 'task?id=' + id, {
      method: 'DELETE',
    });
    if (response.status === 200) {
      if (JSON.parse(await response.text()).ok === "cool") {
        return true
      } else {
        return response.text();
      }
    } else {
      return ""
    }
  }

  async getTaskById(id: number): Promise<string> {
    const response = await fetch(this.url + 'task/id/' + id, {
      method: 'GET',
    });
    if (response.status === 200) {
      return response.text();
    } else {
      return ""
    }
  }

  async getAllTasks(): Promise<string> {
    const response = await fetch(this.url + 'task/', {
      method: 'GET',
    });
    if (response.status === 200) {
      return response.text();
    } else {
      return ""
    }
  }

  async getTasksByCollection(collectionId: number): Promise<string> {
    const response = await fetch(this.url + 'task/' + collectionId, {
      method: 'GET',
    });
    if (response.status === 200) {
      return response.text();
    } else {
      return ""
    }
  }
}
