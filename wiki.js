const { app, BrowserWindow } = require('electron')
const path = require('path')

let win=""

const createWindow = () => {
  win = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

const fetch = require("cross-fetch");
const cheerio = require("cheerio");
const { getCreationTime } = require('process')
const { monitorEventLoopDelay } = require('perf_hooks')

// function to get the raw data
const getRawData = (URL) => {
   return fetch(URL)
      .then((response) => response.text())
      .then((data) => {
         return data;
      });
};

function Point(s, c){
  this.start=s;
  this.count=c;
}

let Points=[]

// start of the program
const getToPhilosophy = async () => {
  console.log("Please wait for all links to be clicked")

  let loopWords=[];

  for(let x=0; x<25; x++)
  {
    let URL = "https://en.wikipedia.org/wiki/Special:Random";
    let count=0;
    
    let sites=[]

    let loop=false;

    let seq=""
    let seqArray=[]

    let words=[]

    while(URL!="https://en.wikipedia.org/wiki/Philosophy" && !loop){
        let rawData = await getRawData(URL);
     
        let parsedData = cheerio.load(rawData);
     
         let aLinks = parsedData("a");
         let stillLooking=true;
         let x=0;
         let link="";
         while(stillLooking){
          if(aLinks[x] != undefined){
              if(aLinks[x].attribs.href!=undefined && aLinks[x].attribs.href.includes("/wiki/") && !aLinks[x].attribs.href.includes("/wiki/File") && aLinks[x].parent.name == "p" && aLinks[x].parent.parent.attribs.class != undefined && aLinks[x].parent.parent.attribs.class == "mw-parser-output")
              {
                stillLooking=false;
                link=aLinks[x].attribs.href;
              }
              else
                x++;
          }
          else
            x++;
        }

        let patched=link.substring(6)
        let finPatched=""
        for(element of patched)
        {
          if(element=="_")
            finPatched+=" ";
          else
            finPatched+=element;   
        }
        if(count==0)
          seq="Start:\n"
        seq+=finPatched+"\n"
        seqArray.push(finPatched)
        words.push(finPatched)

        if(sites.includes(finPatched) || loopWords.includes(finPatched)){
          loop=true
          for(element of words)
            if(!loopWords.includes(element))
                loopWords.push(element)
          URL="https://en.wikipedia.org"+link;
          win.loadURL(URL)
        }
        else{
          sites.push(finPatched)
          count++;
          URL="https://en.wikipedia.org"+link;
          win.loadURL(URL)
        }
        await new Promise(r=> setTimeout(r, 1500));
    }

    if(loop){
      console.log(seq+"Cannot find path, looped"+"\n")
      var p=new Point(seqArray[0], 0)
      Points.push(p)
    }      
    else{
      console.log(seq+"# of clicks: "+count-1+"\n")
      var p=new Point(seqArray[0], count)
      Points.push(p)
    }
    await new Promise(r=> setTimeout(r, 1500));
  }
  
  console.log(Points)
  console.log("loopWords:")
  for(element of loopWords)
    console.log(element)
  var longest=Points[0]
  for(let x=1; x<Points.length; x++)
  {
    if(Points[x].count>longest.count)
      longest=Points[x];
  }
  console.log("Longest Trail: "+longest.start+" with "+longest.count+" clicks.")
};


getToPhilosophy()

