# BigvuTask


# Application that creates a video with no sound website screenshot.

## INPUT:
**JSON** :
```
{"body": {"url":"websiteURL"}}
```

## OUTPUT:
**JSON** :
```
{ statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  body: '{"file":"path/to/file.mp4"}'
}
```



## To run this application clone the repository and follow the next steps:
1.install node. (preferably  v19.1.0 ) <br>
2.run npm install to install all project packages.<br>
3. make sure videos and images directory are inside your project folder.


## CLI command :<br>
node app.js websiteDomain (Default is google.com in case you run it as follows **node .\app.js**)

### examples:
 ```
 node .\app.js google.co.il
```
## multiple args async :
```
node .\app.js ynet.co.il google.co.il
```



