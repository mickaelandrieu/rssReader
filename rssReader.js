/**
 * A simple rssReader
 * needs Google Feed API v2
 * to custom the view, overide the display
 *
 **/
 function Rss(){
    this._title = "";
    this._content = "";
    this._media = "";
    this._link = "";

    this.getHtmlView = function() {
        if(undefined == this._media){
            return '';
        }
        return "<div class='feed'>"+
                    "<h3><a href='"+this._link+"'>"+this._title+"</a></h3>"+
                    "<p>"+this._content+"</p>"
                "</div>";
    };
}

var rssReader = {
    containers : null,

    init : function(selector) {
        var containers = document.getElementsByClassName(selector);
        for(var i=0;i<containers.length;i++){
        
            var rssUrl = containers[i].getAttribute('rss_url');
            var num = containers[i].getAttribute('rss_num');
            var id = containers[i].getAttribute('id');

            // create temporary script to transform XML (RSS) into JSON
            var url = encodeURIComponent(rssUrl);
            var googUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?v=2.0&num='+num+'&q='+url+'&callback=rssReader.parse&context='+id;
            var script = document.createElement('script');
            script.setAttribute('type','text/javascript');
            script.setAttribute('charset','utf-8');
            script.setAttribute('src',googUrl);
            containers[i].appendChild(script);
        }
    },

    // parsing of results by google
    parse : function(context, data) {
        var container = document.getElementById(context);
        container.innerHTML = '';

        var entries = data.feed.entries;

        for (var i=0; i<entries.length; i++) {

        	var entry = entries[i];

            var rss = new Rss();
            rss._title = entry.title;
            rss._content = entry.content;
            rss._media = entry.mediaGroups;
            rss._link = entry.link;
            container.innerHTML += rss.getHtmlView();
        }
        
    }
};



window.onload = function() {
    rssReader.init('post_results');
};