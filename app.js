var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/scraping');

var HackNewsPost = mongoose.model('HackNewsPost',{
    titulo: String,
    imagen: String
});

request({url:'http://thehackernews.com/',encoding: 'binary'},function(err,resp,body){

    if (!err && resp.statusCode == 200) {
        //console.log(body);
        var $ = cheerio.load(body);
        var i = 0;
        /* solo titulos */
        $('article.post.item .main-article-info').each(function(){
            var titulo = $(this).find('h2 a.entry-title').html();
            var img = $(this).find('img').attr('src');

            var file = fs.createWriteStream('imgs/'+i+'.jpg');
            request(img).pipe(file);

            var hacknewspost = new HackNewsPost({
                titulo: titulo,
                imagen: i+'.jpg'
            });

            hacknewspost.save(function(error){
                if(error){
                    console.log(error);
                }
            });

            console.log(titulo);
            console.log(img);


            i++;
        });


    }

});
