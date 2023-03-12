const puppeteer = require('puppeteer');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require('fs');
const path = require('path');

//AWS version 
//npm install aws-sdk
// const AWS = require('aws-sdk');

const takeScreenShot = async (url, formattedDateString) =>{
  // Launch headless Chrome
  
  if (!url.includes("http")){
    url = "https://" + url;
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to URL and take screenshot
  const result = await page.goto(url).then(async ()=>{
    //success handler

    //set screenShotsize and take the screenshot
    await page.setViewport({ width: 1920, height: 1080  });
    const screenshot = await page.screenshot();


    // Save screenshot to disk
    const screenshotPath = `./images/${formattedDateString}_${url.split("https://")[1].replace(/\//g, '').replace(/\./g,'-')}.png`;
    fs.writeFileSync(screenshotPath, screenshot);
    return screenshotPath;

  },
  (reason) =>{
    //rejected Handler
    return JSON.stringify({ Error: reason.message})
    
  });
  browser.close();
  return result;
};


const createVideoFromScreenShot = async (screenshotPath) =>{
  const videoPath = `./videos/${screenshotPath.split('/')[2].split('.')[0]}.mp4`;
  const  result = await new Promise((resolve, reject) => {
    ffmpeg(screenshotPath)
    .loop(10)
    .outputOptions('-pix_fmt yuv420p')
    .output(videoPath)
    .on('end', resolve)
    .on('error', reject)
    .run();
  }).then((value) => {
    console.log(value);
    return videoPath; // Success!
  })
  .catch((err) => {
    console.log(err);
    return JSON.stringify({ Error: err.message});
  });
  
  return result;
};

const createDateString = () =>{
  const now = new Date();
  //create date format
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  };
  //format date string to be valid for file name
  const formattedDateString = now.toLocaleString('en-US', options).replace(/\//g, '-').replace(/, /g, '_').replace(/\:/g, '-');
  
  return formattedDateString;
};
  

exports.handler = async (event) => {
  //create Date string for path saving of the img/video 
  const formattedDateString = createDateString();
  // Parse input JSON
  const { url } = JSON.parse(event.body);

  //create screenshot using puppeteer
  const screenshotpath = await takeScreenShot(url, formattedDateString);

  //check if screenshot encounterd an error
  
  if(!fs.existsSync(screenshotpath)){
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
      },
      body: screenshotpath,
    };
  }
  //create video of the screenshot using ffmpeg
  const videoPath = await createVideoFromScreenShot(screenshotpath);

  if(!fs.existsSync(videoPath)){
    return {
      statusCode: 424,
      headers: {
        'Content-Type': 'application/json',
      },
      body: videoPath,
    };
  }
 
  //AWS Version upload video to S3 

  // Upload video to S3
  // const s3 = new AWS.S3();
  // const s3Key = `videos/${Date.now()}.mp4`;

  // const res = await s3.upload({
  //   Bucket: 'bigvutask',
  //   Key: s3Key,
  //   Body: fs.createReadStream(videoPath),
  // }).promise();
  
  
  // Return JSON response with file path
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ file: path.resolve(__dirname,videoPath)}),
  };
};






