import { Application, Router } from 'https://deno.land/x/oak/mod.ts'

const urls = JSON.parse(Deno.readTextFileSync('./urls.json'))

const books = new Map<string, any>()
books.set('1', {
  id: '1',
  title: 'The Hound of the Baskervilles',
  author: 'Conan Doyle, Arthur',
})

const router = new Router()
router
  .get('/', context => {
    context.response.body = 'Hello world!'
  })
  .get('/book/:id', context => {
    if (context.params && context.params.id && books.has(context.params.id)) {
      context.response.body = books.get(context.params.id)
    }
  })
  .get('/shrt/:urlid', context => {
    if (context.params && context.params.urlid && urls[context.params.urlid])
      context.response.redirect(urls[context.params.urlid].dest)
    else context.response.body = '404'
  })

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port: 8000 })
