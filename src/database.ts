import { SQL } from "bun"

export type ToDo = {
	id: string
	title: string
	done: boolean
}

const sqlite = new SQL("sqlite://myapp.db")

export const createStorage = () => {
	let initialized: Promise<void> | null = null

	const connect = async (): Promise<void> => {
		if (!initialized) {
			initialized = sqlite`
				CREATE TABLE IF NOT EXISTS todos (
					id TEXT PRIMARY KEY,
					title TEXT NOT NULL,
					done INTEGER NOT NULL DEFAULT 0
				)
			`
		}
		await initialized
	}


	const getAll = async (): Promise<ToDo[]> => {
		
		const rows = await sqlite`SELECT id, title, done FROM todos`
		return rows.map((row: any) => ({
			id: row.id as string,
			title: row.title as string,
			done: Boolean(row.done)
		}))
	}

	const get = async (id: string): Promise<ToDo | undefined> => {
		
		const rows = await sqlite`SELECT id, title, done FROM todos WHERE id = ${id}`
		if (rows.length === 0) return undefined
		const row = rows[0]
		return {
			id: row.id as string,
			title: row.title as string,
			done: Boolean(row.done)
		}
	}

	const create = async (title: string): Promise<ToDo> => {
		
		const todo: ToDo = {
			id: crypto.randomUUID(),
			title,
			done: false,
		}
		await sqlite`
			INSERT INTO todos (id, title, done) 
			VALUES (${todo.id}, ${todo.title}, ${todo.done ? 1 : 0})
		`
		return todo
	}

	const update = async (
		id: string, 
		updates: Partial<Pick<ToDo, 'title' | 'done'>>
	): Promise<ToDo | undefined> => {
		const todo = await get(id)
		if (!todo) return undefined

		const updated: ToDo = {
			...todo,
			...updates,
		}

		await sqlite`
			UPDATE todos 
			SET title = ${updated.title}, done = ${updated.done ? 1 : 0}
			WHERE id = ${id}
		`
		
		return updated
	}

	const remove = async (id: string): Promise<boolean> => {
		const result = await sqlite`DELETE FROM todos WHERE id = ${id}`
		return result.affectedRows > 0
	}

	const exists = async (id: string): Promise<boolean> => {
		const rows = await sqlite`SELECT 1 FROM todos WHERE id = ${id}`
		return rows.length > 0
	}

	return {
		connect,
		getAll,
		get,
		create,
		update,
		remove,
		exists,
	}
}

export const database = createStorage()