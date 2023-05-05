import axios from "axios";
import cors from "cors";
import express from "express";
import jsdom from "jsdom";

const { JSDOM } = jsdom; 

const sites = [
    'site:100haryt.com',
    'site:salamnews.tm',
    'site:ynamdar.com',
    'site:gerekli.tm',
    'site:bazar.com.tm',
    'site:saray.tm',
    'site:tmcars.info',
]

const app = express();

app.use(cors());
app.use(express.json({extended: true}));
app.use(express.urlencoded({ extended: true}));

app.get('/',async (req,res)=>{
 const text = req.query.text;
    const start = req.query.start;
    const searchText = `https://www.google.com/search?q=${text} ${sites.join(' OR ')}&start=${start}&sxsrf=APwXEdffmnglt--dOy-jMjwoyHMtOeZWQQ:1683308673695&ei=gUBVZJiHKqut0PEPkK2OkAI&sa=N&ved=2ahUKEwjYy6u83d7-AhWrFjQIHZCWAyIQ8tMDegQIBBAE&cshid=1683308681943278&biw=1536&bih=746&dpr=1.25`;

    const searchResult = await axios.get(searchText);
    //BVG0Nb
    const dom = new JSDOM(searchResult.data); 
    let list = dom.window.document.getElementsByClassName('BVG0Nb');
    let images=[];
    for(let i=0; i<list.length; i++){
        let image = list[i].href.split('imgurl=')[1].split('&imgrefurl=')[0];
        images.push(image);
    }
    let links = dom.window.document.getElementsByClassName('Gx5Zad');
    let items = [];
    for(let i=0; i<links.length; i++){
        let link = links[i].getElementsByTagName('a')[0].href.replace('/url?q=','');
        let title = '';
        let desc = '';
        let more = '';

        try{
          more = links[i].getElementsByClassName('s3v9rd')[1].textContent;
        } catch(err){}

        try{
           title =  links[i].getElementsByTagName('h3')[0].textContent;
           
        } catch(err){}
        try{
           desc =  links[i].getElementsByClassName('lRVwie')[0].textContent;
        }catch(err){}
        console.log(title);
        items.push({
            link,
            title,
            desc,
            more
        })
    }

    res.json({
        images,
        items
    });
})