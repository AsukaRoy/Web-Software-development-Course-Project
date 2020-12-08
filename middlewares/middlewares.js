import { send } from '../deps.js';

const errorMiddleware = async(context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}

const requestTimingMiddleware = async({ request }, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${request.method} ${request.url.pathname} - ${ms} ms`);
}

const serveStaticFilesMiddleware = async(context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);
  
    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });
  
  } else {
    await next();
  }
}

const limitAccessMiddleware = async(context, next) => {
    if (context.request.url.pathname.startsWith('/auth')){
      await next();
    } else if(context.request.url.pathname === "/"){
      await next();
    }
    else{
      if (await context.session.get('authenticated')) {
        await next();
      } else {
        context.response.redirect('/auth/login');
      }
    }
  }

export { limitAccessMiddleware, errorMiddleware, requestTimingMiddleware, serveStaticFilesMiddleware };