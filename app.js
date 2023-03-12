const {handler} = require('./handler');
const args = process.argv;
const res = handler({
  "body": `{\"url\":\"${args[2]}\"}`
})

res.then((res)=>{
  console.log(res);
})
