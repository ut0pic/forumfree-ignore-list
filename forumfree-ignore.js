/*
*	TODO:
*	- ignore likes from ignored users
*/

ignoreUsers();

/* ----------------------------------------------------------- */
/* --- get ignore list from logged user's forumfree        --- */
/* --- contact list located at:                            --- */
/* --- https://[forumName].forumfree.it/?act=Msg&CODE=02   --- */
/* --- and remove mentions of ignored users from the page  --- */                         
/* ----------------------------------------------------------- */

async function ignoreUsers() {
    
    /* ----------------------------------------------------------- */
    /* --- fetch the ignore list                               --- */
    /* ----------------------------------------------------------- */
    
    const result = await fetch("https://"+document.domain+"/?act=Msg&CODE=02");
    // set timeout otherwise text() fails/hangs
    setTimeout(() => null, 0);
    const data = await result.text();
    // replace '\n' with ' ' (space) in html document, otherwise regex does not match
    var s = data.replace(/\n/g, " ");
    // regex to get the user list
    usersToIgnoreString = s.match
    (/<textarea name=\"cannot_contact\" .*?>(.*?)<\/textarea>/)[1];
    // split the string at " " and put elements into an array
    var users = usersToIgnoreString.split(" ");
    // last element is always empty, remove it
    users.splice(users.length-1, 1);
    
    /* ----------------------------------------------------------- */    

    
    /* ----------------------------------------------------------- */
    /* --- ignore function                                     --- */
    /* ----------------------------------------------------------- */
  
    for(i = 0; i < users.length; i++){
        var user = users[i];
        if(window.location.href.includes("/?t=") ){ // topic ignore
            // ignore user posts
            ignorePosts(user);
            // ignore user quotes
            ignoreQuotes(user);
        } else {
        	if(window.location.href.includes("/?f=") ) // section/homepage ignore
            	page = "SECTION";
        	else
            	page = "HOME";
        	// ignore user mentions from topic list/homepage
        	ignoreFromTopicList(user, page);
        }
    }
  
    /* ----------------------------------------------------------- */    
}

/* --- remove user's posts from the page --- */
function ignorePosts(key){
    var posts = document.getElementsByTagName("TABLE");
    for(k = 0; k < posts.length; k++) {
        if(posts[k].innerHTML.includes(key+"</a>") )
            posts[k].style.display = "none";
    }
}

/* --- remove quotes to ignored user from the page --- */
function ignoreQuotes(key){
    var quoteDivs = document.getElementsByClassName("quote_top");
    for(k = 0; k < quoteDivs.length; k++){
        if(quoteDivs[k].innerHTML.includes(key+" @") ){
            // get parent element
            quotePost = quoteDivs[k].parentNode;
            // hide quoted post
            quotePost.innerHTML ="<div align=\"center\"><div class=\"quote_top\" align=\"left\"><b>CITAZIONE</b> da utente ignorato</b></div></div>";
        }
    }
}

/* --- remove user's links from section/home views --- */
function ignoreFromTopicList(key, view){
    
    if(view.includes("SECTION") )
        tag = "when";
    else if(view.includes("HOME") )
        tag = "where";
  
    // get users mentions in the topic list
	var lastPosts = document.getElementsByClassName("who");
  	for(k = 0; k < lastPosts.length; k++){
    	if(lastPosts[k].innerHTML.includes(key+"</a>") ){
           // remove user mention
           lastPosts[k].innerHTML = "<span>di</span> <a href=\""+window.location.href+"\">utente ignorato</a>";
           // remove topic's last post reference
           var node = document.getElementsByClassName(tag)[k];
           document.getElementsByClassName(tag)[k].innerHTML = node.innerHTML.replace("#newpost","");
    	}
    }
    // remove mentions from topics OP column
    var topicOPs = document.getElementsByClassName("xx");
    for(k = 0; k < topicOPs.length; k++){
        if(topicOPs[k].innerHTML.includes(key+"</a>") )
            // remove op mention
            topicOPs[k].innerHTML = "<a href=\""+window.location.href+"\">utente ignorato</a>";
    }
}
