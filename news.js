/* News for every page: reads /news.json (newest post first). To post, edit news.json on GitHub.
   <section id="news" data-games="Tight Lines|Fairway Tales"> shows only posts about those games.
   Leave data-games off to show everything. Game cards with <div class="latest" data-game="..."> get a "Latest update" line. */
(function(){
  var GAME_CLASS = {"Fairway Tales":"ft","Solaris Gambit":"sg","Tight Lines":"tl","Metropolitan Misadventure":"mm","Python Kitchen":"pk","Garage Code":"gc","Peekaboo Meadow":"pm"};
  var section = document.getElementById("news");
  var filter = section && section.getAttribute("data-games") ? section.getAttribute("data-games").split("|") : null;
  var SHOW = section && section.getAttribute("data-show") ? +section.getAttribute("data-show") : 3;

  function el(tag, cls, text){ var e=document.createElement(tag); if(cls) e.className=cls; if(text!=null) e.textContent=text; return e; }
  function niceDate(s){ var d=new Date(s+"T12:00:00"); return isNaN(d)?s:d.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}); }
  function slug(p,i){ return "post-"+(p.date||"")+"-"+i; }
  function about(p,games){ return !games || (p.changes||[]).some(function(c){ return games.indexOf(c.game)>=0; }); }

  function renderPost(p,i){
    var art=el("article","post"+(p.type==="announcement"?" announcement":"")); art.id=slug(p,i);
    var meta=el("div","post-meta");
    if(p.type==="announcement") meta.appendChild(el("span","post-badge","Announcement"));
    var t=el("time",null,niceDate(p.date)); t.dateTime=p.date||""; meta.appendChild(t);
    art.appendChild(meta);
    if(p.title) art.appendChild(el("h3",null,p.title));
    if(p.message) art.appendChild(el("p","msg",p.message));
    var changes=(p.changes||[]).filter(function(c){ return !filter || filter.indexOf(c.game)>=0; });
    if(changes.length){
      var wrap=el("div","changes");
      changes.forEach(function(c){
        var box=el("div","change "+(GAME_CLASS[c.game]||"")); box.appendChild(el("h4",null,c.game));
        var ul=el("ul"); (c.items||[]).forEach(function(it){ ul.appendChild(el("li",null,it)); });
        box.appendChild(ul); wrap.appendChild(box);
      });
      art.appendChild(wrap);
    }
    return art;
  }

  fetch("/news.json",{cache:"no-cache"})
    .then(function(r){ if(!r.ok) throw 0; return r.json(); })
    .then(function(posts){
      if(!Array.isArray(posts)) return;
      var onPage={}, hiddenPosts=[];
      if(section){
        var list=document.getElementById("news-list"), shown=0;
        posts.forEach(function(p,i){
          if(!about(p,filter)) return;
          var node=renderPost(p,i); onPage[i]=true;
          if(shown>=SHOW){ node.hidden=true; hiddenPosts.push(node); }
          list.appendChild(node); shown++;
        });
        if(hiddenPosts.length){
          var more=el("button","btn more","Show older news"); more.type="button";
          more.onclick=function(){ hiddenPosts.forEach(function(n){ n.hidden=false; }); more.remove(); };
          list.appendChild(more);
        }
        if(shown) section.hidden=false;
      }
      document.querySelectorAll(".latest[data-game]").forEach(function(box){
        var name=box.getAttribute("data-game");
        for(var i=0;i<posts.length;i++){
          var ch=(posts[i].changes||[]).filter(function(c){ return c.game===name; })[0];
          if(!ch) continue;
          box.appendChild(el("b",null,"Latest update · "+niceDate(posts[i].date)));
          var a=el("a",null,(ch.items||[])[0]||posts[i].title||"See what's new");
          a.href=(onPage[i]?"":"/")+"#"+slug(posts[i],i);
          if(onPage[i]) a.addEventListener("click",function(){ var m=document.querySelector(".more"); if(m) m.click(); });
          box.appendChild(a);
          var extra=(ch.items||[]).length-1; if(extra>0) box.appendChild(document.createTextNode(" (+"+extra+" more)"));
          box.hidden=false; break;
        }
      });
      if(location.hash){ var target=document.getElementById(location.hash.slice(1)); if(target){ if(target.hidden){ var m=document.querySelector(".more"); if(m) m.click(); } target.scrollIntoView(); } }
    })
    .catch(function(){ /* no news file: news stays hidden */ });
})();
