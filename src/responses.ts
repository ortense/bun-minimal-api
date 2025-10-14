export const Ok = <T>(data: T) => 
	Response.json(data, { status: 200, statusText: 'OK' })

export const Created = <T>(data: T) => 
	Response.json(data, { status: 201, statusText: 'Created' })

export const NoContent = () => 
	new Response(undefined, { status: 204, statusText: 'No Content' })

export const NotFound = (body: BodyInit = 'Not Found') => 
	new Response(body, { status: 404, statusText: 'Not Found' })

export const MethodNotAllowed = (body: BodyInit = 'Method Not Allowed') => 
	new Response(body, { status: 405, statusText: 'Method Not Allowed' })

export const InternalServerError = (error: Bun.ErrorLike) => {
	console.error('Internal Server Error', error)
	return Response.json({ error: error.message }, {
		status: 500,
		statusText: 'Internal Server Error',
	})
}