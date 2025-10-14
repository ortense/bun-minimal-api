import { Created, InternalServerError, MethodNotAllowed, NoContent, NotFound, Ok } from './responses'
import { database } from './database'

(async function main() {
	await database.connect()

	const server = Bun.serve({
		port: 4321,
		routes: {
			'/todos': {
				async GET() {
					const todos = await database.getAll()
					return Ok({ todos, count: todos.length })
				},
				async POST(req) {
					const { title } = await req.json()
					const todo = await database.create(title)
					return Created(todo)
				}
			},
			'/todos/:id': {
				async GET(req) {
					const todo = await database.get(req.params.id)
					if (!todo) return NotFound()
					return Ok(todo)
				},
				async PUT(req) {
					const { title, done } = await req.json()
					const todo = await database.update(req.params.id, { title, done })
					if (!todo) return NotFound()
					return Ok(todo)
				},
				async DELETE(req) {
					if (!(await database.exists(req.params.id))) return NotFound()
					await database.remove(req.params.id)
					return NoContent()
				}
			},
		},
		fetch() { return MethodNotAllowed() },
		error: InternalServerError,
	})

	console.log(`server up http://${server.hostname}:${server.port}`)
})()