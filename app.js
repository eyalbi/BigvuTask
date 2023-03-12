const {handler} = require('./handler');
const args = process.argv;
//add Default arg
if (args.length < 3){
  args.push('google.com');
}

//handler execution function
const runHandler = (url) => {
  const res = handler({
    "body": `{\"url\":\"${url}\"}`
  })
  
  res.then((res)=>{
    console.log(res);
  })
};

const runApplication = (urlArray) =>{
  const promises = [];
  //Create Promise for every url and Push to Promises array
  for (let i = 2; i < urlArray.length; i++) {
    promises.push(new Promise((resolve, reject) => {
      runHandler(args[i])
    }))
  }

  //run all url async
  Promise.all(promises)
  .then((messages) => {
    console.log(messages);
  })
  .catch((error) => {
    console.error(error);
  });
};

runApplication(args);