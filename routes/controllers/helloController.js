const hello = async({response}) => {
    response.body = 'Hello world!';
  };
   
  export { hello };